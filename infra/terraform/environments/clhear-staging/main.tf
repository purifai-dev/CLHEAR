# -----------------------------------------------------------------------------
# CLHear staging — full stack (VPC, RDS, ECR, ECS, ALB).
# Isolated from Complied Influence: separate VPC CIDR, state key, IAM roles.
# -----------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

module "clhear" {
  source = "../../modules/clhear_stack"

  name_prefix     = var.name_prefix
  aws_region      = var.aws_region
  vpc_cidr        = var.vpc_cidr
  app_base_url    = var.app_base_url
  allowed_origins = var.allowed_origins

  rds_instance_class = var.rds_instance_class
  app_cpu            = var.app_cpu
  app_memory_mb      = var.app_memory_mb

  acm_certificate_arn = var.acm_certificate_arn
  alb_idle_timeout    = var.alb_idle_timeout

  smtp_host = var.smtp_host
  smtp_port = var.smtp_port
  smtp_user = var.smtp_user
  smtp_pass = var.smtp_pass
  smtp_from = var.smtp_from

  github_repository = var.github_repository

  tags = {
    Environment = var.environment
  }
}

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
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
