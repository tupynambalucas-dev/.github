---
name: k8s-docs-manager
description: Use this skill to create, update, and manage GitOps documentation inside the infrastructure references directory using the Diátaxis framework. Trigger this whenever infrastructure changes (Helm/Kustomize) occur to document the new state.
---

# K8s Documentation Manager

This skill establishes the workflow for updating the Kubernetes documentation in the infrastructure references directory to reflect the current state of the infrastructure.

## 1. Documentation Triggers

You MUST use this skill to update or create documentation when any of the following occur:

- A new Helm chart is added or an existing one is removed.
- Kustomize overlays are restructured.
- Architectural decisions are made regarding deployer separation, Ingress management, or RBAC.
- Local development orchestrator configuration changes significantly.

## 2. Diátaxis Framework Alignment

All documentation MUST be placed into the appropriate quadrant within the documentation directory:

- **tutorials/**: Use for step-by-step setup instructions for new developers.
- **guides/**: Use for goal-oriented tasks (e.g., "How to expose a new microservice", "How to inject RBAC rules").
- **reference/**: Use for pure technical specifications, manifest requirements, API versions, and schema definitions. Avoid using this quadrant if the document fits better as a guide or explanation, to prevent redundancy with the root `references/` name.
- **explanation/**: Use for architectural decision records (ADRs) and deep dives (e.g., "Why we separate Helm and Kustomize").

## 3. Authoring Standards

- **English Only**: All documents must be authored in en-US.
- **No Emojis**: Maintain a strict, professional tone without emojis.
- **Concrete References**: Always use clickable relative markdown links to refer to real manifest files (e.g., `./skaffold.yaml` or relative path to manifest).
- **No Placeholders**: Never write "TODO" or "TBD". If you lack information, do not write the section.

## 4. Execution Workflow

When tasked with documenting an infrastructure change:

1. Identify the type of knowledge (Tutorial, Guide, Reference, or Explanation).
2. Determine the correct subdirectory in the documentation directory.
3. Create or update the Markdown file.
4. If creating a new file, ensure it is linked in the corresponding documentation index `README.md` if necessary.
