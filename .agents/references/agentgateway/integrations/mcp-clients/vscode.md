# Windows Terminal Integration & JSON Fragments

This document describes how to manage Windows Terminal profiles locally within a repository without forcing users to manually edit their global Windows Terminal `settings.json` app configuration.

## The Problem

Windows Terminal (`wt.exe`) **does not** support a command-line argument like `--settings ./local-settings.json` to load an arbitrary configuration file. The settings path is strictly hardcoded to the application's `LocalState` directory.

## The Solution: JSON Fragment Extensions

Windows Terminal supports **JSON Fragment Extensions**. This allows applications (or scripts) to drop small `.json` files containing profile definitions into a specific system folder. Windows Terminal dynamically reads these fragments and merges them into the user's available profiles.

### Fragment Structure

A fragment file (e.g., `profiles.json`) looks like this:

```json
{
  "profiles": [
    {
      "name": "Project X - Admin CLI",
      "commandline": "pwsh.exe",
      "elevate": true,
      "startingDirectory": "${workspaceFolder}",
      "colorScheme": "Campbell Powershell",
      "icon": "ms-appx:///ProfileIcons/pwsh.png"
    }
  ]
}
```

### Where to Place Fragments

To make Windows Terminal read your custom profiles without editing the main app, the JSON fragment must be placed (or symlinked) into:
`%LOCALAPPDATA%\Microsoft\Windows Terminal\Fragments\{AppName}\{file-name}.json`

_Note: `{AppName}` can be any custom folder name you choose for your project._

### Implementation Strategy for this Repository

1. **Store locally:** Keep your custom `.json` profiles inside `.vscode/terminal-windows/Fragments/`.
2. **Symlink script:** Create an initialization script (`setup-terminal.ps1`) that creates a Symbolic Link from the `.vscode` fragments folder to the `%LOCALAPPDATA%` fragments folder.
3. **Usage:** Once linked, the VS Code tasks can simply call `wt.exe --profile "Project X - Admin CLI"` and Windows Terminal will instantly recognize it.

This approach keeps terminal configurations version-controlled in the repository while seamlessly integrating with the user's local Windows Terminal app.
