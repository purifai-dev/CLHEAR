# PurifAI — CLHear platform

**CLHear** is the regulatory obligations analyzer and management product under the **PurifAI** umbrella.

- **Production site:** [clhear.ai](https://clhear.ai)  
- **Sister product (separate repo & AWS):** Complied Influence → [complied-influence.app](https://complied-influence.app)

## Repo layout

| Path | Purpose |
|------|---------|
| `backend/` | FastAPI API + services |
| `frontend/` | React + htm SPA (no bundler) |
| `nginx/`, `Dockerfile`, `docker-compose*.yml` | Current production-style deploy |
| `products/clhear/` | Logical product home (code still at root until Phase 2 move) |
| `packages/platform-sdk/` | Future shared auth/tenancy Python package |
| `infra/terraform/` | **CLHear-only** AWS Terraform (isolated from Complied Influence) |
| `docs/` | Architecture, boundaries, migration roadmap |

## Docs

- [Architecture & north star](docs/ARCHITECTURE.md)
- [Complied Influence — do not break](docs/COMPLIED_INFLUENCE_BOUNDARY.md)
- [Migration roadmap](docs/MIGRATION_ROADMAP.md)

## Local dev

See `setup.sh` and `docker-compose.yml`. Backend expects PostgreSQL and `DATABASE_URL` / `backend/.env`.

## AWS (staging)

```bash
cd infra/terraform/environments/clhear-staging
cp backend.tf.example backend.tf   # edit remote state
terraform init && terraform apply
```

Details: **[docs/AWS_DEPLOY.md](docs/AWS_DEPLOY.md)** (RDS, ECR, ECS, ALB, optional GitHub deploy).
