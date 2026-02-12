# Antigravity Setup

{% hint style="info" %}
Learn how to set up and use bkend MCP in Antigravity.
{% endhint %}

## Prerequisites

- A bkend account and Organization (create one in the [Quick Start Guide](../getting-started/02-quickstart.md))
- Antigravity installed

***

## Setup

### Step 1: Open MCP Settings

Open the **Settings** > **MCP Servers** menu in Antigravity.

### Step 2: Add the bkend MCP Server

Add the following configuration:

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

### Step 3: Authenticate

After adding the MCP server, authentication proceeds in the browser on the first request.

1. Your browser opens automatically
2. Log in to the bkend console
3. Select your Organization
4. Approve the permissions

***

## Usage

Make natural language requests in Antigravity's AI Chat:

```text
"Show me the list of projects connected to bkend"

"Create a products table in the dev environment"

"Add sample data to the products table"
```

***

## Troubleshooting

### MCP server does not connect

1. Verify that Node.js 18 or later is installed
2. Make sure `mcp-remote` is installed:
   ```bash
   npx mcp-remote --version
   ```
3. Restart Antigravity
4. Delete the MCP configuration and add it again

{% hint style="warning" %}
Antigravity uses `mcp-remote` to convert Streamable HTTP to stdio. If the `mcp-remote` process terminates unexpectedly, the connection may drop. Try restarting Antigravity first when issues occur.
{% endhint %}

***

## Next Steps

- [AI Tool Integration Overview](01-overview.md) — Supported tool list
- [Understanding MCP Protocol](02-mcp-protocol.md) — MCP protocol details
- [Other AI Tools](09-other-tools.md) — Integrating other AI tools
