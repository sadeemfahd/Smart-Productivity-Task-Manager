#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${GCP_PROJECT_ID:-}" ]]; then
  echo "GCP_PROJECT_ID is required"
  exit 1
fi

REGION="${GCP_REGION:-us-central1}"
GAR_LOCATION="${GAR_LOCATION:-us-central1}"
GAR_REPOSITORY="${GAR_REPOSITORY:-smart-productivity-repo}"
TASK_SERVICE_IMAGE_URL="${TASK_SERVICE_IMAGE_URL:-TASK_SERVICE_IMAGE_URL}"
ANALYTICS_SERVICE_IMAGE_URL="${ANALYTICS_SERVICE_IMAGE_URL:-ANALYTICS_SERVICE_IMAGE_URL}"

echo "Destroying infrastructure with Terraform..."
terraform -chdir=infrastructure init
terraform -chdir=infrastructure destroy -auto-approve \
  -var="project_id=${GCP_PROJECT_ID}" \
  -var="region=${REGION}" \
  -var="gar_location=${GAR_LOCATION}" \
  -var="gar_repository_id=${GAR_REPOSITORY}" \
  -var="task_service_image_url=${TASK_SERVICE_IMAGE_URL}" \
  -var="analytics_service_image_url=${ANALYTICS_SERVICE_IMAGE_URL}"

echo "Destroy complete."
