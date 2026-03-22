"""
CLHEAR Regulatory Loader
Imports regulatory source texts and obligations from data modules.
Designed for multi-regulator support — add ESMA, FCA, MAS data files
and register them below.
"""
import hashlib
import json
import os
import sys
import logging
from datetime import datetime

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.sql import text as sql_text

# Ensure backend package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from data.finra_sources import FINRA_SOURCES
from data.finra_obligations import FINRA_OBLIGATIONS
from data.fca_sources import FCA_SOURCES
from data.fca_obligations import FCA_OBLIGATIONS

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


class RegulatoryLoader:
    """Load regulatory sources and obligations into the database."""

    def __init__(self):
        self.engine = create_engine(
            os.getenv("DATABASE_URL", "postgresql://clhear_user:dev123@localhost:5432/clhear")
        )

    @staticmethod
    def _hash(text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    # ------------------------------------------------------------------
    # Sources
    # ------------------------------------------------------------------

    def load_sources(self, sources: list[dict]) -> dict:
        stats = {"new": 0, "updated": 0, "unchanged": 0}

        with self.engine.connect() as conn:
            for src in sources:
                rule_key = (src["regulator"], src["rule_number"])
                content_hash = self._hash(src["raw_text"])

                existing = conn.execute(
                    sql_text(
                        "SELECT id, metadata FROM regulatory_sources "
                        "WHERE regulator = :reg AND rule_number = :rn"
                    ),
                    {"reg": src["regulator"], "rn": src["rule_number"]},
                ).fetchone()

                if not existing:
                    conn.execute(
                        sql_text("""
                            INSERT INTO regulatory_sources
                            (regulator, series, series_title, subseries, subseries_title,
                             rule_number, rule_title, raw_text, source_url,
                             effective_date, last_amended, created_at, metadata)
                            VALUES (:regulator, :series, :series_title, :subseries, :subseries_title,
                                    :rule_number, :rule_title, :raw_text, :source_url,
                                    :effective_date, :last_amended, :created_at, :metadata)
                        """),
                        {
                            **{k: src.get(k) for k in [
                                "regulator", "series", "series_title", "subseries",
                                "subseries_title", "rule_number", "rule_title",
                                "raw_text", "source_url", "effective_date", "last_amended",
                            ]},
                            "created_at": datetime.utcnow(),
                            "metadata": json.dumps({"content_hash": content_hash}),
                        },
                    )
                    stats["new"] += 1
                    logger.info(f"  + NEW source: {rule_key}")
                else:
                    old_meta = existing[1] if isinstance(existing[1], dict) else (
                        json.loads(existing[1]) if existing[1] else {}
                    )
                    if old_meta.get("content_hash") != content_hash:
                        conn.execute(
                            sql_text("""
                                UPDATE regulatory_sources
                                SET raw_text = :raw_text, rule_title = :rule_title,
                                    source_url = :source_url, series = :series,
                                    series_title = :series_title,
                                    updated_at = :updated_at, metadata = :metadata
                                WHERE regulator = :regulator AND rule_number = :rule_number
                            """),
                            {
                                "raw_text": src["raw_text"],
                                "rule_title": src["rule_title"],
                                "source_url": src.get("source_url"),
                                "series": src.get("series"),
                                "series_title": src.get("series_title"),
                                "regulator": src["regulator"],
                                "rule_number": src["rule_number"],
                                "updated_at": datetime.utcnow(),
                                "metadata": json.dumps({"content_hash": content_hash}),
                            },
                        )
                        stats["updated"] += 1
                        logger.info(f"  ~ UPDATED source: {rule_key}")
                    else:
                        stats["unchanged"] += 1

            conn.commit()
        return stats

    # ------------------------------------------------------------------
    # Obligations
    # ------------------------------------------------------------------

    def load_obligations(self, obligations: list[dict]) -> dict:
        stats = {"new": 0, "updated": 0, "unchanged": 0}

        with self.engine.connect() as conn:
            for ob in obligations:
                code = ob["obligation_code"]
                content_hash = self._hash(ob["obligation_text"])

                existing = conn.execute(
                    sql_text(
                        "SELECT id, metadata FROM regulatory_obligations "
                        "WHERE obligation_code = :code"
                    ),
                    {"code": code},
                ).fetchone()

                if not existing:
                    conn.execute(
                        sql_text("""
                            INSERT INTO regulatory_obligations
                            (obligation_code, regulator, rule_reference, obligation_title,
                             obligation_text, obligation_summary, category, pillar_id,
                             severity, severity_reasoning, source_url, source_rule_number,
                             created_at, metadata)
                            VALUES (:obligation_code, :regulator, :rule_reference, :obligation_title,
                                    :obligation_text, :obligation_summary, :category, :pillar_id,
                                    :severity, :severity_reasoning, :source_url, :source_rule_number,
                                    :created_at, :metadata)
                        """),
                        {
                            **{k: ob.get(k) for k in [
                                "obligation_code", "regulator", "rule_reference",
                                "obligation_title", "obligation_text", "obligation_summary",
                                "category", "pillar_id", "severity", "severity_reasoning",
                                "source_url", "source_rule_number",
                            ]},
                            "created_at": datetime.utcnow(),
                            "metadata": json.dumps({"content_hash": content_hash}),
                        },
                    )
                    stats["new"] += 1
                    logger.info(f"  + NEW obligation: {code}")
                else:
                    old_meta = existing[1] if isinstance(existing[1], dict) else (
                        json.loads(existing[1]) if existing[1] else {}
                    )
                    if old_meta.get("content_hash") != content_hash:
                        conn.execute(
                            sql_text("""
                                UPDATE regulatory_obligations
                                SET obligation_text = :obligation_text,
                                    obligation_title = :obligation_title,
                                    obligation_summary = :obligation_summary,
                                    rule_reference = :rule_reference,
                                    category = :category, pillar_id = :pillar_id,
                                    severity = :severity,
                                    severity_reasoning = :severity_reasoning,
                                    source_url = :source_url,
                                    source_rule_number = :source_rule_number,
                                    updated_at = :updated_at, metadata = :metadata
                                WHERE obligation_code = :obligation_code
                            """),
                            {
                                **{k: ob.get(k) for k in [
                                    "obligation_code", "obligation_text", "obligation_title",
                                    "obligation_summary", "rule_reference", "category",
                                    "pillar_id", "severity", "severity_reasoning",
                                    "source_url", "source_rule_number",
                                ]},
                                "updated_at": datetime.utcnow(),
                                "metadata": json.dumps({"content_hash": content_hash}),
                            },
                        )
                        stats["updated"] += 1
                        logger.info(f"  ~ UPDATED obligation: {code}")
                    else:
                        stats["unchanged"] += 1

            conn.commit()
        return stats

    # ------------------------------------------------------------------
    # Main
    # ------------------------------------------------------------------

    def run(self):
        logger.info("=" * 60)
        logger.info("CLHEAR - Regulatory Loader")
        logger.info("=" * 60)

        # ── FINRA Sources ──
        logger.info(f"\nLoading FINRA sources ({len(FINRA_SOURCES)} rules)...")
        src_stats = self.load_sources(FINRA_SOURCES)
        logger.info(f"  FINRA Sources — New: {src_stats['new']}, Updated: {src_stats['updated']}, Unchanged: {src_stats['unchanged']}")

        # ── FINRA Obligations ──
        logger.info(f"\nLoading FINRA obligations ({len(FINRA_OBLIGATIONS)} obligations)...")
        ob_stats = self.load_obligations(FINRA_OBLIGATIONS)
        logger.info(f"  FINRA Obligations — New: {ob_stats['new']}, Updated: {ob_stats['updated']}, Unchanged: {ob_stats['unchanged']}")

        # ── FCA Sources ──
        logger.info(f"\nLoading FCA sources ({len(FCA_SOURCES)} rules)...")
        fca_src_stats = self.load_sources(FCA_SOURCES)
        logger.info(f"  FCA Sources — New: {fca_src_stats['new']}, Updated: {fca_src_stats['updated']}, Unchanged: {fca_src_stats['unchanged']}")

        # ── FCA Obligations ──
        logger.info(f"\nLoading FCA obligations ({len(FCA_OBLIGATIONS)} obligations)...")
        fca_ob_stats = self.load_obligations(FCA_OBLIGATIONS)
        logger.info(f"  FCA Obligations — New: {fca_ob_stats['new']}, Updated: {fca_ob_stats['updated']}, Unchanged: {fca_ob_stats['unchanged']}")

        # ── Summary ──
        total_src = src_stats['new'] + src_stats['updated'] + fca_src_stats['new'] + fca_src_stats['updated']
        total_ob = ob_stats['new'] + ob_stats['updated'] + fca_ob_stats['new'] + fca_ob_stats['updated']
        logger.info("\n" + "=" * 60)
        logger.info(f"Done. Total changes: {total_src} sources, {total_ob} obligations.")
        logger.info("=" * 60)


if __name__ == "__main__":
    loader = RegulatoryLoader()
    loader.run()
