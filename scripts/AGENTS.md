<context-hierarchy>
  <parent src="../AGENTS.md" type="global-rules" />
  <system-instruction>
    AGENT: You are operating in the scripts bounded context of .github (organization governance). If you have not read "../AGENTS.md" in this session, read it first before proceeding.
  </system-instruction>
</context-hierarchy>

# Governance Scripts Agent Context

This document defines the bounded context router for organization provisioning and compliance verification scripts.

## Scripts Directory Layout

- [bootstrap-workstation.ps1](./bootstrap-workstation.ps1): Automated workstation bootstrapper with Ed25519 signing and Git protocol configuration.
- [verify-workstation.ps1](./verify-workstation.ps1): Workstation readiness gate validating Git, SSH signing, Mani orchestrator, and GitHub CLI.
- [README.md](./README.md): Operational guide and runbooks for governance scripts.

## Operational Guardrails

- MUST NOT leak secrets or private keys into terminal output or log files.
- MUST enforce SSH Ed25519 commit signing and Git conditional includes (`hasconfig:remote.*.url`).
- MUST maintain zero-emoji invariant across all scripts, messages, and documentation.
- Scripts in this directory govern enterprise workstation provisioning across all organization repositories.
