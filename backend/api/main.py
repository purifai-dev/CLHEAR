import json
import logging
import math
import os
import uuid

from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://clhear_user:dev123@localhost:5432/clhear")
APP_BASE_URL = os.getenv("APP_BASE_URL", "https://clhear.ai")

# Comma-separated list from Terraform / ECS (includes ALB DNS + clhear.ai)
_cors_raw = os.getenv(
    "ALLOWED_ORIGINS_CORS",
    "https://clhear.ai,https://www.clhear.ai,http://localhost:8000",
)
ALLOWED_ORIGINS = [o.strip() for o in _cors_raw.split(",") if o.strip()]
if APP_BASE_URL not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.insert(0, APP_BASE_URL)
engine = create_engine(DATABASE_URL)

# ---------------------------------------------------------------------------
# Initialize services
# ---------------------------------------------------------------------------
from services.audit_service import AuditService
from services.scheduler_service import SchedulerService
from services.news_service import NewsService
from services.email_service import EmailService
from services.scrape_orchestrator import ScrapeOrchestrator

audit_svc = AuditService(engine)
scheduler_svc = SchedulerService(engine, audit_service=audit_svc)
news_svc = NewsService(engine, audit_service=audit_svc)
email_svc = EmailService(engine, audit_service=audit_svc)
scrape_orch = ScrapeOrchestrator(engine, audit_service=audit_svc)


def get_db():
    with engine.connect() as conn:
        yield conn


def _parse_json(val):
    """Handle JSONB columns that may come back as dict or string."""
    if val is None:
        return None
    if isinstance(val, str):
        return json.loads(val)
    return val


# ---------------------------------------------------------------------------
# Lifespan: start/stop scheduler
# ---------------------------------------------------------------------------
def _env_flag_true(name: str) -> bool:
    return os.getenv(name, "").strip().lower() in ("1", "true", "yes")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: optional schema + seed (idempotent; first ECS task after deploy)
    if _env_flag_true("CLHEAR_RUN_MIGRATIONS"):
        try:
            from database.init_schema import run_schema_migrations
            from database.clhear_framework_seed import run_clhear_seed

            run_schema_migrations()
            run_clhear_seed(engine)
            logger.info("CLHEAR startup: schema migrations and framework seed completed")
        except Exception:
            logger.exception("CLHEAR startup migration failed")
            raise

    scheduler_svc.start()
    audit_svc.log(
        action="system_startup",
        entity_type="system",
        description="CLHEAR.ai platform started",
    )
    logger.info("CLHEAR.ai platform started")
    yield
    # Shutdown
    scheduler_svc.stop()
    logger.info("CLHEAR.ai platform stopped")


app = FastAPI(
    title="CLHEAR.ai Platform API",
    description="Compliance intelligence for financial institutions — clhear.ai",
    version="0.3.0",
    lifespan=lifespan,
)

# CORS — ALLOWED_ORIGINS_CORS env (set by ECS) or defaults above
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "healthy"}


# ===========================================================================
# Stats
# ===========================================================================

@app.get("/api/stats")
def get_stats(conn: Connection = Depends(get_db)):
    total = conn.execute(text("SELECT COUNT(*) FROM regulatory_obligations")).scalar()

    by_regulator = {
        row[0]: row[1]
        for row in conn.execute(
            text("SELECT regulator, COUNT(*) FROM regulatory_obligations GROUP BY regulator ORDER BY regulator")
        )
    }

    by_category = {
        row[0]: row[1]
        for row in conn.execute(
            text("SELECT category, COUNT(*) FROM regulatory_obligations GROUP BY category ORDER BY category")
        )
    }

    by_severity = {
        row[0]: row[1]
        for row in conn.execute(
            text("SELECT severity, COUNT(*) FROM regulatory_obligations GROUP BY severity ORDER BY severity")
        )
    }

    audit_total = conn.execute(text("SELECT COUNT(*) FROM audit_log")).scalar()

    # Sources stats
    total_sources = conn.execute(text("SELECT COUNT(*) FROM regulatory_sources")).scalar()
    sources_by_regulator = {
        row[0]: row[1]
        for row in conn.execute(
            text("SELECT regulator, COUNT(*) FROM regulatory_sources GROUP BY regulator ORDER BY regulator")
        )
    }

    # News stats
    news_stats = news_svc.get_news_stats()

    # Scheduler stats
    scheduler_jobs = scheduler_svc.get_all_jobs()

    return {
        "total_obligations": total,
        "by_regulator": by_regulator,
        "by_category": by_category,
        "by_severity": by_severity,
        "total_audit_events": audit_total,
        "total_sources": total_sources,
        "sources_by_regulator": sources_by_regulator,
        "news": news_stats,
        "scheduler_jobs_count": len(scheduler_jobs),
        "active_jobs": sum(1 for j in scheduler_jobs if j.get("enabled")),
    }


# ===========================================================================
# Filter options
# ===========================================================================

