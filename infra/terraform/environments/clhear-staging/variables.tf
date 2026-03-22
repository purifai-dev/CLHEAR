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
  type    = string
  default = "10.42.0.0/16"
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
