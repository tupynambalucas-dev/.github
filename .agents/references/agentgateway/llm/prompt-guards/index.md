# Guardrails

Protect LLM interactions with prompt guards that evaluate and filter requests and responses for
harmful or policy-violating content.

Guardrails are security policies that inspect LLM requests and responses to detect and block
harmful, policy-violating, or inappropriate content before it reaches the model or the user. You can
apply prompt guards to the request phase, the response phase, or both.

To learn more about guardrails, see the following topic.

To set up guardrails, check out the following guides.

To track guardrails and content safety, see the following guide.

[About guardrails

How agentgateway’s content safety controls, such as PII detection and DLP, layer to guard LLM …](overview.md)[Regex filters

Match and redact prompt content with custom regex patterns or agentgateway’s built-in PII detectors.](regex.md)[OpenAI moderation

Use the OpenAI Moderation API as a prompt guard to screen LLM traffic for harmful content.](moderation.md)[AWS Bedrock Guardrails

Apply AWS Bedrock Guardrails to filter LLM requests and responses for policy-violating content.](bedrock-guardrails.md)[Azure AI Content Safety

Apply Azure AI Content Safety to detect harmful content and jailbreak attempts in LLM requests and …](azure-content-safety.md)[Google Model Armor

Apply Google Cloud Model Armor templates to sanitize LLM requests and responses.](google-model-armor.md)[Custom webhooks

Integrate custom webhook servers to configure advanced content safety requirements.](webhooks.md)[Multi-layered guardrails

Chain multiple prompt guards so each request passes every check in order, for defense in depth.](multi-layer.md)

[Cost controls](/docs/standalone/latest/llm/cost-controls/ 'Cost controls')[Observe traffic](/docs/standalone/latest/llm/observability/ 'Observe traffic')

Was this page helpful?
