# -----------------------------------------------------------------------------
# CLHear staging — Aurora, ECR, ECS, ALB (own SGs, DB, secrets).
# Shared PurifAI VPC: set vpc_id + subnet IDs (no second VPC/NAT).
# State: dedicated S3 key under the same bucket/lock table as other stacks.
# -----------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

module "clhear" {
  source = "../../modules/clhear_stack"

  name_prefix        = var.name_prefix
  aws_region         = var.aws_region
  vpc_id             = var.vpc_id
  public_subnet_ids  = var.public_subnet_ids
  private_subnet_ids = var.private_subnet_ids
  vpc_cidr           = var.vpc_cidr
  app_base_url       = var.app_base_url
  allowed_origins    = var.allowed_origins

  rds_instance_class = var.rds_instance_class
  app_cpu            = var.app_cpu
  app_memory_mb      = var.app_memory_mb

  acm_certificate_arn = var.acm_certificate_arn
  alb_idle_timeout    = var.alb_idle_timeout

  domain_name = var.domain_name

  bastion_security_group_id = var.bastion_security_group_id

  smtp_host = var.smtp_host
  smtp_port = var.smtp_port
  smtp_user = var.smtp_user
  smtp_pass = var.smtp_pass
  smtp_from = var.smtp_from

  github_repository = var.github_repository

  anthropic_secret_name = var.anthropic_secret_name

  clhear_run_migrations = var.clhear_run_migrations
  clhear_admin_user     = var.clhear_admin_user
  clhear_admin_pass     = var.clhear_admin_pass

  finra_api_client_id     = var.finra_api_client_id
  finra_api_client_secret = var.finra_api_client_secret

  tags = {
    Environment = var.environment
  }
}

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "vpc_id" {
  value       = module.clhear.vpc_id
  description = "VPC used by CLHear (shared or created)."
}

output "alb_dns_name" {
  value = module.clhear.alb_dns_name
}

output "ecr_repository_url" {
  value = module.clhear.ecr_repository_url
}

output "ecs_cluster_name" {
  value = module.clhear.ecs_cluster_name
}

output "ecs_service_name" {
  value = module.clhear.ecs_service_name
}

output "github_deploy_role_arn" {
  value = module.clhear.github_deploy_role_arn
}

output "route53_nameservers" {
  description = "Update GoDaddy nameservers for clhear.ai to these values."
  value       = module.clhear.route53_nameservers
}

output "acm_certificate_arn" {
  value = module.clhear.acm_certificate_arn
}
