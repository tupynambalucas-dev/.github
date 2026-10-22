# Google Cloud

Deploy agentgateway on Google Cloud Platform

Run agentgateway on GCP to leverage Vertex AI, GKE, and Google Cloud services.

## Deployment options

### Google Kubernetes Engine (GKE)

For GKE deployments, use [Agentgateway on Kubernetes](https://agentgateway.dev/docs/kubernetes/)
which provides native Kubernetes Gateway API support, dynamic configuration, and MCP service
discovery.

[Deploy on GKE](https://agentgateway.dev/docs/kubernetes/)

### Cloud Run

Run agentgateway as a serverless container on Cloud Run.

```
gcloud run deploy agentgateway \
  --image cr.agentgateway.dev/agentgateway:latest \
  --port 3000 \
  --set-env-vars "GOOGLE_CLOUD_PROJECT=my-project" \
  --service-account [email protected] \
  --allow-unauthenticated
```

## GCP integrations

| Integration                                                                     | Purpose                        |
| ------------------------------------------------------------------------------- | ------------------------------ |
| [Vertex AI](../../llm/providers/vertex.md)                                      | Access Gemini and other models |
| [Google Gemini](../../llm/providers/gemini.md)                                  | Direct Gemini API access       |
| [GCP Secret Manager](https://cloud.google.com/security/products/secret-manager) | Secure API key storage         |
| Cloud Load Balancing                                                            | Global load balancing with SSL |
| Cloud Trace                                                                     | Distributed tracing            |
| Cloud Monitoring                                                                | Metrics and alerting           |

## IAM permissions

Create a service account with these roles:

```
# Create service account
gcloud iam service-accounts create agentgateway \
  --display-name "agentgateway"

# Grant Vertex AI access
gcloud projects add-iam-policy-binding my-project \
  --member "serviceAccount:[email protected]" \
  --role "roles/aiplatform.user"

# Grant Secret Manager access
gcloud projects add-iam-policy-binding my-project \
  --member "serviceAccount:[email protected]" \
  --role "roles/secretmanager.secretAccessor"
```

## Learn more

- [Vertex AI Provider](../../llm/providers/vertex.md)
- [Google Gemini Provider](../../llm/providers/gemini.md)
- [GCP Secret Manager Integration](https://cloud.google.com/security/products/secret-manager)
- [Deployment Guide](../../deployment/index.md)

[AWS](/docs/standalone/latest/integrations/platforms/aws/ 'AWS')[Azure](/docs/standalone/latest/integrations/platforms/azure/ 'Azure')

Was this page helpful?
