#!/usr/bin/env bash
set -euo pipefail

ORG="${1:-tupynambalucas-dev}"
REPO="${2:-tupynambalucas-dev}"

echo "Syncing repository permissions for ${ORG}/${REPO}..."

declare -A PERMISSIONS=(
  ["core-engineers"]="push"
  ["infra-ops"]="maintain"
  ["creative-team"]="push"
)

for SLUG in "${!PERMISSIONS[@]}"; do
  PERM="${PERMISSIONS[$SLUG]}"
  echo "Setting permission '${PERM}' for team '${SLUG}' on ${ORG}/${REPO}..."
  gh api -X PUT "/orgs/${ORG}/teams/${SLUG}/repos/${ORG}/${REPO}" \
    -f permission="${PERM}" >/dev/null
done

echo "Repository RBAC sync completed successfully."
