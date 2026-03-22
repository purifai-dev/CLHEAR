# Shared backend with Complied Influence — unique key so state never collides.
# Requires IAM: s3:GetObject/PutObject/List on this prefix + dynamodb lock.

terraform {
  backend "s3" {
    bucket         = "complied-influence-tfstate-392932797125"
    key            = "clhear/staging/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "complied-influence-tf-lock"
  }
}
