resource "random_password" "db" {
  length  = 32
  special = false
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.name_prefix}-db-subnets"
  subnet_ids = local.private_subnet_ids
  tags       = merge(local.tags, { Name = "${var.name_prefix}-db-subnets" })
}

resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.name_prefix}-ecs-"
  vpc_id      = local.vpc_id
  description = "CLHear ECS tasks"
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = merge(local.tags, { Name = "${var.name_prefix}-ecs" })
}

resource "aws_security_group" "rds" {
  name_prefix = "${var.name_prefix}-rds-"
  vpc_id      = local.vpc_id
  description = "CLHear Aurora PostgreSQL"
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = merge(local.tags, { Name = "${var.name_prefix}-rds" })
}

resource "aws_rds_cluster_parameter_group" "main" {
  family = "aurora-postgresql16"
  name   = "${var.name_prefix}-aurora-pg16"
  tags   = merge(local.tags, { Name = "${var.name_prefix}-aurora-pg16" })
}

resource "aws_rds_cluster" "main" {
  cluster_identifier = "${var.name_prefix}-aurora"
  engine             = "aurora-postgresql"
  engine_version     = "16.6"

  database_name   = var.db_name
  master_username = var.db_username
  master_password = random_password.db.result

  db_subnet_group_name            = aws_db_subnet_group.main.name
  vpc_security_group_ids          = [aws_security_group.rds.id]
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.main.name

  storage_encrypted   = true
  deletion_protection = false
  skip_final_snapshot = true

  backup_retention_period      = 7
  preferred_backup_window      = "03:00-04:00"
  preferred_maintenance_window = "sun:04:00-sun:05:00"

  tags = merge(local.tags, { Name = "${var.name_prefix}-aurora" })
}

resource "aws_rds_cluster_instance" "main" {
  identifier         = "${var.name_prefix}-aurora-1"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = var.aurora_instance_class
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  publicly_accessible = false

  tags = merge(local.tags, { Name = "${var.name_prefix}-aurora-1" })
}

resource "aws_security_group_rule" "rds_from_bastion" {
  count                    = trimspace(var.bastion_security_group_id) != "" ? 1 : 0
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = var.bastion_security_group_id
  security_group_id        = aws_security_group.rds.id
}
