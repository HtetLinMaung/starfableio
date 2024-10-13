variable "domain_name" {
  default = "www.starfableio.com"
}

# CloudFront Origin Access Identity (OAI) to restrict direct access to S3
resource "aws_cloudfront_origin_access_identity" "starfable_identity" {
  comment = "OAI for Starfable S3 Bucket"
}

# CloudFront Distribution for S3 Website
resource "aws_cloudfront_distribution" "starfable_cdn" {
  origin {
    domain_name = aws_s3_bucket.starfable_bucket.bucket_regional_domain_name
    origin_id   = "S3-Starfable"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.starfable_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-Starfable"
    viewer_protocol_policy = "redirect-to-https" # Redirect HTTP to HTTPS

    forwarded_values {
      query_string = false
      cookies {
        forward = "none" # Do not forward cookies
      }
    }
  }

  # Use the ACM certificate for HTTPS on the custom domain
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.starfable_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Custom error response to handle subdirectory requests without trailing /index.html
  #   custom_error_response {
  #     error_code            = 404
  #     response_code         = 200
  #     response_page_path    = "/index.html" # Return the root index.html for folder-like requests
  #     error_caching_min_ttl = 0
  #   }

  price_class = "PriceClass_100" # Cheapest pricing tier (only US, Europe, Asia)

  #   viewer_certificate {
  #     cloudfront_default_certificate = true # Use the default CloudFront SSL certificate
  #   }

  restrictions {
    geo_restriction {
      restriction_type = "none" # No geo-restrictions
    }
  }

  aliases = [var.domain_name] # Your custom domain name here

  tags = {
    Name        = "Starfable CloudFront Distribution"
    Environment = "Production"
  }
}

# ACM Certificate in us-east-1 (for CloudFront SSL)
resource "aws_acm_certificate" "starfable_cert" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"

#   subject_alternative_names = ["www.${var.domain_name}"]

  tags = {
    Name        = "Starfable SSL Certificate"
    Environment = "Production"
  }
}
