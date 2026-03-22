"""
CLHEAR Audit Logging Service
Provides centralized audit logging for all system and user actions.
Every compliance-relevant action is recorded with full context.
"""
import json
import logging
from datetime import datetime
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.sql import text as sql_text

logger = logging.getLogger(__name__)


class AuditService:
    """Centralized audit logger for compliance tracking."""

    # Action constants
    ACTION_DATA_LOAD = "data_load"
    ACTION_DATA_UPDATE = "data_update"
    ACTION_DATA_DELETE = "data_delete"
    ACTION_SCAN_STARTED = "scan_started"
    ACTION_SCAN_COMPLETED = "scan_completed"
    ACTION_SCAN_FAILED = "scan_failed"
    ACTION_SCHEDULER_CREATED = "scheduler_created"
    ACTION_SCHEDULER_UPDATED = "scheduler_updated"
    ACTION_SCHEDULER_DELETED = "scheduler_deleted"
    ACTION_SCHEDULER_TOGGLED = "scheduler_toggled"
    ACTION_NEWS_SCRAPED = "news_scraped"
    ACTION_NEWS_MARKED_READ = "news_marked_read"
    ACTION_EMAIL_SUB_CREATED = "email_sub_created"
    ACTION_EMAIL_SUB_UPDATED = "email_sub_updated"
    ACTION_EMAIL_SUB_DELETED = "email_sub_deleted"
    ACTION_EMAIL_SENT = "email_sent"
    ACTION_EMAIL_FAILED = "email_failed"
    ACTION_OBLIGATION_VIEWED = "obligation_viewed"
    ACTION_SOURCE_VIEWED = "source_viewed"
    ACTION_SEARCH_PERFORMED = "search_performed"
    ACTION_SYSTEM_STARTUP = "system_startup"
    ACTION_SCHEMA_MIGRATION = "schema_migration"

    # Entity types
    ENTITY_OBLIGATION = "obligation"
    ENTITY_SOURCE = "regulatory_source"
    ENTITY_SCHEDULER = "scheduler_job"
    ENTITY_NEWS = "regulatory_news"
    ENTITY_EMAIL_SUB = "email_subscription"
    ENTITY_SYSTEM = "system"

    # Severity levels
    SEV_INFO = "info"
    SEV_WARNING = "warning"
    SEV_ERROR = "error"
    SEV_CRITICAL = "critical"

    def __init__(self, engine):
        self.engine = engine

    def log(
        self,
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
        description: Optional[str] = None,
        changes: Optional[dict] = None,
        metadata: Optional[dict] = None,
        user_context: str = "system",
        severity: str = "info",
        conn=None,
    ):
        """
        Record an audit log entry.

        If conn is provided, uses that connection (caller manages commit).
        Otherwise, opens its own connection and commits immediately.
        """
        params = {
            "action": action,
            "entity_type": entity_type,
            "entity_id": str(entity_id) if entity_id else None,
            "user_context": user_context,
            "severity": severity,
            "description": description,
            "changes": json.dumps(changes) if changes else None,
            "metadata": json.dumps(metadata) if metadata else None,
            "timestamp": datetime.utcnow(),
        }

        insert_sql = sql_text("""
            INSERT INTO audit_log
                (timestamp, action, entity_type, entity_id, user_context,
                 severity, description, changes, metadata)
            VALUES
                (:timestamp, :action, :entity_type, :entity_id, :user_context,
                 :severity, :description, :changes, :metadata)
        """)

        if conn:
            conn.execute(insert_sql, params)
        else:
            with self.engine.connect() as new_conn:
                new_conn.execute(insert_sql, params)
                new_conn.commit()

        logger.info(
            f"AUDIT: [{severity.upper()}] {action} | {entity_type}"
            f"{f' ({entity_id})' if entity_id else ''}"
            f" | {description or ''}"
        )

    def log_data_load(self, regulator: str, entity_type: str, stats: dict, conn=None):
        """Log a bulk data load operation."""
        self.log(
            action=self.ACTION_DATA_LOAD,
            entity_type=entity_type,
            description=f"Loaded {regulator} {entity_type}: "
                        f"{stats.get('new', 0)} new, {stats.get('updated', 0)} updated, "
                        f"{stats.get('unchanged', 0)} unchanged",
            changes=stats,
            metadata={"regulator": regulator},
            severity=self.SEV_INFO,
            conn=conn,
        )

    def log_scan(self, job_id: str, regulator: str, status: str,
                 result: Optional[dict] = None, error: Optional[str] = None, conn=None):
        """Log a scheduled scan execution."""
        action = (
            self.ACTION_SCAN_COMPLETED if status == "success"
            else self.ACTION_SCAN_FAILED if status == "error"
            else self.ACTION_SCAN_STARTED
        )
        severity = self.SEV_ERROR if status == "error" else self.SEV_INFO

        self.log(
            action=action,
            entity_type=self.ENTITY_SCHEDULER,
            entity_id=job_id,
            description=f"Scan for {regulator}: {status}"
                        + (f" - {error}" if error else ""),
            changes=result,
            metadata={"regulator": regulator, "status": status},
            severity=severity,
            conn=conn,
        )

    def log_news_scrape(self, regulator: str, count: int, conn=None):
        """Log a news scraping operation."""
        self.log(
            action=self.ACTION_NEWS_SCRAPED,
            entity_type=self.ENTITY_NEWS,
            description=f"Scraped {count} news items from {regulator}",
            changes={"count": count, "regulator": regulator},
            severity=self.SEV_INFO,
            conn=conn,
        )

    def log_email(self, subscription_id: str, recipient: str, status: str,
                  news_count: int = 0, error: Optional[str] = None, conn=None):
        """Log an email send attempt."""
        action = self.ACTION_EMAIL_SENT if status == "success" else self.ACTION_EMAIL_FAILED
        severity = self.SEV_ERROR if status == "error" else self.SEV_INFO

        self.log(
            action=action,
            entity_type=self.ENTITY_EMAIL_SUB,
            entity_id=subscription_id,
            description=f"Email to {recipient}: {status}"
                        + (f" ({news_count} items)" if news_count else "")
                        + (f" - {error}" if error else ""),
            changes={"recipient": recipient, "news_count": news_count},
            severity=severity,
            conn=conn,
        )
