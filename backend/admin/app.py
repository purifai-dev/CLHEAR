"""
Admin FastAPI sub-app: HTTP Basic auth, scrape jobs, runs, reanalyze, seed status, audit.
Mounted at /admin on the main application.
"""
from __future__ import annotations

import json
import logging
import math
import os
import secrets
from pathlib import Path
from typing import Any, Optional

from fastapi import Body, Depends, FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy import text
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)

security = HTTPBasic(auto_error=False)


def _parse_json(val: Any) -> Any:
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return val
    if isinstance(val, str):
        try:
            return json.loads(val)
        except json.JSONDecodeError:
            return None
    return val


def create_admin_app(
    engine: Engine,
    scheduler_svc,
    scrape_orch,
) -> FastAPI:
    admin = FastAPI(title="CLHEAR Admin", docs_url=None, redoc_url=None, openapi_url=None)

    def _admin_configured() -> tuple[str, str]:
        u = os.getenv("CLHEAR_ADMIN_USER", "").strip()
        p = os.getenv("CLHEAR_ADMIN_PASS", "")
        return u, p

    async def require_admin(credentials: Optional[HTTPBasicCredentials] = Depends(security)) -> str:
        user, pwd = _admin_configured()
        if not user or not pwd:
            raise HTTPException(
                status_code=503,
                detail="Admin credentials not configured (set CLHEAR_ADMIN_USER and CLHEAR_ADMIN_PASS)",
            )
        if credentials is None:
            raise HTTPException(
                status_code=401,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Basic"},
            )
        ok_u = secrets.compare_digest(credentials.username, user)
        ok_p = secrets.compare_digest(credentials.password, pwd)
        if not (ok_u and ok_p):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Basic"},
            )
        return user

    admin_dir = Path(__file__).resolve().parent
    admin_html = admin_dir / "admin.html"

    @admin.get("/")
    def admin_dashboard(_: str = Depends(require_admin)):
        if not admin_html.is_file():
            raise HTTPException(status_code=500, detail="admin.html missing")
        return FileResponse(admin_html, media_type="text/html")

    @admin.get("/api/jobs")
    def list_jobs(_: str = Depends(require_admin)):
        return {"jobs": scheduler_svc.get_all_jobs()}

    @admin.post("/api/jobs")
    def create_job(body: dict = Body(...), _: str = Depends(require_admin)):
        name = body.get("name")
        regulator = body.get("regulator")
        if not name or not regulator:
            raise HTTPException(status_code=400, detail="name and regulator are required")
        cron = body.get("schedule_cron") or "0 6 * * *"
        enabled = body.get("enabled", True)
        cfg = body.get("config")
        return scheduler_svc.create_job(name, regulator, cron, bool(enabled), cfg)

    @admin.put("/api/jobs/{job_id}")
    def update_job(job_id: str, body: dict = Body(...), _: str = Depends(require_admin)):
        ok = scheduler_svc.update_job(job_id, **body)
        if not ok:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"ok": True, "id": job_id}

    @admin.delete("/api/jobs/{job_id}")
    def delete_job(job_id: str, _: str = Depends(require_admin)):
        ok = scheduler_svc.delete_job(job_id)
        if not ok:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"ok": True}

    @admin.post("/api/jobs/{job_id}/run")
    def run_job_now(job_id: str, _: str = Depends(require_admin)):
        j = scheduler_svc.get_job(job_id)
        if not j:
            raise HTTPException(status_code=404, detail="Job not found")
        scheduler_svc.run_job_now(job_id)
        return {"ok": True, "job_id": job_id}

    @admin.get("/api/scrape-runs")
    def list_scrape_runs(
        _: str = Depends(require_admin),
        page: int = Query(1, ge=1),
        page_size: int = Query(50, ge=1, le=200),
        status: Optional[str] = Query(None),
        date_from: Optional[str] = Query(None, alias="from"),
        date_to: Optional[str] = Query(None, alias="to"),
    ):
        filters = []
        params: dict = {}
        if status:
            filters.append("status = :status")
            params["status"] = status
        if date_from:
            filters.append("started_at >= CAST(:df AS timestamp)")
            params["df"] = date_from
        if date_to:
            filters.append("started_at <= CAST(:dt AS timestamp)")
            params["dt"] = date_to
        where = ("WHERE " + " AND ".join(filters)) if filters else ""

        with engine.connect() as conn:
            total = conn.execute(
                text(f"SELECT COUNT(*) FROM scrape_runs {where}"),
                params,
            ).scalar()
            offset = (page - 1) * page_size
            params["limit"] = page_size
            params["offset"] = offset
            rows = conn.execute(
                text(
                    f"""
                    SELECT id, run_type, status, started_at, completed_at, rules_total, rules_done,
                           items_created, items_updated, sources_new, sources_updated,
                           error_message, progress, metadata
                    FROM scrape_runs
                    {where}
                    ORDER BY started_at DESC
                    LIMIT :limit OFFSET :offset
                    """
                ),
                params,
            ).fetchall()

        items = [
            {
                "id": str(r[0]),
                "run_type": r[1],
                "status": r[2],
                "started_at": r[3].isoformat() if r[3] else None,
                "completed_at": r[4].isoformat() if r[4] else None,
                "rules_total": r[5],
                "rules_done": r[6],
                "items_created": r[7],
                "items_updated": r[8],
                "sources_new": r[9],
                "sources_updated": r[10],
                "error_message": r[11],
                "progress": _parse_json(r[12]),
                "metadata": _parse_json(r[13]),
            }
            for r in rows
        ]
        t = int(total or 0)
        return {
            "items": items,
            "total": t,
            "page": page,
            "page_size": page_size,
            "pages": max(1, math.ceil(t / page_size)),
        }

    @admin.get("/api/scrape-runs/{run_id}")
    def get_scrape_run(run_id: str, _: str = Depends(require_admin)):
        with engine.connect() as conn:
            r = conn.execute(
                text(
                    """
                    SELECT id, run_type, status, started_at, completed_at, rules_total, rules_done,
                           items_created, items_updated, sources_new, sources_updated,
                           error_message, progress, metadata
                    FROM scrape_runs WHERE id = CAST(:id AS uuid)
                    """
                ),
                {"id": run_id},
            ).fetchone()
        if not r:
            raise HTTPException(status_code=404, detail="Run not found")
        return {
            "id": str(r[0]),
            "run_type": r[1],
            "status": r[2],
            "started_at": r[3].isoformat() if r[3] else None,
            "completed_at": r[4].isoformat() if r[4] else None,
            "rules_total": r[5],
            "rules_done": r[6],
            "items_created": r[7],
            "items_updated": r[8],
            "sources_new": r[9],
            "sources_updated": r[10],
            "error_message": r[11],
            "progress": _parse_json(r[12]),
            "metadata": _parse_json(r[13]),
            "pipeline_running": scrape_orch.is_running(),
        }

    @admin.post("/api/reanalyze")
    def reanalyze(body: dict = Body(...), _: str = Depends(require_admin)):
        regulator = (body.get("regulator") or "FINRA").strip().upper()
        force_all = bool(body.get("force_all"))
        rule_numbers = body.get("rule_numbers")
        rlist = None
        if isinstance(rule_numbers, list):
            rlist = [str(x).strip() for x in rule_numbers if str(x).strip()]

        if regulator != "FINRA":
            raise HTTPException(status_code=400, detail="Only FINRA re-analysis is supported")

        try:
            if force_all and not rlist:
                return scrape_orch.start_finra_pipeline(max_rules=None, force_reanalyze=True)
            if rlist:
                return scrape_orch.start_finra_pipeline(
                    max_rules=None,
                    force_reanalyze=True,
                    rule_numbers=rlist,
                )
        except RuntimeError as e:
            raise HTTPException(status_code=409, detail=str(e)) from e

        raise HTTPException(
            status_code=400,
            detail="Provide force_all: true with regulator FINRA, or rule_numbers: [...]",
        )

    @admin.get("/api/seed-status")
    def seed_status(_: str = Depends(require_admin)):
        out: dict = {}
        queries = [
            ("verticals", "SELECT COUNT(*) FROM verticals"),
            ("pillars", "SELECT COUNT(*) FROM pillars"),
            ("regulators", "SELECT COUNT(*) FROM regulators"),
            ("standards", "SELECT COUNT(*) FROM reference_standards"),
            ("roles", "SELECT COUNT(*) FROM compliance_roles"),
            ("governance_bodies", "SELECT COUNT(*) FROM governance_bodies"),
        ]
        with engine.connect() as conn:
            for key, q in queries:
                try:
                    out[key] = int(conn.execute(text(q)).scalar() or 0)
                except Exception as e:
                    logger.warning("seed-status %s: %s", key, e)
                    out[key] = None
        return out

    @admin.get("/api/audit")
    def list_audit_admin(
        _: str = Depends(require_admin),
        page: int = Query(1, ge=1),
        page_size: int = Query(50, ge=1, le=200),
        action: Optional[str] = Query(None),
        entity_type: Optional[str] = Query(None),
        severity: Optional[str] = Query(None),
        q: Optional[str] = Query(None),
    ):
        filters = []
        params: dict = {}
        if action:
            filters.append("action = :action")
            params["action"] = action
        if entity_type:
            filters.append("entity_type = :entity_type")
            params["entity_type"] = entity_type
        if severity:
            filters.append("severity = :severity")
            params["severity"] = severity
        if q:
            filters.append(
                "(description ILIKE :q_pattern OR action ILIKE :q_pattern OR entity_type ILIKE :q_pattern)"
            )
            params["q_pattern"] = f"%{q}%"
        where = ("WHERE " + " AND ".join(filters)) if filters else ""

        with engine.connect() as conn:
            total = conn.execute(
                text(f"SELECT COUNT(*) FROM audit_log {where}"),
                params,
            ).scalar()
            offset = (page - 1) * page_size
            params["limit"] = page_size
            params["offset"] = offset
            rows = conn.execute(
                text(
                    f"""
                    SELECT id, timestamp, action, entity_type, entity_id,
                           user_context, severity, description, changes, metadata
                    FROM audit_log
                    {where}
                    ORDER BY timestamp DESC
                    LIMIT :limit OFFSET :offset
                    """
                ),
                params,
            ).fetchall()

        items = [
            {
                "id": r[0],
                "timestamp": r[1].isoformat() if r[1] else None,
                "action": r[2],
                "entity_type": r[3],
                "entity_id": r[4],
                "user_context": r[5],
                "severity": r[6],
                "description": r[7],
                "changes": _parse_json(r[8]),
                "metadata": _parse_json(r[9]),
            }
            for r in rows
        ]
        t = int(total or 0)
        return {
            "items": items,
            "total": t,
            "page": page,
            "page_size": page_size,
            "pages": max(1, math.ceil(t / page_size)),
        }

    @admin.get("/api/pipeline-status")
    def pipeline_status(_: str = Depends(require_admin)):
        latest = scrape_orch.get_latest_run()
        return latest if latest else {"running": scrape_orch.is_running()}

    @admin.post("/api/migrate")
    def migrate_on_demand(_: str = Depends(require_admin)):
        from database.init_schema import run_schema_migrations
        from database.clhear_framework_seed import run_clhear_seed

        run_schema_migrations()
        counts = run_clhear_seed(engine)
        return {"ok": True, "seed_counts": counts}

    return admin
