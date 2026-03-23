output "vpc_id" {
  value       = local.vpc_id
  description = "VPC hosting CLHear (created by module or supplied via var.vpc_id)."
}

output "alb_dns_name" {
  description = "Point clhear.ai (CNAME) here, or use for staging smoke tests."
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  value = aws_lb.main.zone_id
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.api.name
}

output "database_secret_arn" {
  value     = aws_secretsmanager_secret.database_url.arn
  sensitive = true
}

output "admin_http_pass_secret_arn" {
  description = "Secrets Manager plaintext password for /admin HTTP Basic (username is CLHEAR_ADMIN_USER in ECS env, default clhear_admin)."
  value       = aws_secretsmanager_secret.admin_http_pass.arn
}

output "github_deploy_role_arn" {
  description = "Set as GitHub secret CLHEAR_AWS_DEPLOY_ROLE_ARN for CI deploy."
  value       = length(aws_iam_role.github_deploy) > 0 ? aws_iam_role.github_deploy[0].arn : null
}

output "route53_nameservers" {
  description = "Set these as nameservers at your registrar (GoDaddy) to delegate clhear.ai to Route53."
  value       = length(aws_route53_zone.main) > 0 ? aws_route53_zone.main[0].name_servers : []
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN (from dns.tf or passed in). Used by ALB HTTPS listener."
  value       = local.resolved_acm_arn
}
