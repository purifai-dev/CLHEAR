# `platform-sdk` (PurifAI)

Shared Python utilities for PurifAI products: JWT validation, tenant context, entitlement checks, and database helpers (e.g. setting `app.current_tenant_id` for PostgreSQL RLS).

## Status

**Placeholder** — no package code yet. CLHear currently has no end-user auth; when multi-tenancy and SSO land, implement `purifai_sdk` here and install it from CLHear (and later Complied Influence) Docker builds.

## Intended layout (future)

```
packages/platform-sdk/
  pyproject.toml
  src/
    purifai_sdk/
      __init__.py
      auth.py
      tenancy.py
      entitlements.py
```

## Versioning

Use calendar or semver tags; products pin a version in `requirements.txt` or `pyproject.toml`.
