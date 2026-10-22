# Security Policy

Tupynambá Lucas treats system security and cryptographic integrity as first-class architectural
priorities. We appreciate the responsible disclosure of any security vulnerability found within
our software, repositories, and cloud-native services.

---

## Supported Versions

Security patches and vulnerability updates are actively maintained on the latest stable releases:

| Project / Component               | Supported Version | Status             |
| :-------------------------------- | :---------------- | :----------------- |
| `tupynambalucas` Monorepo (Main)  | `latest` (`main`) | Actively Supported |
| `corporate/services/api` (Fastify)| `5.x`             | Actively Supported |
| `corporate/services/web` (React)  | `19.x`            | Actively Supported |
| `.agents` Custom Plugins          | `latest` (`main`) | Actively Supported |

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential threat in any organization repository or
deployed service:

1. **Do NOT open a public GitHub issue**. Publicly disclosing security flaws puts our infrastructure
   and users at risk.
2. Submit your findings directly via private email to:
   - **Primary**: [security@tupynambalucas.dev](mailto:security@tupynambalucas.dev)
   - **Alternative**: [contato@tupynambalucas.dev](mailto:contato@tupynambalucas.dev)
3. Please include the following details in your report:
   - Description of the vulnerability and attack vector.
   - Affected repository, component, or URL endpoint.
   - Step-by-step reproduction instructions or proof-of-concept (PoC).
   - Potential impact assessment.

---

## Response Commitments

The Tupynambá Lucas security team adheres to the following response timeline:

- **Initial Acknowledgement**: Within 24 hours of receipt.
- **Triage and Impact Assessment**: Within 72 hours.
- **Remediation & Patching**: Delivered based on CVSS severity (critical vulnerabilities patched
  within 7 days).
- **Public Disclosure**: Coordinated with the reporter after remediation is deployed.

---

## Security Architecture Principles

- **Zero Secrets in Source**: Master secrets, database credentials, and API tokens are
  managed strictly via Infisical and Bitnami Sealed Secrets. Commits containing secrets fail
  pre-receive gates.
- **Cryptographic Provenance**: Commits are strictly verified through SSH key signatures.
- **Zero Trust Ingress**: External ingress terminates at Cloudflare edge with strict TLS 1.3
  and WAF controls.
