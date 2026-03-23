"""
FINRA Query API client — authenticates via OAuth2 (FIP) and fetches the
finraRulebook dataset.  Returns structured rule data including full text,
hierarchy, effective dates, and topic tags.

Environment:
  FINRA_API_CLIENT_ID     — API Console credential ID
  FINRA_API_CLIENT_SECRET — API Console credential secret

Docs: https://developer.finra.org/docs#query_api-finra_content-finra_rulebook
"""
from __future__ import annotations

import base64
import hashlib
import logging
import os
import time
from dataclasses import dataclass, field
from typing import Any, Optional

import requests

logger = logging.getLogger(__name__)

FIP_TOKEN_URL = "https://ews.fip.finra.org/fip/rest/ews/oauth2/access_token?grant_type=client_credentials"
API_BASE = "https://api.finra.org"
RULEBOOK_DATASET = os.getenv("FINRA_API_DATASET", "finraRulebook")
RULEBOOK_ENDPOINT = f"{API_BASE}/data/group/finra/name/{RULEBOOK_DATASET}"
USER_AGENT = "CLHEAR.ai-Compliance-Monitor/1.0 (+https://clhear.ai)"

_cached_token: Optional[str] = None
_token_expires_at: float = 0.0


@dataclass
class FINRARuleRecord:
    rule_number: str
    rule_title: str
    raw_text: str
    html_text: str
    hierarchy: str
    effective_start: Optional[str]
    effective_end: Optional[str]
    summary_topics: list[str] = field(default_factory=list)
    detailed_topics: list[str] = field(default_factory=list)
    content_hash: str = ""

    def __post_init__(self):
        if not self.content_hash:
            self.content_hash = hashlib.sha256(self.raw_text.encode("utf-8")).hexdigest()


def _get_credentials() -> tuple[str, str]:
    cid = os.getenv("FINRA_API_CLIENT_ID", "").strip()
    secret = os.getenv("FINRA_API_CLIENT_SECRET", "").strip()
    return cid, secret


def is_configured() -> bool:
    cid, secret = _get_credentials()
    return bool(cid and secret)


