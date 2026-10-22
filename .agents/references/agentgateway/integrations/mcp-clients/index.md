# MCP clients

Connect AI coding assistants and tools to agentgateway

Configure popular AI coding assistants and tools to use agentgateway as their MCP server.

## Before you begin

1. [Install and run agentgateway](../../quickstart/mcp.md).
2. Confirm agentgateway is up by opening the [agentgateway UI](http://localhost:15000/ui).
3. Use the MCP endpoint `http://localhost:3000/mcp/http` to connect your client to agentgateway. If you run agentgateway on a different host or port, replace `localhost:3000` in the examples accordingly.

> [!NOTE] Note Multiplexed tool names : If your agentgateway backend routes to more than one Virtual MCP target, agentgateway namespaces each tool and prompt name with its target name by default, for example time_get_current_time . When you add a second target, tools in your client’s tool list might get new names because of this prefixing. Control it with the prefixMode field; see Tool name prefixing for the available modes.

[Claude

Connect Claude Desktop and Claude Code to agentgateway](claude.md)[Cursor

Connect Cursor IDE to agentgateway](cursor.md)[OpenCode

Connect OpenCode to agentgateway](opencode.md)[Devin Desktop

Connect Devin Desktop to agentgateway](devin.md)[VS Code

Connect VS Code with GitHub Copilot to agentgateway](vscode.md)[Antigravity IDE

Connect Antigravity IDE to agentgateway](antigravity.md)

[LLM providers](/docs/standalone/latest/integrations/llm-providers/ 'LLM providers')[MCP servers](/docs/standalone/latest/integrations/mcp-servers/ 'MCP servers')

Was this page helpful?
