#!/usr/bin/env bash
# Start SSM port forwarding: localhost -> RDS:5432 via a managed EC2 instance in the VPC.
# Requires: AWS CLI + Session Manager plugin; instance must be Online in SSM.
set -euo pipefail

: "${BASTION_INSTANCE_ID:?Set BASTION_INSTANCE_ID (e.g. i-0abc...)}"
: "${RDS_ENDPOINT:?Set RDS_ENDPOINT (RDS hostname, no jdbc: prefix)}"

LOCAL_PORT="${LOCAL_PORT:-15432}"
REMOTE_PORT="${REMOTE_PORT:-5432}"

exec aws ssm start-session \
  --target "$BASTION_INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters "{\"host\":[\"$RDS_ENDPOINT\"],\"portNumber\":[\"$REMOTE_PORT\"],\"localPortNumber\":[\"$LOCAL_PORT\"]}"
