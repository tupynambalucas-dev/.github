# Ubuntu Native Environment Setup & Readiness Gates

Authoritative technical guide for bootstrapping the native WSL2 Ubuntu development environment,
provisioning the dual k3d clusters (`hub` and `corporate`), executing validation readiness gates
(U0 to U12), and landing the `chore/enterprise-architecture` branch into `develop` and `main`
without losing Git history.

Related documents:

- [Roadmap](./roadmap.md)
- [Tunnel provisioning strategy](./tunnel-provisioning-strategy.md)
- [Enterprise architecture review](./enterprise-architecture-review.md)
- [Infrastructure refactor](./infrastructure-refactor.md)

---

## 1. WSL2 Virtual Machine Preparation

Source code must live directly on the Linux native filesystem (`ext4`) inside WSL2. This eliminates
the NTFS 9P translation latency and `gvproxy` network bottlenecks that cause Skaffold sync timeouts
under Windows.

### Distribution Lifecycle & Provisioning

#### Step 1: Remove Stale Distributions (Optional Clean Slate)

If removing an existing unused distribution (e.g., `Ubuntu-26.04`), unregister it from Windows PowerShell.

> [!WARNING]
> Running `wsl --unregister` permanently deletes the virtual disk image (`ext4.vhdx`) for that distribution. Ensure no required files exist inside it before executing.

```powershell
wsl --shutdown
wsl --unregister Ubuntu-26.04
```

#### Step 2: Install Dedicated Instance (`tupynambalucasdev-ubuntu`)

Provision a clean Ubuntu LTS instance with the dedicated name:

```powershell
wsl --install Ubuntu-24.04 --name tupynambalucasdev-ubuntu
```

#### Step 3: Configure Default User (`tupy`) & Credentials

During the initial initialization prompt, enter the requested credentials:

- **UNIX username**: `tupy`
- **Password**: `Namba47913@`

Alternatively, configure the user and credentials non-interactively as root from Windows PowerShell:

```powershell
# Create user 'tupy' with sudo and docker group memberships
wsl -d tupynambalucasdev-ubuntu -u root -e bash -c "useradd -m -s /bin/bash -G sudo tupy && echo 'tupy:Namba47913@' | chpasswd && printf '[boot]\nsystemd=true\n\n[user]\ndefault=tupy\n' > /etc/wsl.conf"

# Restart WSL to apply systemd and default user settings
wsl --shutdown
```

### Host Resource Allocation (`%UserProfile%\.wslconfig`)

Ensure `%UserProfile%\.wslconfig` on Windows contains sufficient headroom for both clusters and
concurrent builds:

```ini
[wsl2]
memory=16GB
processors=8
swap=4GB
localhostForwarding=true

[experimental]
autoMemoryReclaim=gradual
sparseVhd=true
```

### Systemd & Inotify Configuration

1. Enable `systemd` inside Ubuntu (`/etc/wsl.conf`) to manage the Docker Engine daemon:

   ```ini
   [boot]
   systemd=true
   ```

2. Restart WSL2 from Windows PowerShell to apply:

   ```powershell
   wsl --shutdown
   ```

3. Disable Docker Desktop WSL integration for this distribution (in Docker Desktop: Settings >
   Resources > WSL Integration). Two concurrent Docker daemons conflict with each other.

4. Elevate the `inotify` watcher limits inside Ubuntu for Skaffold file sync and Docusaurus:

   ```bash
   echo 'fs.inotify.max_user_watches=524288' | sudo tee /etc/sysctl.d/99-inotify.conf
   sudo sysctl --system
   ```

5. Configure Git identity and GitHub CLI authentication inside Ubuntu:

   ```bash
   git config --global user.name "<YOUR_NAME>"
   git config --global user.email "<YOUR_EMAIL>"
   git config --global core.autocrlf input
   gh auth login
   ```

---

## 2. Pinned Toolchain Installation

Install all required binaries inside Ubuntu. Exact versions are pinned to guarantee deterministic
environments.

### Build Prerequisites

```bash
sudo apt-get update
sudo apt-get install -y build-essential python3 git jq unzip ca-certificates curl gnupg
```

### Native Docker Engine

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
sudo systemctl enable --now docker
```

### Kubernetes CLI Tools (`k3d`, `kubectl`, `helm`, `skaffold`, `kubeseal`)

```bash
# 1. k3d v5.8.3
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | TAG=v5.8.3 bash

