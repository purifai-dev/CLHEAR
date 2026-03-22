# PurifAI platform architecture (CLHear + future products)

This repository is the **PurifAI** monorepo home for **CLHear** (regulatory obligations) and, over time, shared platform code. **Complied Influence** remains in its own Git repository and AWS stack until we deliberately integrate it.

## Product & domain map (current)

| Product             | Public domain              | Repo / deploy                          |
|---------------------|----------------------------|----------------------------------------|
| CLHear              | `clhear.ai`                | This repo (`clhear-platform`)          |
| Complied Influence  | `complied-influence.app`   | Separate repo — **do not break**       |

Future: shared SSO and deep links between products; domains stay customer-facing as above.

## Target technical shape (north star)

- **Platform**: auth, tenants, subscriptions/entitlements, audit primitives (shared across products).
- **Products**: CLHear, Complied Influence, future modules — each with its own API surface and optional workers.
- **Data**: one Aurora cluster is viable long-term with **schema-per-product** and **row-level tenancy** (`tenant_id` + RLS). Cross-product links (e.g. obligation → control in CI) live in explicit mapping tables.
- **Runtime**: ECS Fargate per service, shared ALB with path/host rules, Secrets Manager, Terraform modules.

See `docs/COMPLIED_INFLUENCE_BOUNDARY.md` for safety rules while CI stays independent.

## Repository layout (phased)

**Phase 1 (now)** — logical layout without moving application code:

- `backend/`, `frontend/` — CLHear app (unchanged paths for Docker Compose & deploy).
- `products/clhear/` — docs + pointers to root paths; physical move comes in a dedicated migration PR.
- `packages/platform-sdk/` — placeholder for shared Python utilities (auth, tenancy) when CLHear gains multi-tenant APIs.
- `infra/terraform/` — CLHear-only AWS resources; **no references** to Complied Influence Terraform state or resources.

**Phase 2** — move `backend/` + `frontend/` under `products/clhear/` and update Dockerfile, CI, and docs in one atomic change.

## Migration order

1. CLHear: Terraform + ECS + Aurora (or RDS) in AWS, CI deploy — **isolated** naming (`clhear-*`).
2. Platform service + `platform-sdk` when auth/tenancy is required.
3. Complied Influence: optional monorepo merge or Git submodule / shared packages — **only** after CLHear AWS path is stable and documented.

Details: `docs/MIGRATION_ROADMAP.md`.
