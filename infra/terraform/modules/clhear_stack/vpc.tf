# -----------------------------------------------------------------------------
# VPC: create only when vpc_id is not set (shared PurifAI VPC mode uses var.*_subnet_ids).
# -----------------------------------------------------------------------------

resource "aws_vpc" "main" {
  count                = local.create_vpc ? 1 : 0
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = merge(local.tags, { Name = "${var.name_prefix}-vpc" })
}

resource "aws_internet_gateway" "main" {
  count  = local.create_vpc ? 1 : 0
  vpc_id = aws_vpc.main[0].id
  tags   = merge(local.tags, { Name = "${var.name_prefix}-igw" })
}

resource "aws_subnet" "public" {
  count                   = local.create_vpc ? length(local.azs) : 0
  vpc_id                  = aws_vpc.main[0].id
  cidr_block              = cidrsubnet(aws_vpc.main[0].cidr_block, 8, count.index)
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true
  tags                    = merge(local.tags, { Name = "${var.name_prefix}-public-${local.azs[count.index]}" })
}

resource "aws_subnet" "private" {
  count             = local.create_vpc ? length(local.azs) : 0
  vpc_id            = aws_vpc.main[0].id
  cidr_block        = cidrsubnet(aws_vpc.main[0].cidr_block, 8, count.index + 10)
  availability_zone = local.azs[count.index]
  tags              = merge(local.tags, { Name = "${var.name_prefix}-private-${local.azs[count.index]}" })
}

resource "aws_eip" "nat" {
  count  = local.create_vpc ? 1 : 0
  domain = "vpc"
  tags   = merge(local.tags, { Name = "${var.name_prefix}-nat-eip" })
}

resource "aws_nat_gateway" "main" {
  count         = local.create_vpc ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id
  tags          = merge(local.tags, { Name = "${var.name_prefix}-nat" })
}

resource "aws_route_table" "public" {
  count  = local.create_vpc ? 1 : 0
  vpc_id = aws_vpc.main[0].id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main[0].id
  }
  tags = merge(local.tags, { Name = "${var.name_prefix}-public-rt" })
}

resource "aws_route_table" "private" {
  count  = local.create_vpc ? 1 : 0
  vpc_id = aws_vpc.main[0].id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[0].id
  }
  tags = merge(local.tags, { Name = "${var.name_prefix}-private-rt" })
}

resource "aws_route_table_association" "public" {
  count          = local.create_vpc ? length(aws_subnet.public) : 0
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public[0].id
}

resource "aws_route_table_association" "private" {
  count          = local.create_vpc ? length(aws_subnet.private) : 0
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[0].id
}
