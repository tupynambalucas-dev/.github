# Kubernetes Documentation Rule

> **CRITICAL AGENT INSTRUCTION:**
> Whenever you create, modify, or delete Kubernetes manifests (e.g., Deployments, Services, ConfigMaps, Ingresses, Kustomizations) in this repository, you MUST actively use the `k8s-docs-manager` skill from this plugin to update the architectural documentation in the infrastructure references directory.
> This ensures that the GitOps documentation accurately reflects the current state of the infrastructure.
> Do NOT assume the user will update the documentation themselves. You must proactively maintain the infrastructure documentation.
