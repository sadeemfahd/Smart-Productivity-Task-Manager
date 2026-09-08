#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-${GCP_PROJECT_ID:-}}"
REGION="${REGION:-${GCP_REGION:-us-central1}}"
REPOSITORY="${REPOSITORY:-${GAR_REPOSITORY:-smart-productivity-repo}}"
GAR_LOCATION="${GAR_LOCATION:-$REGION}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
TASK_IMAGE="${TASK_IMAGE:-${GAR_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/task-service:${IMAGE_TAG}}"
ANALYTICS_IMAGE="${ANALYTICS_IMAGE:-${GAR_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/analytics-service:${IMAGE_TAG}}"

if [[ -z "${PROJECT_ID:-}" ]]; then
  echo "PROJECT_ID is required"
  exit 1
fi

echo "Initializing Terraform..."
terraform -chdir=infrastructure init

echo "Bootstrapping required APIs and Artifact Registry..."
terraform -chdir=infrastructure apply -auto-approve \
  -target=google_project_service.run_api \
  -target=google_project_service.firestore_api \
  -target=google_project_service.artifactregistry_api \
  -target=google_project_service.apigateway_api \
  -target=google_project_service.iam_api \
  -target=google_project_service.cloudresourcemanager_api \
  -target=google_artifact_registry_repository.services \
  -var="project_id=${PROJECT_ID}" \
  -var="region=${REGION}" \
  -var="gar_location=${GAR_LOCATION}" \
  -var="gar_repository_id=${REPOSITORY}" \
  -var="task_service_image_url=${TASK_IMAGE}" \
  -var="analytics_service_image_url=${ANALYTICS_IMAGE}"

echo "Building and pushing Docker images..."
gcloud auth configure-docker "${GAR_LOCATION}-docker.pkg.dev" --quiet
docker build -t "${TASK_IMAGE}" .
docker build -t "${ANALYTICS_IMAGE}" ./analytics-service
docker push "${TASK_IMAGE}"
docker push "${ANALYTICS_IMAGE}"

echo "Running full Terraform apply..."
terraform -chdir=infrastructure apply -auto-approve \
  -var="project_id=${PROJECT_ID}" \
  -var="region=${REGION}" \
  -var="gar_location=${GAR_LOCATION}" \
  -var="gar_repository_id=${REPOSITORY}" \
  -var="task_service_image_url=${TASK_IMAGE}" \
  -var="analytics_service_image_url=${ANALYTICS_IMAGE}"

echo "Deployment complete."