def _obtain_token(session: requests.Session) -> str:
    global _cached_token, _token_expires_at

    if _cached_token and time.time() < _token_expires_at - 60:
        return _cached_token

    cid, secret = _get_credentials()
    if not cid or not secret:
        raise RuntimeError("FINRA_API_CLIENT_ID and FINRA_API_CLIENT_SECRET must be set")

    b64 = base64.b64encode(f"{cid}:{secret}".encode()).decode()
    resp = session.post(
        FIP_TOKEN_URL,
        headers={
            "Authorization": f"Basic {b64}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()
    _cached_token = data["access_token"]
    _token_expires_at = time.time() + int(data.get("expires_in", 1800))
    logger.info("FINRA API: obtained OAuth2 token (expires in %ss)", data.get("expires_in"))
    return _cached_token


def _api_session() -> requests.Session:
    s = requests.Session()
    s.headers["User-Agent"] = USER_AGENT
    s.headers["Accept"] = "application/json"
    return s


def _resolve_endpoint(session: requests.Session, token: str) -> str:
    """Try production dataset first; fall back to mock on 403."""
    global RULEBOOK_ENDPOINT, RULEBOOK_DATASET

    probe = session.post(
        RULEBOOK_ENDPOINT,
        json={"limit": 1},
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    if probe.status_code == 403 and "Mock" not in RULEBOOK_DATASET:
        mock = f"{API_BASE}/data/group/finra/name/finraRulebookMock"
        logger.warning("FINRA API: 403 on %s, trying mock dataset", RULEBOOK_ENDPOINT)
        probe2 = session.post(
            mock,
            json={"limit": 1},
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        if probe2.ok:
            RULEBOOK_ENDPOINT = mock
            RULEBOOK_DATASET = "finraRulebookMock"
            logger.info("FINRA API: using mock dataset (upgrade to Firm credential for production)")
            return RULEBOOK_ENDPOINT
    if not probe.ok:
        probe.raise_for_status()
    return RULEBOOK_ENDPOINT


def fetch_all_rules(
    limit: int = 5000,
    offset: int = 0,
) -> list[FINRARuleRecord]:
    """Fetch all current rules from the FINRA Rulebook Query API."""
    session = _api_session()
    token = _obtain_token(session)
    endpoint = _resolve_endpoint(session, token)

    all_rules: list[FINRARuleRecord] = []
    page_limit = min(limit, 500)

    while True:
        payload: dict[str, Any] = {
            "fields": [
                "ruleNumber",
                "ruleTitle",
                "ruleTextAscii",
                "ruleTextHtml",
                "rulebookHierarchy",
                "effectiveStartDate",
                "effectiveEndDate",
                "summaryTopics",
                "detailedTopics",
            ],
            "limit": page_limit,
            "offset": offset,
            "compareFilters": [
                {"compareType": "equal", "fieldName": "effectiveEndDate", "fieldValue": None}
            ],
        }

        resp = session.post(
            endpoint,
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=60,
        )

        if resp.status_code == 401:
            token = _obtain_token(session)
            resp = session.post(
                endpoint,
                json=payload,
                headers={"Authorization": f"Bearer {token}"},
                timeout=60,
            )

        resp.raise_for_status()
        rows = resp.json()

        if not rows:
            break

        for row in rows:
            rn = str(row.get("ruleNumber") or "").strip()
            if not rn:
                continue
            all_rules.append(
                FINRARuleRecord(
                    rule_number=rn,
                    rule_title=str(row.get("ruleTitle") or f"Rule {rn}"),
                    raw_text=str(row.get("ruleTextAscii") or ""),
                    html_text=str(row.get("ruleTextHtml") or ""),
                    hierarchy=str(row.get("rulebookHierarchy") or ""),
                    effective_start=row.get("effectiveStartDate"),
                    effective_end=row.get("effectiveEndDate"),
                    summary_topics=row.get("summaryTopics") or [],
                    detailed_topics=row.get("detailedTopics") or [],
                )
            )

        if len(rows) < page_limit:
            break
        offset += page_limit

        if len(all_rules) >= limit:
            break

    logger.info("FINRA API: fetched %d current rules", len(all_rules))
    return all_rules


def fetch_rules_by_numbers(rule_numbers: list[str]) -> list[FINRARuleRecord]:
    """Fetch specific rules by rule number."""
    session = _api_session()
    token = _obtain_token(session)
    endpoint = _resolve_endpoint(session, token)

    results: list[FINRARuleRecord] = []
    for rn in rule_numbers:
        payload: dict[str, Any] = {
            "fields": [
                "ruleNumber",
                "ruleTitle",
                "ruleTextAscii",
                "ruleTextHtml",
                "rulebookHierarchy",
                "effectiveStartDate",
                "effectiveEndDate",
                "summaryTopics",
                "detailedTopics",
            ],
            "compareFilters": [
                {"compareType": "equal", "fieldName": "ruleNumber", "fieldValue": rn.strip()},
                {"compareType": "equal", "fieldName": "effectiveEndDate", "fieldValue": None},
            ],
        }
        resp = session.post(
            endpoint,
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=60,
        )
        if resp.status_code == 401:
            token = _obtain_token(session)
            resp = session.post(
                endpoint,
                json=payload,
                headers={"Authorization": f"Bearer {token}"},
                timeout=60,
            )
        resp.raise_for_status()
        rows = resp.json()
        for row in rows:
            num = str(row.get("ruleNumber") or "").strip()
            if not num:
                continue
            results.append(
                FINRARuleRecord(
                    rule_number=num,
                    rule_title=str(row.get("ruleTitle") or f"Rule {num}"),
                    raw_text=str(row.get("ruleTextAscii") or ""),
                    html_text=str(row.get("ruleTextHtml") or ""),
                    hierarchy=str(row.get("rulebookHierarchy") or ""),
                    effective_start=row.get("effectiveStartDate"),
                    effective_end=row.get("effectiveEndDate"),
                    summary_topics=row.get("summaryTopics") or [],
                    detailed_topics=row.get("detailedTopics") or [],
                )
            )

    logger.info("FINRA API: fetched %d rules by number", len(results))
    return results
