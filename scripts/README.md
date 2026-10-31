# Organization Governance Scripts (`scripts/`)

This directory houses authoritative developer provisioning, workstation readiness verification gates, and corporate Git configuration scripts for the `tupynambalucas-dev` organization.

---

## 1. Scripts Catalog

| Script | Purpose | Execution Mode |
| :--- | :--- | :--- |
| `bootstrap-workstation.ps1` | Automated developer workstation bootstrapper applying Ed25519 commit signing, Git protocol defaults, and `includeIf` conditional identity delegation. | Standalone PowerShell setup. |
| `verify-workstation.ps1` | Pre-flight compliance validator verifying 7 compliance gates (Git version >= 2.36.0, SSH Ed25519 signing, Mani orchestrator, Node, pnpm, gh authentication, repository trees). | Invoked via `mani run verify-workstation` or directly in PowerShell. |

---

## 2. Usage Instructions

### Automated Workstation Provisioning

Run with administrative or developer permissions:

```powershell
powershell -ExecutionPolicy Bypass -File .github/scripts/bootstrap-workstation.ps1 -DeveloperName "Your Name" -CorporateEmail "your.email@tupynambalucas.dev"
```

### Pre-flight Readiness Gate Verification

```powershell
# Read-only verification
powershell -ExecutionPolicy Bypass -File .github/scripts/verify-workstation.ps1

# With automatic remediation
powershell -ExecutionPolicy Bypass -File .github/scripts/verify-workstation.ps1 -Fix
```

Or via Mani from the meta-repository root:

```bash
mani run verify-workstation
```
