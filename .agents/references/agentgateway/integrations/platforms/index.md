# Platforms

Deploy agentgateway on various platforms and cloud providers

Agentgateway runs anywhere—from local development to production cloud environments.

## Kubernetes distributions

Agentgateway runs on all Kubernetes distributions. For more information, see the [Kubernetes section
of the docs](https://agentgateway.dev/docs/kubernetes/).

| Category              | Distributions                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Cloud-managed**     | Amazon EKS, Google GKE, Azure AKS, DigitalOcean, Linode, IBM Cloud, Oracle OKE, Alibaba ACK    |
| **On-premises**       | Red Hat OpenShift, Rancher RKE/RKE2, VMware Tanzu, Canonical MicroK8s, K3s, vanilla Kubernetes |
| **Local development** | kind, minikube, Docker Desktop, Rancher Desktop, k3d                                           |

## Choosing a deployment model

| Platform       | Best for                       | Key features                                                        |
| -------------- | ------------------------------ | ------------------------------------------------------------------- |
| **Kubernetes** | Production workloads           | Gateway API, auto-scaling, MCP service discovery, CRD configuration |
| **Docker**     | Development, small deployments | Simple setup, Docker Compose support                                |
| **AWS**        | AWS-native workloads           | ECS, Bedrock integration, Secrets Manager                           |
| **GCP**        | Google Cloud workloads         | Cloud Run, Vertex AI integration, Secret Manager                    |
| **Azure**      | Azure workloads                | Container Apps, Azure OpenAI integration, Key Vault                 |

## Learn more

- [Deployment Guide](../../deployment/index.md)
- [Configuration Reference](../../configuration/index.md)
- [Agentgateway on Kubernetes documentation](https://agentgateway.dev/docs/kubernetes/)

[Kubernetes

Deploy agentgateway on any Kubernetes distribution](kubernetes.md)[Docker

Run agentgateway as a Docker container](docker.md)[AWS

Deploy agentgateway on Amazon Web Services](aws.md)[Google Cloud

Deploy agentgateway on Google Cloud Platform](gcp.md)[Azure

Deploy agentgateway on Microsoft Azure](azure.md)

[Observability](/docs/standalone/latest/integrations/observability/ 'Observability')[Web UIs & agent frameworks](/docs/standalone/latest/integrations/web-uis/ 'Web UIs & agent frameworks')

Was this page helpful?
