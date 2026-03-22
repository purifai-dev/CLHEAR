# CLHear → PurifAI AWS migration roadmap

## Phase 0 — Complete ✅ (this PR)

- [x] Architecture docs and Complied Influence safety boundary.
- [x] Logical monorepo folders: `products/clhear`, `packages/platform-sdk`, `infra/terraform`.
- [x] Terraform **bootstrap** for CLHear (separate state; validate-only / minimal apply).

## Phase 1 — CLHear on AWS ✅ (implemented)

- Terraform module `infra/terraform/modules/clhear_stack` + environment `environments/clhear-staging`.
- VPC `10.42.0.0/16` (default), RDS PostgreSQL 16, ECR, ECS Fargate, ALB, Secrets Manager.
- Optional GitHub OIDC deploy role (reuses account-wide GitHub OIDC provider).
- **Runbook:** `docs/AWS_DEPLOY.md`
- **CI:** `.github/workflows/deploy-clhear-ecs.yml` (enable with variable `CLHEAR_DEPLOY_ENABLED=true` + secret `CLHEAR_AWS_DEPLOY_ROLE_ARN`).

## Phase 2 — Physical monorepo layout

- Move `backend/` → `products/clhear/backend/`, `frontend/` → `products/clhear/frontend/`.
- Update `Dockerfile`, `docker-compose*.yml`, `deploy.sh`, `.dockerignore`.
- Single commit; run full smoke test (Compose + AWS staging).

## Phase 3 — Platform (auth + tenants)

- Deploy `platform` API (new service) or embed minimal auth in CLHear first (product decision).
- Add `tenant_id` + RLS to CLHear schema; migrate from single-tenant behavior.
- Publish `packages/platform-sdk` to internal PyPI or install via path in Docker.

## Phase 4 — Complied Influence convergence (optional)

- **Option A**: Git subtree / monorepo import of `complied-influence` with unchanged deploy until unified.
- **Option B**: Keep separate repo; shared `platform-sdk` as versioned package consumed by both.
- Implement `obligation_mappings` and CI webhooks only after Phase 3 is stable.

## Checklist before any CI repo change

- [ ] CLHear staging URL healthy for 1+ week.
- [ ] Separate AWS account or clear resource tagging + IAM scoping documented.
- [ ] RFC approved for shared identity and data linking.
