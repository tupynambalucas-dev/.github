# Repository Ruleset Schemas

This document defines the JSON payloads used to enforce repository branch protection rulesets via
the GitHub REST API (`POST /repos/{owner}/{repo}/rulesets`).

---

## 1. Production Ruleset (`main`)

Targeted to `refs/heads/main` to guarantee zero unverified commits and linear history:

```json
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
```

---

## 2. Integration Ruleset (`develop`)

Targeted to `refs/heads/develop` to maintain integration integrity without slowing automated workflows:

```json
{
  "name": "enterprise-integration-develop",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/develop"],
      "exclude": []
    }
  },
  "rules": [{ "type": "deletion" }, { "type": "non_fast_forward" }]
}
```
