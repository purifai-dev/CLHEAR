"""
CLHEAR Email Notification Service
Manages email subscriptions and sends regulatory news digests to compliance teams.
Supports SMTP configuration and daily digest scheduling.
"""
import json
import logging
import math
import os
import smtplib
import uuid
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.sql import text as sql_text

logger = logging.getLogger(__name__)


class EmailService:
    """Manages email subscriptions and sends regulatory news digests."""

    def __init__(self, engine, audit_service=None):
        self.engine = engine
        self.audit = audit_service

        # SMTP config from environment
        self.smtp_host = os.getenv("SMTP_HOST", "")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_pass = os.getenv("SMTP_PASS", "")
        self.smtp_from = os.getenv("SMTP_FROM", "alerts@clhear.ai")
        self.smtp_tls = os.getenv("SMTP_TLS", "true").lower() == "true"
        self.app_base_url = os.getenv("APP_BASE_URL", "https://clhear.ai")

    @property
    def is_configured(self) -> bool:
        """Check if SMTP is configured."""
        return bool(self.smtp_host and self.smtp_user)

    # ------------------------------------------------------------------
    # Subscription CRUD
    # ------------------------------------------------------------------

    def create_subscription(
        self,
        email: str,
        name: str = "",
        regulators: list = None,
        importance_filter: list = None,
        frequency: str = "daily",
    ) -> dict:
        """Create a new email subscription."""
        sub_id = str(uuid.uuid4())
        now = datetime.utcnow()

        if regulators is None:
            regulators = ["FINRA", "FCA"]
        if importance_filter is None:
            importance_filter = ["critical", "high", "medium"]

        with self.engine.connect() as conn:
            conn.execute(
                sql_text("""
                    INSERT INTO email_subscriptions
                        (id, email, name, regulators, importance_filter,
                         frequency, enabled, created_at, updated_at)
                    VALUES
                        (:id, :email, :name, :regulators, :importance_filter,
                         :frequency, true, :now, :now)
                """),
                {
                    "id": sub_id,
                    "email": email,
                    "name": name or email,
                    "regulators": json.dumps(regulators),
                    "importance_filter": json.dumps(importance_filter),
                    "frequency": frequency,
                    "now": now,
                },
            )
            conn.commit()

        if self.audit:
            self.audit.log(
                action="email_sub_created",
                entity_type="email_subscription",
                entity_id=sub_id,
                description=f"Created email subscription for {email}",
                changes={"email": email, "regulators": regulators, "frequency": frequency},
            )

        return {
            "id": sub_id,
            "email": email,
            "name": name or email,
            "regulators": regulators,
            "importance_filter": importance_filter,
            "frequency": frequency,
            "enabled": True,
        }

    def update_subscription(self, sub_id: str, **kwargs) -> bool:
        """Update an email subscription."""
        allowed = {"email", "name", "regulators", "importance_filter", "frequency", "enabled"}
        updates = {k: v for k, v in kwargs.items() if k in allowed and v is not None}

        if not updates:
            return False

        set_parts = []
        params = {"id": sub_id, "now": datetime.utcnow()}

        for key, val in updates.items():
            if key in ("regulators", "importance_filter"):
                set_parts.append(f"{key} = :{key}")
                params[key] = json.dumps(val)
            elif key == "enabled":
                set_parts.append(f"enabled = :enabled")
                params["enabled"] = val
            else:
                set_parts.append(f"{key} = :{key}")
                params[key] = val

        set_parts.append("updated_at = :now")

        with self.engine.connect() as conn:
            result = conn.execute(
                sql_text(f"UPDATE email_subscriptions SET {', '.join(set_parts)} WHERE id = :id"),
                params,
            )
            conn.commit()

        if self.audit and result.rowcount > 0:
            self.audit.log(
                action="email_sub_updated",
                entity_type="email_subscription",
                entity_id=sub_id,
                description=f"Updated email subscription",
                changes=updates,
            )

        return result.rowcount > 0

    def delete_subscription(self, sub_id: str) -> bool:
        """Delete an email subscription."""
        with self.engine.connect() as conn:
            sub = conn.execute(
                sql_text("SELECT email FROM email_subscriptions WHERE id = :id"),
                {"id": sub_id},
            ).fetchone()

            if not sub:
                return False

            conn.execute(
                sql_text("DELETE FROM email_subscriptions WHERE id = :id"),
                {"id": sub_id},
            )
            conn.commit()

        if self.audit:
            self.audit.log(
                action="email_sub_deleted",
                entity_type="email_subscription",
                entity_id=sub_id,
                description=f"Deleted email subscription for {sub[0]}",
            )

        return True

    def get_subscriptions(self, page: int = 1, page_size: int = 50) -> dict:
        """List all email subscriptions."""
        with self.engine.connect() as conn:
            total = conn.execute(sql_text("SELECT COUNT(*) FROM email_subscriptions")).scalar()

            offset = (page - 1) * page_size
            rows = conn.execute(
                sql_text("""
                    SELECT id, email, name, regulators, importance_filter,
                           frequency, enabled, last_sent, created_at, updated_at
                    FROM email_subscriptions
                    ORDER BY created_at DESC
                    LIMIT :limit OFFSET :offset
                """),
                {"limit": page_size, "offset": offset},
            ).fetchall()

        def _parse(v):
            if v is None:
                return []
            if isinstance(v, list):
                return v
            if isinstance(v, str):
                return json.loads(v)
            return v

        items = [
            {
                "id": str(r[0]),
                "email": r[1],
                "name": r[2],
                "regulators": _parse(r[3]),
                "importance_filter": _parse(r[4]),
                "frequency": r[5],
                "enabled": r[6],
                "last_sent": r[7].isoformat() if r[7] else None,
                "created_at": r[8].isoformat() if r[8] else None,
                "updated_at": r[9].isoformat() if r[9] else None,
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

    def get_subscription(self, sub_id: str) -> Optional[dict]:
        """Get a single email subscription."""
        with self.engine.connect() as conn:
            r = conn.execute(
                sql_text("""
                    SELECT id, email, name, regulators, importance_filter,
                           frequency, enabled, last_sent, created_at, updated_at
                    FROM email_subscriptions WHERE id = :id
                """),
                {"id": sub_id},
            ).fetchone()

        if not r:
            return None

        def _parse(v):
            if v is None:
                return []
            if isinstance(v, list):
                return v
            if isinstance(v, str):
                return json.loads(v)
            return v

        return {
            "id": str(r[0]),
            "email": r[1],
            "name": r[2],
            "regulators": _parse(r[3]),
            "importance_filter": _parse(r[4]),
            "frequency": r[5],
            "enabled": r[6],
            "last_sent": r[7].isoformat() if r[7] else None,
            "created_at": r[8].isoformat() if r[8] else None,
            "updated_at": r[9].isoformat() if r[9] else None,
        }

    # ------------------------------------------------------------------
    # Email sending
    # ------------------------------------------------------------------

    def send_daily_digests(self):
        """Send daily digest emails to all enabled subscriptions."""
        with self.engine.connect() as conn:
            subs = conn.execute(
                sql_text("""
                    SELECT id, email, name, regulators, importance_filter, last_sent
                    FROM email_subscriptions
                    WHERE enabled = true AND frequency = 'daily'
                """)
            ).fetchall()

        sent_count = 0
        error_count = 0

        for sub in subs:
            sub_id = str(sub[0])
            email = sub[1]
            name = sub[2]

            regulators = sub[3] if isinstance(sub[3], list) else (
                json.loads(sub[3]) if sub[3] else []
            )
            importance_filter = sub[4] if isinstance(sub[4], list) else (
                json.loads(sub[4]) if sub[4] else ["critical", "high", "medium"]
            )
            last_sent = sub[5]

            # Determine time window
            since = last_sent or (datetime.utcnow() - timedelta(days=1))

            try:
                # Fetch news items for this subscription
                news_items = self._get_news_for_subscription(
                    regulators, importance_filter, since
                )

                if not news_items:
                    logger.info(f"No new items for {email}, skipping")
                    continue

                # Build and send email
                success = self._send_digest_email(email, name, news_items)

                if success:
                    # Update last_sent
                    with self.engine.connect() as conn:
                        conn.execute(
                            sql_text("""
                                UPDATE email_subscriptions
                                SET last_sent = :now, updated_at = :now
                                WHERE id = :id
                            """),
                            {"now": datetime.utcnow(), "id": sub_id},
                        )
                        conn.commit()
                    sent_count += 1

                    if self.audit:
                        self.audit.log_email(sub_id, email, "success", len(news_items))
                else:
                    error_count += 1
                    if self.audit:
                        self.audit.log_email(sub_id, email, "error", error="SMTP not configured")

            except Exception as e:
                error_count += 1
                logger.error(f"Failed to send digest to {email}: {e}")
                if self.audit:
                    self.audit.log_email(sub_id, email, "error", error=str(e))

        return {"sent": sent_count, "errors": error_count, "total_subscribers": len(subs)}

    def _get_news_for_subscription(
        self, regulators: list, importance_filter: list, since: datetime
    ) -> list:
        """Get news items matching subscription criteria."""
        if not regulators:
            return []

        placeholders_reg = ", ".join(f":reg_{i}" for i in range(len(regulators)))
        placeholders_imp = ", ".join(f":imp_{i}" for i in range(len(importance_filter)))

        params = {"since": since}
        for i, r in enumerate(regulators):
            params[f"reg_{i}"] = r
        for i, imp in enumerate(importance_filter):
            params[f"imp_{i}"] = imp

        with self.engine.connect() as conn:
            rows = conn.execute(
                sql_text(f"""
                    SELECT title, summary, regulator, importance, source_url, published_date
                    FROM regulatory_news
                    WHERE regulator IN ({placeholders_reg})
                      AND importance IN ({placeholders_imp})
                      AND published_date > :since
                    ORDER BY importance_order(importance), published_date DESC
                """.replace(
                    "importance_order(importance)",
                    """CASE importance
                        WHEN 'critical' THEN 1
                        WHEN 'high' THEN 2
                        WHEN 'medium' THEN 3
                        WHEN 'low' THEN 4
                        ELSE 5 END"""
                )),
                params,
            ).fetchall()

        return [
            {
                "title": r[0],
                "summary": r[1],
                "regulator": r[2],
                "importance": r[3],
                "source_url": r[4],
                "published_date": r[5].isoformat() if r[5] else None,
            }
            for r in rows
        ]

    def _send_digest_email(self, to_email: str, name: str, items: list) -> bool:
        """Send a formatted digest email."""
        if not self.is_configured:
            logger.warning(f"SMTP not configured - would send digest to {to_email} with {len(items)} items")
            # Log what would be sent for demo purposes
            logger.info(f"  Digest for {name}: {len(items)} regulatory updates")
            for item in items[:5]:
                logger.info(f"    [{item['importance'].upper()}] {item['title'][:80]}")
            return True  # Return True in demo mode so last_sent gets updated

        subject = f"CLHEAR.ai Daily Regulatory Digest - {datetime.utcnow().strftime('%B %d, %Y')}"
        html_body = self._build_digest_html(name, items)

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.smtp_from
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        try:
            if self.smtp_tls:
                server = smtplib.SMTP(self.smtp_host, self.smtp_port)
                server.starttls()
            else:
                server = smtplib.SMTP(self.smtp_host, self.smtp_port)

            server.login(self.smtp_user, self.smtp_pass)
            server.send_message(msg)
            server.quit()
            logger.info(f"Digest email sent to {to_email}")
            return True

        except Exception as e:
            logger.error(f"SMTP error sending to {to_email}: {e}")
            return False

    def _build_digest_html(self, name: str, items: list) -> str:
        """Build a professional HTML email digest."""
        importance_colors = {
            "critical": "#e05c5c",
            "high": "#e89b50",
            "medium": "#f0c040",
            "low": "#3ecf8e",
        }

        items_html = ""
        for item in items:
            color = importance_colors.get(item["importance"], "#8b8fa8")
            items_html += f"""
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #2e3148;">
                <span style="display:inline-block;padding:2px 8px;border-radius:4px;
                  font-size:11px;font-weight:600;text-transform:uppercase;
                  background:rgba({','.join(str(int(color[i:i+2], 16)) for i in (1, 3, 5))},0.2);
                  color:{color};">{item['importance']}</span>
                <span style="font-size:12px;color:#8b8fa8;margin-left:8px;">{item['regulator']}</span>
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #2e3148;">
                <a href="{item.get('source_url', '#')}" style="color:#4f7dff;text-decoration:none;font-size:14px;">
                  {item['title']}
                </a>
                <p style="margin:4px 0 0;font-size:12px;color:#8b8fa8;">{item.get('summary', '')[:150]}</p>
              </td>
            </tr>
            """

        return f"""
        <html>
        <body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <div style="max-width:700px;margin:0 auto;padding:24px;">
            <div style="background:#1a1d27;border:1px solid #2e3148;border-radius:10px;overflow:hidden;">
              <div style="padding:24px;border-bottom:1px solid #2e3148;">
                <h1 style="margin:0;color:#4f7dff;font-size:20px;">CLHEAR.ai</h1>
                <p style="margin:8px 0 0;color:#e2e4ef;font-size:16px;">Daily Regulatory Digest</p>
                <p style="margin:4px 0 0;color:#8b8fa8;font-size:13px;">
                  {datetime.utcnow().strftime('%B %d, %Y')} | {len(items)} update{'s' if len(items) != 1 else ''}
                </p>
              </div>
              <div style="padding:4px 0;">
                <p style="padding:12px 16px;color:#e2e4ef;font-size:14px;">
                  Hello {name},<br><br>
                  Here are the latest regulatory updates relevant to your compliance monitoring:
                </p>
                <table style="width:100%;border-collapse:collapse;">
                  {items_html}
                </table>
              </div>
              <div style="padding:16px;background:#232635;border-top:1px solid #2e3148;text-align:center;">
                <a href="{self.app_base_url}" style="display:inline-block;margin-bottom:10px;padding:8px 20px;background:#4f7dff;color:#fff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;">
                  Open CLHEAR.ai Dashboard
                </a>
                <p style="margin:0;color:#8b8fa8;font-size:11px;">
                  CLHEAR.ai — Compliance Intelligence Platform | Automated Regulatory Monitoring
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
        """

    def get_smtp_status(self) -> dict:
        """Get SMTP configuration status."""
        return {
            "configured": self.is_configured,
            "host": self.smtp_host or "(not set)",
            "port": self.smtp_port,
            "from_address": self.smtp_from,
            "tls": self.smtp_tls,
        }
