#!/usr/bin/env bash
# Verify AWS CLI credentials (same first step as other PurifAI repos).
set -euo pipefail

echo "AWS_PROFILE=${AWS_PROFILE:-<not set>}"
echo "AWS_REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-<not set>}}"
echo
echo "Caller identity:"
aws sts get-caller-identity