# 2. kubectl v1.31
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' \
  | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl

# 3. Helm v3.16.4
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | DESIRED_VERSION=v3.16.4 bash

# 4. Skaffold v2.13.2
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/v2.13.2/skaffold-linux-amd64
sudo install -m 755 skaffold /usr/local/bin/skaffold
rm skaffold

# 5. kubeseal v0.27.1 (Bitnami Sealed Secrets CLI)
KUBESEAL_VERSION="0.27.1"
curl -OL "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION}/kubeseal-${KUBESEAL_VERSION}-linux-amd64.tar.gz"
tar -xvzf "kubeseal-${KUBESEAL_VERSION}-linux-amd64.tar.gz" kubeseal
sudo install -m 755 kubeseal /usr/local/bin/kubeseal
rm "kubeseal-${KUBESEAL_VERSION}-linux-amd64.tar.gz" kubeseal
```

### Node.js (LTS v22) & pnpm (v12.6.0)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
corepack enable
corepack prepare pnpm@12.6.0 --activate
```

---

## 3. Repository Setup & Zero Data Loss Migration

Setting up native Linux carries **zero risk of losing project files or uncommitted work**:

1. **Filesystem Boundary**: Windows drives (`C:`) and WSL2 disks are physically isolated. Nothing
   executed inside Ubuntu can accidentally destroy files on the Windows filesystem.
2. **Safe Clone**: Clone the repository directly to Linux `ext4` storage (`~/projects/`):

   ```bash
   mkdir -p ~/projects && cd ~/projects
   git clone https://github.com/tupynambalucas-dev/tupynambalucas.git
   cd tupynambalucas
   git checkout chore/enterprise-architecture
   ```

3. **Untracked Secrets Migration (`k8s/.env`)**:
   Because `k8s/.env` is ignored by Git to prevent secret leaks, copy it directly from the Windows
   mount into the Linux repository:

   ```bash
   cp /mnt/c/Users/tupyn/projects/tupynambalucas/k8s/.env ~/projects/tupynambalucas/k8s/.env
   ```

4. **Install Workspace Dependencies**:

   ```bash
   pnpm install --frozen-lockfile
   ```

---

## 4. Network, Registry, and Cluster Provisioning

The architecture runs two isolated clusters (`hub` and `corporate`) connected to a single Docker
network bridge and a shared local registry. Because each cluster runs its own dedicated Cloudflare
Tunnel (`dev-hub` and `dev-corporate`), neither cluster requires host port bindings for 80/443. Both
clusters disable the default k3s Traefik in favor of our customized Helm overlay.

```bash
# 1. Shared Docker network
docker network create k3d-enterprise-net --subnet 172.28.0.0/16

# 2. Shared local container registry
k3d registry create registry.localhost --port 5000

# 3. Host resolution for the registry
echo '127.0.0.1 k3d-registry.localhost' | sudo tee -a /etc/hosts

# 4. Hub Cluster (internal platform & observability - API port 6550)
k3d cluster create hub \
  --network k3d-enterprise-net \
  --servers 1 \
  --agents 1 \
  --image rancher/k3s:v1.31.4-k3s1 \
  --api-port 0.0.0.0:6550 \
  --registry-use k3d-registry.localhost:5000 \
  --k3s-arg "--disable=traefik@server:*"

# 5. Corporate Cluster (external products & web workloads - API port 6551)
k3d cluster create corporate \
  --network k3d-enterprise-net \
  --servers 1 \
  --agents 1 \
  --image rancher/k3s:v1.31.4-k3s1 \
  --api-port 0.0.0.0:6551 \
  --registry-use k3d-registry.localhost:5000 \
  --k3s-arg "--disable=traefik@server:*"

# 6. Configure default repo for Skaffold
skaffold config set default-repo localhost:5000
```

### Cluster Lifecycle: Stopping and Resuming After Reboot

k3d clusters persist their state and local volumes across WSL2 shutdowns and Windows reboots.
Containers are not deleted unless explicitly targeted with `k3d cluster delete`.

#### 1. Stopping Clusters (Before Shutdown)

To gracefully stop the clusters without losing state or data:

```bash
k3d cluster stop hub corporate
```

#### 2. Starting Clusters (After Reboot or WSL Start)

