variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "staging"
}

variable "name_prefix" {
  description = "Prefix for AWS resources (ECR repo name, cluster, etc.). Example: clhear-staging"
  type        = string
  default     = "clhear-staging"
}

variable "vpc_cidr" {
  description = "Only when creating a dedicated VPC (leave vpc_id empty)."
  type        = string
  default     = "10.42.0.0/16"
}

variable "vpc_id" {
  description = "Shared PurifAI VPC ID (e.g. Complied Influence). Requires public_subnet_ids and private_subnet_ids (≥2 each)."
  type        = string
  default     = ""
}

variable "public_subnet_ids" {
  type    = list(string)
  default = []
}

variable "private_subnet_ids" {
  type    = list(string)
  default = []
}

variable "app_base_url" {
  type    = string
  default = "https://clhear.ai"
}

variable "allowed_origins" {
  description = "Extra comma-separated CORS origins (ALB URL is added automatically by Terraform)."
  type        = string
  default     = "https://clhear.ai,https://www.clhear.ai,http://localhost:8000"
}

variable "rds_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "app_cpu" {
  type    = number
  default = 512
}

variable "app_memory_mb" {
  type    = number
  default = 1024
}

variable "acm_certificate_arn" {
  description = "ACM cert in the same region as the ALB for HTTPS. Leave empty for HTTP-only."
  type        = string
  default     = ""
}

variable "alb_idle_timeout" {
  type    = number
  default = 300
}

variable "smtp_host" {
  type    = string
  default = ""
}

variable "smtp_port" {
  type    = string
  default = "587"
}

variable "smtp_user" {
  type    = string
  default = ""
}

variable "smtp_pass" {
  type      = string
  sensitive = true
  default   = ""
}

variable "smtp_from" {
  type    = string
  default = "alerts@clhear.ai"
}

variable "github_repository" {
  description = "owner/repo for GitHub OIDC deploy role (e.g. fathercandle/clhear-platform). Empty skips role."
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain for Route53 + ACM (e.g. clhear.ai). Empty skips DNS/cert."
  type        = string
  default     = ""
}

variable "bastion_security_group_id" {
  description = "SG of the SSM bastion for DB port-forwarding."
  type        = string
  default     = ""
}

variable "anthropic_secret_name" {
  description = "Secrets Manager secret name for Claude API key (injected as ANTHROPIC_API_KEY). Empty skips."
  type        = string
  default     = ""
}

variable "clhear_run_migrations" {
  type    = string
  default = "true"
}

variable "clhear_admin_user" {
  type      = string
  default   = ""
  sensitive = true
}

variable "clhear_admin_pass" {
  type      = string
  default   = ""
  sensitive = true
}
