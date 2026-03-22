"""
CLHEAR Regulatory News Service
Scrapes and manages regulatory news/updates from FINRA and FCA.

Key design principle: Only ingest DATED, TIME-BOUND publications (notices,
press releases, policy statements, speeches). Never ingest permanent pages
like "About us", "Handbook of rules", or general navigation content.

Detection logic:
  1. FCA: Use the official RSS feed at /news/rss.xml — every item has a
     pubDate, a unique permalink, and a summary. This is the canonical
     source the FCA publishes for exactly this purpose.
  2. FINRA: Scrape the /rules-guidance/notices page which lists dated
     Regulatory Notices, Trade Reporting Notices, and Information Notices
     with explicit publication dates and notice numbers (e.g. "26-06").
     Only items with a parseable date are ingested.

Both sources guarantee that every item is a genuine regulatory publication
with a known publication date — not a permanent reference page.
"""
import hashlib
import json
import logging
import math
import os
import re
import uuid
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from email.utils import parsedate_to_datetime
from typing import Optional

import requests
from sqlalchemy import create_engine
from sqlalchemy.sql import text as sql_text

logger = logging.getLogger(__name__)


# -----------------------------------------------------------------------
# Feed definitions — only official publication channels
# -----------------------------------------------------------------------
REGULATOR_FEEDS = {
    "FCA": {
        "name": "FCA",
        "feeds": [
            {
                "url": "https://www.fca.org.uk/news/rss.xml",
                "type": "rss",
                "label": "FCA Official News RSS",
                "category": "news",
            },
        ],
    },
    "FINRA": {
        "name": "FINRA",
        "feeds": [
            {
                "url": "https://www.finra.org/rules-guidance/notices",
                "type": "html_notices",
                "label": "FINRA Regulatory Notices",
                "category": "regulatory_notice",
            },
        ],
    },
}


