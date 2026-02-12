# Claude Code Setup

{% hint style="info" %}
Learn how to set up bkend MCP in Claude Code and Claude Desktop.
{% endhint %}

## Prerequisites

- A bkend account and Organization (create one in the [Quick Start Guide](../getting-started/02-quickstart.md))
- Claude Code or Claude Desktop installed

***

## Setting Up Claude Code

### Step 1: Add the bkend MCP Server

Run the following command in your terminal.

```bash
claude mcp add bkend --transport http https://api.bkend.ai/mcp
```

### Step 2: Authenticate

When you make a bkend-related request in Claude Code, authentication proceeds in the browser.

1. Your browser opens automatically
2. Log in to the bkend console
3. Select your Organization
4. Approve the permissions

### Step 3: Verify the Connection

```text
"Show me the list of projects connected to bkend"
```

***

## Setting Up Claude Desktop

### Step 1: Open the Configuration File

{% tabs %}
{% tab title="macOS" %}
```text
~/Library/Application Support/Claude/claude_desktop_config.json
```
{% endtab %}
{% tab title="Windows" %}
```text
%APPDATA%\Claude\claude_desktop_config.json
```
{% endtab %}
{% endtabs %}

### Step 2: Add the bkend MCP Server

Add the following to your configuration file.

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

### Step 3: Restart Claude Desktop

Save the configuration file and restart Claude Desktop.

***

## Managing Your Configuration

### Check registered MCP servers

```bash
claude mcp list
```

### Remove an MCP server

```bash
claude mcp remove bkend
```

### Update an MCP server

```bash
claude mcp remove bkend
claude mcp add bkend --transport http https://api.bkend.ai/mcp
```

***

## Troubleshooting

### MCP server does not connect

1. Run `claude mcp list` to verify the bkend server is registered
2. Make sure your network allows access to `https://api.bkend.ai/mcp`
3. Restart Claude Code

### Tools do not appear after authentication

1. Confirm that you have an Organization in the bkend console
2. Run `claude mcp remove bkend` and add it again
3. Restart Claude Code

### "Token expired" error

This means the Refresh Token has expired (30 days). Restart Claude Code and re-authentication will proceed automatically.

{% hint style="warning" %}
On corporate networks or VPN environments, outbound HTTPS connections to `https://api.bkend.ai/mcp` may be blocked. If the connection fails, check with your network administrator whether the domain is allowed.
{% endhint %}

***

## Next Steps

- [Claude Code Usage](05-claude-code-usage.md) — Using bkend with Claude Code
- [OAuth 2.1 Authentication Setup](03-oauth-setup.md) — Detailed authentication flow
- [MCP Tools Overview](../mcp/01-overview.md) — MCP tool list and parameters
