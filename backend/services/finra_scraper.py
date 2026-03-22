"""
FINRA Rulebook web scraper — discovers rule URLs from series index pages and
extracts full rule text for storage in regulatory_sources.

Uses public HTML only (no API key). Respectful rate limiting.
"""
from __future__ import annotations

import hashlib
import logging
import re
import time
from dataclasses import dataclass
from typing import Callable, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

BASE = "https://www.finra.org"
USER_AGENT = "CLHEAR.ai-Compliance-Monitor/1.0 (+https://clhear.ai)"

# Top-level FINRA Rules series pages (from finra.org/rules-guidance/rulebooks/finra-rules)
SERIES_PATHS = [
    "/rules-guidance/rulebooks/finra-rules/0100",
    "/rules-guidance/rulebooks/finra-rules/1000",
    "/rules-guidance/rulebooks/finra-rules/2000",
    "/rules-guidance/rulebooks/finra-rules/3000",
    "/rules-guidance/rulebooks/finra-rules/4000",
    "/rules-guidance/rulebooks/finra-rules/5000",
    "/rules-guidance/rulebooks/finra-rules/6000",
    "/rules-guidance/rulebooks/finra-rules/7000",
    "/rules-guidance/rulebooks/finra-rules/8000",
    "/rules-guidance/rulebooks/finra-rules/9000",
    "/rules-guidance/rulebooks/finra-rules/11000",
    "/rules-guidance/rulebooks/finra-rules/12000",
    "/rules-guidance/rulebooks/finra-rules/13000",
    "/rules-guidance/rulebooks/finra-rules/14000",
]

RULE_HREF_RE = re.compile(
    r"/rules-guidance/rulebooks/finra-rules/([0-9]+(?:\.[0-9]+)*)",
    re.IGNORECASE,
)


@dataclass
class ScrapedRule:
    regulator: str
    series: str
    series_title: str
    rule_number: str
    rule_title: str
    raw_text: str
    source_url: str
    content_hash: str


def _session() -> requests.Session:
    s = requests.Session()
    s.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
        }
    )
    return s


def _sleep_ratelimit(seconds: float = 1.0) -> None:
    time.sleep(seconds)


def discover_rule_urls(
    session: requests.Session,
    series_paths: Optional[list[str]] = None,
    on_progress: Optional[Callable[[str, int], None]] = None,
) -> list[tuple[str, str]]:
    """
    Returns sorted unique list of (rule_number, absolute_url).
    """
    paths = series_paths or SERIES_PATHS
    found: dict[str, str] = {}

    for sp in paths:
        url = urljoin(BASE, sp)
        if on_progress:
            on_progress(f"Discovering rules from {sp}", len(found))
        try:
            r = session.get(url, timeout=45)
            r.raise_for_status()
        except requests.RequestException as e:
            logger.warning("Failed to fetch series page %s: %s", url, e)
            continue

        for m in RULE_HREF_RE.finditer(r.text):
            rn = m.group(1)
            path = m.group(0)
            if not path.startswith("/"):
                path = "/" + path
            abs_url = urljoin(BASE, path)
            # Normalize rule number string
            found[rn] = abs_url
        _sleep_ratelimit(1.0)

    out = sorted(found.items(), key=lambda x: _rule_sort_key(x[0]))
    return out


def _rule_sort_key(rule_number: str) -> tuple:
    parts = []
    for p in rule_number.split("."):
        try:
            parts.append(int(p))
        except ValueError:
            parts.append(0)
    return tuple(parts)


