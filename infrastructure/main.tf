provider "aws" {
  region = "ap-southeast-1"
}

# Provider for us-east-1 (for ACM certificate, required for CloudFront)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}