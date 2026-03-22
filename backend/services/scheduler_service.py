"""
CLHEAR Scheduler Service
Manages scheduled jobs for automated regulatory scanning and news scraping.
Uses APScheduler for background job management with cron-like scheduling.
"""
import json
import logging
import os
import sys
import uuid
from datetime import datetime, timedelta
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import create_engine
from sqlalchemy.sql import text as sql_text

# Ensure imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

logger = logging.getLogger(__name__)


class SchedulerService:
    """Manages automated regulatory scan jobs."""

    def __init__(self, engine, audit_service=None):
        self.engine = engine
        self.audit = audit_service
        self.scheduler = BackgroundScheduler(
            job_defaults={"coalesce": True, "max_instances": 1}
        )
        self._started = False

    def start(self):
        """Start the scheduler and register all enabled jobs from DB."""
        if self._started:
            return
        self._load_jobs_from_db()
        self.scheduler.start()
        self._started = True
        logger.info("Scheduler service started")

        if self.audit:
            self.audit.log(
                action="system_startup",
                entity_type="system",
                description="Scheduler service started",
            )

    def stop(self):
        """Gracefully shutdown the scheduler."""
        if self._started:
            self.scheduler.shutdown(wait=False)
            self._started = False
            logger.info("Scheduler service stopped")

    def _load_jobs_from_db(self):
        """Load all enabled jobs from the database and register them."""
        with self.engine.connect() as conn:
            rows = conn.execute(
                sql_text("SELECT id, name, regulator, schedule_cron, config FROM scheduler_jobs WHERE enabled = true")
            ).fetchall()

        for row in rows:
            job_id = str(row[0])
            cron_expr = row[3]
            try:
                self._register_job(job_id, cron_expr)
                logger.info(f"Registered scheduled job: {row[1]} ({job_id})")
            except Exception as e:
                logger.error(f"Failed to register job {job_id}: {e}")

    def _register_job(self, job_id: str, cron_expr: str):
        """Register a single job with APScheduler."""
        # Remove existing if any
        existing = self.scheduler.get_job(job_id)
        if existing:
            self.scheduler.remove_job(job_id)

        # Parse cron expression: "minute hour day month day_of_week"
        parts = cron_expr.strip().split()
        if len(parts) == 5:
            trigger = CronTrigger(
                minute=parts[0],
                hour=parts[1],
                day=parts[2],
                month=parts[3],
                day_of_week=parts[4],
            )
        else:
            # Fallback: run daily at 6 AM
            trigger = CronTrigger(hour=6, minute=0)

        self.scheduler.add_job(
            self._execute_scan,
            trigger=trigger,
            id=job_id,
            args=[job_id],
            replace_existing=True,
        )

        # Update next_run in DB
        next_run = trigger.get_next_fire_time(None, datetime.utcnow())
        with self.engine.connect() as conn:
            conn.execute(
                sql_text("UPDATE scheduler_jobs SET next_run = :next_run WHERE id = :id"),
                {"next_run": next_run, "id": job_id},
            )
            conn.commit()

    def _execute_scan(self, job_id: str):
        """Execute a regulatory scan job."""
        logger.info(f"Executing scan job: {job_id}")

        with self.engine.connect() as conn:
            job = conn.execute(
                sql_text("SELECT id, name, regulator, config FROM scheduler_jobs WHERE id = :id"),
                {"id": job_id},
            ).fetchone()

            if not job:
                logger.error(f"Job {job_id} not found in database")
                return

            regulator = job[2]
            job_name = job[1]

            # Mark scan as started
            conn.execute(
                sql_text("""
                    UPDATE scheduler_jobs
                    SET last_run = :now, last_status = 'running', updated_at = :now
                    WHERE id = :id
                """),
                {"now": datetime.utcnow(), "id": job_id},
            )
            conn.commit()

        if self.audit:
            self.audit.log_scan(job_id, regulator, "started")

        try:
            # Run the actual regulatory data reload
            result = self._run_regulatory_scan(regulator)

            # Update job status
            with self.engine.connect() as conn:
                # Calculate next run
                job_row = conn.execute(
                    sql_text("SELECT schedule_cron FROM scheduler_jobs WHERE id = :id"),
                    {"id": job_id},
                ).fetchone()
                cron_parts = job_row[0].strip().split() if job_row else ["0", "6", "*", "*", "*"]

                if len(cron_parts) == 5:
                    trigger = CronTrigger(
                        minute=cron_parts[0], hour=cron_parts[1],
                        day=cron_parts[2], month=cron_parts[3],
                        day_of_week=cron_parts[4],
                    )
                    next_run = trigger.get_next_fire_time(None, datetime.utcnow())
                else:
                    next_run = datetime.utcnow() + timedelta(days=1)

                conn.execute(
                    sql_text("""
                        UPDATE scheduler_jobs
                        SET last_status = 'success', last_result = :result,
                            next_run = :next_run, updated_at = :now
                        WHERE id = :id
                    """),
                    {
                        "result": json.dumps(result),
                        "next_run": next_run,
                        "now": datetime.utcnow(),
                        "id": job_id,
                    },
                )
                conn.commit()

            if self.audit:
                self.audit.log_scan(job_id, regulator, "success", result=result)

            logger.info(f"Scan job {job_name} completed successfully: {result}")

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Scan job {job_name} failed: {error_msg}")

            with self.engine.connect() as conn:
                conn.execute(
                    sql_text("""
                        UPDATE scheduler_jobs
                        SET last_status = 'error',
                            last_result = :result,
                            updated_at = :now
                        WHERE id = :id
                    """),
                    {
                        "result": json.dumps({"error": error_msg}),
                        "now": datetime.utcnow(),
                        "id": job_id,
                    },
                )
                conn.commit()

            if self.audit:
                self.audit.log_scan(job_id, regulator, "error", error=error_msg)

    def _run_regulatory_scan(self, regulator: str) -> dict:
        """
        Execute the actual regulatory data scan/reload for a given regulator.
        This re-imports from the data modules and runs the loader.
        """
        from services.regulatory_loader import RegulatoryLoader

        loader = RegulatoryLoader()

        if regulator.upper() == "FINRA":
            from data.finra_sources import FINRA_SOURCES
            from data.finra_obligations import FINRA_OBLIGATIONS
            src_stats = loader.load_sources(FINRA_SOURCES)
            ob_stats = loader.load_obligations(FINRA_OBLIGATIONS)
        elif regulator.upper() == "FCA":
            from data.fca_sources import FCA_SOURCES
            from data.fca_obligations import FCA_OBLIGATIONS
            src_stats = loader.load_sources(FCA_SOURCES)
            ob_stats = loader.load_obligations(FCA_OBLIGATIONS)
        else:
            return {"error": f"Unknown regulator: {regulator}", "sources": {}, "obligations": {}}

        result = {
            "regulator": regulator,
            "sources": src_stats,
            "obligations": ob_stats,
            "timestamp": datetime.utcnow().isoformat(),
        }

        # Audit the data load
        if self.audit:
            self.audit.log_data_load(regulator, "regulatory_source", src_stats)
            self.audit.log_data_load(regulator, "obligation", ob_stats)

        return result

    # ------------------------------------------------------------------
    # CRUD for scheduler jobs
    # ------------------------------------------------------------------

    def create_job(self, name: str, regulator: str, cron_expr: str = "0 6 * * *",
                   enabled: bool = True, config: Optional[dict] = None) -> dict:
        """Create a new scheduler job."""
        job_id = str(uuid.uuid4())
        now = datetime.utcnow()

        # Calculate initial next_run
        parts = cron_expr.strip().split()
        if len(parts) == 5:
            trigger = CronTrigger(
                minute=parts[0], hour=parts[1],
                day=parts[2], month=parts[3],
                day_of_week=parts[4],
            )
            next_run = trigger.get_next_fire_time(None, now)
        else:
            next_run = now + timedelta(days=1)

        with self.engine.connect() as conn:
            conn.execute(
                sql_text("""
                    INSERT INTO scheduler_jobs
                        (id, name, regulator, schedule_cron, enabled, next_run,
                         created_at, updated_at, config)
                    VALUES
                        (:id, :name, :regulator, :cron, :enabled, :next_run,
                         :now, :now, :config)
                """),
                {
                    "id": job_id,
                    "name": name,
                    "regulator": regulator,
                    "cron": cron_expr,
                    "enabled": enabled,
                    "next_run": next_run,
                    "now": now,
                    "config": json.dumps(config) if config else None,
                },
            )
            conn.commit()

        # Register with APScheduler if enabled
        if enabled and self._started:
            self._register_job(job_id, cron_expr)

        if self.audit:
            self.audit.log(
                action="scheduler_created",
                entity_type="scheduler_job",
                entity_id=job_id,
                description=f"Created scheduled job '{name}' for {regulator} ({cron_expr})",
                changes={"name": name, "regulator": regulator, "cron": cron_expr},
            )

        return {"id": job_id, "name": name, "regulator": regulator, "schedule_cron": cron_expr}

    def update_job(self, job_id: str, **kwargs) -> bool:
        """Update a scheduler job's properties."""
        allowed = {"name", "regulator", "schedule_cron", "enabled", "config"}
        updates = {k: v for k, v in kwargs.items() if k in allowed and v is not None}

        if not updates:
            return False

        set_parts = []
        params = {"id": job_id, "now": datetime.utcnow()}

        for key, val in updates.items():
            if key == "config":
                set_parts.append(f"config = :config")
                params["config"] = json.dumps(val)
            elif key == "enabled":
                set_parts.append(f"enabled = :enabled")
                params["enabled"] = val
            else:
                set_parts.append(f"{key} = :{key}")
                params[key] = val

        set_parts.append("updated_at = :now")

        with self.engine.connect() as conn:
            result = conn.execute(
                sql_text(f"UPDATE scheduler_jobs SET {', '.join(set_parts)} WHERE id = :id"),
                params,
            )
            conn.commit()

            if result.rowcount == 0:
                return False

            # Re-read job to update scheduler
            job = conn.execute(
                sql_text("SELECT schedule_cron, enabled FROM scheduler_jobs WHERE id = :id"),
                {"id": job_id},
            ).fetchone()

        if job and self._started:
            if job[1]:  # enabled
                self._register_job(job_id, job[0])
            else:
                existing = self.scheduler.get_job(job_id)
                if existing:
                    self.scheduler.remove_job(job_id)

        if self.audit:
            self.audit.log(
                action="scheduler_updated",
                entity_type="scheduler_job",
                entity_id=job_id,
                description=f"Updated scheduler job: {', '.join(f'{k}={v}' for k, v in updates.items())}",
                changes=updates,
            )

        return True

    def delete_job(self, job_id: str) -> bool:
        """Delete a scheduler job."""
        with self.engine.connect() as conn:
            # Get name for audit
            job = conn.execute(
                sql_text("SELECT name, regulator FROM scheduler_jobs WHERE id = :id"),
                {"id": job_id},
            ).fetchone()

            if not job:
                return False

            conn.execute(
                sql_text("DELETE FROM scheduler_jobs WHERE id = :id"),
                {"id": job_id},
            )
            conn.commit()

        # Remove from APScheduler
        if self._started:
            existing = self.scheduler.get_job(job_id)
            if existing:
                self.scheduler.remove_job(job_id)

        if self.audit:
            self.audit.log(
                action="scheduler_deleted",
                entity_type="scheduler_job",
                entity_id=job_id,
                description=f"Deleted scheduler job '{job[0]}' for {job[1]}",
            )

        return True

    def run_job_now(self, job_id: str):
        """Trigger immediate execution of a job."""
        # Run in background thread
        import threading
        thread = threading.Thread(target=self._execute_scan, args=(job_id,), daemon=True)
        thread.start()
        return True

    def get_all_jobs(self) -> list:
        """List all scheduler jobs."""
        with self.engine.connect() as conn:
            rows = conn.execute(
                sql_text("""
                    SELECT id, name, regulator, job_type, schedule_cron, enabled,
                           last_run, last_status, last_result, next_run,
                           created_at, updated_at, config
                    FROM scheduler_jobs
                    ORDER BY created_at DESC
                """)
            ).fetchall()

        return [
            {
                "id": str(r[0]),
                "name": r[1],
                "regulator": r[2],
                "job_type": r[3],
                "schedule_cron": r[4],
                "enabled": r[5],
                "last_run": r[6].isoformat() if r[6] else None,
                "last_status": r[7],
                "last_result": r[8] if isinstance(r[8], dict) else (json.loads(r[8]) if r[8] else None),
                "next_run": r[9].isoformat() if r[9] else None,
                "created_at": r[10].isoformat() if r[10] else None,
                "updated_at": r[11].isoformat() if r[11] else None,
                "config": r[12] if isinstance(r[12], dict) else (json.loads(r[12]) if r[12] else None),
            }
            for r in rows
        ]

    def get_job(self, job_id: str) -> Optional[dict]:
        """Get a single scheduler job."""
        with self.engine.connect() as conn:
            r = conn.execute(
                sql_text("""
                    SELECT id, name, regulator, job_type, schedule_cron, enabled,
                           last_run, last_status, last_result, next_run,
                           created_at, updated_at, config
                    FROM scheduler_jobs WHERE id = :id
                """),
                {"id": job_id},
            ).fetchone()

        if not r:
            return None

        return {
            "id": str(r[0]),
            "name": r[1],
            "regulator": r[2],
            "job_type": r[3],
            "schedule_cron": r[4],
            "enabled": r[5],
            "last_run": r[6].isoformat() if r[6] else None,
            "last_status": r[7],
            "last_result": r[8] if isinstance(r[8], dict) else (json.loads(r[8]) if r[8] else None),
            "next_run": r[9].isoformat() if r[9] else None,
            "created_at": r[10].isoformat() if r[10] else None,
            "updated_at": r[11].isoformat() if r[11] else None,
            "config": r[12] if isinstance(r[12], dict) else (json.loads(r[12]) if r[12] else None),
        }
