# Security Policy

`tupynambalucas-dev` treats system security, secret hygiene, and cryptographic provenance as first-class architectural invariants. We welcome responsible disclosure of security vulnerabilities across any repository, package, or cloud-native service in our ecosystem.

---

## Supported Versions

Security patches and dependency remediations are actively maintained on the latest `main` branch heads and current `1.x.x` package releases:

| Repository / Package Scope | Supported Version | Status |
| :--- | :--- | :--- |
| `tupynambalucas-dev/org-core` | `main` (latest) | Actively Supported |
| `tupynambalucas-dev/platform` | `main` (latest) | Actively Supported |
| `tupynambalucas-dev/agent-mesh` (`@tupynambalucas-dev/mcp-*`, `plugin-*`) | `1.x.x` (`main`) | Actively Supported |
| `tupynambalucas-dev/docs` | `main` (latest) | Actively Supported |
| `tupynambalucas-dev/.github` | `main` (latest) | Actively Supported |
| `< 1.0.0` (Legacy Pre-Release Packages) | `< 1.0.0` | Unsupported |

---

## Reporting a Vulnerability

If you identify a security vulnerability or credential exposure across any `@tupynambalucas-dev` repository or deployed endpoint:

1. **Do NOT open a public GitHub issue or pull request.** Public disclosure prior to remediation puts infrastructure and users at risk.
2. Report the finding privately via GitHub Security Advisories on the affected repository or via email:
   - **Primary Security Contact**: [security@tupynambalucas.dev](mailto:security@tupynambalucas.dev)
   - **Secondary Governance Contact**: [contato@tupynambalucas.dev](mailto:contato@tupynambalucas.dev)
3. Include the following technical details in your report:
   - Affected repository, package (`@tupynambalucas-dev/*`), or service endpoint.
   - Vulnerability classification and attack vector description.
   - Deterministic reproduction steps or minimal proof-of-concept (PoC).
   - Estimated impact and scope.

---

## Response Commitments

The `tupynambalucas-dev` security team adheres to the following disclosure SLAs:

- **Initial Acknowledgement**: Within 24 hours of receipt.
- **Triage and Severity Assessment**: Within 72 hours.
- **Remediation and Patching**: Prioritized by CVSS severity (critical vulnerabilities patched within 7 days).
- **Coordinated Disclosure**: Published jointly with the reporter after patches are verified in production.

---

## Security Architecture Principles

- **Zero Secrets in Source**: Credentials, machine identities, and tokens are managed exclusively via Infisical Universal Auth and synchronized into Kubernetes via `InfisicalSecret` custom resources. Secret Scanning push protection blocks credential leaks at the Git edge.
- **Cryptographic Provenance**: All commits and release tags require verified `ed25519` SSH signatures enforced by organization rulesets.
- **Zero-Trust Edge Ingress**: Public traffic terminates at Cloudflare Zero Trust tunnels and WAF policies with strict TLS 1.3 enforcement.
