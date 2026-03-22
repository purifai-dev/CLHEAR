# Custom validation (Terraform 1.5+ check/assert)
check "existing_vpc_requires_subnets" {
  assert {
    condition = trimspace(var.vpc_id) == "" || (
      length(var.public_subnet_ids) >= 2 &&
      length(var.private_subnet_ids) >= 2
    )
    error_message = "When vpc_id is set, provide at least two public and two private subnet IDs (ALB requires two AZs)."
  }
}

check "subnets_only_with_vpc_id" {
  assert {
    condition = (
      (length(var.public_subnet_ids) == 0 && length(var.private_subnet_ids) == 0) ||
      trimspace(var.vpc_id) != ""
    )
    error_message = "public_subnet_ids / private_subnet_ids are only valid together with vpc_id."
  }
}
