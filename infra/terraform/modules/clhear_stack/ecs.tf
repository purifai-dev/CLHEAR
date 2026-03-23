# Pre-existing secret (e.g. created in console) — lookup by friendly name
data "aws_secretsmanager_secret" "anthropic" {
  count = trimspace(var.anthropic_secret_name) != "" ? 1 : 0
  name  = trimspace(var.anthropic_secret_name)
}

resource "aws_ecs_cluster" "main" {
  name = var.name_prefix
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  tags = merge(local.tags, { Name = "${var.name_prefix}-cluster" })
}

locals {
  origins_for_cors = join(",", distinct(compact(concat(
    [var.app_base_url],
    split(",", replace(var.allowed_origins, " ", "")),
    ["http://${aws_lb.main.dns_name}"],
    local.use_https ? ["https://${aws_lb.main.dns_name}"] : []
  ))))

  container_secrets = concat(
    [{ name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.database_url.arn }],
    [
      { name = "CLHEAR_ADMIN_PASS", valueFrom = aws_secretsmanager_secret.admin_http_pass.arn },
    ],
    length(aws_secretsmanager_secret.smtp_pass) > 0 ? [
      { name = "SMTP_PASS", valueFrom = aws_secretsmanager_secret.smtp_pass[0].arn }
    ] : [],
    length(data.aws_secretsmanager_secret.finra_api) > 0 ? [
      { name = "FINRA_API_CLIENT_SECRET", valueFrom = data.aws_secretsmanager_secret.finra_api[0].arn }
    ] : [],
    length(data.aws_secretsmanager_secret.anthropic) > 0 ? [
      { name = "ANTHROPIC_API_KEY", valueFrom = data.aws_secretsmanager_secret.anthropic[0].arn }
    ] : []
  )

  container_environment = concat(
    [
      { name = "APP_BASE_URL", value = var.app_base_url },
      { name = "ALLOWED_ORIGINS_CORS", value = local.origins_for_cors },
      { name = "SMTP_HOST", value = var.smtp_host },
      { name = "SMTP_PORT", value = var.smtp_port },
      { name = "SMTP_USER", value = var.smtp_user },
      { name = "SMTP_FROM", value = var.smtp_from },
      { name = "CLHEAR_RUN_MIGRATIONS", value = var.clhear_run_migrations },
      {
        name  = "CLHEAR_ADMIN_USER"
        value = trimspace(var.clhear_admin_user) != "" ? var.clhear_admin_user : "clhear_admin"
      },
      { name = "FINRA_API_CLIENT_ID", value = var.finra_api_client_id },
    ],
    length(aws_secretsmanager_secret.smtp_pass) > 0 ? [] : [{ name = "SMTP_PASS", value = "" }]
  )
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${var.name_prefix}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.app_cpu
  memory                   = var.app_memory_mb
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "api"
    image     = "${aws_ecr_repository.app.repository_url}:latest"
    essential = true
    command = [
      "gunicorn", "api.main:app",
      "-w", "2",
      "-k", "uvicorn.workers.UvicornWorker",
      "--bind", "0.0.0.0:8000",
      "--access-logfile", "-",
      "--error-logfile", "-"
    ]
    workingDirectory = "/app/backend"
    portMappings     = [{ containerPort = 8000, protocol = "tcp" }]
    environment      = local.container_environment
    secrets          = local.container_secrets
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.app.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "api"
      }
    }
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 90
    }
  }])

  tags = merge(local.tags, { Name = "${var.name_prefix}-task-api" })
}

resource "aws_ecs_service" "api" {
  name            = "${var.name_prefix}-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = local.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 8000
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  tags = merge(local.tags, { Name = "${var.name_prefix}-svc-api" })
}
