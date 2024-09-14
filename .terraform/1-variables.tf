resource "random_string" "random" {
  length = 6
  special = false
  upper = false
} 

variable "bucket_name" {
  type = string
  default = "trust-ai-code-challenge-${random_string.random.result}"
}
