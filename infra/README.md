# PurifAI infrastructure (CLHear)

Terraform and related automation for **CLHear only**. Complied Influence infrastructure stays in **its own repository**; do not mix state files.

## Layout

```
infra/terraform/environments/clhear-staging/   # first environment to wire up
```

## Prerequisites

- AWS CLI configured (`aws sts get-caller-identity`).
- S3 bucket + DynamoDB table for Terraform backend (create manually or add a tiny bootstrap — **never** reuse Complied Influence’s state bucket without a **separate key prefix** and team agreement).

## Quick start

```bash
cd infra/terraform/environments/clhear-staging
cp backend.tf.example backend.tf   # edit bucket, key, region, dynamodb_table
terraform init
terraform plan
```

Full stack is in this environment; see **`../docs/AWS_DEPLOY.md`** for apply, image push, and DB init.

## Naming

Prefix all resources **`clhear-`** (or `purifai-clhear-`) to avoid collisions in a shared AWS account with Complied Influence.
