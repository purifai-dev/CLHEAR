"""
Multi-regulator scrape pipeline registry. Dispatches scheduler jobs to the correct pipeline.
"""
from __future__ import annotations

import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


def run_pipeline_for_regulator(
    regulator_code: str,
    engine: Any,
    audit: Any,
    config: Optional[dict],
) -> dict:
    """
    Run the configured pipeline for a regulator (e.g. FINRA: web scrape + Claude analysis).
    """
    cfg = config or {}
    pipeline = (cfg.get("pipeline") or "").strip().lower()
    code = (regulator_code or "").strip().upper()

    if pipeline == "finra_scrape" and code == "FINRA":
        from services.scrape_orchestrator import run_finra_pipeline_job

        return run_finra_pipeline_job(engine, audit, cfg)

    return {
        "error": f"No pipeline for regulator={regulator_code!r} pipeline={pipeline!r}",
        "regulator": regulator_code,
        "pipeline": pipeline,
    }
