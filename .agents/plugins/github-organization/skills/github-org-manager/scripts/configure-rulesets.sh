#!/usr/bin/env bash
set -euo pipefail

ORG="${1:-tupynambalucas-dev}"
REPO="${2:-tupynambalucas-dev}"

echo "Configuring branch rulesets for ${ORG}/${REPO}..."

MAIN_RULESET_PAYLOAD=$(cat <<'EOF'
{
  "name": "enterprise-production-main",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    { "type": "required_signatures" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": true,
        "required_review_thread_resolution": true
      }
    }
  ]
}
EOF
)

echo "Applying production ruleset on 'main'..."
gh api -X POST "/repos/${ORG}/${REPO}/rulesets" \
  --input - <<< "${MAIN_RULESET_PAYLOAD}" >/dev/null 2>&1 || \
echo "Ruleset already active or requires update."

echo "Ruleset configuration completed successfully."
