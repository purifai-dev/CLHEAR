# CLHear (PurifAI product)

**Regulatory obligations** analyzer and management — the base PurifAI product.

## Where the code lives today

Application code currently lives at the **repository root** for stable Docker and VPS deploy:

- `backend/` — FastAPI app
- `frontend/` — React + htm SPA (`index.html`)

This folder (`products/clhear/`) is the **logical** product boundary in the PurifAI monorepo. A future PR will **move** `backend/` and `frontend/` here and update `Dockerfile` / Compose paths (see `docs/MIGRATION_ROADMAP.md` Phase 2).

## Domain

- Production: **https://clhear.ai**

## Related docs

- `docs/ARCHITECTURE.md` — platform vision
- `docs/COMPLIED_INFLUENCE_BOUNDARY.md` — do not break Complied Influence
