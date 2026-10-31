<#
.SYNOPSIS
    Automated Workstation Provisioning Script for tupynambalucas-dev.
.DESCRIPTION
    Configures Git global defaults, Mani multi-repo orchestrator, cryptographic
    SSH signing, includeIf conditional identity delegation, and GitHub CLI settings.
.PARAMETER DeveloperName
    Full name or GitHub handle for Git commits.
.PARAMETER CorporateEmail
    Corporate email address (default: contato@tupynambalucas.dev).
#>

[CmdletBinding()]
param(
    [string]$DeveloperName = "tupynambalucasdev",
    [string]$CorporateEmail = "contato@tupynambalucas.dev",
    [string]$WorkstationProjectsRoot = "$HOME/projects"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "tupynambalucas-dev Workstation Automated Bootstrapper" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Developer Name: $DeveloperName" -ForegroundColor Gray
Write-Host "Corporate Email: $CorporateEmail" -ForegroundColor Gray
Write-Host "Projects Root: $WorkstationProjectsRoot" -ForegroundColor Gray
Write-Host ""

# 1. Verify Git Installation
Write-Host "[1/6] Verificando instalacao do Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git nao foi encontrado no PATH. Instale via 'winget install Git.Git' e reinicie o terminal."
}
$gitVer = git --version
Write-Host "  $gitVer detectado." -ForegroundColor Green

# 2. Configure Git Global Defaults & Mani Protocol
Write-Host "[2/6] Aplicando diretrizes de seguranca e protocolo Git..." -ForegroundColor Yellow
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global url."git@github.com:".insteadOf https://github.com/
Write-Host "  init.defaultBranch = main" -ForegroundColor Green
Write-Host "  core.autocrlf = true" -ForegroundColor Green
Write-Host "  url.git@github.com:.insteadOf = https://github.com/" -ForegroundColor Green

# 3. Provision Ed25519 SSH Signing Keypair
Write-Host "[3/6] Verificando chave SSH Ed25519 corporativa..." -ForegroundColor Yellow
$sshDir = "$HOME/.ssh"
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
}

$keyFile = "$sshDir/github_tupynambalucas_ed25519"
$pubKeyFile = "$keyFile.pub"

if (-not (Test-Path $pubKeyFile)) {
    Write-Host "  Gerando novo par de chaves Ed25519 em $keyFile..." -ForegroundColor Cyan
    ssh-keygen -t ed25519 -C $CorporateEmail -f $keyFile -N ""
    Write-Host "  Chave gerada com sucesso." -ForegroundColor Green
} else {
    Write-Host "  Chave existente encontrada em $pubKeyFile." -ForegroundColor Green
}

# 4. Configure Cryptographic Commit Signing
Write-Host "[4/6] Configurando assinatura criptografica de commits..." -ForegroundColor Yellow
git config --global gpg.format ssh
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# Normalize path with forward slashes for Windows compatibility in Git config
$pubKeyForwardSlash = $pubKeyFile.Replace("\", "/")
git config --global user.signingkey $pubKeyForwardSlash
Write-Host "  gpg.format = ssh" -ForegroundColor Green
Write-Host "  commit.gpgsign = true" -ForegroundColor Green
Write-Host "  user.signingkey = $pubKeyForwardSlash" -ForegroundColor Green

# 5. Create Conditional Identity Config (`includeIf:gitdir`)
Write-Host "[5/6] Configurando isolamento de namespaces corporativos..." -ForegroundColor Yellow
$corpGitConfigPath = "$HOME/.gitconfig-tupynambalucas-dev"
$corpContent = @"
[user]
	name = $DeveloperName
	email = $CorporateEmail
	signingkey = $pubKeyForwardSlash

[commit]
	gpgsign = true

[tag]
	gpgsign = true

[gpg]
	format = ssh
"@
Set-Content -Path $corpGitConfigPath -Value $corpContent -Encoding UTF8 -Force
Write-Host "  Configuracao corporativa salva em $corpGitConfigPath." -ForegroundColor Green

# Link conditional include in ~/.gitconfig
$normProjectsRoot = $WorkstationProjectsRoot.Replace("\", "/")
if (-not $normProjectsRoot.EndsWith("/")) { $normProjectsRoot += "/" }
$orgGitDir = "${normProjectsRoot}organizations/tupynambalucas-dev/"
$corpGitConfigForwardSlash = $corpGitConfigPath.Replace("\", "/")

git config --global "includeIf.gitdir:$orgGitDir.path" $corpGitConfigForwardSlash
Write-Host "  includeIf 'gitdir:$orgGitDir' -> $corpGitConfigForwardSlash" -ForegroundColor Green

# 6. Configure GitHub CLI
Write-Host "[6/6] Padronizando configuracoes do GitHub CLI (gh)..." -ForegroundColor Yellow
if (Get-Command gh -ErrorAction SilentlyContinue) {
    gh config set git_protocol ssh
    gh config set prompt enabled
    Write-Host "  gh git_protocol = ssh" -ForegroundColor Green
} else {
    Write-Host "  Aviso: gh nao instalado. Recomendado: 'winget install GitHub.cli'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Bootstrapping concluido com sucesso!" -ForegroundColor Green
Write-Host "Execute o verificador pre-flight agora para validar os 7 gates:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File agent-mesh/scripts/verify-workstation.ps1" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
