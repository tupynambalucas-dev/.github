# GitHub Documentation Workflow

This reference defines the verification steps required when creating, updating, or analyzing general repository Markdown files (.md, README.md, skill documentation).

## 1. Documentation Integrity

- **Git Diff Inspection**: Review `git diff` to ensure that no critical sections, links, or technical guidelines were accidentally deleted or modified during the edit.
- **Reference Validation**: Check that any file links added or modified point to existing, valid paths in the repository using the correct relative directory depth.
- **Absolute Path Prohibition Verification**: Ensure that NO absolute filesystem paths or local protocol URLs (e.g., file scheme paths or `/absolute/...`) are introduced into any links or references. All links must be relative paths or fully-qualified public web URLs with explicit domains.

## 2. Formatting Check

- Verify that semantic line breaks are used (one sentence per line where practical) to keep Git diffs clean.
- Ensure only GFM-supported callouts are used (`> [!NOTE]`, etc.).
- Run `pnpm exec prettier --check <file>` to verify Prettier compliance. If there are formatting issues, resolve them using `pnpm exec prettier --write <file>`.
