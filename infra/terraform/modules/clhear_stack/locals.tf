locals {
  azs = ["${var.aws_region}a", "${var.aws_region}b"]
  tags = merge(
    {
      Project   = "clhear"
      PurifAI   = "true"
      Name      = var.name_prefix
      Terraform = "true"
    },
    var.tags
  )
  use_https = var.acm_certificate_arn != ""
}
