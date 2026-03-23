"""
Claude-powered extraction of structured regulatory items from FINRA rule text.
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import re
import time
from typing import Any, Optional

logger = logging.getLogger(__name__)

ANALYSIS_VERSION = os.getenv("CLHEAR_ANALYSIS_VERSION", "1.1")
MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")

TYPE_TO_CODE = {
    "obligation": "OBL",
    "licensing_requirement": "LIC",
    "required_role": "ROL",
    "policy_document": "POL",
    "operational_procedure": "PRO",
    "committee": "COM",
    "risk_requirement": "RSK",
    "reporting_requirement": "RPT",
    "recordkeeping_requirement": "REC",
    "other": "OTH",
}

VALID_TYPES = set(TYPE_TO_CODE.keys())


def _sanitize_rule_for_code(rule_number: str) -> str:
    s = re.sub(r"[^0-9A-Za-z]", "-", (rule_number or "").strip())
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "RULE"


def _parse_json_block(text: str) -> Any:
    raw = (text or "").strip()
    m = re.search(r"```(?:json)?\s*([\s\S]*?)```", raw)
    body = m.group(1).strip() if m else raw
    try:
        return json.loads(body)
    except json.JSONDecodeError:
        start = body.find("[")
        end = body.rfind("]")
        if start != -1 and end != -1 and end > start:
            return json.loads(body[start : end + 1])
        raise


PILLAR_LIST = """pillar_id must be an integer 1-18 (CLHEAR industry pillars for broker-dealers):
1=Governance and Organizational Structure, 2=Licensing and Registration, 3=Client Onboarding/KYC/CIP,
4=Suitability and Best Interest, 5=Product Governance and Approval, 6=Conduct of Business and Conflicts,
7=Market Conduct and Trading Controls, 8=Financial Crime and Sanctions, 9=Communications and Marketing Compliance,
10=Capital Adequacy and Financial Resilience, 11=Record Keeping and Books and Records,
12=Operational Resilience and Business Continuity, 13=Outsourcing and Third Party Risk,
14=Regulatory Reporting and Disclosures, 15=Complaints Handling and Client Outcomes,
16=Internal Controls and Compliance Monitoring, 17=Internal Audit and Independent Review,
18=Regulatory Engagement and Change Management"""


def build_prompt(rule_number: str, rule_title: str, raw_text: str) -> str:
    return f"""You are a securities compliance analyst. Read the FINRA rule below and extract EVERY distinct regulatory requirement or compliance-relevant fact that a broker-dealer or associated person must consider.

For each item, classify it into exactly one of these item_type values:
- obligation: a binding requirement, prohibition, or duty
- licensing_requirement: registration, exams, qualifications, licenses
- required_role: named roles, responsibilities, CCO, supervisor, principal, etc.
- policy_document: written policies, procedures manuals, WSPs, plans required to exist
- operational_procedure: operational steps, processes, controls, testing, surveillance
- committee: board/committees/groups that must exist or meet
- risk_requirement: risk assessment, AML, cybersecurity, business continuity, model risk, etc.
- reporting_requirement: filings, notices, reports to FINRA/SEC/customers
- recordkeeping_requirement: books and records, retention, audit trail
- other: anything else material for compliance that does not fit above

Also assign:
- importance: critical | high | medium | low (for a typical US broker-dealer)
- importance_reasoning: 2-4 sentences citing regulatory impact
- evidence_excerpt: a SHORT verbatim quote from the rule text supporting this item (must be copied from the rule text below)
- category: short label e.g. Registration, Supervision, Trading, Communications, Financial, Cybersecurity
- {PILLAR_LIST}
- tags: array of short strings (topics)
- applicability: JSON object with optional keys firm_types, products, customer_types (arrays of strings; use [] if unknown)
- rule_reference: precise citation if possible e.g. "FINRA Rule {rule_number}(a)(1)"
- title: concise title
- description: full explanation (2-6 sentences)
- summary: one sentence

Return ONLY a JSON array of objects with keys:
item_type, title, description, summary, rule_reference, importance, importance_reasoning, evidence_excerpt,
category, pillar_id, tags, applicability

If the rule text is very long, still extract all materially distinct items (do not skip types).

FINRA Rule {rule_number}: {rule_title}

