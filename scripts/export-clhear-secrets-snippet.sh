#!/usr/bin/env bash
# Emit env-style lines for CLHear secrets in Secrets Manager (run locally with AWS creds).
# Default prefix matches Terraform: "${name_prefix}/database-url"
set -euo pipefail

PREFIX="${AWS_SECRET_PREFIX:-clhear-staging}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"

get_secret() {
  local id="$1"
  aws secretsmanager get-secret-value \
    --secret-id "$id" \
    --region "$REGION" \
    --query SecretString \
    --output text 2>/dev/null || true
}

db_url="$(get_secret "${PREFIX}/database-url")"
if [[ -n "$db_url" ]]; then
  printf 'DATABASE_URL=%q\n' "$db_url"
else
  echo "# Missing secret ${PREFIX}/database-url (check prefix and IAM permissions)" >&2
fi

smtp="$(get_secret "${PREFIX}/smtp-pass")"
if [[ -n "$smtp" ]]; then
  printf 'SMTP_PASS=%q\n' "$smtp"
fi
