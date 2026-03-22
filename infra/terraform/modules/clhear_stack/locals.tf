locals {
  azs = ["${var.aws_region}a", "${var.aws_region}b"]

  create_vpc = trimspace(var.vpc_id) == ""

  vpc_id = length(aws_vpc.main) > 0 ? aws_vpc.main[0].id : var.vpc_id

  public_subnet_ids = length(aws_subnet.public) > 0 ? aws_subnet.public[*].id : var.public_subnet_ids

  private_subnet_ids = length(aws_subnet.private) > 0 ? aws_subnet.private[*].id : var.private_subnet_ids

  tags = merge(
    {
      Project   = "clhear"
      PurifAI   = "true"
      Name      = var.name_prefix
      Terraform = "true"
    },
    var.tags
  )

  use_https = local.create_dns || var.acm_certificate_arn != ""

  resolved_acm_arn = (
    length(aws_acm_certificate_validation.main) > 0
    ? aws_acm_certificate_validation.main[0].certificate_arn
    : var.acm_certificate_arn
  )
}
