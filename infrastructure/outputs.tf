output "task_service_url" {
  description = "Public URL for task-service"
  value       = google_cloud_run_v2_service.task_service.uri
}

output "analytics_service_url" {
  description = "Public URL for analytics-service"
  value       = google_cloud_run_v2_service.analytics_service.uri
}

output "api_gateway_url" {
  description = "Public URL for API Gateway"
  value       = "https://${google_api_gateway_gateway.smart_productivity_gateway.default_hostname}"
}
