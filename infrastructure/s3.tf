# S3 Bucket for Static Website Hosting
resource "aws_s3_bucket" "starfable_bucket" {
  bucket = "starfableio-bucket"

  tags = {
    Name        = "Starfable S3 Website"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.starfable_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }

  #   routing_rule {
  #     condition {
  #       key_prefix_equals = "docs/"
  #     }
  #     redirect {
  #       replace_key_prefix_with = "documents/"
  #     }
  #   }
}

# Disable the public access block for the bucket
# resource "aws_s3_bucket_public_access_block" "starfable_bucket" {
#   bucket = aws_s3_bucket.starfable_bucket.id

#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }

resource "aws_s3_bucket_ownership_controls" "starfable_bucket" {
  bucket = aws_s3_bucket.starfable_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# resource "aws_s3_bucket_acl" "starfable_bucket" {
#   depends_on = [
#     aws_s3_bucket_ownership_controls.starfable_bucket,
#     aws_s3_bucket_public_access_block.starfable_bucket
#   ]

#   bucket = aws_s3_bucket.starfable_bucket.id
#   acl    = "public-read"
# }

# S3 Bucket Policy for Public Read Access
# resource "aws_s3_bucket_policy" "starfable_bucket" {
#   bucket = aws_s3_bucket.starfable_bucket.id
#   policy = data.aws_iam_policy_document.starfable_bucket.json
# }

# data "aws_iam_policy_document" "starfable_bucket" {
#   statement {
#     principals {
#       type        = "AWS"
#       identifiers = ["*"]
#     }

#     actions = [
#       "s3:GetObject"
#     ]

#     resources = [
#       "${aws_s3_bucket.starfable_bucket.arn}/*",
#     ]

#     effect = "Allow"
#   }
# }

# Define a local variable to list all files in the "dist" folder
locals {
  website_files = fileset("../dist", "**/*") # Use relative path to your dist folder
}

# Upload each file from the "dist" folder to S3
resource "aws_s3_object" "website_files" {
  for_each = { for file in local.website_files : file => file }

  bucket = aws_s3_bucket.starfable_bucket.id
  key    = each.value              # The S3 object key (file path in S3)
  source = "../dist/${each.value}" # The file path from your local directory
  #   acl    = "public-read"           # Make files publicly readable

  # Automatically determine the content-type based on the file extension
  content_type = lookup({
    "html" = "text/html",
    "css"  = "text/css",
    "js"   = "application/javascript",
    "png"  = "image/png",
    "jpg"  = "image/jpeg",
    "jpeg" = "image/jpeg",
    "svg"  = "image/svg+xml"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
}

# Attach the OAI to the S3 Bucket Policy to allow CloudFront access to S3
resource "aws_s3_bucket_policy" "cloudfront_policy" {
  bucket = aws_s3_bucket.starfable_bucket.id

  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

# IAM Policy allowing CloudFront to access S3
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.starfable_bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.starfable_identity.iam_arn]
    }
  }
}

resource "null_resource" "sync_files" {
  provisioner "local-exec" {
    command = "aws s3 sync ../dist s3://${aws_s3_bucket.starfable_bucket.id}/ --delete"
  }

  triggers = {
    always_run = "${timestamp()}" # Force run every time
  }
}
