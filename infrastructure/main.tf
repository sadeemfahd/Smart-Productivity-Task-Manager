terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "run_api" {
  project            = var.project_id
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "firestore_api" {
  project            = var.project_id
  service            = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry_api" {
  project            = var.project_id
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "apigateway_api" {
  project            = var.project_id
  service            = "apigateway.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam_api" {
  project            = var.project_id
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudresourcemanager_api" {
  project            = var.project_id
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "services" {
  location      = var.gar_location
  repository_id = var.gar_repository_id
  description   = "Docker repository for Smart Productivity services"
  format        = "DOCKER"

  depends_on = [
    google_project_service.artifactregistry_api
  ]
}

resource "google_firestore_database" "default" {
  project     = var.project_id
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"

  depends_on = [
    google_project_service.firestore_api
  ]
}

resource "google_cloud_run_v2_service" "task_service" {
  name     = "task-service"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = var.task_service_image_url

      ports {
        container_port = 8080
      }

      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
    }
  }

  depends_on = [
    google_project_service.run_api,
    google_project_service.artifactregistry_api,
    google_artifact_registry_repository.services
  ]
}

resource "google_cloud_run_v2_service" "analytics_service" {
  name     = "analytics-service"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = var.analytics_service_image_url

      ports {
        container_port = 8080
      }

      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
    }
  }

  depends_on = [
    google_project_service.run_api,
    google_project_service.artifactregistry_api,
    google_artifact_registry_repository.services
  ]
}

resource "google_cloud_run_v2_service_iam_member" "task_public_invoker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.task_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "analytics_public_invoker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.analytics_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_api_gateway_api" "smart_productivity_api" {
  provider = google-beta

  api_id       = "smart-productivity-api"
  display_name = "Smart Productivity API"

  depends_on = [
    google_project_service.apigateway_api
  ]
}

resource "google_api_gateway_api_config" "smart_productivity_api_config" {
  provider = google-beta

  api           = google_api_gateway_api.smart_productivity_api.api_id
  api_config_id = "smart-productivity-api-config"

  openapi_documents {
    document {
      path = "openapi.yaml"
      contents = base64encode(
        templatefile("${path.module}/openapi.yaml", {
          task_service_url      = google_cloud_run_v2_service.task_service.uri
          analytics_service_url = google_cloud_run_v2_service.analytics_service.uri
        })
      )
    }
  }

  depends_on = [
    google_project_service.apigateway_api,
    google_cloud_run_v2_service_iam_member.task_public_invoker,
    google_cloud_run_v2_service_iam_member.analytics_public_invoker
  ]
}

resource "google_api_gateway_gateway" "smart_productivity_gateway" {
  provider = google-beta

  gateway_id   = "smart-productivity-gateway"
  display_name = "Smart Productivity Gateway"
  region       = var.region
  api_config   = google_api_gateway_api_config.smart_productivity_api_config.id

  depends_on = [
    google_project_service.apigateway_api
  ]
}