@app.get("/api/filter-options")
def get_filter_options(conn: Connection = Depends(get_db)):
    regulators = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT regulator FROM regulatory_obligations WHERE regulator IS NOT NULL ORDER BY regulator")
        )
    ]
    categories = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT category FROM regulatory_obligations WHERE category IS NOT NULL ORDER BY category")
        )
    ]
    severities = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT severity FROM regulatory_obligations WHERE severity IS NOT NULL ORDER BY severity")
        )
    ]
    actions = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT action FROM audit_log WHERE action IS NOT NULL ORDER BY action")
        )
    ]
    entity_types = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT entity_type FROM audit_log WHERE entity_type IS NOT NULL ORDER BY entity_type")
        )
    ]
    # Source filter options
    source_regulators = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT regulator FROM regulatory_sources WHERE regulator IS NOT NULL ORDER BY regulator")
        )
    ]
    source_series = [
        {"series": r[0], "series_title": r[1]}
        for r in conn.execute(
            text("SELECT DISTINCT series, series_title FROM regulatory_sources WHERE series IS NOT NULL ORDER BY series")
        )
    ]

    # Audit severity options
    audit_severities = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT severity FROM audit_log WHERE severity IS NOT NULL ORDER BY severity")
        )
    ]

    return {
        "regulators": regulators,
        "categories": categories,
        "severities": severities,
        "actions": actions,
        "entity_types": entity_types,
        "source_regulators": source_regulators,
        "source_series": source_series,
        "audit_severities": audit_severities,
    }


# ===========================================================================
# Obligations
# ===========================================================================

@app.get("/api/obligations")
def list_obligations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    regulator: str = Query(None),
    category: str = Query(None),
    severity: str = Query(None),
    q: str = Query(None),
    conn: Connection = Depends(get_db),
):
    filters = []
    params: dict = {}

    if regulator:
        filters.append("regulator = :regulator")
        params["regulator"] = regulator
    if category:
        filters.append("category = :category")
        params["category"] = category
    if severity:
        filters.append("severity = :severity")
        params["severity"] = severity
    if q:
        filters.append(
            "(obligation_title ILIKE :q_pattern OR obligation_text ILIKE :q_pattern OR obligation_code ILIKE :q_pattern)"
        )
        params["q_pattern"] = f"%{q}%"

    where = ("WHERE " + " AND ".join(filters)) if filters else ""

    total = conn.execute(
        text(f"SELECT COUNT(*) FROM regulatory_obligations {where}"), params
    ).scalar()

    offset = (page - 1) * page_size
    params["limit"] = page_size
    params["offset"] = offset

    rows = conn.execute(
        text(
            f"""
            SELECT id, obligation_code, regulator, rule_reference, obligation_title,
                   obligation_summary, category, severity, pillar_id, effective_date,
                   created_at, updated_at, source_rule_number
            FROM regulatory_obligations
            {where}
            ORDER BY obligation_code
            LIMIT :limit OFFSET :offset
            """
        ),
        params,
    ).fetchall()

    items = [
        {
            "id": str(r[0]),
            "obligation_code": r[1],
            "regulator": r[2],
            "rule_reference": r[3],
            "obligation_title": r[4],
            "obligation_summary": r[5],
            "category": r[6],
            "severity": r[7],
            "pillar_id": r[8],
            "effective_date": r[9].isoformat() if r[9] else None,
            "created_at": r[10].isoformat() if r[10] else None,
            "updated_at": r[11].isoformat() if r[11] else None,
            "source_rule_number": r[12],
        }
        for r in rows
    ]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, math.ceil(total / page_size)),
    }


