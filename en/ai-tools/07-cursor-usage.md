# Cursor Usage

{% hint style="info" %}
Use bkend MCP in Cursor to manage your backend while writing code.
{% endhint %}

## Overview

Once Cursor is connected to bkend MCP, you can manage your backend with natural language from AI Chat. Manipulate Database, Auth, and Storage while writing code at the same time.

{% hint style="warning" %}
If you haven't completed the setup yet, see [Cursor Setup](06-cursor-setup.md) first.
{% endhint %}

***

## Using AI Chat

Make natural language requests in Cursor's AI Chat (`Cmd+L` / `Ctrl+L`).

### Managing Projects

```text
"Show me the list of projects connected to bkend"

"Check the status of the dev environment in the my-app project"
```

### Managing Tables

```text
"Create a users table in the dev environment.
I need name (string, required), email (string, required), and role (string) fields"

"Show me the schema of the users table"
```

### Performing Data CRUD

```text
"Add 5 test records to the users table"

"Show me users with role admin from the users table"
```

***

## Using with Code

In Cursor, you can write code and manage bkend at the same time.

### With Frontend Code

```text
"Check the schema of the users table and
create a TypeScript interface matching this table"
```

### Generating API Code

```text
"Write TypeScript service code that calls
CRUD operations on the bkend users table"
```

***

## Using Composer Mode

You can also use bkend MCP in Cursor's Composer (`Cmd+I` / `Ctrl+I`).

```text
"Create a products table in bkend and
write a React component that calls CRUD operations on this table"
```

***

## Troubleshooting

### Tool call failures

1. Check the bkend server status in Cursor's **Settings** > **MCP** tab
2. If the server is inactive, restart Cursor
3. If authentication has expired, re-authentication will proceed automatically

### Slow responses

1. Check your network connection
2. When querying large datasets, add filter conditions

***

## Next Steps

- [Cursor Setup](06-cursor-setup.md) — Initial setup guide
- [Data CRUD Tools](../mcp/05-data-tools.md) — Detailed data tool parameters
- [AI Tool Integration Overview](01-overview.md) — Supported tool list
