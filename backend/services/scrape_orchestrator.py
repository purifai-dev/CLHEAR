"""
Coordinates FINRA web scrape + Claude analysis + DB persistence.
"""
from __future__ import annotations

import json
import logging
import os
import threading
import uuid
from datetime import datetime
from typing import Any, Optional, Sequence

from sqlalchemy.sql import text as sql_text

from services.finra_scraper import ScrapedRule, _session, discover_rule_urls, scrape_rule
from services.rule_analyzer import ANALYSIS_VERSION, analyze_rule_text

logger = logging.getLogger(__name__)

_pipeline_lock = threading.Lock()
_pipeline_running = False
_active_thread: Optional[threading.Thread] = None


def _parse_meta(val: Any) -> dict:
    if val is None:
        return {}
    if isinstance(val, dict):
        return val
    try:
        return json.loads(val)
    except (json.JSONDecodeError, TypeError):
        return {}


class ScrapeOrchestrator:
    """Runs FINRA scrape + analysis pipeline (background thread)."""

    def __init__(self, engine, audit_service=None):
        self.engine = engine
        self.audit = audit_service
        self._cached_finra_regulator_id: Optional[str] = None

    def is_running(self) -> bool:
        global _pipeline_running, _active_thread
        with _pipeline_lock:
            if _pipeline_running:
                return True
        t = _active_thread
        return t is not None and t.is_alive()

    def start_finra_pipeline(
        self,
        max_rules: Optional[int] = None,
        force_reanalyze: bool = False,
        rule_numbers: Optional[Sequence[str]] = None,
    ) -> dict:
        """
        Start background pipeline. Returns { run_id, status } or raises if already running.
        """
        global _active_thread, _pipeline_running

        with _pipeline_lock:
            if _pipeline_running or (_active_thread is not None and _active_thread.is_alive()):
                raise RuntimeError("A FINRA scrape is already in progress")
            _pipeline_running = True

        run_id = str(uuid.uuid4())

        def worker():
            global _pipeline_running, _active_thread
            try:
                self._run_finra_pipeline(run_id, max_rules, force_reanalyze, rule_numbers)
            finally:
                with _pipeline_lock:
                    _pipeline_running = False
                    _active_thread = None

        try:
            _active_thread = threading.Thread(target=worker, daemon=True)
            _active_thread.start()
        except Exception:
            with _pipeline_lock:
                _pipeline_running = False
                _active_thread = None
            raise

        return {"run_id": run_id, "status": "started"}

    def _update_run(
        self,
        run_id: str,
        *,
        status: Optional[str] = None,
        rules_total: Optional[int] = None,
        rules_done: Optional[int] = None,
        items_created: Optional[int] = None,
        items_updated: Optional[int] = None,
        sources_new: Optional[int] = None,
        sources_updated: Optional[int] = None,
        error_message: Optional[str] = None,
        progress: Optional[dict] = None,
        completed: bool = False,
    ) -> None:
        sets = []
        params: dict = {"rid": run_id}
        if status:
            sets.append("status = :status")
            params["status"] = status
        if rules_total is not None:
            sets.append("rules_total = :rules_total")
            params["rules_total"] = rules_total
        if rules_done is not None:
            sets.append("rules_done = :rules_done")
            params["rules_done"] = rules_done
        if items_created is not None:
            sets.append("items_created = :items_created")
            params["items_created"] = items_created
        if items_updated is not None:
            sets.append("items_updated = :items_updated")
            params["items_updated"] = items_updated
        if sources_new is not None:
            sets.append("sources_new = :sources_new")
            params["sources_new"] = sources_new
        if sources_updated is not None:
            sets.append("sources_updated = :sources_updated")
            params["sources_updated"] = sources_updated
        if error_message is not None:
            sets.append("error_message = :error_message")
            params["error_message"] = error_message
        if progress is not None:
            sets.append("progress = CAST(:progress AS jsonb)")
            params["progress"] = json.dumps(progress)
        if completed:
            sets.append("completed_at = :completed_at")
            params["completed_at"] = datetime.utcnow()

        if not sets:
            return

        sql = f"UPDATE scrape_runs SET {', '.join(sets)} WHERE id = CAST(:rid AS uuid)"
        with self.engine.connect() as conn:
            conn.execute(sql_text(sql), params)
            conn.commit()

    def _insert_run(self, run_id: str) -> None:
        with self.engine.connect() as conn:
            conn.execute(
                sql_text(
                    """
                    INSERT INTO scrape_runs (id, run_type, status, started_at, progress, metadata)
                    VALUES (CAST(:id AS uuid), 'finra_full', 'running', :started_at,
                            CAST(:progress AS jsonb), CAST(:metadata AS jsonb))
                    """
                ),
                {
                    "id": run_id,
                    "started_at": datetime.utcnow(),
                    "progress": json.dumps({"phase": "discover"}),
                    "metadata": json.dumps({"analysis_version": ANALYSIS_VERSION}),
                },
            )
            conn.commit()

    def _fetch_rules(
        self,
        run_id: str,
        max_rules: Optional[int],
        rule_numbers: Optional[Sequence[str]],
    ) -> list[ScrapedRule]:
        """Fetch rules via FINRA Query API if credentials are set, otherwise HTML scraping."""
        from services.finra_api_client import is_configured as finra_api_configured

        if finra_api_configured():
            try:
                return self._fetch_via_api(run_id, max_rules, rule_numbers)
            except Exception as exc:
                logger.warning("FINRA API failed, falling back to HTML scraping", exc_info=True)
                detail = str(exc)[:1200]
                self._update_run(
                    run_id,
                    progress={
                        "phase": "api_fallback",
                        "message": "FINRA Query API failed; using finra.org HTML instead. See server logs for full response body.",
                        "api_error": detail,
                    },
                )
                return self._fetch_via_html(
                    run_id,
                    max_rules,
                    rule_numbers,
                    html_reason="FINRA Query API failed (403/401/etc.) — see progress.api_error",
                )
        return self._fetch_via_html(
            run_id,
            max_rules,
            rule_numbers,
            html_reason="FINRA_API_CLIENT_ID / FINRA_API_CLIENT_SECRET not set",
        )

    def _fetch_via_api(
        self,
        run_id: str,
        max_rules: Optional[int],
        rule_numbers: Optional[Sequence[str]],
    ) -> list[ScrapedRule]:
        """Use the official FINRA Query API (structured JSON, no scraping)."""
        from services.finra_api_client import fetch_all_rules, fetch_rules_by_numbers, FINRARuleRecord

        self._update_run(run_id, progress={"phase": "api_fetch", "message": "Fetching rules from FINRA Query API"})

        if rule_numbers:
            recs = fetch_rules_by_numbers([str(r) for r in rule_numbers])
        else:
            recs = fetch_all_rules(limit=max_rules or 5000)
            if max_rules is not None:
                recs = recs[:max_rules]

        def _to_scraped(rec: FINRARuleRecord) -> ScrapedRule:
            series = rec.hierarchy.split(">")[0].strip() if rec.hierarchy else ""
            return ScrapedRule(
                regulator="FINRA",
                series=series[:50] if series else "",
                series_title=series or f"FINRA Rule {rec.rule_number}",
                rule_number=rec.rule_number,
                rule_title=rec.rule_title,
                raw_text=rec.raw_text,
                source_url=f"https://www.finra.org/rules-guidance/rulebooks/finra-rules/{rec.rule_number}",
                content_hash=rec.content_hash,
            )

        return [_to_scraped(r) for r in recs]

    def _fetch_via_html(
        self,
        run_id: str,
        max_rules: Optional[int],
        rule_numbers: Optional[Sequence[str]],
        *,
        html_reason: str = "FINRA Query API not configured",
    ) -> list[ScrapedRule]:
        """Discover + scrape HTML when API is unavailable or credentials missing."""
        session = _session()

        def prog(msg: str, n: int) -> None:
            self._update_run(
                run_id,
                progress={"phase": "discover", "message": msg, "discovered": n},
            )

        pairs = discover_rule_urls(session, on_progress=prog)
        if rule_numbers:
            wanted = {str(x).strip() for x in rule_numbers if str(x).strip()}
            pairs = [(rn, url) for rn, url in pairs if rn in wanted]
        if max_rules is not None:
            pairs = pairs[:max(0, int(max_rules))]

        results: list[ScrapedRule] = []
        total = len(pairs)
        self._update_run(
            run_id,
            progress={
                "phase": "html_scrape",
                "message": f"HTML scraping {total} rules — {html_reason}",
                "source": "finra.org",
            },
        )
        for i, (rn, url) in enumerate(pairs, start=1):
            self._update_run(
                run_id,
                progress={
                    "phase": "html_scrape",
                    "current_rule": rn,
                    "index": i,
                    "total": total,
                    "message": f"Scraping FINRA Rule {rn}",
                },
            )
            scraped = scrape_rule(session, rn, url)
            if scraped:
                results.append(scraped)
        return results

    def _run_finra_pipeline(
        self,
        run_id: str,
        max_rules: Optional[int],
        force_reanalyze: bool,
        rule_numbers: Optional[Sequence[str]] = None,
    ) -> None:
        items_total = 0
        src_new = 0
        src_upd = 0

        try:
            self._insert_run(run_id)

            if self.audit:
                self.audit.log(
                    action="finra_scrape_started",
                    entity_type="scrape_run",
                    entity_id=run_id,
                    description="FINRA rulebook scrape + analysis started",
                    metadata={"max_rules": max_rules, "force_reanalyze": force_reanalyze},
                )

            scraped_rules = self._fetch_rules(run_id, max_rules, rule_numbers)
            total = len(scraped_rules)
            self._update_run(run_id, rules_total=total, rules_done=0, progress={"phase": "process", "message": f"{total} rules to process"})

            for i, scraped in enumerate(scraped_rules, start=1):
                self._update_run(
                    run_id,
                    rules_done=i - 1,
                    progress={
                        "phase": "upsert_analyze",
                        "current_rule": scraped.rule_number,
                        "index": i,
                        "total": total,
                        "message": f"Processing FINRA Rule {scraped.rule_number}",
                    },
                )

                sn, su = self._upsert_source(scraped)
                if sn == "new":
                    src_new += 1
                elif sn == "updated":
                    src_upd += 1

                if not os.getenv("ANTHROPIC_API_KEY"):
                    logger.warning("ANTHROPIC_API_KEY not set — sources updated but AI analysis skipped")
                    continue

                meta = self._get_source_meta("FINRA", scraped.rule_number)
                text_hash = scraped.content_hash
                last_h = meta.get("last_analyzed_hash")
                last_v = meta.get("last_analysis_version")
                skip = (
                    not force_reanalyze
                    and last_h == text_hash
                    and (last_v == ANALYSIS_VERSION)
                )

                if skip:
                    continue

                items, _ver = analyze_rule_text(
                    scraped.rule_number,
                    scraped.rule_title,
                    scraped.raw_text,
                    scraped.source_url,
                )
                if not items:
                    logger.warning("No regulatory items extracted for rule %s — leaving existing items unchanged", scraped.rule_number)
                    continue

                n_ins = self._replace_items_for_rule(
                    scraped.rule_number,
                    items,
                    scraped_at=datetime.utcnow(),
                    analyzed_at=datetime.utcnow(),
                    run_id=run_id,
                )
                items_total += n_ins

                meta_up = {
                    **meta,
                    "content_hash": text_hash,
                    "last_analyzed_hash": text_hash,
                    "last_analysis_version": ANALYSIS_VERSION,
                    "finra_pipeline": True,
                }
                self._update_source_metadata("FINRA", scraped.rule_number, meta_up)

                self._update_run(
                    run_id,
                    items_created=items_total,
                    sources_new=src_new,
                    sources_updated=src_upd,
                )

            self._update_run(
                run_id,
                status="completed",
                rules_done=total,
                items_created=items_total,
                sources_new=src_new,
                sources_updated=src_upd,
                progress={"phase": "done", "message": "Completed"},
                completed=True,
            )

            if self.audit:
                self.audit.log(
                    action="finra_scrape_completed",
                    entity_type="scrape_run",
                    entity_id=run_id,
                    description="FINRA pipeline completed",
                    metadata={
                        "rules": total,
                        "items_inserted": items_total,
                        "sources_new": src_new,
                        "sources_updated": src_upd,
                    },
                )

        except Exception as e:
            logger.exception("FINRA pipeline failed")
            self._update_run(
                run_id,
                status="failed",
                error_message=str(e)[:2000],
                progress={"phase": "error", "message": str(e)},
                completed=True,
            )
            if self.audit:
                self.audit.log(
                    action="finra_scrape_failed",
                    entity_type="scrape_run",
                    entity_id=run_id,
                    description=str(e)[:500],
                    severity="error",
                )

    def _get_source_meta(self, regulator: str, rule_number: str) -> dict:
        with self.engine.connect() as conn:
            row = conn.execute(
                sql_text(
                    "SELECT metadata FROM regulatory_sources WHERE regulator = :r AND rule_number = :n"
                ),
                {"r": regulator, "n": rule_number},
            ).fetchone()
        return _parse_meta(row[0] if row else None)

    def _update_source_metadata(self, regulator: str, rule_number: str, meta: dict) -> None:
        with self.engine.connect() as conn:
            conn.execute(
                sql_text(
                    """
                    UPDATE regulatory_sources
                    SET metadata = CAST(:m AS jsonb), updated_at = :u
                    WHERE regulator = :r AND rule_number = :n
                    """
                ),
                {"m": json.dumps(meta), "u": datetime.utcnow(), "r": regulator, "n": rule_number},
            )
            conn.commit()

    def _upsert_source(self, scraped: ScrapedRule) -> tuple[str, None]:
        """Returns ('new'|'updated'|'unchanged', None)."""
        with self.engine.connect() as conn:
            row = conn.execute(
                sql_text(
                    "SELECT id, metadata FROM regulatory_sources WHERE regulator = :r AND rule_number = :n"
                ),
                {"r": scraped.regulator, "n": scraped.rule_number},
            ).fetchone()

            meta = {"content_hash": scraped.content_hash, "finra_scraper": True}
            if not row:
                conn.execute(
                    sql_text(
                        """
                        INSERT INTO regulatory_sources
                        (regulator, series, series_title, subseries, subseries_title,
                         rule_number, rule_title, raw_text, source_url,
                         effective_date, last_amended, created_at, metadata)
                        VALUES (:regulator, :series, :series_title, NULL, NULL,
                                :rule_number, :rule_title, :raw_text, :source_url,
                                NULL, NULL, :created_at, CAST(:metadata AS jsonb))
                        """
                    ),
                    {
                        "regulator": scraped.regulator,
                        "series": scraped.series,
                        "series_title": scraped.series_title,
                        "rule_number": scraped.rule_number,
                        "rule_title": scraped.rule_title,
                        "raw_text": scraped.raw_text,
                        "source_url": scraped.source_url,
                        "created_at": datetime.utcnow(),
                        "metadata": json.dumps(meta),
                    },
                )
                conn.commit()
                return "new", None

            old_meta = _parse_meta(row[1])
            old_hash = old_meta.get("content_hash")
            if old_hash == scraped.content_hash:
                return "unchanged", None

            merged = {**old_meta, **meta}
            conn.execute(
                sql_text(
                    """
                    UPDATE regulatory_sources
                    SET raw_text = :raw_text, rule_title = :rule_title, source_url = :source_url,
                        series = :series, series_title = :series_title,
                        updated_at = :updated_at, metadata = CAST(:metadata AS jsonb)
                    WHERE regulator = :regulator AND rule_number = :rule_number
                    """
                ),
                {
                    "raw_text": scraped.raw_text,
                    "rule_title": scraped.rule_title,
                    "source_url": scraped.source_url,
                    "series": scraped.series,
                    "series_title": scraped.series_title,
                    "regulator": scraped.regulator,
                    "rule_number": scraped.rule_number,
                    "updated_at": datetime.utcnow(),
                    "metadata": json.dumps(merged),
                },
            )
            conn.commit()
            return "updated", None

    def _resolve_finra_regulator_id(self) -> Optional[str]:
        if self._cached_finra_regulator_id is not None:
            return self._cached_finra_regulator_id or None
        with self.engine.connect() as conn:
            row = conn.execute(
                sql_text("SELECT id FROM regulators WHERE code = 'FINRA' LIMIT 1")
            ).fetchone()
        if row:
            self._cached_finra_regulator_id = str(row[0])
        else:
            self._cached_finra_regulator_id = ""
        return self._cached_finra_regulator_id or None

    def _replace_items_for_rule(
        self,
        rule_number: str,
        items: list[dict],
        scraped_at: datetime,
        analyzed_at: datetime,
        run_id: Optional[str] = None,
    ) -> int:
        rid = self._resolve_finra_regulator_id()
        with self.engine.connect() as conn:
            old_cnt = conn.execute(
                sql_text(
                    """
                    SELECT COUNT(*) FROM regulatory_items
                    WHERE regulator = 'FINRA' AND source_rule_number = :rn
                    """
                ),
                {"rn": rule_number},
            ).scalar()
            old_cnt = int(old_cnt or 0)

            if old_cnt > 0 and len(items) < max(1, int(old_cnt * 0.5)):
                logger.warning(
                    "Claude returned %d items for rule %s vs %d previously — possible partial response; keeping existing rows",
                    len(items),
                    rule_number,
                    old_cnt,
                )
                return 0

            # Snapshot hashes for versioning before delete
            old_rows = conn.execute(
                sql_text(
                    """
                    SELECT id, item_code, content_hash FROM regulatory_items
                    WHERE regulator = 'FINRA' AND source_rule_number = :rn
                    """
                ),
                {"rn": rule_number},
            ).fetchall()

            batch_id = uuid.uuid4() if run_id else None
            for row in old_rows:
                oid, icode, ohash = row[0], row[1], row[2]
                conn.execute(
                    sql_text(
                        """
                        INSERT INTO regulatory_item_versions
                        (regulatory_item_id, version_number, previous_hash, new_hash, diff_summary,
                         changed_fields, source_rule_number, regulator, batch_id)
                        VALUES
                        (CAST(:iid AS uuid), 1, :phash, NULL, :summary,
                         CAST(:cf AS jsonb), :rn, 'FINRA', :bid)
                        """
                    ),
                    {
                        "iid": str(oid),
                        "phash": ohash,
                        "summary": "Superseded by re-analysis",
                        "cf": json.dumps({"item_code": icode, "run_id": run_id}),
                        "rn": rule_number,
                        "bid": str(batch_id) if batch_id else None,
                    },
                )

            conn.execute(
                sql_text(
                    """
                    DELETE FROM regulatory_items
                    WHERE regulator = 'FINRA' AND source_rule_number = :rn
                    """
                ),
                {"rn": rule_number},
            )

            n = 0
            for it in items:
                conn.execute(
                    sql_text(
                        """
                        INSERT INTO regulatory_items
                        (item_code, regulator, regulator_id, item_type, rule_reference, source_rule_number,
                         source_url, title, description, summary, category, pillar_id,
                         importance, importance_reasoning, evidence_excerpt, tags, applicability,
                         content_hash, analysis_version, scraped_at, analyzed_at, created_at, metadata)
                        VALUES
                        (:item_code, :regulator, CAST(:regulator_id AS uuid), :item_type, :rule_reference, :source_rule_number,
                         :source_url, :title, :description, :summary, :category, :pillar_id,
                         :importance, :importance_reasoning, :evidence_excerpt,
                         CAST(:tags AS jsonb), CAST(:applicability AS jsonb),
                         :content_hash, :analysis_version, :scraped_at, :analyzed_at, :created_at,
                         CAST(:metadata AS jsonb))
                        ON CONFLICT (item_code) DO UPDATE SET
                         regulator_id = COALESCE(EXCLUDED.regulator_id, regulatory_items.regulator_id),
                         item_type = EXCLUDED.item_type,
                         rule_reference = EXCLUDED.rule_reference,
                         source_rule_number = EXCLUDED.source_rule_number,
                         source_url = EXCLUDED.source_url,
                         title = EXCLUDED.title,
                         description = EXCLUDED.description,
                         summary = EXCLUDED.summary,
                         category = EXCLUDED.category,
                         pillar_id = EXCLUDED.pillar_id,
                         importance = EXCLUDED.importance,
                         importance_reasoning = EXCLUDED.importance_reasoning,
                         evidence_excerpt = EXCLUDED.evidence_excerpt,
                         tags = EXCLUDED.tags,
                         applicability = EXCLUDED.applicability,
                         content_hash = EXCLUDED.content_hash,
                         analysis_version = EXCLUDED.analysis_version,
                         scraped_at = EXCLUDED.scraped_at,
                         analyzed_at = EXCLUDED.analyzed_at,
                         updated_at = EXCLUDED.analyzed_at,
                         metadata = EXCLUDED.metadata
                        """
                    ),
                    {
                        "item_code": it["item_code"],
                        "regulator": it["regulator"],
                        "regulator_id": rid,
                        "item_type": it["item_type"],
                        "rule_reference": it.get("rule_reference"),
                        "source_rule_number": it.get("source_rule_number"),
                        "source_url": it.get("source_url"),
                        "title": it.get("title"),
                        "description": it.get("description"),
                        "summary": it.get("summary"),
                        "category": it.get("category"),
                        "pillar_id": it.get("pillar_id"),
                        "importance": it.get("importance"),
                        "importance_reasoning": it.get("importance_reasoning"),
                        "evidence_excerpt": it.get("evidence_excerpt"),
                        "tags": json.dumps(it.get("tags") or []),
                        "applicability": json.dumps(it.get("applicability") or {}),
                        "content_hash": it.get("content_hash"),
                        "analysis_version": it.get("analysis_version"),
                        "scraped_at": scraped_at,
                        "analyzed_at": analyzed_at,
                        "created_at": datetime.utcnow(),
                        "metadata": json.dumps({"finra_pipeline": True}),
                    },
                )
                n += 1
            conn.commit()
        return n

    def get_latest_run(self) -> Optional[dict]:
        with self.engine.connect() as conn:
            row = conn.execute(
                sql_text(
                    """
                    SELECT id, run_type, status, started_at, completed_at,
                           rules_total, rules_done, items_created, items_updated,
                           sources_new, sources_updated, error_message, progress, metadata
                    FROM scrape_runs
                    ORDER BY started_at DESC
                    LIMIT 1
                    """
                )
            ).fetchone()
        if not row:
            return None
        return {
            "id": str(row[0]),
            "run_type": row[1],
            "status": row[2],
            "started_at": row[3].isoformat() if row[3] else None,
            "completed_at": row[4].isoformat() if row[4] else None,
            "rules_total": row[5],
            "rules_done": row[6],
            "items_created": row[7],
            "items_updated": row[8],
            "sources_new": row[9],
            "sources_updated": row[10],
            "error_message": row[11],
            "progress": _parse_meta(row[12]),
            "metadata": _parse_meta(row[13]),
            "running": self.is_running(),
        }


def run_finra_pipeline_job(engine, audit, config: dict) -> dict:
    """Entry point for scheduler / scraper_registry (FINRA scrape + AI)."""
    orch = ScrapeOrchestrator(engine, audit)
    rn = config.get("rule_numbers")
    rule_numbers = list(rn) if isinstance(rn, (list, tuple)) else None
    try:
        return orch.start_finra_pipeline(
            max_rules=config.get("max_rules"),
            force_reanalyze=bool(config.get("force_reanalyze")),
            rule_numbers=rule_numbers,
        )
    except RuntimeError as e:
        return {"pipeline": "finra_scrape", "error": str(e), "started": False}