@app.get("/api/obligations/{obligation_id}")
def get_obligation(obligation_id: str, conn: Connection = Depends(get_db)):
    is_uuid = len(obligation_id) == 36 and obligation_id.count("-") == 4
    col = "id" if is_uuid else "obligation_code"

    row = conn.execute(
        text(
            f"""
            SELECT id, obligation_code, regulator, rule_reference, obligation_title,
                   obligation_text, obligation_summary, category, severity, pillar_id,
                   effective_date, created_at, updated_at, metadata,
                   severity_reasoning, source_url, source_rule_number
            FROM regulatory_obligations WHERE {col} = :val
            """
        ),
        {"val": obligation_id},
    ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Obligation not found")

    # Audit the view
    audit_svc.log(
        action="obligation_viewed",
        entity_type="obligation",
        entity_id=str(row[0]),
        description=f"Viewed obligation {row[1]}",
        severity="info",
    )

    return {
        "id": str(row[0]),
        "obligation_code": row[1],
        "regulator": row[2],
        "rule_reference": row[3],
        "obligation_title": row[4],
        "obligation_text": row[5],
        "obligation_summary": row[6],
        "category": row[7],
        "severity": row[8],
        "pillar_id": row[9],
        "effective_date": row[10].isoformat() if row[10] else None,
        "created_at": row[11].isoformat() if row[11] else None,
        "updated_at": row[12].isoformat() if row[12] else None,
        "metadata": _parse_json(row[13]),
        "severity_reasoning": row[14],
        "source_url": row[15],
        "source_rule_number": row[16],
    }


# ===========================================================================
# Regulatory Sources
# ===========================================================================

@app.get("/api/sources")
def list_sources(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    regulator: str = Query(None),
    series: str = Query(None),
    q: str = Query(None),
    conn: Connection = Depends(get_db),
):
    filters = []
    params: dict = {}

    if regulator:
        filters.append("regulator = :regulator")
        params["regulator"] = regulator
    if series:
        filters.append("series = :series")
        params["series"] = series
    if q:
        filters.append(
            "to_tsvector('english', coalesce(rule_title, '') || ' ' || coalesce(raw_text, '')) @@ plainto_tsquery('english', :q)"
        )
        params["q"] = q

    where = ("WHERE " + " AND ".join(filters)) if filters else ""

    total = conn.execute(
        text(f"SELECT COUNT(*) FROM regulatory_sources {where}"), params
    ).scalar()

    offset = (page - 1) * page_size
    params["limit"] = page_size
    params["offset"] = offset

    rows = conn.execute(
        text(
            f"""
            SELECT id, regulator, series, series_title, rule_number, rule_title,
                   source_url, created_at, updated_at,
                   LEFT(raw_text, 200) as text_preview
            FROM regulatory_sources
            {where}
            ORDER BY regulator, series, rule_number
            LIMIT :limit OFFSET :offset
            """
        ),
        params,
    ).fetchall()

    items = [
        {
            "id": str(r[0]),
            "regulator": r[1],
            "series": r[2],
            "series_title": r[3],
            "rule_number": r[4],
            "rule_title": r[5],
            "source_url": r[6],
            "created_at": r[7].isoformat() if r[7] else None,
            "updated_at": r[8].isoformat() if r[8] else None,
            "text_preview": r[9],
        }
        for r in rows
    ]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, math.ceil(total / page_size)),
    }


