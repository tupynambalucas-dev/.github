<#
.SYNOPSIS
    Pre-flight workstation readiness gate for tupynambalucas-dev developers and AI agents.
.DESCRIPTION
    Validates Git version, cryptographic commit signing, Mani multi-repo orchestrator,
    GitHub CLI authentication, and repository tree health across 7 compliance gates.
#>

[CmdletBinding()]
param(
    [switch]$Fix = $false
)

$ErrorActionPreference = "Continue"
$failedGates = 0

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "tupynambalucas-dev Workstation Readiness Gate Verification" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Gate 1: Git Version Check (>= 2.36.0 required for SSH signing and conditional includes)
Write-Host "[Gate 1/7] Inspecionando versao do Git..." -NoNewline
try {
    $gitVerStr = (git --version) -replace "git version ", "" -replace "\.windows.*", ""
    $gitVer = [version]($gitVerStr.Split(" ")[0])
    $minVer = [version]"2.36.0"
    if ($gitVer -ge $minVer) {
        Write-Host " PASS (Git $gitVer >= 2.36.0)" -ForegroundColor Green
    } else {
        Write-Host " FAIL (Git $gitVer detectado. Minimo exigido: 2.36.0)" -ForegroundColor Red
        Write-Host "  Remediacao: Atualize o Git via 'winget upgrade Git.Git' ou 'brew upgrade git'" -ForegroundColor Yellow
        $failedGates++
    }
} catch {
    Write-Host " FAIL (Git nao encontrado no PATH)" -ForegroundColor Red
    $failedGates++
}

# Gate 2: SSH Signing Key Existence
Write-Host "[Gate 2/7] Inspecionando chave Ed25519 de assinatura..." -NoNewline
$sshKeyPath = "$HOME/.ssh/github_tupynambalucas_ed25519.pub"
$signingKeyConfig = (git config --get user.signingkey 2>$null)

if ($signingKeyConfig -and (Test-Path $signingKeyConfig)) {
    Write-Host " PASS (Chave de assinatura ativa: $signingKeyConfig)" -ForegroundColor Green
} elseif (Test-Path $sshKeyPath) {
    Write-Host " PASS (Chave encontrada em $sshKeyPath)" -ForegroundColor Green
} else {
    Write-Host " FAIL (Chave SSH Ed25519 nao encontrada)" -ForegroundColor Red
    Write-Host "  Remediacao: Execute 'ssh-keygen -t ed25519 -C `"contato@tupynambalucas.dev`" -f `"$HOME/.ssh/github_tupynambalucas_ed25519`"'" -ForegroundColor Yellow
    $failedGates++
}

# Gate 3: Commit GPG/SSH Signing Configuration
Write-Host "[Gate 3/7] Inspecionando configuracao de assinatura criptografica..." -NoNewline
$gpgFormat = (git config --get gpg.format 2>$null)
$commitGpgSign = (git config --get commit.gpgsign 2>$null)

if ($gpgFormat -eq "ssh" -and $commitGpgSign -eq "true") {
    Write-Host " PASS (gpg.format=ssh, commit.gpgsign=true)" -ForegroundColor Green
} else {
    Write-Host " FAIL (Assinatura nao configurada globalmente)" -ForegroundColor Red
    if ($Fix) {
        git config --global gpg.format ssh
        git config --global commit.gpgsign true
        git config --global tag.gpgsign true
        Write-Host "  [Auto-Fix] Aplicado: gpg.format=ssh, commit.gpgsign=true" -ForegroundColor Cyan
    } else {
        Write-Host "  Remediacao: Execute: git config --global gpg.format ssh; git config --global commit.gpgsign true" -ForegroundColor Yellow
        $failedGates++
    }
}

# Gate 4: Mani Multi-Repository CLI Orchestrator
Write-Host "[Gate 4/7] Inspecionando orquestrador multi-repositorio Mani..." -NoNewline
$maniCmd = (Get-Command mani -ErrorAction SilentlyContinue)

