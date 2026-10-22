# Cloudflare Tunnel Provisioning Strategy & Architecture

Technical blueprint and architectural evaluation for Cloudflare Tunnel provisioning across `dev`,
`staging`, and `prod` clusters.

---

## 1. Architectural Evaluation: Do We Really Need 6 Tunnels?

### 1.1 Evaluated Alternatives

| Approach                                                  | Topology                                                                  | Failure Isolation                                           | Kubernetes DNS Compatibility                                                             | Operational Complexity                               | Verdict                         |
| :-------------------------------------------------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------- | :--------------------------------------------------------------------------------------- | :--------------------------------------------------- | :------------------------------ |
| **A. Single Global Tunnel**                               | 1 tunnel running everywhere or in a central gateway                       | Critical: 1 breach or misconfiguration impacts dev and prod | Impossible: Pods in `k3d-hub` cannot resolve `cluster.local` of `k3d-corporate` or cloud | High: Requires cross-cluster mesh / VPN              | **Rejected**                    |
| **B. Cloudflare Tunnel Ingress Controller / Operator**    | Third-party CRD operator per cluster                                      | Moderate                                                    | Good, but introduces third-party CRDs and API token sprawl                               | High: Controller lifecycle overhead, RBAC privileges | **Rejected**                    |
| **C. One Remotely-Managed Tunnel per Cluster (Selected)** | 1 dedicated tunnel connector pod per cluster targeting in-cluster Traefik | Complete: Zero cross-cluster impact                         | Native: Outbound-only connector routes strictly to in-cluster Traefik                    | Low: Pod needs only 1 token via Secret               | **Adopted (Industry Standard)** |

### 1.2 Why One Dedicated Tunnel per Cluster is the Senior Pattern

1. **Kubernetes Overlay Network Isolation**: Each cluster (`k3d-hub`, `k3d-corporate`, staging, and
   prod) runs its own isolated CoreDNS and overlay network (`cluster.local`). A connector pod can
   only route traffic to services reachable from its own network namespace. Because Traefik runs as
   `ClusterIP` inside each cluster (`traefik.platform.svc.cluster.local` or
   `traefik.corporate.svc.cluster.local`), an external or shared tunnel connector cannot reach
   in-cluster origins without bridging the networks.
2. **Blast Radius and Security Segmentation**:
   - Internal team tools (`hub`: Grafana, Headlamp, Penpot, Memos, AgentGateway) must never share
     ingress credentials with customer-facing applications (`corporate`: Web, API).
   - If a developer resets or breaks local `dev` networking, staging and production remain untouched.
3. **Zero Inbound Attack Surface**:
   - No public IPs, no open ports (80/443), and no cloud LoadBalancers.
   - Eliminates port contention between multiple local k3d clusters on the developer host.
4. **Remotely-Managed Simplicity**:
   - The connector pod needs only `TUNNEL_TOKEN` passed to
     `cloudflared tunnel --no-autoupdate run`.
   - Hostname routing rules and TLS edge certificates reside in the Cloudflare Edge control plane.

---

## 2. Tunnel Inventory

Total tunnels required: **6** (2 per environment across 3 environments).

| Environment | Tunnel Name         | Target Cluster          | Connector Deployment                           | Secret Source                                         | Replicas |
| :---------- | :------------------ | :---------------------- | :--------------------------------------------- | :---------------------------------------------------- | :------- |
| `dev`       | `dev-hub`           | `k3d-hub` (local)       | `manifests/hub/network/cloudflared.yaml`       | `platform-secrets.CLOUDFLARE_TUNNEL_TOKEN_HUB`        | 1        |
| `dev`       | `dev-corporate`     | `k3d-corporate` (local) | `manifests/corporate/network/cloudflared.yaml` | `corporate-secrets.CLOUDFLARE_TUNNEL_TOKEN_CORPORATE` | 1        |
| `staging`   | `staging-hub`       | Cloud Staging Hub       | `manifests/hub/network/cloudflared.yaml`       | `platform-secrets` (SealedSecret)                     | 1        |
| `staging`   | `staging-corporate` | Cloud Staging Corporate | `manifests/corporate/network/cloudflared.yaml` | `corporate-secrets` (SealedSecret)                    | 1        |
| `prod`      | `prod-hub`          | Cloud Prod Hub          | `manifests/hub/network/cloudflared.yaml`       | `platform-secrets` (SealedSecret)                     | 2        |
| `prod`      | `prod-corporate`    | Cloud Prod Corporate    | `manifests/corporate/network/cloudflared.yaml` | `corporate-secrets` (SealedSecret)                    | 2        |

---

## 3. Hostname and Origin Mapping

Every public hostname is registered under `tupynambalucas.dev`. All hostnames for a cluster point to
that cluster's in-cluster Traefik service. Traefik inspects the incoming `Host` header and routes
to the correct backend pod.

### 3.1 Hub Clusters

**Origin Service**: `http://traefik.platform.svc.cluster.local:80`

