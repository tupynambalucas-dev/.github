# .vscode/terminal/windows/install-profiles.ps1

$projectName = "TupynambaProject"
$sourcePath = Resolve-Path ".\.vscode\terminal\windows\Fragments\$projectName"
$wtFragmentsDir = "$env:LOCALAPPDATA\Microsoft\Windows Terminal\Fragments\$projectName"

Write-Host "Instalando Profiles Locais do Windows Terminal..." -ForegroundColor Cyan

if (-not (Test-Path "$env:LOCALAPPDATA\Microsoft\Windows Terminal\Fragments")) {
    New-Item -Path "$env:LOCALAPPDATA\Microsoft\Windows Terminal\Fragments" -ItemType Directory -Force | Out-Null
}

if (Test-Path $wtFragmentsDir) {
    Remove-Item -Path $wtFragmentsDir -Recurse -Force
}

# Cria um Hard Link / Junção de Diretório apontando para os nossos profiles locais
New-Item -ItemType Junction -Path $wtFragmentsDir -Target $sourcePath | Out-Null

Write-Host "Pronto! O Windows Terminal agora reconhece as tasks 'Tupynamba - Admin CLI' automaticamente!" -ForegroundColor Green
