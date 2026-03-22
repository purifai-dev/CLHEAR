#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════════
#  CLHEAR.ai — Production Deployment
#  Run on a fresh Ubuntu 22.04+ server after cloning the repo
#
#  Prerequisites:
#    1. Point clhear.ai DNS A record → this server's IP
#    2. cp .env.prod.example .env.prod   (set a strong password)
#    3. sudo bash deploy.sh
# ═══════════════════════════════════════════════════════════════

DOMAIN="clhear.ai"
EMAIL="${CERTBOT_EMAIL:-admin@clhear.ai}"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.prod"

echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║   CLHEAR.ai — Production Deployment   ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""

# ── Preflight ─────────────────────────────────────────────
if [ ! -f ".env.prod" ]; then
    echo "✗ .env.prod not found"
    echo "  Run: cp .env.prod.example .env.prod && nano .env.prod"
    exit 1
fi
echo "✓ .env.prod found"

# ── Install Docker if needed ──────────────────────────────
if ! command -v docker &> /dev/null; then
    echo "→ Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker && systemctl start docker
fi
echo "✓ Docker ready"

# ── Phase 1: HTTP only (needed to obtain SSL cert) ───────
echo ""
echo "── Phase 1: Starting services (HTTP) ─────"
cp nginx/nginx-initial.conf nginx/active.conf

$COMPOSE build
$COMPOSE up -d postgres
echo "  Waiting for database..."
sleep 5

echo "→ Running database migration..."
$COMPOSE run --rm app python database/init_schema.py
echo "✓ Database schema ready"

$COMPOSE up -d
echo "✓ All services running (HTTP)"

# ── Phase 2: Obtain SSL certificate ──────────────────────
echo ""
echo "── Phase 2: Obtaining SSL certificate ────"
$COMPOSE run --rm certbot \
    certbot certonly --webroot \
    --webroot-path /var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"
echo "✓ SSL certificate obtained"

# ── Phase 3: Switch to HTTPS ─────────────────────────────
echo ""
echo "── Phase 3: Enabling HTTPS ───────────────"
cp nginx/nginx.conf nginx/active.conf
$COMPOSE exec nginx nginx -s reload
echo "✓ HTTPS enabled"

# ── Phase 4: SSL auto-renewal cron ───────────────────────
CRON_CMD="0 3 * * * cd $(pwd) && docker compose -f docker-compose.prod.yml --env-file .env.prod run --rm certbot certbot renew --quiet && docker compose -f docker-compose.prod.yml --env-file .env.prod exec nginx nginx -s reload"
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_CMD") | crontab -
echo "✓ SSL auto-renewal scheduled (daily 3 AM)"

echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║        ✓ CLHEAR.ai is live!           ║"
echo "  ║                                       ║"
echo "  ║     https://clhear.ai                 ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""