| Service                     | `dev-hub` Hostname                            | `staging-hub` Hostname                        | `prod-hub` Hostname                       |
| :-------------------------- | :-------------------------------------------- | :-------------------------------------------- | :---------------------------------------- |
| Traefik Dashboard           | `traefik-dev.tupynambalucas.dev`              | `traefik-stg.tupynambalucas.dev`              | `traefik.tupynambalucas.dev`              |
| Grafana Observability       | `grafana-dev.tupynambalucas.dev`              | `grafana-stg.tupynambalucas.dev`              | `grafana.tupynambalucas.dev`              |
| Headlamp K8s Dashboard      | `headlamp-dev.tupynambalucas.dev`             | `headlamp-stg.tupynambalucas.dev`             | `headlamp.tupynambalucas.dev`             |
| Turbocache Remote Cache     | `turbocache-dev.tupynambalucas.dev`           | `turbocache-stg.tupynambalucas.dev`           | `turbocache.tupynambalucas.dev`           |
| Memos Notes                 | `memos-dev.tupynambalucas.dev`                | `memos-stg.tupynambalucas.dev`                | `memos.tupynambalucas.dev`                |
| Penpot Design Studio        | `penpot-dev.tupynambalucas.dev`               | `penpot-stg.tupynambalucas.dev`               | `penpot.tupynambalucas.dev`               |
| Cortex Memory Web           | `memory-dev.tupynambalucas.dev`               | `memory-stg.tupynambalucas.dev`               | `memory.tupynambalucas.dev`               |
| Cortex Memory API           | `memory-api-dev.tupynambalucas.dev`           | `memory-api-stg.tupynambalucas.dev`           | `memory-api.tupynambalucas.dev`           |
| Cortex AgentGateway Primary | `agentgateway-dev.tupynambalucas.dev`         | `agentgateway-stg.tupynambalucas.dev`         | `agentgateway.tupynambalucas.dev`         |
| Cortex AgentGateway Ingress | `agentgateway-ingress-dev.tupynambalucas.dev` | `agentgateway-ingress-stg.tupynambalucas.dev` | `agentgateway-ingress.tupynambalucas.dev` |
| Cortex AgentGateway MCP     | `agentgateway-mcp-dev.tupynambalucas.dev`     | `agentgateway-mcp-stg.tupynambalucas.dev`     | `agentgateway-mcp.tupynambalucas.dev`     |

### 3.2 Corporate Clusters

**Origin Service**: `http://traefik.corporate.svc.cluster.local:80`

| Service                           | `dev-corporate` Hostname      | `staging-corporate` Hostname | `prod-corporate` Hostname |
| :-------------------------------- | :---------------------------- | :--------------------------- | :------------------------ |
| Corporate Web (React)             | `web-dev.tupynambalucas.dev`  | `web-stg.tupynambalucas.dev` | `web.tupynambalucas.dev`  |
| Corporate API (Fastify)           | `api-dev.tupynambalucas.dev`  | `api-stg.tupynambalucas.dev` | `api.tupynambalucas.dev`  |
| Documentation Portal (Docusaurus) | `docs-dev.tupynambalucas.dev` | _N/A (Cloudflare Pages)_     | _N/A (Cloudflare Pages)_  |

> [!NOTE]
> In `staging` and `prod`, documentation is served directly from Cloudflare Pages at
> `docs.tupynambalucas.dev` via `deploy-docs.yaml`. It does not route through any Kubernetes tunnel.

---

## 4. Initial Bootstrap Runbook (First Instance Setup)

Follow this procedure to create and activate the tunnels via Cloudflare Zero Trust Dashboard.

### Step 1: Open Cloudflare Zero Trust

1. Navigate to the [Cloudflare One Dashboard](https://one.dash.cloudflare.com/).
2. In the sidebar, navigate to **Networks** > **Tunnels**.
3. Click **Add a tunnel**.

### Step 2: Create Tunnel Connector

1. Select **Cloudflared** connector type.
2. Enter the Tunnel Name (e.g. `dev-hub` or `dev-corporate`).
3. Click **Save tunnel**.
4. In the installation screen, choose **Docker** or **Kubernetes** to reveal the Tunnel Token.
   Copy the base64 token string following `--token`.

### Step 3: Configure Public Hostnames

In the **Public Hostnames** tab of the created tunnel, add each hostname using the table in Section 3:

- **Subdomain**: `<prefix>` (e.g., `grafana-dev`)
- **Domain**: `tupynambalucas.dev`
- **Path**: leave empty
- **Service**:
  - Type: `HTTP`
  - URL: `traefik.platform.svc.cluster.local:80` (for Hub) OR `traefik.corporate.svc.cluster.local:80` (for Corporate)
- **Additional application settings**:
  - HTTP Settings: check `HTTP2` if supported, leave TLS verify default.

Repeat for all hostnames mapped to that tunnel.

### Step 4: Save Tokens to Local Environment (`dev`)

Add the copied tokens into `k8s/.env`:

```bash
CLOUDFLARE_TUNNEL_TOKEN_HUB=<YOUR_DEV_HUB_TOKEN>
CLOUDFLARE_TUNNEL_TOKEN_CORPORATE=<YOUR_DEV_CORPORATE_TOKEN>
```

### Step 5: Verification

1. Start Skaffold or apply manifests:
   ```bash
   cd k8s
   skaffold dev -f skaffold.hub.yaml
   ```
2. Verify tunnel registration in the pod logs:
   ```bash
   kubectl --context k3d-hub -n platform logs deploy/cloudflared
   ```
   Logs must display: `Connection registered with Cloudflare edge`.
3. Check status in Cloudflare Dashboard: Tunnel status transitions to **HEALTHY** (green).
4. Verify HTTPS access from any external device:
   ```bash
   curl -I https://grafana-dev.tupynambalucas.dev
   ```

---

## 5. Security & Access Policies

All `hub` hostnames across all environments expose internal management dashboards and must be
protected with Cloudflare Zero Trust Access policies.

1. **Access Application Type**: Self-hosted.
2. **Domain**: `*-dev.tupynambalucas.dev` / `*-stg.tupynambalucas.dev` / `*.tupynambalucas.dev`.
3. **Policy**:
   - Human users: require authentication via configured Identity Provider (GitHub or Google OAuth).
   - Automated agents / MCP: configure **Service Tokens** (`CF-Access-Client-Id` and
     `CF-Access-Client-Secret`) bypassing interactive login.
