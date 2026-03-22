locals {
  create_dns = trimspace(var.domain_name) != ""
}

resource "aws_route53_zone" "main" {
  count = local.create_dns ? 1 : 0
  name  = var.domain_name
  tags  = merge(local.tags, { Name = "${var.name_prefix}-zone" })
}

resource "aws_acm_certificate" "main" {
  count             = local.create_dns ? 1 : 0
  domain_name       = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method = "DNS"
  tags              = merge(local.tags, { Name = "${var.name_prefix}-cert" })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "acm_validation" {
  for_each = local.create_dns ? {
    for dvo in aws_acm_certificate.main[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  zone_id         = aws_route53_zone.main[0].zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 60
  records         = [each.value.record]
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "main" {
  count                   = local.create_dns ? 1 : 0
  certificate_arn         = aws_acm_certificate.main[0].arn
  validation_record_fqdns = [for r in aws_route53_record.acm_validation : r.fqdn]
}

resource "aws_route53_record" "apex" {
  count   = local.create_dns ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "www" {
  count   = local.create_dns ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}
