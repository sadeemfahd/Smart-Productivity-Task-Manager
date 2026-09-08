variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-central1"
}

variable "gar_location" {
  description = "Artifact Registry location (same as region for this project)"
  type        = string
  default     = "us-central1"
}

variable "gar_repository_id" {
  description = "Artifact Registry repository ID"
  type        = string
  default     = "smart-productivity-repo"
}

variable "task_service_image_url" {
  description = "Full container image URL for task-service"
  type        = string
}

variable "analytics_service_image_url" {
  description = "Full container image URL for analytics-service"
  type        = string
}