When opening Ubuntu after a system reboot or `wsl --shutdown`:

```bash
# 1. Verify Docker daemon is active (started automatically by systemd)
systemctl is-system-running

# 2. Ensure the local registry container is running
docker start k3d-registry.localhost 2>/dev/null || true

# 3. Start both clusters simultaneously
k3d cluster start hub corporate

# 4. Verify node readiness
kubectl --context k3d-hub get nodes
kubectl --context k3d-corporate get nodes

# 5. Resume Skaffold development loops
skaffold dev -f k8s/skaffold.hub.yaml
skaffold dev -f k8s/skaffold.corporate.yaml
```

#### 3. Recommended Bash Helpers (`~/.bashrc`)

Add the following shortcuts to `~/.bashrc` inside Ubuntu for one-command lifecycle management:

```bash
alias k8s-start="docker start k3d-registry.localhost 2>/dev/null; k3d cluster start hub corporate"
alias k8s-stop="k3d cluster stop hub corporate"
alias k8s-status="k3d cluster list"
```

---

## 5. Sequential Readiness Gates (U0 to U12)

Execute these validation gates sequentially. Each gate defines an explicit command and pass
condition before proceeding to the next.

| Gate    | Action                                     | Verification Command                                                                                 | Pass Condition                                                                    |
| :------ | :----------------------------------------- | :--------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **U0**  | Verify Windows branch committed and pushed | `git status --porcelain` on Windows                                                                  | Output empty, branch ahead by 0 commits.                                          |
| **U1**  | Verify backup and `.env` presence          | `test -f ~/projects/tupynambalucas/k8s/.env && echo OK`                                              | Prints `OK`.                                                                      |
| **U2**  | Verify WSL2 systemd daemon                 | `systemctl is-system-running`                                                                        | Returns `running`.                                                                |
| **U3**  | Verify native Docker Engine                | `docker info --format '{{.ServerVersion}}'`                                                          | Reports native engine, not `desktop-linux`.                                       |
| **U4**  | Verify toolchain CLI versions              | `k3d --version && kubectl version --client && helm version && skaffold version`                      | All exit code 0.                                                                  |
| **U5**  | Verify Git branch & upstream               | `git rev-parse --abbrev-ref HEAD`                                                                    | Prints `chore/enterprise-architecture`.                                           |
| **U6**  | Workspace dependency install               | `pnpm install --frozen-lockfile`                                                                     | Exit code 0, Git hooks initialized.                                               |
| **U7**  | Node status across both clusters           | `kubectl --context k3d-hub get nodes && kubectl --context k3d-corporate get nodes`                   | All nodes report `Ready`.                                                         |
| **U8**  | Registry image push smoke test             | `docker pull alpine && docker tag alpine localhost:5000/alpine && docker push localhost:5000/alpine` | Push finishes successfully.                                                       |
| **U9**  | Render all six overlays via Kustomize      | See command block below                                                                              | All 6 overlays return exit code 0.                                                |
| **U10** | Launch Skaffold dev loops                  | `skaffold dev -f k8s/skaffold.hub.yaml` and `skaffold dev -f k8s/skaffold.corporate.yaml`            | Workloads reach `Running 1/1`; tunnels report `HEALTHY`.                          |
| **U11** | Open repository in VS Code Remote WSL      | `code ~/projects/tupynambalucas`                                                                     | Status bar displays `WSL: tupynambalucasdev-ubuntu`; terminal defaults to `bash`. |
| **U12** | Freelens cluster connectivity              | Windows Freelens connects to merged kubeconfig                                                       | Both `k3d-hub` and `k3d-corporate` show green health in sidebar.                  |

### Gate U9: Kustomize Validation Command

```bash
for env in dev staging prod; do
  for ctx in hub corporate; do
    echo "Rendering $env/$ctx..."
    kubectl kustomize --load-restrictor=LoadRestrictionsNone "k8s/overlays/$env/$ctx" > /dev/null || exit 1
  done
done
echo "All overlays validated successfully."
```

### Cluster Reset & Teardown (Rollback Procedure)

If cluster creation fails or needs a clean reset:

```bash
k3d cluster delete hub corporate
k3d registry delete registry.localhost
docker network rm k3d-enterprise-net
```

---

## 6. Branch Integration Procedure (Landing into `develop` and `main`)