@app.get("/api/sources/{source_id}")
def get_source(source_id: str, conn: Connection = Depends(get_db)):
    is_uuid = len(source_id) == 36 and source_id.count("-") == 4

    if is_uuid:
        row = conn.execute(
            text(
                """
                SELECT id, regulator, series, series_title, subseries, subseries_title,
                       rule_number, rule_title, raw_text, source_url,
                       effective_date, last_amended, created_at, updated_at, metadata
                FROM regulatory_sources WHERE id = :val
                """
            ),
            {"val": source_id},
        ).fetchone()
    else:
        row = conn.execute(
            text(
                """
                SELECT id, regulator, series, series_title, subseries, subseries_title,
                       rule_number, rule_title, raw_text, source_url,
                       effective_date, last_amended, created_at, updated_at, metadata
                FROM regulatory_sources WHERE rule_number = :val
                """
            ),
            {"val": source_id},
        ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Source not found")

    # Related obligations
    obligations = conn.execute(
        text(
            """
            SELECT obligation_code, obligation_title, severity, category
            FROM regulatory_obligations
            WHERE source_rule_number = :rn
            ORDER BY obligation_code
            """
        ),
        {"rn": row[6]},
    ).fetchall()

    related_items = conn.execute(
        text(
            """
            SELECT item_code, title, item_type, importance
            FROM regulatory_items
            WHERE source_rule_number = :rn
            ORDER BY item_code
            LIMIT 500
            """
        ),
        {"rn": row[6]},
    ).fetchall()

    # Audit the view
    audit_svc.log(
        action="source_viewed",
        entity_type="regulatory_source",
        entity_id=str(row[0]),
        description=f"Viewed source rule {row[6]}",
        severity="info",
    )

    return {
        "id": str(row[0]),
        "regulator": row[1],
        "series": row[2],
        "series_title": row[3],
        "subseries": row[4],
        "subseries_title": row[5],
        "rule_number": row[6],
        "rule_title": row[7],
        "raw_text": row[8],
        "source_url": row[9],
        "effective_date": row[10].isoformat() if row[10] else None,
        "last_amended": row[11].isoformat() if row[11] else None,
        "created_at": row[12].isoformat() if row[12] else None,
        "updated_at": row[13].isoformat() if row[13] else None,
        "metadata": _parse_json(row[14]),
        "related_obligations": [
            {
                "obligation_code": o[0],
                "obligation_title": o[1],
                "severity": o[2],
                "category": o[3],
            }
            for o in obligations
        ],
        "related_regulatory_items": [
            {
                "item_code": ri[0],
                "title": ri[1],
                "item_type": ri[2],
                "importance": ri[3],
            }
            for ri in related_items
        ],
    }


# ===========================================================================
# Audit log (enhanced)
# ===========================================================================

@app.get("/api/audit")
def list_audit(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    action: str = Query(None),
    entity_type: str = Query(None),
    severity: str = Query(None),
    q: str = Query(None),
    conn: Connection = Depends(get_db),
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

    total = conn.execute(
        text(f"SELECT COUNT(*) FROM audit_log {where}"), params
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

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, math.ceil(total / page_size)),
    }


@app.get("/api/audit/stats")
def audit_stats(conn: Connection = Depends(get_db)):
    """Get audit log statistics."""
    total = conn.execute(text("SELECT COUNT(*) FROM audit_log")).scalar()

    by_action = {
        r[0]: r[1]
        for r in conn.execute(
            text("SELECT action, COUNT(*) FROM audit_log GROUP BY action ORDER BY COUNT(*) DESC LIMIT 20")
        )
    }

    by_severity = {
        r[0]: r[1]
        for r in conn.execute(
            text("SELECT severity, COUNT(*) FROM audit_log WHERE severity IS NOT NULL GROUP BY severity")
        )
    }

    by_entity = {
        r[0]: r[1]
        for r in conn.execute(
            text("SELECT entity_type, COUNT(*) FROM audit_log GROUP BY entity_type ORDER BY COUNT(*) DESC")
        )
    }

    # Recent activity (last 24h)
    recent = conn.execute(
        text("SELECT COUNT(*) FROM audit_log WHERE timestamp > NOW() - INTERVAL '24 hours'")
    ).scalar()

    return {
        "total": total,
        "by_action": by_action,
        "by_severity": by_severity,
        "by_entity": by_entity,
        "last_24h": recent,
    }


# ===========================================================================
# Scheduler endpoints
# ===========================================================================

@app.get("/api/scheduler/jobs")
def list_scheduler_jobs():
    """List all scheduler jobs."""
    return {"items": scheduler_svc.get_all_jobs()}


@app.get("/api/scheduler/jobs/{job_id}")
def get_scheduler_job(job_id: str):
    """Get a single scheduler job."""
    job = scheduler_svc.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.post("/api/scheduler/jobs")
def create_scheduler_job(body: dict = Body(...)):
    """Create a new scheduler job."""
    name = body.get("name")
    regulator = body.get("regulator")
    cron_expr = body.get("schedule_cron", "0 6 * * *")
    enabled = body.get("enabled", True)
    config = body.get("config")

    if not name or not regulator:
        raise HTTPException(status_code=400, detail="name and regulator are required")

    result = scheduler_svc.create_job(name, regulator, cron_expr, enabled, config)
    return result


@app.put("/api/scheduler/jobs/{job_id}")
def update_scheduler_job(job_id: str, body: dict = Body(...)):
    """Update a scheduler job."""
    success = scheduler_svc.update_job(job_id, **body)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found or no changes")
    return scheduler_svc.get_job(job_id)


@app.delete("/api/scheduler/jobs/{job_id}")
def delete_scheduler_job(job_id: str):
    """Delete a scheduler job."""
    success = scheduler_svc.delete_job(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"deleted": True}


@app.post("/api/scheduler/jobs/{job_id}/run")
def run_scheduler_job_now(job_id: str):
    """Trigger immediate execution of a job."""
    job = scheduler_svc.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    scheduler_svc.run_job_now(job_id)
    return {"status": "triggered", "job_id": job_id}


# ===========================================================================
# Regulatory News endpoints
# ===========================================================================

@app.get("/api/news")
def list_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    regulator: str = Query(None),
    importance: str = Query(None),
    is_read: bool = Query(None),
    q: str = Query(None),
):
    """List regulatory news items."""
    return news_svc.get_news(page, page_size, regulator, importance, is_read, q)


@app.get("/api/news/stats")
def news_stats():
    """Get news statistics."""
    return news_svc.get_news_stats()


@app.get("/api/news/unread-count")
def news_unread_count():
    """Get unread news count by regulator."""
    return news_svc.get_unread_count()


@app.post("/api/news/{news_id}/read")
def mark_news_read(news_id: str, body: dict = Body(None)):
    """Mark a news item as read/unread."""
    read = body.get("read", True) if body else True
    success = news_svc.mark_read(news_id, read)
    if not success:
        raise HTTPException(status_code=404, detail="News item not found")
    return {"success": True}


@app.post("/api/news/scrape")
def scrape_news(body: dict = Body(...)):
    """Trigger a news scrape for a regulator."""
    regulator = body.get("regulator")
    if not regulator:
        raise HTTPException(status_code=400, detail="regulator is required")
    result = news_svc.scrape_regulator_news(regulator)
    return result


@app.post("/api/news/scrape-all")
def scrape_all_news():
    """Trigger a news scrape for all configured regulators."""
    results = {}
    for reg in ["FINRA", "FCA"]:
        results[reg] = news_svc.scrape_regulator_news(reg)
    return results


# ===========================================================================
# Email subscription endpoints
# ===========================================================================

@app.get("/api/email/subscriptions")
def list_email_subscriptions(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
):
    """List email subscriptions."""
    return email_svc.get_subscriptions(page, page_size)


