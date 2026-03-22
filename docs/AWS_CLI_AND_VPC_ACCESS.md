# AWS CLI & VPC access (same pattern as Complied Influence)

Cursor and CI **do not keep a live connection** to your AWS account between sessions. Anything that looked like “the agent connected to my VPC” was **your terminal** using **your** AWS credentials and network path.

This doc matches the workflow used elsewhere in PurifAI: **AWS CLI identity** + **a network path into the VPC** when RDS (or other resources) are private.

## 1. Prerequisites

- **AWS CLI v2** — [Install](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **Session Manager plugin** (for SSM port forwarding) — [Install](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)

## 2. Sign in (pick one)

### AWS SSO (common for orgs)

```bash
aws configure sso
# then, when the session expires:
aws sso login --profile your-profile-name
export AWS_PROFILE=your-profile-name
```

### Access keys (less ideal)

```bash
aws configure
```

## 3. Verify identity (required before any other command)

Use the **same terminal** Cursor uses for project commands.

```bash
./scripts/aws-verify-identity.sh
# or:
aws sts get-caller-identity
```

Confirm **Account** and **Region** (`AWS_REGION` or `AWS_DEFAULT_REGION`, often `us-east-1`) match the account where CLHear (or the shared VPC) lives.

## 4. Why `get-secret-value` is not enough

Secrets Manager returns the **RDS URL and password**, but your laptop still needs a **route to the private IP** of RDS. For private subnets you typically use one of:

| Path | When to use |
|------|-------------|
| **SSM port forwarding** via an EC2 instance in the VPC with SSM agent | Bastion/jump box already exists (e.g. Complied Influence stack) |
| **VPN / Tailscale** into the VPC | Your org provides it |
| **Temporary SG rule** | Short maintenance window only; tighten again after |

## 5. SSM port forwarding (template)

1. Find an instance that is **Managed** in Systems Manager and sits in the **same VPC** as RDS (or can route to it):

```bash
aws ssm describe-instance-information --query "InstanceInformationList[?PingStatus=='Online'].[InstanceId,ComputerName]" --output table
```

Or locate by tag/name:

```bash
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" "Name=tag:Name,Values=*bastion*" \
  --query 'Reservations[].Instances[].[InstanceId,Tags[?Key==`Name`].Value|[0]]' \
  --output table
```

2. Get the RDS endpoint from Terraform output or Secrets Manager (host part only is fine).

3. Start forwarding (example: local `15432` → RDS `5432`):

```bash
export BASTION_INSTANCE_ID=i-0123456789abcdef0
export RDS_ENDPOINT=your-db.xxxx.us-east-1.rds.amazonaws.com
export LOCAL_PORT=15432

aws ssm start-session \
  --target "$BASTION_INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters "{\"host\":[\"$RDS_ENDPOINT\"],\"portNumber\":[\"5432\"],\"localPortNumber\":[\"$LOCAL_PORT\"]}"
```

Leave that session running. In another terminal, point tools at `localhost:$LOCAL_PORT` (and the DB user/password from the secret).

**Security group note:** the bastion (or its security group) must be allowed **outbound** to RDS on **5432**, and the **RDS security group** must allow **inbound 5432** from the bastion’s security group (or a self-referencing rule on a shared SG—see your platform Terraform). If SSM logs show “connection to destination port failed,” this path is usually blocked by SG rules.

## 6. CLHear secrets → local env snippet

After RDS is reachable (tunnel up, or public maintenance rule), you can pull the Terraform-managed secret into a **local snippet file** (do not commit):

```bash
export AWS_SECRET_PREFIX=clhear-staging   # must match Terraform name_prefix
./scripts/export-clhear-secrets-snippet.sh > tmp/clhear-secrets.snippet
```

Merge lines into `backend/.env` as needed. **Do not paste** `DATABASE_URL` or passwords into chat.

## 7. Optional: dump / restore (advanced)

If you install `pg_dump` (e.g. `brew install libpq`) and use a **PostgreSQL client major version compatible with RDS**, you can dump through the tunnel:

```bash
export PGPASSWORD='...'   # from secret, locally only
pg_dump -h 127.0.0.1 -p 15432 -U your_db_user -d your_db -Fc -f tmp/clhear-from-aws.dump
```

Restore targets depend on your local Docker Postgres version; see PostgreSQL docs for `pg_restore` compatibility.

## Related

- Deploy & networking overview: `docs/AWS_DEPLOY.md`
- Terraform outputs: `cd infra/terraform/environments/clhear-staging && terraform output`
