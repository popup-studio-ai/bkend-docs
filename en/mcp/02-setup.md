# Set Up bkend MCP Server

{% hint style="info" %}
💡 Install the bkend MCP server and authenticate in your AI tool.
{% endhint %}

## Prerequisites

- A bkend account and Organization (create one in the [Quick Start Guide](../getting-started/02-quickstart.md))
- An AI tool installed (Claude Code, Cursor, VS Code, etc.)

***

## Step 1: Add the MCP Server (Installation)

{% tabs %}
{% tab title="Claude Code" %}
Run the following command in your terminal:

```bash
claude mcp add --scope user bkend --transport http https://api.bkend.ai/mcp
```

Alternatively, add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "bkend": {
      "type": "http",
      "url": "https://api.bkend.ai/mcp"
    }
  }
}
```
{% endtab %}

{% tab title="Cursor" %}
Open the Cursor MCP configuration file:

{% tabs %}
{% tab title="Global" %}
```text
~/.cursor/mcp.json
```
{% endtab %}
{% tab title="Per Project" %}
```text
{project root}/.cursor/mcp.json
```
{% endtab %}
{% endtabs %}

Add the following:

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

Save the file and restart Cursor.
{% endtab %}

{% tab title="VS Code" %}
Add the following to your VS Code `settings.json`:

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
{% endtab %}

{% tab title="Other (stdio)" %}
If your tool only supports stdio-based MCP, use `mcp-remote`:

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
💡 `mcp-remote` requires Node.js 18 or later.
{% endhint %}

For any MCP-compatible tool, you can also connect using just the URL:

```text
https://api.bkend.ai/mcp
```
{% endtab %}
{% endtabs %}

***

## Step 2: Authenticate

After configuring the MCP server, you need to authenticate.

{% tabs %}
{% tab title="Claude Code" %}
In a regular terminal (not the IDE extension), run:

```bash
claude /mcp
```

Select the **bkend** server, then select **Authenticate** to begin the authentication flow.

<figure><img src="../../.gitbook/assets/2026-03/mcp-auth-needs-authentication.png" alt=""><figcaption><p>bkend server showing "needs authentication" status</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/2026-03/mcp-auth-select-authenticate.png" alt=""><figcaption><p>Select "Authenticate" to begin</p></figcaption></figure>
{% endtab %}

{% tab title="Cursor / VS Code / Other" %}
When you make a bkend-related request in the AI Chat, the browser opens automatically to begin authentication.
{% endtab %}
{% endtabs %}

### Authentication Flow

Once authentication begins:

1. **Your browser opens automatically**
2. **Log in** to bkend
3. **Select your Organization** and approve permissions
4. **Return to your tool** — the connection is now active

<figure><img src="../../.gitbook/assets/2026-03/mcp-auth-authorize-browser.png" alt=""><figcaption><p>Select your Organization and authorize</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/2026-03/mcp-auth-success-browser.png" alt=""><figcaption><p>Authentication successful — you can close this window</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/2026-03/mcp-auth-success-terminal.png" alt=""><figcaption><p>Terminal confirms "Connected to bkend"</p></figcaption></figure>

{% hint style="info" %}
💡 For detailed information about the authentication protocol (OAuth 2.1, token management), see [OAuth 2.1 Authentication](05-oauth.md).
{% endhint %}

***

## Step 3: Verify the Connection

Ask your AI tool:

```text
"Show me the list of projects connected to bkend"
```

If you see your projects listed, the setup is complete.

***

## Managing Your Configuration

### Check registered MCP servers (Claude Code)

```bash
claude mcp list
```

### Remove an MCP server (Claude Code)

```bash
claude mcp remove bkend
```

### Update an MCP server (Claude Code)

```bash
claude mcp remove bkend
claude mcp add --scope user bkend --transport http https://api.bkend.ai/mcp
```

***

## Troubleshooting

| Symptom | Solution |
|---------|----------|
| `/mcp` shows **failed** | Verify the URL is correct, then remove and re-add the server |
| Browser does not open | Make sure you selected **Authenticate** in `/mcp` |
| **needs authentication** persists | Complete login and Organization selection in the browser |
| **Token expired** error | Refresh Token has expired (30 days). Restart your tool — re-authentication proceeds automatically |
| Tools do not appear | Confirm you have an Organization in the bkend console. Remove and re-add the server |
| VPN/firewall blocked | Ensure HTTPS outbound to `https://api.bkend.ai/mcp` is allowed |
| `mcp-remote` connection fails | Verify Node.js 18+ is installed: `npx mcp-remote --version` |

{% hint style="warning" %}
⚠️ On corporate networks or VPN environments, outbound HTTPS connections to `https://api.bkend.ai/mcp` may be blocked. If the connection fails, check with your network administrator whether the domain is allowed.
{% endhint %}

***

## Next Steps

- [Usage](03-usage.md) — Prompt examples and best practices
- [OAuth 2.1 Authentication](05-oauth.md) — Detailed authentication flow
- [MCP Tools Overview](01-overview.md) — Available tools and resources
