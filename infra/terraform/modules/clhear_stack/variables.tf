variable "name_prefix" {
  description = "Resource name prefix, e.g. clhear-staging (must be unique in the account)."
  type        = string
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "vpc_id" {
  description = <<-EOT
    Existing PurifAI / platform VPC ID (e.g. Complied Influence). When set, CLHear does not create a VPC, NAT, IGW, or subnets.
    Set public_subnet_ids and private_subnet_ids (ALB requires ≥2 public subnets in different AZs).
  EOT
  type        = string
  default     = ""
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for the ALB (required when vpc_id is set)."
  type        = list(string)
  default     = []
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS and RDS subnet group (required when vpc_id is set)."
  type        = list(string)
  default     = []
}

variable "vpc_cidr" {
  description = "CIDR for a new VPC only (ignored when vpc_id is set)."
  type        = string
  default     = "10.42.0.0/16"
}

variable "db_name" {
  type    = string
  default = "clhear"
}

variable "db_username" {
  type    = string
  default = "clhear_user"
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

variable "app_base_url" {
  description = "Public URL for links and CORS (e.g. https://clhear.ai)."
  type        = string
  default     = "https://clhear.ai"
}

variable "allowed_origins" {
  description = "Comma-separated origins for FastAPI CORS (must include app_base_url and any dev origins)."
  type        = string
  default     = "https://clhear.ai,https://www.clhear.ai,http://localhost:8000"
}

variable "acm_certificate_arn" {
  description = "If set, ALB listens on HTTPS (443) and redirects HTTP to HTTPS. Leave empty for HTTP-only (staging)."
  type        = string
  default     = ""
}

variable "alb_idle_timeout" {
  description = "ALB idle timeout in seconds (long scrapes / news fetches)."
  type        = number
  default     = 300
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
  description = "GitHub repo allowed to assume the deploy role (e.g. owner/clhear-platform). Empty skips deploy role."
  type        = string
  default     = ""
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Extra tags for all resources."
}

variable "aurora_instance_class" {
  description = "Aurora PostgreSQL instance class. db.t4g.medium is the minimum for Aurora burstable."
  type        = string
  default     = "db.t4g.medium"
}

variable "domain_name" {
  description = "Domain for Route53 zone + ACM cert (e.g. clhear.ai). Empty skips DNS/cert creation."
  type        = string
  default     = ""
}

variable "bastion_security_group_id" {
  description = "SG of the SSM bastion for DB access (port-forwarding). Empty skips the rule."
  type        = string
  default     = ""
}
