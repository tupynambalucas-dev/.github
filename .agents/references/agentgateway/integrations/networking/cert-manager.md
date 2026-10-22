# cert-manager

Automatic TLS certificate management for agentgateway

cert-manager automates TLS certificate management in Kubernetes. Use it to automatically provision
and renew certificates for agentgateway.

## Why use cert-manager with agentgateway?

- **Automatic provisioning** - Request certificates from Let’s Encrypt or other CAs
- **Auto-renewal** - Certificates are renewed before expiration
- **Multiple issuers** - Support for ACME, Vault, Venafi, and self-signed
- **Gateway API integration** - Native support for Gateway resources

## Before you begin

Install cert-manager:

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml
```

## Create a ClusterIssuer

For Let’s Encrypt:

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: [email protected]
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx
```

## Gateway API integration

cert-manager can automatically provision certificates for Gateway resources:

```
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: agentgateway
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  gatewayClassName: agentgateway
  listeners:
  - name: https
    protocol: HTTPS
    port: 443
    hostname: "ai.example.com"
    tls:
      mode: Terminate
      certificateRefs:
      - name: ai-example-com-tls
```

cert-manager automatically:

1. Detects the Gateway needs a certificate
2. Creates a Certificate resource
3. Completes the ACME challenge
4. Stores the certificate in the referenced Secret

## Manual certificate

For more control, create the Certificate manually:

```
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ai-example-com
spec:
  secretName: ai-example-com-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - ai.example.com
  - api.example.com
```

Then reference it in your agentgateway config:

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 443
    protocol: HTTPS
    tls:
      cert: /certs/tls.crt
      key: /certs/tls.key
routes:
- backends:
  - mcp:
      targets:
      - name: my-server
        stdio:
          cmd: npx
          args: ["@modelcontextprotocol/server-everything"]
```

## Self-signed certificates for development

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: agentgateway-dev
spec:
  secretName: agentgateway-dev-tls
  issuerRef:
    name: selfsigned
    kind: ClusterIssuer
  dnsNames:
  - localhost
  - agentgateway.local
```

## Learn more

- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Listeners and TLS](../../configuration/listeners.md)
- [Kubernetes Deployment](../platforms/kubernetes.md)

[External DNS](/docs/standalone/latest/integrations/networking/external-dns/ 'External DNS')

Was this page helpful?
