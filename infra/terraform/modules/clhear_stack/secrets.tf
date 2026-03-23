resource "aws_secretsmanager_secret" "database_url" {
  name                    = "${var.name_prefix}/database-url"
  recovery_window_in_days = 0
  tags                    = merge(local.tags, { Name = "${var.name_prefix}-db-secret" })
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id = aws_secretsmanager_secret.database_url.id
  secret_string = format(
    "postgresql://%s:%s@%s:%s/%s",
    var.db_username,
    urlencode(random_password.db.result),
    aws_rds_cluster.main.endpoint,
    aws_rds_cluster.main.port,
    var.db_name
  )

  depends_on = [aws_rds_cluster.main]
}

resource "aws_secretsmanager_secret" "smtp_pass" {
  count                   = trimspace(var.smtp_pass) != "" ? 1 : 0
  name                    = "${var.name_prefix}/smtp-pass"
  recovery_window_in_days = 0
  tags                    = merge(local.tags, { Name = "${var.name_prefix}-smtp-secret" })
}

resource "aws_secretsmanager_secret_version" "smtp_pass" {
  count         = length(aws_secretsmanager_secret.smtp_pass)
  secret_id     = aws_secretsmanager_secret.smtp_pass[0].id
  secret_string = var.smtp_pass
}

# HTTP Basic password for /admin — plaintext secret (no "/" in name: ECS valueFrom + JSON keys breaks on path-style names).
resource "random_password" "admin" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "admin_http_pass" {
  name                    = "${var.name_prefix}-admin-http-pass"
  recovery_window_in_days = 0
  tags                    = merge(local.tags, { Name = "${var.name_prefix}-admin-http-pass" })
}

resource "aws_secretsmanager_secret_version" "admin_http_pass" {
  secret_id     = aws_secretsmanager_secret.admin_http_pass.id
  secret_string = trimspace(var.clhear_admin_pass) != "" ? var.clhear_admin_pass : random_password.admin.result
}
