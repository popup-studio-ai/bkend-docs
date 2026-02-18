# Cursor Setup

{% hint style="info" %}
💡 Learn how to set up bkend MCP in Cursor.
{% endhint %}

## Prerequisites

- A bkend account and Organization (create one in the [Quick Start Guide](../getting-started/02-quickstart.md))
- Cursor installed (v0.45 or later)

***

## Setup

### Step 1: Open the MCP Configuration File

Open the Cursor MCP configuration file.

{% tabs %}
{% tab title="Global Configuration" %}
```text
~/.cursor/mcp.json
```
{% endtab %}
{% tab title="Project Configuration" %}
```text
{project root}/.cursor/mcp.json
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
💡 Use the project configuration to connect different MCP servers per project.
{% endhint %}

### Step 2: Add the bkend MCP Server

Add the following to your configuration file:

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

### Step 3: Restart Cursor

Save the configuration file and restart Cursor.

### Step 4: Authenticate

When you make a bkend-related request in Cursor's AI Chat, authentication proceeds in the browser.

1. Your browser opens automatically
2. Log in to the bkend console
3. Select your Organization
4. Approve the permissions

### Step 5: Verify the Connection

In Cursor AI Chat, verify the connection:

```text
"Show me the list of projects connected to bkend"
```

***

## Managing Your Configuration

### Check MCP server status

You can view the connection status in Cursor's **Settings** > **MCP** tab.

### Remove the configuration

Delete the `mcp-bkend` entry from the MCP configuration file and restart Cursor.

***

## Troubleshooting

### MCP server does not connect

1. Verify that a firewall is not blocking access to `https://api.bkend.ai/mcp`
2. Check that the JSON format in the configuration file is valid
3. Restart Cursor

### Tools do not appear after authentication

1. Restart Cursor
2. Check the bkend server status in **Settings** > **MCP** tab
3. Verify that the JSON format in the configuration file is valid

***

## Next Steps

- [Cursor Usage](07-cursor-usage.md) — Using bkend with Cursor
- [AI Tool Integration Overview](01-overview.md) — Supported tool list
- [OAuth 2.1 Authentication Setup](03-oauth-setup.md) — Detailed authentication flow
