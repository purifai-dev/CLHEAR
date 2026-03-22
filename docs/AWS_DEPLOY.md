# Deploy CLHear on AWS (Terraform + ECS)

This stack is **only for CLHear**. It does not modify Complied Influence.

## What gets created

- VPC `10.42.0.0/16` (default), public + private subnets, single NAT
- RDS PostgreSQL 16 (`db.t4g.micro` by default)
- ECR repository named `{name_prefix}` (default `clhear-staging`)
- ECS Fargate cluster + one API service behind an ALB
- Secrets Manager: database URL (SMTP password optional)
- Optional IAM role for GitHub Actions OIDC (push to ECR + `ecs:UpdateService`)

## Prerequisites

1. AWS CLI and Terraform ≥ 1.5
2. S3 + DynamoDB backend for Terraform state (see `backend.tf.example`)
3. **GitHub OIDC provider** in the account (often already present if Complied Influence was set up).  
   If `terraform apply` errors on `aws_iam_openid_connect_provider`, create the provider once per AWS account ([GitHub docs](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)).

## Apply

```bash
cd infra/terraform/environments/clhear-staging
cp backend.tf.example backend.tf   # edit bucket + key + lock table
terraform init
terraform plan
terraform apply
```

Set `github_repository = "owner/clhear-platform"` in `terraform.tfvars` if you want the deploy role. After apply:

```bash
terraform output github_deploy_role_arn
```

Add that ARN as GitHub repository secret **`CLHEAR_AWS_DEPLOY_ROLE_ARN`**.

## First container image

ECR starts empty. After `apply`, build and push **before** the service can stay healthy:

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1
REPO=clhear-staging   # same as name_prefix

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker build -t $REPO:latest -f Dockerfile ../../..
docker tag $REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO:latest

aws ecs update-service --cluster $REPO --service ${REPO}-api --force-new-deployment --region $REGION
```

Or push to `main` after configuring the GitHub workflow (see below).

## Database schema

RDS is empty. Initialize once (from a machine that can reach the DB — e.g. VPN/bastion, or temporarily allow your IP on the RDS security group **only for maintenance**):

```bash
# Get connection string
aws secretsmanager get-secret-value --secret-id clhear-staging/database-url --query SecretString --output text

export DATABASE_URL='postgresql://...'
cd backend && python database/init_schema.py
```

Adjust the command to match how you invoke `init_schema.py` in this repo.

## DNS

- **Staging / smoke test:** open `http://$(terraform output -raw alb_dns_name)/`
- **Production:** create ACM certificate in **us-east-1** for `clhear.ai`, set `acm_certificate_arn` in tfvars, `terraform apply`, then CNAME `clhear.ai` → ALB DNS name.

## HTTPS and CORS

`ALLOWED_ORIGINS_CORS` is set automatically to include the ALB DNS name plus values from `allowed_origins`. Ensure `app_base_url` matches your public URL.

## GitHub Actions

Workflow **`.github/workflows/deploy-clhear-ecs.yml`** builds the root `Dockerfile`, pushes `:latest` to ECR, and forces a new ECS deployment.

1. Repository secret: **`CLHEAR_AWS_DEPLOY_ROLE_ARN`** (from `terraform output github_deploy_role_arn`).
2. Repository variable: **`CLHEAR_DEPLOY_ENABLED`** = `true` (workflows are skipped until this is set, so pushes to `main` do not fail before AWS exists).

Optional variables (repository **Settings → Secrets and variables → Actions → Variables**):

| Variable | Default |
|----------|---------|
| `CLHEAR_AWS_REGION` | `us-east-1` |
| `CLHEAR_ECR_REPOSITORY` | `clhear-staging` |
| `CLHEAR_ECS_CLUSTER` | `clhear-staging` |
| `CLHEAR_ECS_SERVICE` | `clhear-staging-api` |