if ($maniCmd) {
    $maniVer = (mani --version 2>$null | Select-Object -First 1)
    Write-Host " PASS ($maniVer)" -ForegroundColor Green
} else {
    Write-Host " FAIL (Mani nao encontrado no PATH)" -ForegroundColor Red
    if ($Fix) {
        if (Get-Command scoop -ErrorAction SilentlyContinue) {
            scoop bucket add poldi https://github.com/aliesbelik/poldi
            scoop install mani
            Write-Host "  [Auto-Fix] Mani instalado via Scoop" -ForegroundColor Cyan
        } else {
            Write-Host "  Remediacao: Instale via Scoop ('scoop install mani') ou baixe o binario do GitHub Releases" -ForegroundColor Yellow
            $failedGates++
        }
    } else {
        Write-Host "  Remediacao: Instale o Mani via Scoop ('scoop install mani') ou adicione o binario ao PATH" -ForegroundColor Yellow
        $failedGates++
    }
}

# Gate 5: Node.js & pnpm Environment
Write-Host "[Gate 5/7] Inspecionando Node.js e gerenciador pnpm..." -NoNewline
$nodeCmd = (Get-Command node -ErrorAction SilentlyContinue)
$pnpmCmd = (Get-Command pnpm -ErrorAction SilentlyContinue)

if ($nodeCmd -and $pnpmCmd) {
    $nodeVer = (node --version)
    $pnpmVer = (pnpm --version)
    Write-Host " PASS (Node $nodeVer, pnpm $pnpmVer)" -ForegroundColor Green
} else {
    Write-Host " FAIL (Node.js ou pnpm ausente)" -ForegroundColor Red
    Write-Host "  Remediacao: Instale Node.js >= 22 e execute 'corepack enable'" -ForegroundColor Yellow
    $failedGates++
}

# Gate 6: Git Protocol Defaults
Write-Host "[Gate 6/7] Inspecionando protocolo padrao Git SSH..." -NoNewline
$urlInsteadOf = (git config --get url.git@github.com:.insteadOf 2>$null)

if ($urlInsteadOf -eq "https://github.com/") {
    Write-Host " PASS (SSH em vez de HTTPS configurado)" -ForegroundColor Green
} else {
    Write-Host " WARN (url.git@github.com:.insteadOf nao configurado)" -ForegroundColor Yellow
    if ($Fix) {
        git config --global url."git@github.com:".insteadOf https://github.com/
        Write-Host "  [Auto-Fix] Aplicado: url.git@github.com:.insteadOf = https://github.com/" -ForegroundColor Cyan
    } else {
        Write-Host "  Remediacao recomendada: git config --global url.`"git@github.com:`".insteadOf https://github.com/" -ForegroundColor Gray
    }
}

# Gate 7: GitHub CLI Authentication & Git Protocol
Write-Host "[Gate 7/7] Inspecionando autenticacao do GitHub CLI (gh)..." -NoNewline
try {
    $ghStatus = (gh auth status 2>&1 | Out-String)
    if ($ghStatus -match "Logged in to github.com") {
        Write-Host " PASS (gh autenticado)" -ForegroundColor Green
    } else {
        Write-Host " FAIL (gh nao autenticado)" -ForegroundColor Red
        Write-Host "  Remediacao: Execute 'gh auth login --git-protocol ssh --web'" -ForegroundColor Yellow
        $failedGates++
    }
} catch {
    Write-Host " FAIL (GitHub CLI nao encontrado)" -ForegroundColor Red
    Write-Host "  Remediacao: Instale o GitHub CLI via 'winget install GitHub.cli'" -ForegroundColor Yellow
    $failedGates++
}

Write-Host ""
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

if ($failedGates -eq 0) {
    Write-Host "SUCESSO: Todos os gates de conformidade foram aprovados." -ForegroundColor Green
    Write-Host "A estacao de trabalho esta pronta para desenvolvimento no org-core e repositorios soberanos." -ForegroundColor Green
    exit 0
} else {
    Write-Host "FALHA: $failedGates gate(s) de conformidade falharam." -ForegroundColor Red
    Write-Host "Execute '.\agent-mesh\scripts\verify-workstation.ps1 -Fix' para correcao automatica." -ForegroundColor Yellow
    exit 1
}
