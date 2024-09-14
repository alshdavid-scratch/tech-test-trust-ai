locals {
  bucket_name = var.bucket_name == null ? "trust-ai-code-challenge-${random_string.random.result}" : var.bucket_name
}

resource "aws_s3_bucket" "bucket" {
  bucket = local.bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "s3_website" {
  bucket = aws_s3_bucket.bucket.id
  
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket-policy" {
  depends_on = [aws_s3_bucket_public_access_block.public_access_block]
  bucket = aws_s3_bucket.bucket.id
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "PublicReadGetObject",
          "Effect" : "Allow",
          "Principal" : "*",
          "Action" : "s3:GetObject",
          "Resource" : "arn:aws:s3:::${aws_s3_bucket.bucket.id}/*"
        }
      ]
    }
  )
}

resource "aws_s3_object" "upload_object" {
  for_each = fileset("../client/dist/", "*")
  bucket = aws_s3_bucket.bucket.id
  key = each.value
  source = "../client/dist/${each.value}"
  etag = filemd5("../client/dist/${each.value}")
  content_type = "text/html"
}

output "website_url" {
  value = "http://${aws_s3_bucket_website_configuration.s3_website.website_endpoint}"
}