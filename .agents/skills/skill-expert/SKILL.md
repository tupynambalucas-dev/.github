---
name: skill-expert
description: Use this skill when creating, refining, testing, analyzing, or updating custom Agent Skills (.agents/skills/*), authoring SKILL.md instructions, designing executable script helpers, or optimizing skill descriptions and evals.
---

# Agent Skill Creator & Engineering Standard

This skill establishes the authoritative engineering guidelines, format specifications, authoring
playbooks, and automated verification protocols for Agent Skills in the repository, adhering
strictly to the open Agent Skills specification utilized by Antigravity.

---

## 1. Directory Structure Standards

Every custom Agent Skill MUST reside in a dedicated directory under `.agents/skills/<skill-name>/`
and adhere to the canonical structure:

```plaintext
.agents/skills/<skill-name>/
├── SKILL.md                 # Required: frontmatter metadata + core instructions (< 500 lines)
├── scripts/                 # Optional: non-interactive, self-contained executable automation
├── references/              # Optional: focused, on-demand documentation and domain manuals
├── assets/                  # Optional: static templates, schemas, lookup tables, or mockups
└── evals/                   # Optional: test prompts, expected outputs, and assertion definitions
```

All files within a skill's directory MUST be written in **English (en-US)**, contain **zero
emojis**, and use **clickable relative markdown links** exclusively. Absolute paths and `file:///`
URLs are strictly forbidden.

---

## 2. Frontmatter Specifications

The `SKILL.md` file MUST begin with a valid YAML frontmatter block enclosed by `---` lines. Per the
Agent Skills specification, only the following six fields are permitted. Any unexpected fields will
fail validation:

| Field           | Required | Type   | Constraints & Standards                                                                                                                                                                                                   |
| :-------------- | :------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`          | Yes      | String | 1-64 characters. Unicode lowercase alphanumeric characters and hyphens (`[a-z0-9-]`) only. Must not start or end with a hyphen, nor contain consecutive hyphens (`--`). **Must match the parent directory name exactly**. |
| `description`   | Yes      | String | 1-1024 characters. Non-empty. Imperative phrasing detailing what the skill does and when the agent should use it ("Use this skill when..."). Must include domain triggers, keywords, and boundaries.                      |
| `license`       | No       | String | Short license identifier (e.g., `Apache-2.0`, `MIT`) or reference to a bundled license file.                                                                                                                              |
| `compatibility` | No       | String | 1-500 characters. Environment or runtime prerequisites (e.g., "Requires Python 3.11+, uv, and Docker").                                                                                                                   |
| `metadata`      | No       | Map    | Key-value mapping from string keys to string values for custom client-specific properties.                                                                                                                                |
| `allowed-tools` | No       | String | Space-separated list of pre-approved tools the skill requires (e.g., `Bash(git:*) Read`).                                                                                                                                 |

For complete frontmatter details, read [specification.md](./references/specification.md).

---

## 3. Progressive Disclosure Architecture

To prevent context window bloat, Antigravity loads skills through a 3-stage progressive disclosure
model:

1. **Discovery (~100 tokens)**: At agent startup, only `name` and `description` are loaded. The
   agent inspects descriptions to evaluate relevance to the user prompt.
2. **Activation (< 5,000 tokens)**: When the user task matches a skill's description, the agent loads
   the complete `SKILL.md` body into context.
3. **Execution (On Demand)**: Auxiliary files in `scripts/`, `references/`, or `assets/` are loaded
   only when instructions explicitly require them.

### Progressive Rules

- `SKILL.md` MUST remain strictly under **500 lines** and under 5,000 tokens.
- Bulky documentation, extensive schema matrices, and edge-case catalogs MUST be extracted to
  separate files in `references/`.
- Tell the agent _exactly when_ to read reference files:
  > Read [api-errors.md](./references/api-errors.md) if the endpoint returns a non-200 status code.
- Keep file references one level deep from `SKILL.md`. Avoid deep nesting chains.

---

## 4. Skill Authoring Playbook

Follow these core practices when drafting skill instructions:

### A. Ground in Real Expertise

- Ground instructions in real project artifacts, schemas, and runbooks rather than generic LLM
  advice.
- Focus on what the agent _would not know_ without the skill (project conventions, edge cases,
  environment-specific tools), omitting general concepts the model already knows.

### B. Calibrate Control

- **Freedom for Flexibility**: When multiple paths are valid, explain the underlying rationale
  rather than dictating rigid steps.
- **Prescription for Fragility**: When operations are delicate or error-prone, specify exact commands
  and flags.
- **Defaults over Menus**: Pick an authoritative default approach with a clear fallback, avoiding
  broad menus of equal choices.
- **Procedures over Declarations**: Teach the agent _how to approach_ the class of problems.

### C. Core Instruction Patterns

- **Gotchas Section**: Include a dedicated list of non-obvious traps, quirks, and environment facts
  that defy typical assumptions.
- **Output Templates**: Provide concrete markdown, YAML, or JSON templates for desired outputs.
- **Multi-Step Checklists**: Use progressive checklists to track dependencies and stages.
- **Validation Loops**: Direct the agent to execute, run a validator, fix issues, and repeat.
- **Plan-Validate-Execute**: For destructive or batch operations, create a structured plan, validate
  against the source of truth, and execute only upon approval.

For in-depth authoring patterns and design principles, read [best-practices.md](./references/best-practices.md).

---

## 5. Executable Script Design (`scripts/`)

When bundling scripts in `scripts/`:

1. **Strictly Non-Interactive**: Scripts MUST run in non-interactive shells. TTY prompts, password
   inputs, or interactive confirmation menus will cause execution to hang indefinitely.
2. **Usage with `--help`**: Provide a concise `--help` flag documenting arguments, options, and
   typical usage examples.
3. **Structured Outputs**: Output parseable data (JSON, CSV) to `stdout` and diagnostic logs,
   warnings, or progress to `stderr`.
4. **Actionable Error Messages**: Explain clearly what failed, what was expected, and how to fix it.
5. **Self-Contained Dependencies**: Declare inline script dependencies (e.g., PEP 723 for Python via
   `uv run`, or Node/TypeScript via `pnpm dlx tsx`).
6. **Idempotency & Safety**: Support `--dry-run` for stateful or destructive modifications. Ensure
   operations can be retried safely.

For complete script guidelines and multi-language patterns, read [using-scripts.md](./references/using-scripts.md).

---

## 6. Trigger Optimization & Evaluation (`evals/`)

### A. Description Optimization

- Write imperative descriptions focused on user intent: "Use this skill when...".
- Err on the side of being pushy by including specific keywords, file paths, and near-miss
  boundaries.
- Design ~20 eval queries (positive triggers and negative near-misses) split into train (60%) and
  validation (40%) sets.
- Compute trigger rates across multiple runs to verify accuracy before finalizing.

For step-by-step trigger optimization loops, read [optimizing-descriptions.md](./references/optimizing-descriptions.md).

### B. Output Quality Evaluation

- Define test cases in `evals/evals.json` with realistic prompts, expected outputs, and objective
  assertions.
- Run test cases both with the skill and without the skill (or against a previous version snapshot)
  to measure the pass rate and token/time deltas.
- Grade assertions objectively requiring concrete evidence from generated outputs.

For full eval-driven iteration workflows, read [evaluating-skills.md](./references/evaluating-skills.md).
For a step-by-step tutorial on creating a skill from scratch, read [quickstart.md](./references/quickstart.md).

---

## 7. Automated Skill Validation

Before concluding any skill creation or update, execute the automated validator from the workspace
root:

```bash
pnpm dlx tsx .agents/skills/skill-expert/scripts/validate-skill.ts --path .agents/skills/<skill-name>
```

Verify that the command exits with code `0`. Fix any flagged issues before declaring the task
complete.
