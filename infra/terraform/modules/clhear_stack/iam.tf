resource "aws_iam_role" "ecs_execution" {
  name = "${var.name_prefix}-ecs-execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

locals {
  execution_secret_arns = compact(concat(
    [aws_secretsmanager_secret.database_url.arn],
    [aws_secretsmanager_secret.admin_http_pass.arn],
    [for s in aws_secretsmanager_secret.smtp_pass : s.arn],
    data.aws_secretsmanager_secret.anthropic[*].arn
  ))
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name = "${var.name_prefix}-ecs-exec-secrets"
  role = aws_iam_role.ecs_execution.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "secretsmanager:GetSecretValue"
        Resource = local.execution_secret_arns
      },
      {
        Effect   = "Allow"
        Action   = "ecr:GetAuthorizationToken"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = aws_ecr_repository.app.arn
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.name_prefix}-ecs-task"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
  tags = local.tags
}

# Minimal task role — extend when CLHear needs S3 / other AWS APIs
resource "aws_iam_role_policy" "ecs_task_minimal" {
  name = "${var.name_prefix}-ecs-task-minimal"
  role = aws_iam_role.ecs_task.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["logs:CreateLogStream", "logs:PutLogEvents"]
      Resource = "*"
    }]
  })
}

data "aws_iam_policy_document" "github_deploy" {
  count = trimspace(var.github_repository) != "" ? 1 : 0

  statement {
    sid    = "ECRAuth"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "ECRPush"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload"
    ]
    resources = [aws_ecr_repository.app.arn]
  }

  statement {
    sid    = "ECSDeploy"
    effect = "Allow"
    actions = [
      "ecs:DescribeServices",
      "ecs:DescribeTaskDefinition",
      "ecs:DescribeTasks",
      "ecs:UpdateService"
    ]
    resources = ["*"]
  }
}

# Reuse the account-wide GitHub OIDC provider (often created by Complied Influence or other repos).
# If this fails, create once: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
data "aws_iam_openid_connect_provider" "github" {
  count = trimspace(var.github_repository) != "" ? 1 : 0
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "github_deploy" {
  count = trimspace(var.github_repository) != "" ? 1 : 0
  name  = "${var.name_prefix}-github-deploy"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRoleWithWebIdentity"
      Principal = {
        Federated = data.aws_iam_openid_connect_provider.github[0].arn
      }
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_repository}:*"
        }
      }
    }]
  })
  tags = local.tags
}

resource "aws_iam_role_policy" "github_deploy" {
  count  = trimspace(var.github_repository) != "" ? 1 : 0
  name   = "${var.name_prefix}-github-deploy"
  role   = aws_iam_role.github_deploy[0].id
  policy = data.aws_iam_policy_document.github_deploy[0].json
}
