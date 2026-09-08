# Smart Productivity Task Manager

Smart Productivity Task Manager is a cloud-based backend project for SWE455 Cloud Applications Engineering. It uses two Node.js microservices, a managed NoSQL datastore, infrastructure-as-code, and automated CI/CD for production deployment.

## Project Overview

- `task-service` (Express + Firestore): task CRUD and completion management.
- `analytics-service` (Express + Firestore): read-only analytics and reporting APIs.
- `Firestore` (Native mode): centralized managed data storage.
- `API Gateway`: single public entry point for task and analytics routes.
- `Cloud Run`: serverless container runtime for both services.
- `Terraform`: provisions all cloud resources (no manual console provisioning).
- `GitHub Actions`: builds container images and deploys with Terraform on push to `main`.

## Architecture

Client applications send requests to Google API Gateway. Gateway routes task requests to `task-service` and analytics requests to `analytics-service`. Both services are stateless and read/write data in Firestore.

`Client -> API Gateway -> Cloud Run services (task-service + analytics-service) -> Firestore`

## Cloud Services Used

- Google Cloud Run
- Google Firestore (Native mode)
- Google API Gateway
- Google Artifact Registry
- Google IAM / Cloud Resource Manager APIs

## Repository Structure

- `index.js`, `routes/`, `controllers/`, `services/`, `models/`: task-service source.
- `analytics-service/`: analytics-service source.
- `infrastructure/`: Terraform and API Gateway OpenAPI specification.
- `.github/workflows/`: CI/CD pipelines.
- `scripts/`: deploy, destroy, and API smoke-test scripts.
- `SWE455_Technical_Report.md`: formal project report.
- `AI_PROMPTS_APPENDIX.md`: AI prompt appendix.

## Run Locally

### Prerequisites

- Node.js 20+
- npm
- Google credentials (if testing Firestore access)

### Task Service

```bash
npm install
node index.js
```

### Analytics Service

```bash
cd analytics-service
npm install
node index.js
```

## Deploy with Terraform

### Prerequisites

- Terraform 1.5+
- Google Cloud SDK (`gcloud`)
- Authenticated GCP account with required permissions

### Configure variables

Set environment variables:

```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
export GAR_LOCATION="us-central1"
export GAR_REPOSITORY="smart-productivity-repo"
```

### Apply infrastructure

```bash
./scripts/deploy.sh
```

The deploy script builds both service images, pushes them to Artifact Registry, then runs `terraform init` and `terraform apply` with both image URLs.

### Destroy infrastructure

```bash
./scripts/destroy.sh
```

## CI/CD Workflow

One GitHub Actions workflow runs on push to `main`:

- `.github/workflows/deploy.yml`

The workflow:

1. Checks out code
2. Authenticates to Google Cloud
3. Builds Docker image
4. Pushes image to Artifact Registry
5. Runs `terraform apply` with both image URLs to deploy Cloud Run services

## Required GitHub Secrets

- `GCP_PROJECT_ID`: Google Cloud project ID
- `GCP_SA_KEY`: Service account key JSON
- `GCP_REGION`: Deployment region (e.g., `us-central1`)
- `GAR_LOCATION`: Artifact Registry location (e.g., `us-central1`)
- `GAR_REPOSITORY`: Artifact Registry repository ID

## API Endpoints and Curl Examples

Replace `API_GATEWAY_URL` with Terraform output `api_gateway_url`.

### Health

```bash
curl -X GET "API_GATEWAY_URL/health/task"
curl -X GET "API_GATEWAY_URL/health/analytics"
```

### Task APIs

```bash
curl -X GET "API_GATEWAY_URL/tasks"

curl -X POST "API_GATEWAY_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish SWE455 report",
    "description": "Finalize technical report sections",
    "priority": "high",
    "deadline": "2026-05-15T23:59:59.000Z"
  }'
```

### Analytics APIs

```bash
curl -X GET "API_GATEWAY_URL/analytics/summary"
curl -X GET "API_GATEWAY_URL/analytics/overdue"
curl -X GET "API_GATEWAY_URL/analytics/priority"
curl -X GET "API_GATEWAY_URL/analytics/completion-rate"
```

### API smoke test script

```bash
export API_BASE_URL="API_GATEWAY_URL"
./scripts/test-api.sh
```

## Demo Steps (Destroy and Restore)

1. Ensure required environment variables are set.
2. Run `./scripts/destroy.sh` to remove all provisioned resources.
3. Run `./scripts/deploy.sh` to recreate full environment from code.
4. Run `./scripts/test-api.sh` using the gateway URL to verify recovery.

This demonstrates reproducible infrastructure deployment and recovery using Terraform and scripts.

## Team

This project was developed as part of SWE455 – Cloud Applications Engineering at KFUPM.

- Sadeem Alotaibi
- Renad Alqahtani