--- RULE TEXT ---
{raw_text}
"""


def analyze_rule_text(
    rule_number: str,
    rule_title: str,
    raw_text: str,
    source_url: str,
    client: Optional[Any] = None,
) -> tuple[list[dict], str]:
    """
    Returns (items_with_item_code_and_hashes, analysis_version).
    Each item dict is ready for DB insert (includes item_code, regulator, content_hash, etc.).
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.warning("ANTHROPIC_API_KEY not set; skipping AI analysis")
        return [], ANALYSIS_VERSION

    try:
        import anthropic
    except ImportError:
        logger.error("anthropic package not installed")
        return [], ANALYSIS_VERSION

    if client is None:
        client = anthropic.Anthropic(api_key=api_key)

    prompt = build_prompt(rule_number, rule_title, raw_text)
    text_out = ""
    delays = [2, 4, 8]
    for attempt, delay in enumerate([0] + delays):
        if attempt > 0:
            time.sleep(delay)
        try:
            message = client.messages.create(
                model=MODEL,
                max_tokens=8192,
                messages=[{"role": "user", "content": prompt}],
            )
            for block in message.content:
                if block.type == "text":
                    text_out += block.text
            break
        except Exception as e:
            logger.warning("Anthropic API attempt %s failed for rule %s: %s", attempt + 1, rule_number, e)
            if attempt >= len(delays):
                logger.error("Anthropic API exhausted retries for rule %s", rule_number)
                return [], ANALYSIS_VERSION

    try:
        arr = _parse_json_block(text_out)
    except (json.JSONDecodeError, ValueError) as e:
        logger.error("Failed to parse Claude JSON for rule %s: %s", rule_number, e)
        logger.debug("Raw response (first 2k): %s", text_out[:2000])
        return [], ANALYSIS_VERSION

    if not isinstance(arr, list):
        logger.error("Claude returned non-list for rule %s", rule_number)
        return [], ANALYSIS_VERSION

    base_rule = _sanitize_rule_for_code(rule_number)
    out: list[dict] = []

    # Group by type for stable sequencing
    per_type: dict[str, int] = {}
    normalized: list[tuple[dict, str]] = []
    for obj in arr:
        if not isinstance(obj, dict):
            continue
        it = (obj.get("item_type") or "other").strip().lower()
        if it not in VALID_TYPES:
            it = "other"
        obj["item_type"] = it
        normalized.append((obj, it))

    normalized.sort(key=lambda x: (TYPE_TO_CODE.get(x[1], "OTH"), (x[0].get("title") or "")))

    for obj, it in normalized:
        per_type[it] = per_type.get(it, 0) + 1
        seq = per_type[it]
        code = f"FINRA-{base_rule}-{TYPE_TO_CODE[it]}-{seq:02d}"

        pid = obj.get("pillar_id")
        try:
            pn = int(pid)
            pn = max(1, min(18, pn))
        except (TypeError, ValueError):
            pn = 1

        payload = {
            "item_code": code,
            "regulator": "FINRA",
            "item_type": it,
            "rule_reference": obj.get("rule_reference") or f"FINRA Rule {rule_number}",
            "source_rule_number": rule_number,
            "source_url": source_url,
            "title": obj.get("title") or code,
            "description": obj.get("description") or "",
            "summary": obj.get("summary") or "",
            "category": obj.get("category"),
            "pillar_id": pn,
            "importance": (obj.get("importance") or "medium").lower(),
            "importance_reasoning": obj.get("importance_reasoning") or "",
            "evidence_excerpt": obj.get("evidence_excerpt") or "",
            "tags": obj.get("tags") if isinstance(obj.get("tags"), list) else [],
            "applicability": obj.get("applicability") if isinstance(obj.get("applicability"), dict) else {},
        }

        # Content hash for upsert — deterministic per item_code
        h_src = "|".join(
            [
                payload["title"],
                payload["description"],
                payload["importance"],
                payload["evidence_excerpt"] or "",
            ]
        )
        payload["content_hash"] = hashlib.sha256(h_src.encode("utf-8")).hexdigest()
        payload["analysis_version"] = ANALYSIS_VERSION
        out.append(payload)

    return out, ANALYSIS_VERSION
