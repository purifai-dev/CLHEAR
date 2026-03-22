output "vpc_id" {
  value = aws_vpc.main.id
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

output "github_deploy_role_arn" {
  description = "Set as GitHub secret CLHEAR_AWS_DEPLOY_ROLE_ARN for CI deploy."
  value       = length(aws_iam_role.github_deploy) > 0 ? aws_iam_role.github_deploy[0].arn : null
}
