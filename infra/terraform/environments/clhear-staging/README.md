# CLHear staging — Terraform

1. Copy `backend.tf.example` → `backend.tf` and set bucket/key/DynamoDB (**CLHear-dedicated state key**, not Complied Influence’s).
2. Copy `terraform.tfvars.example` → `terraform.tfvars` and set `github_repository` if you want the GitHub deploy role.
3. `terraform init && terraform apply`

See **`../../../docs/AWS_DEPLOY.md`** for image push, DB init, DNS, and GitHub Actions.

**Complied Influence:** do not share Terraform state or import their resources without an RFC.
