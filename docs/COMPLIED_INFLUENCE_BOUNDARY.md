# Complied Influence — non-breaking boundary

Complied Influence is **already in production** on AWS (ECS, Aurora/RDS, Terraform, GitHub Actions). Work in **this** repo must not disrupt it.

## Do not (without a dedicated plan + PR in the CI repo)

- Change the **complied-influence** GitHub repository’s `main` branch deploy workflow or Terraform in passing.
- Share or rotate **CI** Secrets Manager secrets, IAM roles, or ECR repositories from this repo’s automation.
- Reuse the **same** Terraform state bucket/key as Complied Influence for CLHear resources (risk of state corruption).
- Point CLHear Terraform **data sources** at CI VPC/RDS **until** an explicit network integration design is approved.

## Safe to do here

- Add **CLHear-prefixed** resources only (`clhear-*`, separate state file, separate S3 backend key).
- Document cross-product contracts (APIs, `obligation_mappings` shape) without implementing CI-side consumers yet.
- Add optional **read-only** integration later (e.g. CI calling CLHear API with a service token) as a separate project phase.

## When we integrate

- Own **RFC** + ADR: tenancy, JWT issuer, and which service owns `tenant_id`.
- CI repo changes in **their** repo with review; coordinated release windows.
- Prefer **API + events** over shared DB access across products until platform schema is unified.
