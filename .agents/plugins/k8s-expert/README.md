# Kubernetes Expert Plugin

This plugin provides specialized skills, rules, and verification runbooks for managing the
enterprise Kubernetes GitOps architecture, ensuring clean separation of deployers between Helm
and Kustomize.

---

## Components

- **Manifest**: [plugin.json](./plugin.json)
- **Rules**: [rules/k8s-docs.md](./rules/k8s-docs.md)
- **Skills**:
  - [k8s-docs-analyzer](./skills/k8s-docs-analyzer/SKILL.md): Analyzes existing infrastructure
    documentation against live Kubernetes manifests.
  - [k8s-docs-manager](./skills/k8s-docs-manager/SKILL.md): Maintains Diátaxis-compliant technical
    documentation for GitOps overlays and Helm charts.

---

## Architecture Constraints

- **Separation of Deployers**: Third-party Helm charts and Kustomize overlays are strictly
  segregated.
- **Dual-Cluster Parity**: Local `k3d` development mirrors production cloud clusters
  (`hub` and `corporate`).
- **Zero Ingress Drift**: Ingress hosts and route policies are patched declaratively via overlays.