def _extract_series_from_path(path: str) -> str:
    """Best-effort series bucket from URL path segment (e.g. 2000 from .../2111)."""
    m = re.search(r"/finra-rules/([0-9]+)", path)
    if not m:
        return ""
    n = m.group(1)
    # Map rule to series: take leading segment before sub-number
    base = n.split(".")[0]
    try:
        ib = int(base)
    except ValueError:
        return base
    if ib < 1000:
        return "0100"
    # bucket to thousands
    bucket = (ib // 1000) * 1000
    if bucket >= 1000:
        return str(bucket)
    return str(ib)


def extract_rule_page_html(html: str, page_url: str) -> tuple[str, str, str]:
    """
    Returns (rule_number, rule_title, raw_text).
    """
    soup = BeautifulSoup(html, "html.parser")

    # Title: first h1
    h1 = soup.find("h1")
    rule_title = h1.get_text(" ", strip=True) if h1 else ""
    rule_number = ""
    mnum = re.search(
        r"Rule\s+([0-9]+(?:\.[0-9]+)*)",
        rule_title,
        re.IGNORECASE,
    )
    if mnum:
        rule_number = mnum.group(1)
    if not rule_number:
        mpath = re.search(r"/finra-rules/([0-9]+(?:\.[0-9]+)*)", page_url)
        if mpath:
            rule_number = mpath.group(1)

    # Main content: prefer article or main body fields
    main = (
        soup.select_one("article")
        or soup.select_one(".field--name-body")
        or soup.select_one("div.region-content")
        or soup.select_one("div#main-content")
        or soup.select_one("div.layout-content")
    )
    if not main:
        main = soup.find("body") or soup

    # Remove nav/script/style
    for tag in main.find_all(["script", "style", "nav", "header", "footer"]):
        tag.decompose()

    raw_text = main.get_text("\n", strip=True)
    # Collapse excessive blank lines
    raw_text = re.sub(r"\n{3,}", "\n\n", raw_text).strip()

    if not rule_title:
        rule_title = f"Rule {rule_number}" if rule_number else "FINRA Rule"

    return rule_number, rule_title, raw_text


def scrape_rule(
    session: requests.Session,
    rule_number: str,
    page_url: str,
    series_title: str = "",
) -> Optional[ScrapedRule]:
    """Fetch a single rule page and return structured data."""
    try:
        r = session.get(page_url, timeout=45)
        r.raise_for_status()
    except requests.RequestException as e:
        logger.error("Failed to fetch rule %s: %s", page_url, e)
        return None

    rn, title, raw_text = extract_rule_page_html(r.text, page_url)
    if not rn:
        rn = rule_number
    if not raw_text or len(raw_text) < 40:
        logger.warning("Short or empty text for rule %s at %s", rn, page_url)

    parsed = urlparse(page_url)
    series = _extract_series_from_path(parsed.path or "/")

    h = hashlib.sha256(raw_text.encode("utf-8")).hexdigest()

    return ScrapedRule(
        regulator="FINRA",
        series=series or "",
        series_title=series_title or f"FINRA Rules {series}",
        rule_number=rn,
        rule_title=title,
        raw_text=raw_text,
        source_url=page_url,
        content_hash=h,
    )


def scrape_all_rules(
    session: requests.Session,
    on_rule: Optional[Callable[[ScrapedRule, int, int], None]] = None,
    max_rules: Optional[int] = None,
    on_progress: Optional[Callable[[str, int], None]] = None,
) -> list[ScrapedRule]:
    """
    Discover URLs and scrape each rule page.
    """
    pairs = discover_rule_urls(session, on_progress=on_progress)
    if max_rules is not None:
        pairs = pairs[: max(0, int(max_rules))]

    total = len(pairs)
    results: list[ScrapedRule] = []
    for i, (rn, url) in enumerate(pairs, start=1):
        if on_progress:
            on_progress(f"Scraping rule {rn} ({i}/{total})", i)
        scraped = scrape_rule(session, rn, url)
        if scraped:
            results.append(scraped)
            if on_rule:
                on_rule(scraped, i, total)
        _sleep_ratelimit(1.0)

    return results


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    s = _session()
    pairs = discover_rule_urls(s)
    print(f"Discovered {len(pairs)} rule URLs")
    if pairs:
        first = scrape_rule(s, pairs[0][0], pairs[0][1])
        print(first)
