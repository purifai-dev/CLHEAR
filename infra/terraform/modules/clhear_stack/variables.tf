variable "name_prefix" {
  description = "Resource name prefix, e.g. clhear-staging (must be unique in the account)."
  type        = string
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "vpc_cidr" {
  description = "Dedicated VPC CIDR for CLHear (avoid 10.0.0.0/16 if Complied Influence uses it in the same account)."
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
