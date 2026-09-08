#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${API_BASE_URL:-}" ]]; then
  echo "API_BASE_URL is required (example: https://your-gateway-url)"
  exit 1
fi

echo "Testing health endpoints..."
curl -sS "${API_BASE_URL}/health/task" | tee /dev/stderr
curl -sS "${API_BASE_URL}/health/analytics" | tee /dev/stderr

echo "Testing task endpoints..."
curl -sS "${API_BASE_URL}/tasks" | tee /dev/stderr

echo "Testing analytics endpoints..."
curl -sS "${API_BASE_URL}/analytics/summary" | tee /dev/stderr
curl -sS "${API_BASE_URL}/analytics/priority" | tee /dev/stderr
curl -sS "${API_BASE_URL}/analytics/completion-rate" | tee /dev/stderr
curl -sS "${API_BASE_URL}/analytics/overdue" | tee /dev/stderr

echo "API smoke test complete."
