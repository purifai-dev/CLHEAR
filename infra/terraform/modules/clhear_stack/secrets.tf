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
