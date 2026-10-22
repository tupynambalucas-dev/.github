---
name: plugin-expert
description: Use this skill when creating, structuring, or updating Antigravity plugins, authoring plugin.json manifests, or bundling MCP servers, skills, and rules into deployable assets.
---

# Antigravity Plugin Engineering Standard

This skill establishes the authoritative engineering guidelines, format specifications, and authoring playbooks for creating Antigravity plugins within the repository.

---

## 1. Directory Structure Standards

Every custom Antigravity plugin MUST reside in a dedicated directory under `.agents/plugins/<plugin-name>/` (for workspace-level plugins) or `~/.gemini/config/plugins/<plugin-name>/` (for global plugins) and adhere to the canonical structure:

```plaintext
plugins/<plugin-name>/
├── plugin.json       # Required: Manifest file with metadata
├── mcp_config.json   # Optional: MCP server definitions
├── hooks.json        # Optional: Lifecycle hooks definition
├── skills/           # Optional: Directory for Agent Skills
│   └── <skill-name>/
│       └── SKILL.md
├── agents/           # Optional: Subagent definition templates (.md)
└── rules/            # Optional: Behavioral constraints and style rules (.md)
```

All files within a plugin's directory MUST use **clickable relative markdown links** exclusively when referencing other files within the bundle.

---

## 2. Manifest Specification (`plugin.json`)

The `plugin.json` file is the required marker and manifest file for any plugin. It MUST be located at the root of the plugin directory and adhere to the following schema:

```json
{
  "$schema": "https://antigravity.google/schemas/v1/plugin.json",
  "name": "my-custom-plugin",
  "description": "A brief description of what my plugin does."
}
```

### Constraints:

- `name`: (Required) The unique, machine-readable name of the plugin. MUST contain only alphanumeric characters, hyphens, and underscores (`^[a-zA-Z0-9-_]+$`). MUST exactly match the plugin's folder name.
- `description`: (Optional but highly recommended) A brief human-readable description of the plugin's purpose.
- `$schema`: (Recommended) Include the official schema URL to enable IDE autocompletion and validation.

---

## 3. Component Design & Bundling

Plugins can bundle multiple customization types into a single deployable asset. When bundling components, adhere to the following rules:

### A. Skills (`skills/`)

- Custom skills bundled inside a plugin MUST follow the exact same standards as standalone skills (see the `skill-expert` skill).
- They must reside in `skills/<skill-name>/SKILL.md` and use the 3-stage progressive disclosure architecture.

### B. Rules (`rules/`)

- Store localized behavioral constraints, style guidelines, or system instructions as Markdown (`.md`) files in the `rules/` directory.

### C. MCP Servers (`mcp_config.json`)

- Use this file to declare and connect external Model Context Protocol (MCP) tool servers.
- Ensure all environment variables or local paths referenced in `mcp_config.json` are properly documented so the plugin remains portable.

### D. Subagents (`agents/`)

- Store Markdown files defining custom subagents and persona configurations in the `agents/` directory.

### E. Lifecycle Hooks (`hooks.json`)

- Use this file to define event handlers that execute shell commands before or after tool calls.
- **Supported Events**: `PreInvocation`, `PreToolUse`, `PostToolUse`, `PostInvocation`, `Stop`.
- **Absolute Paths**: Commands inside `hooks.json` must use absolute paths.
- **Example Schema**:
  ```json
  {
    "hooks": [
      {
        "event": "PreToolUse",
        "matcher": "create_flag|toggle_flag_environment",
        "command": "/absolute/path/to/script.sh"
      }
    ]
  }
  ```

---

## 4. Plugin Creation Playbook

When tasked with creating a new plugin, follow this exact workflow:

### Step 1: Scaffold the Structure

1. Create the base directory: `.agents/plugins/<plugin-name>/`.
2. Create the `plugin.json` manifest and populate it with the `$schema`, `name`, and `description`.

### Step 2: Bundle Components

1. **MCP Configurations**: If the plugin wraps an MCP server, create `mcp_config.json`.
2. **Rules**: If the plugin requires the agent to follow specific behaviors, write the corresponding rule files in `rules/`.
3. **Skills**: If the plugin provides new agentic runbooks, create them in `skills/` following the `skill-expert` standards.
4. **Hooks**: If the plugin needs to intercept agent tool executions, define `hooks.json`.

### Step 3: Validate Installation

- Plugins placed in `.agents/plugins/` are automatically activated for the workspace.
- To interactively manage or verify plugins in an Antigravity CLI session, recommend the user to use the `/plugin list`, `/plugin enable <plugin-name>`, or `/plugin disable <plugin-name>` commands.

---

## 5. Gotchas & Edge Cases

- **Name Mismatches**: The `name` field in `plugin.json` MUST exactly match the plugin's folder name.
- **Cross-Surface Sync**: Plugins installed via Antigravity 2.0 or CLI are synchronized. Be aware that global plugins (`~/.gemini/config/plugins/`) affect all workspaces, while `.agents/plugins/` only affects the current project.
- **Portability**: Do not use absolute paths (e.g., `<absolute-windows-path>` or `/home/...`) inside `mcp_config.json` or `plugin.json` if the plugin is meant to be shared across machines. Use relative paths or environment variables, except for `hooks.json` command execution paths which explicitly require absolute paths in the current engine version.