@app.get("/api/email/subscriptions/{sub_id}")
def get_email_subscription(sub_id: str):
    """Get a single email subscription."""
    sub = email_svc.get_subscription(sub_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub


@app.post("/api/email/subscriptions")
def create_email_subscription(body: dict = Body(...)):
    """Create a new email subscription."""
    email = body.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="email is required")

    return email_svc.create_subscription(
        email=email,
        name=body.get("name", ""),
        regulators=body.get("regulators"),
        importance_filter=body.get("importance_filter"),
        frequency=body.get("frequency", "daily"),
    )


@app.put("/api/email/subscriptions/{sub_id}")
def update_email_subscription(sub_id: str, body: dict = Body(...)):
    """Update an email subscription."""
    success = email_svc.update_subscription(sub_id, **body)
    if not success:
        raise HTTPException(status_code=404, detail="Subscription not found or no changes")
    return email_svc.get_subscription(sub_id)


@app.delete("/api/email/subscriptions/{sub_id}")
def delete_email_subscription(sub_id: str):
    """Delete an email subscription."""
    success = email_svc.delete_subscription(sub_id)
    if not success:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"deleted": True}


@app.post("/api/email/send-digests")
def send_email_digests():
    """Manually trigger sending of daily digest emails."""
    result = email_svc.send_daily_digests()
    return result


@app.get("/api/email/smtp-status")
def smtp_status():
    """Get SMTP configuration status."""
    return email_svc.get_smtp_status()


# ===========================================================================
# Regulatory items (FINRA AI pipeline) + scrape control
# ===========================================================================


@app.get("/api/items/stats")
def items_stats(conn: Connection = Depends(get_db)):
    total = conn.execute(text("SELECT COUNT(*) FROM regulatory_items")).scalar()
    by_type = {
        r[0]: r[1]
        for r in conn.execute(
            text("SELECT item_type, COUNT(*) FROM regulatory_items GROUP BY item_type ORDER BY item_type")
        )
    }
    by_importance = {
        r[0]: r[1]
        for r in conn.execute(
            text("SELECT importance, COUNT(*) FROM regulatory_items WHERE importance IS NOT NULL GROUP BY importance")
        )
    }
    by_regulator = {
        r[0]: r[1]
        for r in conn.execute(
            text("SELECT regulator, COUNT(*) FROM regulatory_items GROUP BY regulator ORDER BY regulator")
        )
    }
    return {
        "total": total,
        "by_type": by_type,
        "by_importance": by_importance,
        "by_regulator": by_regulator,
    }


@app.get("/api/items/filter-options")
def items_filter_options(conn: Connection = Depends(get_db)):
    regulators = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT regulator FROM regulatory_items WHERE regulator IS NOT NULL ORDER BY regulator")
        )
    ]
    item_types = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT item_type FROM regulatory_items WHERE item_type IS NOT NULL ORDER BY item_type")
        )
    ]
    categories = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT category FROM regulatory_items WHERE category IS NOT NULL ORDER BY category")
        )
    ]
    importances = [
        r[0]
        for r in conn.execute(
            text("SELECT DISTINCT importance FROM regulatory_items WHERE importance IS NOT NULL ORDER BY importance")
        )
    ]
    return {
        "regulators": regulators,
        "item_types": item_types,
        "categories": categories,
        "importances": importances,
    }


@app.get("/api/items")
def list_regulatory_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    regulator: str = Query(None),
    item_type: str = Query(None),
    category: str = Query(None),
    importance: str = Query(None),
    pillar_id: int = Query(None),
    q: str = Query(None),
    sort_by: str = Query("item_code"),
    sort_order: str = Query("asc"),
    conn: Connection = Depends(get_db),
):
    filters = []
    params: dict = {}
    if regulator:
        filters.append("regulator = :regulator")
        params["regulator"] = regulator
    if item_type:
        filters.append("item_type = :item_type")
        params["item_type"] = item_type
    if category:
        filters.append("category = :category")
        params["category"] = category
    if importance:
        filters.append("importance = :importance")
        params["importance"] = importance
    if pillar_id is not None:
        filters.append("pillar_id = :pillar_id")
        params["pillar_id"] = pillar_id
    if q:
        filters.append(
            "(title ILIKE :q_pattern OR description ILIKE :q_pattern OR item_code ILIKE :q_pattern OR summary ILIKE :q_pattern)"
        )
        params["q_pattern"] = f"%{q}%"
    where = ("WHERE " + " AND ".join(filters)) if filters else ""

    total = conn.execute(text(f"SELECT COUNT(*) FROM regulatory_items {where}"), params).scalar()

    sort_cols = {
        "item_code": "item_code",
        "title": "title",
        "importance": "importance",
        "category": "category",
        "rule_reference": "rule_reference",
        "analyzed_at": "analyzed_at",
    }
    col = sort_cols.get(sort_by, "item_code")
    order = "DESC" if sort_order.lower() == "desc" else "ASC"

    offset = (page - 1) * page_size
    params["limit"] = page_size
    params["offset"] = offset

    rows = conn.execute(
        text(
            f"""
            SELECT id, item_code, regulator, item_type, rule_reference, source_rule_number,
                   title, summary, category, pillar_id, importance, analyzed_at
            FROM regulatory_items
            {where}
            ORDER BY {col} {order}
            LIMIT :limit OFFSET :offset
            """
        ),
        params,
    ).fetchall()

    items = [
        {
            "id": str(r[0]),
            "item_code": r[1],
            "regulator": r[2],
            "item_type": r[3],
            "rule_reference": r[4],
            "source_rule_number": r[5],
            "title": r[6],
            "summary": r[7],
            "category": r[8],
            "pillar_id": r[9],
            "importance": r[10],
            "analyzed_at": r[11].isoformat() if r[11] else None,
        }
        for r in rows
    ]
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, math.ceil(total / page_size)),
    }


