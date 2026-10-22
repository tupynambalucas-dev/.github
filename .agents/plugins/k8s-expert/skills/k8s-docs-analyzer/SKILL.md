---
name: k8s-docs-analyzer
description: Use this skill to analyze existing GitOps documentation in the infrastructure references directory to ensure new discoveries or changes are correctly planned, adhere to documented standards, and identify documentation gaps.
---

# K8s Documentation Analyzer

This skill establishes the workflow for analyzing Kubernetes architectural guidelines and references before applying or validating infrastructure changes in the workspace.

## 1. Analysis Triggers

You MUST use this skill when:

- Evaluating a proposed change to Kubernetes manifests, Helm charts, or Kustomize overlays.
- Discovering a new K8s constraint or configuration pattern during a task.
- Validating if a user's request aligns with the established "Separation of Deployers" GitOps architecture.

## 2. Analysis Workflow

When triggered, execute the following steps:

1. **Read Core Architecture**: Inspect the infrastructure reference documentation (e.g., `references/README.md` or `k8s/references/README.md`) and related explanation files.
2. **Verify Compliance**: Check if the proposed infrastructure change respects the documented guidelines (e.g., Helm used for third-party, Kustomize for first-party).
3. **Identify Documentation Gaps**: If the discovered pattern or change is missing from the documentation, flag it.
4. **Enforce Updates**: If a gap is identified, you MUST recommend or automatically trigger the `k8s-docs-manager` skill to fill the gap.

## 3. Strict Guidelines

- **Zero Emojis**: Analysis outputs written to artifacts or documentation must contain zero emojis.
- **English Only**: All architectural gap analysis reports must be in en-US.
- **Objective Grading**: Base your analysis strictly on the Diátaxis files present in the documentation directory. Do not hallucinate external LLM standards unless explicitly requested by the user.
