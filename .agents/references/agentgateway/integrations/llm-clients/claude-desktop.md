# Claude Desktop

Configure Claude Desktop to use agentgateway

Configure [Claude Desktop](https://claude.com/download) to route requests through your agentgateway
proxy.

## About third-party inference mode

Claude Desktop sends model traffic to Anthropic by default. Third-party inference mode changes that
destination to an endpoint that you operate, such as an agentgateway proxy. Anthropic made this mode
generally available on July 9, 2026.

Anthropic designed the mode for organizations whose security, regulatory, or contractual
requirements prevent them from sending data to Anthropic’s first-party infrastructure. Prompts,
responses, files, and tool outputs go only to the endpoint that you configure, and conversation
history stays on the user’s device. You can create an agentgateway proxy at that endpoint, so that
every Claude Desktop request passes through your policies for authentication, guardrails, rate
limits, and observability before it reaches a model.

Keep the following behavior in mind:

- One setting covers the whole Claude Desktop app. Chat, Cowork, and Code all send inference to the endpoint that you configure.
- Claude Desktop reads its configuration once, at launch. After you change a setting, fully quit the app and reopen it.
- The gateway URL must use HTTPS unless it is a loopback address. A plain HTTP URL on any other host fails validation with the error `Invalid custom3p enterprise config: baseUrl: must use https (or http on loopback)`.
- Managed configuration wins. When an administrator delivers settings through mobile device management (MDM), users cannot override them.

For the full list of settings, see the [Claude Desktop configuration
reference](https://claude.com/docs/third-party/claude-desktop/configuration).

The steps in this guide run agentgateway on the same machine as Claude Desktop and use the loopback
address `127.0.0.1`, so no certificate is needed. To point Claude Desktop at an agentgateway proxy
on another host, serve the proxy over HTTPS. For more information, see [HTTPS
listeners](../../configuration/listeners.md#https-listeners).

## Before you begin

1. [Install the `agentgateway` binary](../../deployment/binary.md).
2. Install [Claude Desktop](https://claude.com/download).
3. Decide how the proxy authenticates callers, and meet the requirements for that path.

   - **A gateway API key**, which [Use Client Setup with a gateway API key](#client-setup) covers. Configure an LLM model and a [virtual API key](../../llm/cost-controls/virtual-keys.md) in agentgateway.
   - **A shared token from a Claude subscription**, which [Configure agentgateway with a Claude subscription](#configure-agentgateway) covers. You need a Claude Teams or Pro subscription, and the [Claude Code CLI](https://code.claude.com/docs) (`npm install -g @anthropic-ai/claude-code`), which provides the `claude setup-token` command.
   - **A per-user token from your identity provider**, which [Authenticate users with your identity provider](#sso) covers. You need an OIDC provider and an Anthropic API key for the proxy to send upstream.

## Use Client Setup with a gateway API key

> [!TIP] Tip If you manage models and virtual API keys in the standalone Admin UI, Client Setup can generate the connection settings or snippet for this client. Review the gateway URL, select a model and key, choose the client from the Integration dropdown, and copy the recipe. Each recipe uses only the values that its client supports. Client Setup generates client-side values from existing configuration. It does not create a route, model, authentication policy, virtual key, or provider credential. Follow the steps in this guide to configure those prerequisites or to set up the client manually.

For Claude Desktop, Client Setup outputs the gateway URL and API key; it does not configure a model
name in Claude Desktop. The gateway route must already accept the key and support the Anthropic
Messages API at `/v1/messages`, and agentgateway must hold the upstream provider credential. An
endpoint that exposes only the OpenAI-compatible `/v1/chat/completions` API is not sufficient. For
more information about the UI, see [Admin UI](../../operations/ui.md).

To use a Claude subscription token instead of a gateway API key, continue with the following
sections.

## Configure agentgateway with a Claude subscription

Start agentgateway with the Teams configuration. Agentgateway listens on port `4001` and exposes
Claude at the `/claude` path.

1. Create a configuration file.

   ```
   cat > config.yaml << 'EOF'
   gateways:
     default:
       port: 4001
       protocol: HTTP
   routes:
   - name: claude-agent
     matches:
     - path:
         pathPrefix: /claude
     policies:
       urlRewrite:
         path:
           prefix: /
     backends:
     - ai:
         name: claude-agent
         provider:
           anthropic: {}
         policies:
           ai:
             routes:
               /v1/messages: messages
               /v1/messages/count_tokens: anthropicTokenCount
               '*': passthrough
   EOF
   ```

2. Start agentgateway.

   ```
   agentgateway -f config.yaml
   ```

> [!NOTE] Note Claude Code automatically sends the anthropic-beta: oauth-2025-04-20 header required for OAuth-based authentication. Claude Desktop may require this header to be set as well depending on your client version. If requests fail with a 400 error, add the following to the passthrough route policy in your config: policies : requestHeaderModifier : add : anthropic-beta : oauth-2025-04-20

## Configure Claude Desktop with a Claude subscription

1. Get a bearer token for your Claude account.

   ```
   claude setup-token
   ```

   Copy the token printed to the terminal.

2. Open Claude Desktop and enable developer mode: **Help → Troubleshooting → Enable Developer Mode**.
   Then fully quit and relaunch Claude Desktop. A new **Developer** menu appears in the menu bar.
3. In the menu bar, go to **Developer → Configure Third Party Inference → Gateway**.
4. Enter the gateway URL. Use `127.0.0.1` rather than `localhost`.

   ```
   http://127.0.0.1:4001/claude
   ```

5. For the **Credential kind** dropdown, select `Static API key` and then in the **Gateway API key**
   field, enter the bearer token you copied in step 1. To authenticate each user with your identity
   provider instead of requiring users to pass the same shared token, see [Authenticate users with your
   identity provider](#sso).
6. Click **Apply Changes**, then fully quit Claude Desktop and reopen it. Claude Desktop reads its
   configuration only at launch.

   > [!NOTE] Note On macOS, Claude Desktop might not enter third-party inference mode from the settings panel alone. If the app still signs in to Anthropic after you reopen it, set deploymentMode to 3p in the third-party configuration file, then quit and reopen the app again. python3 - <<'EOF' import json, os p = os.path.expanduser('~/Library/Application Support/Claude-3p/claude_desktop_config.json') d = json.load(open(p)) d['deploymentMode'] = '3p' open(p, 'w').write(json.dumps(d, indent=2)) EOF

## Authenticate users with your identity provider

If you distribute one static API key to every user, you cannot attribute requests to a person or
revoke access for only one user. Instead, select the **Interactive sign-in** credential kind. Claude
Desktop then runs an OAuth 2.0 authorization code flow with Proof Key for Code Exchange (PKCE)
against your identity provider and sends the resulting token on every inference request.
Agentgateway validates the token and adds the LLM provider credential itself, so the user’s device
never holds a provider API key.

The interactive sign-in flow is the same for standalone and Kubernetes deployments. Only the
agentgateway configuration differs: standalone configures JWT validation directly on the route,
whereas Kubernetes uses an AgentgatewayPolicy and an AgentgatewayBackend for the JWKS endpoint.

After you disable or offboard a user, the identity provider prevents new sign-ins and token
refreshes. An ID token that was already issued can remain valid until it expires, depending on the
identity provider’s revocation and session policies.

The following steps use Microsoft Entra ID as the example identity provider. Any OpenID Connect
(OIDC) provider works the same way. Substitute your own issuer URL, client ID, and JWKS URL.

1. Register an application with your identity provider, and record the client ID and the issuer URL.
   Claude Desktop is a public client that receives the redirect on a loopback address, so configure the
   application accordingly.

   | Setting      | Value                                                 |
   | ------------ | ----------------------------------------------------- |
   | Client type  | Public client. Claude Desktop holds no client secret. |
   | Redirect URI | `http://127.0.0.1/callback`                           |
   | Scopes       | `openid profile email offline_access`                 |

   > [!NOTE] Important Two details about the redirect URI cause most failures: Include the /callback path. Claude Desktop redirects to http://127.0.0.1:<port>/callback , and a registration of http://127.0.0.1 alone does not match. On Entra ID, the mismatch returns AADSTS50011 . Register the URI as a native or desktop client, not a web client. Claude Desktop picks an ephemeral port for each sign-in. A native client registration accepts any loopback port, as described in RFC 8252 , and a web client registration requires an exact port match. On Entra ID, select the Mobile and desktop applications platform and set Allow public client flows to Yes .

2. Save the identifiers from your registration and your Anthropic API key, so that agentgateway can
   resolve them. Agentgateway reads variable references in the configuration file from the environment
   at startup.

   ```
   export TENANT_ID=<your-tenant-id>
   export CLIENT_ID=<your-client-id>
   export ANTHROPIC_API_KEY=<your-anthropic-api-key>
   ```

3. Update your configuration file to validate the token on the route and to send an Anthropic API key
   upstream. Interactive sign-in puts the identity provider token in the `Authorization` header, so the
   proxy must supply the provider credential itself rather than pass a user token upstream.

   ```
   cat > config.yaml << 'EOF'
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   gateways:
     default:
       port: 4001
       protocol: HTTP
   routes:
   - name: claude-agent
     matches:
     - path:
         pathPrefix: /claude
     policies:
       urlRewrite:
         path:
           prefix: /
       jwtAuth:
         mode: strict
         issuer: https://login.microsoftonline.com/$TENANT_ID/v2.0
         audiences:
         - $CLIENT_ID
         jwks:
           url: https://login.microsoftonline.com/$TENANT_ID/discovery/v2.0/keys
     backends:
     - ai:
         name: claude-agent
         provider:
           anthropic: {}
         policies:
           backendAuth:
             key: "$ANTHROPIC_API_KEY"
           ai:
             routes:
               /v1/messages: messages
               /v1/messages/count_tokens: anthropicTokenCount
               '*': passthrough
   EOF
   ```

   Review the following table to understand this configuration.

   | Setting             | Description                                                                                                                                                  |
   | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `jwtAuth.mode`      | Set to `strict` so that agentgateway rejects any request that has no valid token. The default value, `optional`, admits requests that carry no token at all. |
   | `jwtAuth.issuer`    | The expected `iss` claim. Validating the issuer alongside the signature is what ties a token to your tenant.                                                 |
   | `jwtAuth.audiences` | The expected `aud` claim. For an ID token, the audience is the client ID of the application that you registered.                                             |
   | `jwtAuth.jwks.url`  | The JWKS endpoint that agentgateway fetches signing keys from.                                                                                               |
   | `backendAuth.key`   | The Anthropic API key that agentgateway sends upstream. Because the user token authenticates the caller, this credential no longer comes from the client.    |

   For more detail on JWT validation, see [JWT
   authentication](../../configuration/security/jwt-authn.md).

4. Restart agentgateway to load the new configuration.

   ```
   agentgateway -f config.yaml
   ```

5. In Claude Desktop, go to **Developer → Configure Third Party Inference → Gateway** and set the
   following fields.

   | Field            | Value                                                |
   | ---------------- | ---------------------------------------------------- |
   | Credential kind  | **Interactive sign-in**                              |
   | Gateway base URL | `http://127.0.0.1:4001/claude`                       |
   | Client ID        | The client ID of the application that you registered |
   | Issuer URL       | `https://login.microsoftonline.com/$TENANT_ID/v2.0`  |
   | Bearer token     | **ID token**                                         |
   | Scopes           | `openid profile email offline_access`                |

   > [!WARNING] Warning Set the bearer token type to ID token. With the access token setting, Entra ID returns a Microsoft Graph token that validation against your tenant JWKS rejects with InvalidSignature . The ID token carries the client ID as its audience, which matches the configured audience.

6. Click **Apply Changes**, then fully quit Claude Desktop and reopen it. A browser window opens to
   your identity provider. After you sign in, Claude Desktop stores the token and refreshes it in the
   background through the `offline_access` scope.

## Send custom headers

Use the **Custom inference headers** field to add a header to every inference request, such as a
tenant identifier that a route or a policy matches on. Claude Desktop sends these headers on
requests from Chat, Cowork, and Code alike.

To supply a header value that changes over time, set a credential helper instead. A credential
helper is an executable that Claude Desktop runs with no arguments and that prints either a bare
token or a JSON object in the form `{"token": "...", "headers": {"Name": "Value"}}`. Claude Desktop
caches the result and re-runs the helper when the cache expires, with no prompt and no relaunch.
Helper headers override custom inference headers of the same name, and a configured helper replaces
any static API key. Use a helper to read a short-lived credential from a secret store.

## Roll out to your organization

Configure and test one machine in developer mode first. When the connection works, click **Export**
in the **Configure Third Party Inference** panel to produce a profile for your device management
system, and distribute it with the tool that you already use, such as Jamf, Intune, Workspace ONE,
or Group Policy. Users then receive the configuration on first launch and do not configure anything
by hand.

Managed configuration takes precedence over local settings, so a user cannot point the app at a
different endpoint. The delivery mechanism differs per operating system.

| Operating system | Managed configuration                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| macOS            | A configuration profile that writes `/Library/Managed Preferences/<user>/com.anthropic.claudefordesktop.plist` |
| Windows          | Registry values under `HKLM\SOFTWARE\Policies\Claude`, which override any values under `HKCU`                  |
| Linux            | A root-owned `/etc/claude-desktop/managed-settings.json` file that is not writable by group or other           |

The following example shows the Linux form. On macOS and Windows, write every value as a string,
including numbers, booleans, and nested JSON.

```
{
  "inferenceProvider": "gateway",
  "inferenceGatewayBaseUrl": "https://agentgateway.example.com/claude",
  "inferenceCredentialKind": "interactive",
  "inferenceGatewayOidc": {
    "issuer": "https://login.microsoftonline.com/$TENANT_ID/v2.0",
    "clientId": "$CLIENT_ID",
    "scopes": "openid profile email offline_access",
    "bearerTokenType": "id_token"
  },
  "inferenceCustomHeaders": {
    "X-Tenant-Id": "acme"
  }
}
```

For every available key and for the per-region profiles that a multi-region deployment needs, see
the [Claude Desktop configuration
reference](https://claude.com/docs/third-party/claude-desktop/configuration).

## Verify the connection

Send a message in Claude Desktop. If the connection is successful, responses flow through your
agentgateway proxy and appear in the terminal where agentgateway is already running.

Look for log entries like the following in your running agentgateway output:

```
info  request gateway=default/default listener=http route=claude-agent endpoint=api.anthropic.com:443 http.method=POST http.path=/v1/messages http.status=200 protocol=llm
```

If you configured gateway API key or OIDC authentication in strict mode, send a request without the
`Authorization` header and confirm that agentgateway rejects it. This negative check verifies that
the route does not admit unauthenticated requests.

## Next steps

[Anthropic providerComplete Anthropic provider configuration](../../llm/providers/anthropic.md) [Prompt guardsSet up guardrails for LLM requests and responses](../../llm/prompt-guards/index.md)

[Claude Code](/docs/standalone/latest/integrations/llm-clients/claude-code/ 'Claude Code')[Cursor](/docs/standalone/latest/integrations/llm-clients/cursor/ 'Cursor')

Was this page helpful?
