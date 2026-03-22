import json
import math
import os
import logging

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

audit_svc = AuditService(engine)
scheduler_svc = SchedulerService(engine, audit_service=audit_svc)
news_svc = NewsService(engine, audit_service=audit_svc)
email_svc = EmailService(engine, audit_service=audit_svc)


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
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
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
# Frontend static files — MUST be last so API routes take priority
# ===========================================================================

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