class NewsService:
    """Manages regulatory news scraping and retrieval."""

    def __init__(self, engine, audit_service=None):
        self.engine = engine
        self.audit = audit_service

    # ==================================================================
    # Scraping orchestrator
    # ==================================================================

    def scrape_regulator_news(self, regulator: str) -> dict:
        """
        Scrape latest news from a regulator's designated publication feeds.
        Returns stats about what was scraped.
        """
        feed_config = REGULATOR_FEEDS.get(regulator.upper())
        if not feed_config:
            return {"error": f"No feeds configured for {regulator}", "new_items": 0}

        total_new = 0
        total_skipped = 0
        errors = []

        for feed in feed_config["feeds"]:
            try:
                items = self._fetch_feed(regulator, feed)
                for item in items:
                    if self._store_news_item(item):
                        total_new += 1
                    else:
                        total_skipped += 1
            except Exception as e:
                error_msg = f"Error fetching {feed['label']}: {str(e)}"
                logger.error(error_msg)
                errors.append(error_msg)

        result = {
            "regulator": regulator,
            "new_items": total_new,
            "skipped_existing": total_skipped,
            "errors": errors,
            "timestamp": datetime.utcnow().isoformat(),
        }

        if self.audit:
            self.audit.log_news_scrape(regulator, total_new)

        return result

    # ==================================================================
    # Feed fetching — dispatch by type
    # ==================================================================

    def _fetch_feed(self, regulator: str, feed: dict) -> list:
        """Route to the appropriate parser based on feed type."""
        headers = {
            "User-Agent": "CLHEAR.ai-Compliance-Monitor/1.0",
            "Accept": "application/rss+xml, application/xml, text/xml, text/html, */*",
        }

        try:
            resp = requests.get(feed["url"], headers=headers, timeout=20)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.warning(f"Network error fetching {feed['url']}: {e}")
            return []

        if feed["type"] == "rss":
            return self._parse_rss(resp.text, regulator, feed)
        elif feed["type"] == "html_notices":
            return self._parse_finra_notices(resp.text, regulator, feed)
        else:
            logger.warning(f"Unknown feed type: {feed['type']}")
            return []

    # ==================================================================
    # FCA RSS parser
    # ==================================================================

    def _parse_rss(self, xml_text: str, regulator: str, feed: dict) -> list:
        """
        Parse a standard RSS 2.0 feed.
        Each <item> has <title>, <link>, <pubDate>, <description>.
        Only items with a valid pubDate are accepted.
        """
        items = []
        try:
            root = ET.fromstring(xml_text)
        except ET.ParseError:
            logger.error("Failed to parse RSS XML")
            return []

        # RSS 2.0: <rss><channel><item>
        channel = root.find("channel")
        if channel is None:
            # Try Atom or direct items
            channel = root

        for entry in channel.findall("item"):
            title_el = entry.find("title")
            link_el = entry.find("link")
            pub_date_el = entry.find("pubDate")
            desc_el = entry.find("description")

            title = title_el.text.strip() if title_el is not None and title_el.text else None
            link = link_el.text.strip() if link_el is not None and link_el.text else None
            description = desc_el.text.strip() if desc_el is not None and desc_el.text else None

            if not title:
                continue

            # Parse publication date — reject items without one
            pub_date = None
            if pub_date_el is not None and pub_date_el.text:
                pub_date = self._parse_rss_date(pub_date_el.text.strip())

            if pub_date is None:
                logger.debug(f"Skipping RSS item without date: {title}")
                continue

            # Clean up HTML from description
            if description:
                description = re.sub(r"<[^>]+>", "", description).strip()
                description = description[:500]  # cap length

            # Classify the news type from the URL pattern
            category = self._classify_fca_category(link or "", title)

            items.append({
                "regulator": regulator,
                "title": title,
                "summary": description,
                "source_url": link,
                "published_date": pub_date,
                "category": category,
                "importance": self._assess_importance(title, description or ""),
            })

        logger.info(f"Parsed {len(items)} items from FCA RSS feed")
        return items

    def _parse_rss_date(self, date_str: str) -> Optional[datetime]:
        """Parse date strings from RSS feeds, handling non-standard formats."""
        # Standard RFC 822
        try:
            return parsedate_to_datetime(date_str)
        except Exception:
            pass

        # FCA uses: "Thursday, March 5, 2026 - 13:42"
        # Strip the day name and the dash before time
        cleaned = date_str.strip()
        # Remove leading day name: "Thursday, " -> ""
        cleaned = re.sub(r"^[A-Za-z]+,\s*", "", cleaned)
        # Replace " - " separator before time with " "
        cleaned = re.sub(r"\s*-\s*", " ", cleaned)

        for fmt in [
            "%B %d, %Y %H:%M",       # "March 5, 2026 13:42"
            "%B %d, %Y %H:%M:%S",    # "March 5, 2026 13:42:00"
            "%B %d, %Y",             # "March 5, 2026"
            "%d %b %Y %H:%M:%S %z",  # RFC 822 variant
            "%d %b %Y %H:%M:%S",
            "%Y-%m-%dT%H:%M:%S",
            "%d/%m/%Y",
        ]:
            try:
                return datetime.strptime(cleaned.strip(), fmt)
            except ValueError:
                continue
        return None

    def _classify_fca_category(self, url: str, title: str) -> str:
        """Classify an FCA news item by its URL path or title."""
        url_lower = url.lower()
        if "/press-releases/" in url_lower:
            return "press_release"
        if "/speeches/" in url_lower:
            return "speech"
        if "/statements/" in url_lower:
            return "statement"
        if "/news-stories/" in url_lower:
            return "news_story"
        if "/policy-statements/" in url_lower:
            return "policy_statement"
        if "/consultation-papers/" in url_lower:
            return "consultation"
        if "/dear-ceo" in url_lower:
            return "dear_ceo_letter"
        if "/warnings/" in url_lower:
            return "warning"

        # Title-based fallback
        title_lower = title.lower()
        if "fine" in title_lower or "penalty" in title_lower:
            return "enforcement"
        if "warn" in title_lower:
            return "warning"
        if "consultation" in title_lower:
            return "consultation"

        return "news"

    # ==================================================================
    # FINRA notices parser
    # ==================================================================

    def _parse_finra_notices(self, html_content: str, regulator: str, feed: dict) -> list:
        """
        Parse FINRA's notices page.

        The HTML is a <table> where each <tr> row has 3 columns:
          1. views-field-field-core-official-dt — contains <time datetime="...">
          2. views-field-title — contains <a href="/rules-guidance/notices/XX-XX">Notice Type XX-XX</a>
          3. views-field-field-notice-title-tx — contains <div>Full Descriptive Title</div>

        We parse each row as a structured entry, guaranteeing every item
        has a real date, a permalink, and a descriptive title.
        """
        items = []

        # Parse table rows: each row has <time datetime="...">, a notice link,
        # and a title div. We use a regex that captures the full row context.
        row_pattern = re.compile(
            r'<time\s+datetime="([^"]+)"[^>]*>[^<]*</time>'   # Group 1: ISO datetime
            r'.*?'
            r'<a[^>]*href="(/rules-guidance/notices/[^"]+)"'   # Group 2: URL path
            r'[^>]*>([^<]+)</a>'                                # Group 3: notice number text
            r'.*?'
            r'views-field-field-notice-title-tx">'
            r'\s*<div>([^<]+)</div>',                           # Group 4: full title
            re.DOTALL,
        )

        for match in row_pattern.finditer(html_content):
            iso_date = match.group(1).strip()
            href = match.group(2).strip()
            notice_label = match.group(3).strip()   # e.g. "Regulatory Notice 26-06"
            full_title = match.group(4).strip()      # e.g. "FINRA Requests Comment on..."

            # Parse the ISO date from <time datetime="2026-03-02T12:00:00Z">
            pub_date = self._parse_iso_date(iso_date)
            if pub_date is None:
                continue

            full_url = f"https://www.finra.org{href}"

            # Build a clear title: "Regulatory Notice 26-06: FINRA Requests Comment..."
            title = f"{notice_label}: {full_title}" if full_title else notice_label

            # Determine notice type from the label
            label_lower = notice_label.lower()
            if "trade reporting" in label_lower:
                notice_type = "trade_reporting_notice"
            elif "information" in label_lower:
                notice_type = "information_notice"
            elif "election" in label_lower:
                notice_type = "election_notice"
            elif "special" in label_lower:
                notice_type = "special_notice"
            else:
                notice_type = "regulatory_notice"

            items.append({
                "regulator": regulator,
                "title": title,
                "summary": full_title,
                "source_url": full_url,
                "published_date": pub_date,
                "category": notice_type,
                "importance": self._assess_importance(title, full_title),
            })

        # Deduplicate by URL
        seen_urls = set()
        unique_items = []
        for item in items:
            if item["source_url"] not in seen_urls:
                seen_urls.add(item["source_url"])
                unique_items.append(item)

        logger.info(f"Parsed {len(unique_items)} dated notices from FINRA")
        return unique_items

    def _parse_iso_date(self, iso_str: str) -> Optional[datetime]:
        """Parse an ISO 8601 date string like '2026-03-02T12:00:00Z'."""
        for fmt in [
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%dT%H:%M:%S%z",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d",
        ]:
            try:
                return datetime.strptime(iso_str.strip(), fmt)
            except ValueError:
                continue
        return None

    def _parse_finra_date(self, date_str: str) -> Optional[datetime]:
        """Parse a FINRA-style date like 'March 2, 2026'."""
        for fmt in ["%B %d, %Y", "%b %d, %Y"]:
            try:
                return datetime.strptime(date_str.strip(), fmt)
            except ValueError:
                continue
        return None

    # ==================================================================
    # Importance assessment
    # ==================================================================

    def _assess_importance(self, title: str, summary: str) -> str:
        """
        Assess the importance/urgency of a regulatory news item.
        Uses the title and summary to classify into:
          critical — enforcement actions, fines, bans, emergency orders
          high     — rule changes, amendments, final rules, policy statements
          medium   — consultations, guidance, speeches, general updates
          low      — administrative, elections, webinars, newsletters
        """
        text = f"{title} {summary}".lower()

        # Critical: enforcement, penalties, bans
        critical_patterns = [
            r"\bfine[sd]?\b", r"\bpenalt", r"\benforcement\b",
            r"\bsuspension\b", r"\bsuspend", r"\bban\b", r"\bbarred\b",
            r"\bemergency\b", r"\bprohibit", r"\bexpel",
            r"\brevok", r"\bcessation\b", r"\bfraud\b",
            r"\bmisleading\b", r"\bwarn\b",
        ]
        if any(re.search(p, text) for p in critical_patterns):
            return "critical"

        # High: substantive regulatory changes
        high_patterns = [
            r"\brule change", r"\bamendment", r"\badopt[s ]",
            r"\bfinal rule", r"\bnew rule", r"\bpolicy statement",
            r"\brequirement", r"\beffective date", r"\bimplementation\b",
            r"\bproposed rule\b", r"\bcomment period",
            r"\bcompensation scheme\b", r"\bredress\b",
        ]
        if any(re.search(p, text) for p in high_patterns):
            return "high"

        # Low: administrative / informational
        low_patterns = [
            r"\belection\b", r"\bnewsletter\b", r"\bwebinar\b",
            r"\bconference\b", r"\btraining\b", r"\bevent\b",
            r"\bholiday\b", r"\bschedule\b",
        ]
        if any(re.search(p, text) for p in low_patterns):
            return "low"

        # Default: medium
        return "medium"

    # ==================================================================
    # Storage — deduplication by URL + title hash
    # ==================================================================

    def _store_news_item(self, item: dict) -> bool:
        """
        Store a news item only if it's genuinely new.
        Dedup key: SHA256 of (regulator + canonical URL) or (regulator + title)
        if no URL is available.
        """
        dedup_key = item.get("source_url") or item["title"]
        content_hash = hashlib.sha256(
            f"{item['regulator']}:{dedup_key}".encode()
        ).hexdigest()

        with self.engine.connect() as conn:
            existing = conn.execute(
                sql_text("""
                    SELECT id FROM regulatory_news
                    WHERE metadata->>'content_hash' = :hash
                """),
                {"hash": content_hash},
            ).fetchone()

            if existing:
                return False

            conn.execute(
                sql_text("""
                    INSERT INTO regulatory_news
                        (id, regulator, title, summary, source_url, published_date,
                         category, importance, scraped_at, metadata)
                    VALUES
                        (:id, :regulator, :title, :summary, :source_url, :published_date,
                         :category, :importance, :scraped_at, :metadata)
                """),
                {
                    "id": str(uuid.uuid4()),
                    "regulator": item["regulator"],
                    "title": item["title"],
                    "summary": item.get("summary"),
                    "source_url": item.get("source_url"),
                    "published_date": item.get("published_date", datetime.utcnow()),
                    "category": item.get("category"),
                    "importance": item.get("importance", "medium"),
                    "scraped_at": datetime.utcnow(),
                    "metadata": json.dumps({
                        "content_hash": content_hash,
                        "feed_type": "rss" if item.get("category") not in (
                            "regulatory_notice", "trade_reporting_notice",
                            "information_notice", "election_notice",
                        ) else "html_scrape",
                    }),
                },
            )
            conn.commit()

        return True

    # ==================================================================
    # Query methods (unchanged)
    # ==================================================================

    def get_news(
        self,
        page: int = 1,
        page_size: int = 20,
        regulator: Optional[str] = None,
        importance: Optional[str] = None,
        is_read: Optional[bool] = None,
        q: Optional[str] = None,
    ) -> dict:
        """Get paginated news items with filters."""
        filters = []
        params = {}

        if regulator:
            filters.append("regulator = :regulator")
            params["regulator"] = regulator
        if importance:
            filters.append("importance = :importance")
            params["importance"] = importance
        if is_read is not None:
            filters.append("is_read = :is_read")
            params["is_read"] = is_read
        if q:
            filters.append(
                "to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '')) "
                "@@ plainto_tsquery('english', :q)"
            )
            params["q"] = q

        where = ("WHERE " + " AND ".join(filters)) if filters else ""

        with self.engine.connect() as conn:
            total = conn.execute(
                sql_text(f"SELECT COUNT(*) FROM regulatory_news {where}"),
                params,
            ).scalar()

            offset = (page - 1) * page_size
            params["limit"] = page_size
            params["offset"] = offset

            rows = conn.execute(
                sql_text(f"""
                    SELECT id, regulator, title, summary, source_url, published_date,
                           category, importance, is_read, scraped_at
                    FROM regulatory_news
                    {where}
                    ORDER BY published_date DESC
                    LIMIT :limit OFFSET :offset
                """),
                params,
            ).fetchall()

        items = [
            {
                "id": str(r[0]),
                "regulator": r[1],
                "title": r[2],
                "summary": r[3],
                "source_url": r[4],
                "published_date": r[5].isoformat() if r[5] else None,
                "category": r[6],
                "importance": r[7],
                "is_read": r[8],
                "scraped_at": r[9].isoformat() if r[9] else None,
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

    def mark_read(self, news_id: str, read: bool = True) -> bool:
        """Mark a news item as read/unread."""
        with self.engine.connect() as conn:
            result = conn.execute(
                sql_text("UPDATE regulatory_news SET is_read = :read WHERE id = :id"),
                {"read": read, "id": news_id},
            )
            conn.commit()
            return result.rowcount > 0

    def get_unread_count(self) -> dict:
        """Get count of unread news by regulator."""
        with self.engine.connect() as conn:
            rows = conn.execute(
                sql_text("""
                    SELECT regulator, COUNT(*)
                    FROM regulatory_news
                    WHERE is_read = false
                    GROUP BY regulator
                """)
            ).fetchall()

        return {r[0]: r[1] for r in rows}

    def get_news_stats(self) -> dict:
        """Get news statistics for dashboard."""
        with self.engine.connect() as conn:
            total = conn.execute(sql_text("SELECT COUNT(*) FROM regulatory_news")).scalar()
            unread = conn.execute(sql_text("SELECT COUNT(*) FROM regulatory_news WHERE is_read = false")).scalar()

            by_importance = {
                r[0]: r[1]
                for r in conn.execute(
                    sql_text("SELECT importance, COUNT(*) FROM regulatory_news GROUP BY importance")
                )
            }

            by_regulator = {
                r[0]: r[1]
                for r in conn.execute(
                    sql_text("SELECT regulator, COUNT(*) FROM regulatory_news GROUP BY regulator")
                )
            }

        return {
            "total": total,
            "unread": unread,
            "by_importance": by_importance,
            "by_regulator": by_regulator,
        }