Once the readiness gates pass inside Ubuntu, promote the branch into `develop` and `main`.

### Safety Rules

- **No Squash Merges**: Merging `chore/enterprise-architecture` MUST use a merge commit or
  rebase-and-merge. Squash merges destroy the Git rename detection (`git log --follow`) across the
  869 file moves.
- **No Force Pushes**: Never execute `git push --force` against `develop` or `main`.
- **Renderer Workflow Protection**: The dynamic renderer bot commits directly to `main`. Always
  pull remote before merging.

### Landing Sequence

1. **Compare with Remote Develop**:

   ```powershell
   git fetch --all --prune
   git rev-list --left-right --count origin/develop...chore/enterprise-architecture
   ```

   Expected output: `0 N` (zero commits behind `develop`).

2. **Open PR and Merge into `develop`**:
   - Open a pull request: `chore/enterprise-architecture` -> `develop`.
   - Title: `chore(arch): finalize enterprise infrastructure refactor and corporate workloads`.
   - Merge type: **Create a merge commit** or **Rebase and merge** (DO NOT squash).

3. **Synchronize Local Develop**:

   ```bash
   git checkout develop
   git pull --ff-only origin develop
   git branch -d chore/enterprise-architecture
   git push origin --delete chore/enterprise-architecture
   ```

4. **Synchronize `main` via Short-Lived Sync Branch**:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b chore/sync-main
   git merge --no-ff develop -m "chore: sync develop enterprise architecture into main"
   git push origin chore/sync-main
   ```

   Open a pull request from `chore/sync-main` into `main`, merge, and delete `chore/sync-main`.

---

## 7. IDE Integration, Antigravity CLI & Freelens Connectivity

### Operating Antigravity CLI (`agy`) in WSL2 vs Windows

The monorepo code, native Docker daemon, and Kubernetes clusters run directly on the Linux `ext4`
filesystem. Therefore, running the **Antigravity CLI inside Ubuntu WSL2** is the authoritative
pattern.

#### Architectural Rationale

- **Direct Toolchain Access**: Running `agy` inside Ubuntu grants the agent direct access to `bash`,
  the native Docker daemon socket (`/var/run/docker.sock`), `kubectl`, and the k3d contexts without
  network proxies or WSL path translation.
- **Maximum File I/O Throughput**: Editing files directly on `ext4` eliminates Windows-to-WSL 9P
  filesystem latency.
- **Hot-Reload Integration**: File modifications made by `agy` inside WSL trigger instant hot-reload
  in Skaffold and the VS Code remote window.

#### Installing Antigravity CLI inside Ubuntu

Inside the Ubuntu terminal:

```bash
# Install Antigravity CLI globally via pnpm or npm
pnpm add -g @google/antigravity-cli

# Verify installation
agy --version
```

### Opening the Project in VS Code / Antigravity Remote

VS Code and Antigravity IDE run as native desktop applications on Windows, while language servers,
extensions, and compilers execute inside the Linux container via the Remote WSL architecture:

1. Install the **WSL** extension (`ms-vscode-remote.remote-wsl`) on Windows.
2. From the terminal inside Ubuntu, navigate to the cloned project and launch VS Code:

   ```bash
   cd ~/projects/tupynambalucas
   code .
   ```

3. VS Code launches on Windows with `WSL: tupynambalucasdev-ubuntu` displayed in the bottom-left
   corner.
4. **Terminal Integration**:
   Pressing `` Ctrl+` `` opens an integrated bash shell directly within `~/projects/tupynambalucas` as
   user `tupy`. You can run `agy` directly inside this terminal.
5. **Recommended In-WSL Extensions**:
   - `ms-kubernetes-tools.vscode-kubernetes-tools`: Full cluster explorer in the sidebar (pods,
     logs, helm, port-forwarding) reading `~/.kube/config`.
   - `ms-azuretools.vscode-docker`: Container inspection and registry management.
   - `redhat.vscode-yaml`: Schema validation for Kubernetes manifests.

### Creative Assets & Windows Desktop Software Interoperability

Design and creative assets in `hub/studio/creative/` (Adobe Illustrator `.ai`, Photoshop `.psd`,
Blender `.blend`, and Premiere projects) are authored using native Windows desktop applications.
WSL2 provides transparent, bidirectional filesystem interoperability:

#### 1. Windows File Explorer Access (Linux Node)

Windows 11 displays a native **Linux** folder in the File Explorer sidebar containing all active
distributions:

```text
\\wsl.localhost\tupynambalucasdev-ubuntu\home\tupy\projects\tupynambalucas\hub\studio\creative\
```

- Double-clicking any `.ai` or `.psd` file in Windows Explorer opens it directly inside Adobe
  Illustrator or Photoshop on Windows.
- Saving changes (`Ctrl+S`) writes directly to the Linux `ext4` filesystem. Git and the Antigravity
  CLI inside Ubuntu detect modifications instantly.

#### 2. Launching Windows Creative Apps from Ubuntu Terminal

From the Ubuntu bash shell, you can open Windows File Explorer or trigger the default Windows
application for any creative asset:

```bash
# Open File Explorer in the illustrator assets directory
explorer.exe hub/studio/creative/illustrator

# Launch Adobe Illustrator on Windows for a specific vector asset
cmd.exe /c start "" "hub/studio/creative/illustrator/brand-tupynambalucas-identity.ai"
```

#### 3. Persistent Network Drive Mapping (`Z:`)

For desktop applications that perform better with classic drive letter paths rather than UNC network
paths, map the Linux project root to a Windows drive letter in Windows PowerShell:

```powershell
net use Z: \\wsl.localhost\tupynambalucasdev-ubuntu\home\tupy\projects\tupynambalucas /persistent:yes
```

Creative assets are then directly accessible in Adobe Creative Cloud as:
`Z:\hub\studio\creative\illustrator\brand-tupynambalucas-identity.ai`.

---

Freelens runs as a desktop application on Windows and connects to the k3d clusters inside WSL2 via
localhost port mirroring (`localhostForwarding=true` in `.wslconfig`).

#### Kubeconfig Preparation

k3d generates addresses with `0.0.0.0` by default. Because Windows network sockets require
`127.0.0.1`, sanitize the endpoint addresses and export the merged configuration directly to the
Windows user profile from Ubuntu:

```bash
# 1. Merge contexts inside Ubuntu
k3d kubeconfig merge hub --kubeconfig-merge-default
k3d kubeconfig merge corporate --kubeconfig-merge-default --kubeconfig-switch-context
sed -i 's/0.0.0.0/127.0.0.1/g' ~/.kube/config

# 2. Export merged, sanitized kubeconfig directly to Windows user profile
WIN_USER=$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r')
mkdir -p "/mnt/c/Users/${WIN_USER}/.kube"
cp ~/.kube/config "/mnt/c/Users/${WIN_USER}/.kube/config"
```

#### Connecting Freelens

1. Open Freelens on Windows.
2. Freelens automatically discovers `%USERPROFILE%\.kube\config`.
3. The cluster sidebar displays both clusters:
   - `k3d-hub`: API endpoint `https://127.0.0.1:6550`
   - `k3d-corporate`: API endpoint `https://127.0.0.1:6551`
4. Both clusters connect instantly with full metrics, pod logs, and terminal exec capabilities.

---

## 8. Storage, Disk Compaction & Eviction Management

When running dual k3d clusters in WSL2, the underlying virtual disk (`ext4.vhdx`) will grow. If
the disk hits kubelet eviction thresholds, Kubernetes nodes will transition to the `Evicted` or
`NotReady` state.

### Mitigation Strategies

1. **Regular Docker Pruning**: Clean up stale build layers:

   ```bash
   docker system prune -a --volumes -f
   ```

2. **Compacting the VHDX**: Windows does not shrink the VHDX automatically when files are deleted
   inside Linux. Periodically compact it from Windows PowerShell (with WSL stopped):

   ```powershell
   wsl --shutdown
   Optimize-VHD -Path "$env:LOCALAPPDATA\Packages\CanonicalGroupLimited.Ubuntu2404LTS_79rhkp1fndgsc\LocalState\ext4.vhdx" -Mode Full
   ```

3. **Full Disaster Recovery Snapshot**:
   Take a complete, bootable snapshot of the entire Ubuntu environment from Windows PowerShell:

   ```powershell
   wsl --shutdown
   wsl --export tupynambalucasdev-ubuntu "D:\wsl-backup\ubuntu-enterprise-$(Get-Date -Format 'yyyyMMdd').tar"
   ```
