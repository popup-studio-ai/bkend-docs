# Other AI Tools

{% hint style="info" %}
Learn how to connect bkend from other MCP-compatible AI tools.
{% endhint %}

## Overview

The bkend MCP server follows the [MCP 2025-03-26 specification](https://spec.modelcontextprotocol.io/2025-03-26), so you can connect from any AI tool that supports MCP.

***

## Connection Details

| Item | Value |
|------|-----|
| MCP Server URL | `https://api.bkend.ai/mcp` |
| Transport | Streamable HTTP |
| Authentication | [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12) + PKCE |

***

## Tools with HTTP Support (Recommended)

Most modern MCP tools support Streamable HTTP natively.

```json
{
  "mcpServers": {
    "mcp-bkend": {
      "type": "http",
      "url": "https://api.bkend.ai/mcp"
    }
  }
}
```

***

## VS Code (Copilot Chat)

Add the following to your VS Code Copilot Chat MCP settings.

### settings.json

```json
{
  "mcp": {
    "servers": {
      "mcp-bkend": {
        "type": "http",
        "url": "https://api.bkend.ai/mcp"
      }
    }
  }
}
```

***

## Using mcp-remote

If your tool only supports stdio-based MCP, use `mcp-remote`.

```json
{
  "mcpServers": {
    "bkend": {
      "command": "mcp-remote",
      "args": [
        "https://api.bkend.ai/mcp"
      ]
    }
  }
}
```

{% hint style="info" %}
`mcp-remote` requires Node.js 18 or later.
{% endhint %}

***

## General MCP Client Configuration

For tools that support MCP, you can typically connect using just the URL.

```text
https://api.bkend.ai/mcp
```

***

## Troubleshooting

### Cannot find MCP settings in the tool

Check the tool's official documentation for MCP configuration instructions. The location and format of MCP configuration files vary by tool.

### Connected but tool list is empty

1. Make sure authentication is complete
2. Confirm that you have an Organization in the bkend console
3. Restart the AI tool

***

## Next Steps

- [AI Tool Integration Overview](01-overview.md) — Supported tool list
- [Understanding MCP Protocol](02-mcp-protocol.md) — MCP protocol details
- [MCP Tools Overview](../mcp/01-overview.md) — Detailed MCP tool parameters

{% hint style="success" %}
Once you've finished setting up your AI tool, start managing your backend with MCP tools. -> [MCP Tools Overview](../mcp/01-overview.md)
{% endhint %}

## Reference Standards

- [MCP Specification 2025-03-26](https://spec.modelcontextprotocol.io/2025-03-26)
