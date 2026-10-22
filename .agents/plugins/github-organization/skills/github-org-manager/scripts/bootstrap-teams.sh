#!/usr/bin/env bash
set -euo pipefail

ORG="${1:-tupynambalucas-dev}"

echo "Configuring teams for organization: ${ORG}..."

declare -A TEAMS=(
  ["core-engineers"]="Core software engineers and application developers"
  ["infra-ops"]="Platform and DevOps engineers managing infrastructure and CI/CD"
  ["creative-team"]="Designers and creative professionals managing brand assets"
)

for SLUG in "${!TEAMS[@]}"; do
  DESC="${TEAMS[$SLUG]}"
  if gh api "/orgs/${ORG}/teams/${SLUG}" >/dev/null 2>&1; then
    echo "Team '${SLUG}' already exists. Updating metadata..."
    gh api -X PATCH "/orgs/${ORG}/teams/${SLUG}" -f description="${DESC}" >/dev/null
  else
    echo "Creating team '${SLUG}'..."
    gh api -X POST "/orgs/${ORG}/teams" \
      -f name="${SLUG}" \
      -f description="${DESC}" \
      -f privacy="closed" >/dev/null
  fi
done

echo "Team bootstrap completed successfully."