@app.get("/api/items/{item_code}")
def get_regulatory_item(item_code: str, conn: Connection = Depends(get_db)):
    row = conn.execute(
        text(
            """
            SELECT ri.id, ri.item_code, ri.regulator, ri.item_type, ri.rule_reference, ri.source_rule_number,
                   ri.source_url, ri.title, ri.description, ri.summary, ri.category, ri.pillar_id,
                   ri.importance, ri.importance_reasoning, ri.evidence_excerpt, ri.tags, ri.applicability,
                   ri.content_hash, ri.analysis_version, ri.scraped_at, ri.analyzed_at, ri.metadata,
                   rs.raw_text, rs.rule_title
            FROM regulatory_items ri
            LEFT JOIN regulatory_sources rs
              ON rs.regulator = ri.regulator AND rs.rule_number = ri.source_rule_number
            WHERE ri.item_code = :code
            """
        ),
        {"code": item_code},
    ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Regulatory item not found")

    audit_svc.log(
        action="regulatory_item_viewed",
        entity_type="regulatory_item",
        entity_id=str(row[0]),
        description=f"Viewed item {row[1]}",
        severity="info",
    )

    raw_text = row[22]
    rule_title = row[23]
    source_rule = None
    if raw_text or rule_title:
        source_rule = {"raw_text": raw_text, "rule_title": rule_title}

    return {
        "id": str(row[0]),
        "item_code": row[1],
        "regulator": row[2],
        "item_type": row[3],
        "rule_reference": row[4],
        "source_rule_number": row[5],
        "source_url": row[6],
        "title": row[7],
        "description": row[8],
        "summary": row[9],
        "category": row[10],
        "pillar_id": row[11],
        "importance": row[12],
        "importance_reasoning": row[13],
        "evidence_excerpt": row[14],
        "tags": _parse_json(row[15]) if row[15] is not None else [],
        "applicability": _parse_json(row[16]) if row[16] is not None else {},
        "content_hash": row[17],
        "analysis_version": row[18],
        "scraped_at": row[19].isoformat() if row[19] else None,
        "analyzed_at": row[20].isoformat() if row[20] else None,
        "metadata": _parse_json(row[21]),
        "source_rule": source_rule,
    }


@app.post("/api/scrape/finra")
def start_finra_scrape(body: dict = Body(None)):
    """Start background FINRA rulebook scrape + Claude analysis."""
    body = body or {}
    try:
        out = scrape_orch.start_finra_pipeline(
            max_rules=body.get("max_rules"),
            force_reanalyze=bool(body.get("force_reanalyze")),
        )
        return out
    except RuntimeError as e:
        raise HTTPException(status_code=409, detail=str(e))


@app.get("/api/scrape/status")
def scrape_status():
    return scrape_orch.get_latest_run() or {"status": "none", "running": scrape_orch.is_running()}


# ===========================================================================
# CLHEAR reference framework + compliance program API
# ===========================================================================


@app.get("/api/reference/framework")
def reference_framework(conn: Connection = Depends(get_db)):
    verticals = [
        {"id": r[0], "vertical_number": r[1], "name": r[2], "description": r[3]}
        for r in conn.execute(
            text("SELECT id, vertical_number, name, description FROM verticals ORDER BY vertical_number")
        )
    ]
    pillars = [
        {"pillar_number": r[0], "vertical_id": r[1], "name": r[2], "description": r[3]}
        for r in conn.execute(
            text("SELECT pillar_number, vertical_id, name, description FROM pillars ORDER BY pillar_number")
        )
    ]
    reg_count = conn.execute(text("SELECT COUNT(*) FROM regulators")).scalar()
    std_count = conn.execute(text("SELECT COUNT(*) FROM reference_standards")).scalar()
    role_count = conn.execute(text("SELECT COUNT(*) FROM compliance_roles")).scalar()
    gov_count = conn.execute(text("SELECT COUNT(*) FROM governance_bodies")).scalar()
    return {
        "verticals": verticals,
        "pillars": pillars,
        "counts": {
            "regulators": reg_count,
            "reference_standards": std_count,
            "compliance_roles": role_count,
            "governance_bodies": gov_count,
        },
    }


@app.get("/api/reference/verticals")
def reference_verticals(conn: Connection = Depends(get_db)):
    rows = conn.execute(
        text("SELECT id, vertical_number, name, description FROM verticals ORDER BY vertical_number")
    ).fetchall()
    return [{"id": r[0], "vertical_number": r[1], "name": r[2], "description": r[3]} for r in rows]


@app.get("/api/reference/pillars")
def reference_pillars(conn: Connection = Depends(get_db)):
    rows = conn.execute(
        text(
            """
            SELECT p.pillar_number, p.vertical_id, p.name, p.description, v.vertical_number
            FROM pillars p
            JOIN verticals v ON v.id = p.vertical_id
            ORDER BY p.pillar_number
            """
        )
    ).fetchall()
    return [
        {
            "pillar_number": r[0],
            "vertical_id": r[1],
            "name": r[2],
            "description": r[3],
            "vertical_number": r[4],
        }
        for r in rows
    ]


@app.get("/api/reference/roles")
def reference_roles(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    conn: Connection = Depends(get_db),
):
    total = conn.execute(text("SELECT COUNT(*) FROM compliance_roles")).scalar()
    offset = (page - 1) * page_size
    rows = conn.execute(
        text(
            """
            SELECT id, role_number, title, line_of_defence, reports_to, tier
            FROM compliance_roles
            ORDER BY role_number
            LIMIT :limit OFFSET :offset
            """
        ),
        {"limit": page_size, "offset": offset},
    ).fetchall()
    return {
        "items": [
            {
                "id": str(r[0]),
                "role_number": r[1],
                "title": r[2],
                "line_of_defence": r[3],
                "reports_to": r[4],
                "tier": r[5],
            }
            for r in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, math.ceil(total / page_size)),
    }


@app.get("/api/reference/governance")
def reference_governance(conn: Connection = Depends(get_db)):
    rows = conn.execute(
        text(
            """
            SELECT g.id, g.body_number, g.name, g.tier, g.chair_role_id, g.meeting_frequency,
                   g.description, g.key_standards, cr.title AS chair_title
            FROM governance_bodies g
            LEFT JOIN compliance_roles cr ON cr.id = g.chair_role_id
            ORDER BY g.body_number
            """
        )
    ).fetchall()
    return {
        "items": [
            {
                "id": str(r[0]),
                "body_number": r[1],
                "name": r[2],
                "tier": r[3],
                "chair_role_id": str(r[4]) if r[4] else None,
                "meeting_frequency": r[5],
                "description": r[6],
                "key_standards": r[7],
                "chair_title": r[8],
            }
            for r in rows
        ]
    }


@app.get("/api/reference/standards")
def reference_standards_list(conn: Connection = Depends(get_db)):
    rows = conn.execute(
        text("SELECT id, code, name, category, primary_focus, clhear_relevance, sort_order FROM reference_standards ORDER BY sort_order, code")
    ).fetchall()
    return [
        {
            "id": str(r[0]),
            "code": r[1],
            "name": r[2],
            "category": r[3],
            "primary_focus": r[4],
            "clhear_relevance": r[5],
            "sort_order": r[6],
        }
        for r in rows
    ]


@app.get("/api/program/frameworks")
def list_control_frameworks(conn: Connection = Depends(get_db)):
    rows = conn.execute(
        text("SELECT id, name, description, firm_type, jurisdiction, status, created_at, updated_at FROM control_frameworks ORDER BY created_at DESC")
    ).fetchall()
    return {
        "items": [
            {
                "id": str(r[0]),
                "name": r[1],
                "description": r[2],
                "firm_type": r[3],
                "jurisdiction": r[4],
                "status": r[5],
                "created_at": r[6].isoformat() if r[6] else None,
                "updated_at": r[7].isoformat() if r[7] else None,
            }
            for r in rows
        ]
    }


@app.post("/api/program/frameworks")
def create_control_framework(body: dict = Body(...), conn: Connection = Depends(get_db)):
    name = body.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    fid = str(uuid.uuid4())
    conn.execute(
        text(
            """
            INSERT INTO control_frameworks (id, name, description, firm_type, jurisdiction, status, created_at, updated_at, metadata)
            VALUES (CAST(:id AS uuid), :name, :description, :firm_type, :jurisdiction, COALESCE(:status, 'draft'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CAST(:metadata AS jsonb))
            """
        ),
        {
            "id": fid,
            "name": name,
            "description": body.get("description"),
            "firm_type": body.get("firm_type"),
            "jurisdiction": body.get("jurisdiction"),
            "status": body.get("status"),
            "metadata": json.dumps(body.get("metadata") or {}),
        },
    )
    conn.commit()
    audit_svc.log(
        action="control_framework_created",
        entity_type="control_framework",
        entity_id=fid,
        description=f"Created framework {name}",
    )
    return {"id": fid, "name": name}


@app.get("/api/program/controls")
def list_program_controls(
    framework_id: str = Query(None),
    conn: Connection = Depends(get_db),
):
    params = {}
    where = ""
    if framework_id:
        where = "WHERE framework_id = CAST(:fw AS uuid)"
        params["fw"] = framework_id
    rows = conn.execute(
        text(
            f"""
            SELECT id, control_code, framework_id, pillar_number, title, description, control_type,
                   frequency, status, effectiveness_rating, last_tested
            FROM controls {where}
            ORDER BY control_code
            """
        ),
        params,
    ).fetchall()
    return {
        "items": [
            {
                "id": str(r[0]),
                "control_code": r[1],
                "framework_id": str(r[2]),
                "pillar_number": r[3],
                "title": r[4],
                "description": r[5],
                "control_type": r[6],
                "frequency": r[7],
                "status": r[8],
                "effectiveness_rating": r[9],
                "last_tested": r[10].isoformat() if r[10] else None,
            }
            for r in rows
        ]
    }


@app.post("/api/program/controls")
def create_program_control(body: dict = Body(...), conn: Connection = Depends(get_db)):
    fw = body.get("framework_id")
    code = body.get("control_code")
    title = body.get("title")
    if not fw or not code or not title:
        raise HTTPException(status_code=400, detail="framework_id, control_code, and title are required")
    cid = str(uuid.uuid4())
    conn.execute(
        text(
            """
            INSERT INTO controls (id, control_code, framework_id, pillar_number, vertical_id, title, description,
                control_type, frequency, owner_role_id, status, metadata, created_at, updated_at)
            VALUES (CAST(:id AS uuid), :control_code, CAST(:fw AS uuid), :pillar_number, :vertical_id, :title, :description,
                :control_type, :frequency, CAST(:owner AS uuid), COALESCE(:status, 'planned'), CAST(:metadata AS jsonb), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """
        ),
        {
            "id": cid,
            "control_code": code,
            "fw": fw,
            "pillar_number": body.get("pillar_number"),
            "vertical_id": body.get("vertical_id"),
            "title": title,
            "description": body.get("description"),
            "control_type": body.get("control_type"),
            "frequency": body.get("frequency"),
            "owner": body.get("owner_role_id"),
            "status": body.get("status"),
            "metadata": json.dumps(body.get("metadata") or {}),
        },
    )
    conn.commit()
    return {"id": cid, "control_code": code}


@app.get("/api/program/risks")
def list_risk_register(framework_id: str = Query(None), conn: Connection = Depends(get_db)):
    params = {}
    where = ""
    if framework_id:
        where = "WHERE framework_id = CAST(:fw AS uuid)"
        params["fw"] = framework_id
    rows = conn.execute(
        text(f"SELECT id, risk_code, framework_id, pillar_number, title, description, risk_score FROM risk_register {where} ORDER BY risk_code"),
        params,
    ).fetchall()
    return {
        "items": [
            {
                "id": str(r[0]),
                "risk_code": r[1],
                "framework_id": str(r[2]),
                "pillar_number": r[3],
                "title": r[4],
                "description": r[5],
                "risk_score": r[6],
            }
            for r in rows
        ]
    }


@app.post("/api/program/risks")
def create_risk_register_entry(body: dict = Body(...), conn: Connection = Depends(get_db)):
    fw = body.get("framework_id")
    code = body.get("risk_code")
    title = body.get("title")
    if not fw or not code or not title:
        raise HTTPException(status_code=400, detail="framework_id, risk_code, and title are required")
    rid = str(uuid.uuid4())
    conn.execute(
        text(
            """
            INSERT INTO risk_register (id, risk_code, framework_id, pillar_number, title, description,
                inherent_likelihood, inherent_impact, residual_likelihood, residual_impact, risk_score, created_at, updated_at)
            VALUES (CAST(:id AS uuid), :risk_code, CAST(:fw AS uuid), :pillar_number, :title, :description,
                :il, :ii, :rl, :ri, :rs, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """
        ),
        {
            "id": rid,
            "risk_code": code,
            "fw": fw,
            "pillar_number": body.get("pillar_number"),
            "title": title,
            "description": body.get("description"),
            "il": body.get("inherent_likelihood"),
            "ii": body.get("inherent_impact"),
            "rl": body.get("residual_likelihood"),
            "ri": body.get("residual_impact"),
            "rs": body.get("risk_score"),
        },
    )
    conn.commit()
    return {"id": rid, "risk_code": code}


# ===========================================================================
# Admin (HTTP Basic) — before SPA static mount
# ===========================================================================

from admin.app import create_admin_app

admin_subapp = create_admin_app(
    engine=engine,
    scheduler_svc=scheduler_svc,
    scrape_orch=scrape_orch,
)
app.mount("/admin", admin_subapp)


# ===========================================================================
# Frontend static files — MUST be last so API routes take priority
# ===========================================================================

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
