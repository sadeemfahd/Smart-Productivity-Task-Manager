# AI Prompts Appendix

## Prompt Used to Improve/Fix the Project

```text
You are a senior cloud infrastructure and Node.js backend engineer.

Review this SWE455 Cloud Applications Engineering project and fix it to fully match professor requirements:
- Two functional services + one data storage service
- Terraform provisioning for all cloud components (no manual console setup)
- CI/CD on GitHub push that builds images and deploys to production automatically
- 15-Factor methodology coverage in technical report
- Architecture diagram, REST API docs, repo links, and AI prompt appendix
- Demo-ready destroy/restore using only code/scripts

Required tasks:
1) Inspect full project for missing/broken parts.
2) Fix Dockerfiles and package-lock/npm install compatibility.
3) Add graceful shutdown (SIGTERM/SIGINT) to both services.
4) Extend Terraform to include APIs, Artifact Registry, Cloud Run, Firestore, API Gateway, IAM.
5) Replace manual gcloud deploy in CI/CD with terraform apply using variables.
6) Add scripts/deploy.sh, scripts/destroy.sh, scripts/test-api.sh.
7) Upgrade README with project overview, architecture, cloud services, local run, deploy, CI/CD, API curl examples, demo steps.
8) Create SWE455_Technical_Report.md with Mermaid architecture and 15-Factor mapping table.
9) Add AI_PROMPTS_APPENDIX.md containing the prompt.

Keep existing project idea unchanged:
- task-service
- analytics-service
- Firestore
```

## Notes

- AI output was reviewed and adapted to match project structure and Terraform-based deployment model.
- Final configuration preserves the original architecture and improves production-readiness for university assessment.
