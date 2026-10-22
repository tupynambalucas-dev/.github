# Admin UI

Verified Code examples on this page have been automatically tested and verified.

Use the built-in Admin UI to inspect and manage your standalone agentgateway configuration.

Use the agentgateway Admin UI to view and manage your standalone proxy configuration in real time.

## About

The agentgateway Admin UI is a built-in web interface that runs alongside the proxy on port 15000 by
default. In standalone mode, the UI is fully interactive — you can inspect your current
configuration and manage your proxy without restarting agentgateway.

The Admin UI is separate from the [Web UI
integrations](../integrations/web-uis/index.md), which are third-party AI chat
frontends (such as Open WebUI or LibreChat) that you connect to agentgateway as a backend. The Admin
UI is the management interface for agentgateway itself.

## Open the Admin UI

1. Start agentgateway with a config file.

   ```
   agentgateway -f config.yaml
   ```

   Example output:

   ```
   INFO app  serving UI at http://localhost:15000/ui
   ```

2. Open <http://localhost:15000/ui/> in your browser.

   The Admin UI opens on the **Gateway Overview**, which lists the available capabilities (LLM, MCP,
   and Traffic) and lets you enable the ones you want to operate.

   ![](/img/agentgateway-ui-landing.png)

   ![](/img/agentgateway-ui-landing-dark.png)

## Generate LLM client settings

The **LLM > Client Setup** page generates connection settings and snippets for curl, Claude Code,
Claude Desktop, Codex CLI, OpenCode, Cursor, GitHub Copilot, Windsurf, and the OpenAI JavaScript and
Python SDKs.

1. Configure at least one LLM model and, if the gateway requires client authentication, a [virtual API key](../llm/cost-controls/virtual-keys.md).
2. Open <http://localhost:15000/ui/llm/client-setup>.
3. Review the **Gateway base URL**, and select a model and virtual API key.
4. Select the client from the **Integration** dropdown, and copy the generated settings or snippet.

Client Setup does not create a route, model, authentication policy, or provider credential. It
generates client-side values from the configuration that already exists. For client-specific
prerequisites, see [LLM clients](../integrations/llm-clients/index.md).

The selected model appears only in recipes that accept a model setting. For example, the Claude
Desktop recipe outputs a gateway URL and API key, but does not configure a model name in Claude
Desktop.

## Customize the Admin UI port

By default, the Admin UI binds to `localhost:15000`. To use a different address or port, set
`adminAddr` in the `config` section of your config file.

1. Add or update the `adminAddr` field in your config file. The value must use `ip:port` format.

   ```
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   config:
     adminAddr: localhost:9090
   ```

2. Start agentgateway with the updated config.

   ```
   agentgateway -f config.yaml
   ```

   Example output:

   ```
   INFO app  serving UI at http://localhost:9090/ui
   ```

3. Open the UI at the new address. In this example, navigate to <http://localhost:9090/ui/>.

> [!NOTE] Note If you change adminAddr , update any agentgateway admin API commands to use the new address. For example, change curl http://localhost:15000/logging to use the new port.

## Secure the Admin UI

By default, the Admin UI is served on the local admin interface (`localhost:15000`) with no
authentication. Anyone who can reach the admin address can inspect and manage your configuration. To
require users to authenticate, attach the UI to a gateway listener and apply a browser
[OIDC](../configuration/security/oidc.md) policy. When you attach the UI to a
gateway, it is served on that gateway’s port instead of the admin address, and all UI traffic must
pass the policies that you attach.

1. Set the `OIDC_COOKIE_SECRET` environment variable. Agentgateway requires this value to encrypt
   session cookies whenever an `oidc` policy is configured. Set it to a random value before you start
   the gateway.

   ```
   export OIDC_COOKIE_SECRET="$(python3 -c 'import os; print(os.urandom(32).hex())')"
   ```

2. Add a `ui` section to your config file that attaches to a gateway and applies an `oidc` policy. The
   following example serves the UI on the `default` gateway on port 3000 and redirects unauthenticated
   users to the OIDC provider to log in. The optional `authorization` policy further restricts access
   to users whose email address ends in `@example.com`.

   ```
   # yaml-language-server: $schema=https://agentgateway.dev/schema/config
   gateways:
     default:
       port: 3000
   ui:
     policies:
       oidc:
         issuer: http://localhost:7080/realms/agentgateway
         clientId: agentgateway-browser
         clientSecret: agentgateway-secret
         redirectURI: http://localhost:3000/oauth/callback
         scopes:
         - profile
         - email
       authorization:
         rules:
         - allow: jwt.email.endsWith("@example.com")
   ```

3. Start agentgateway with the updated config.

   ```
   agentgateway -f config.yaml
   ```

4. Open the UI at the gateway’s address, such as <http://localhost:3000/ui/>. Instead of loading the UI
   directly, agentgateway redirects you to the OIDC provider to log in. After you authenticate, you are
   returned to the UI.

For the full list of `oidc` policy fields and a complete runnable Keycloak setup, see [OIDC browser
authentication](../configuration/security/oidc.md) and the
[`traffic-unified-gateway`
example](https://github.com/agentgateway/agentgateway/tree/main/examples/traffic-unified-gateway) in
the agentgateway repository. You can attach other policies to UI traffic in the same way, such as
`cors`, `jwtAuth`, `basicAuth`, or `apiKey`.

[Install agctl](/docs/standalone/latest/operations/agctl/ 'Install agctl')[Debug your setup](/docs/standalone/latest/operations/debug/ 'Debug your setup')

Was this page helpful?
