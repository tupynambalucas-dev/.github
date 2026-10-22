# .vscode/scripts/launch-agy-wsl.ps1

$d = (wsl.exe -l -q) -replace '\0',''
$distro = if ($d -match 'tupynambalucasdev-ubuntu') {
    'tupynambalucasdev-ubuntu'
} elseif ($d -match 'Ubuntu-26.04') {
    'Ubuntu-26.04'
} else {
    'Ubuntu'
}

Clear-Host
Write-Host "Disabling gravity modules in Linux subsystem ($distro)..." -ForegroundColor Cyan
Write-Host "Connecting to native ext4 workspace..." -ForegroundColor DarkGray
Write-Host "--------------------------------" -ForegroundColor DarkGray

wsl.exe -d $distro bash --login -c "if [ -d ~/projects/tupynambalucas ]; then cd ~/projects/tupynambalucas; fi; if command -v agy >/dev/null 2>&1; then agy; elif [ -f package.json ]; then pnpm agy; else echo 'Antigravity CLI not installed yet. Run: pnpm add -g @google/antigravity-cli'; exec bash; fi; exec bash"
