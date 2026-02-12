# Claude Code Usage

{% hint style="info" %}
Use bkend MCP in Claude Code to manage your backend with natural language.
{% endhint %}

## Overview

Once Claude Code is connected to bkend MCP, you can manage your backend with natural language from the terminal. Create projects, design tables, and perform data CRUD directly.

{% hint style="warning" %}
If you haven't completed the setup yet, see [Claude Code Setup](04-claude-code-setup.md) first.
{% endhint %}

***

## Basic Patterns

### Managing Projects

```text
"Show me the list of projects connected to bkend"

"Check the status of the dev environment in the my-app project"
```

### Creating Tables

```text
"Create a users table in the dev environment.
I need name (string, required), email (string, required), and role (string) fields"
```

### Performing Data CRUD

```text
"Add 5 test records to the users table"

"Show me users with role admin from the users table"
```

***

## Advanced Patterns

### Creating Multiple Tables at Once

```text
"I'm building a blog service. I need the following tables:
- posts: title (string, required), content (string), published (boolean, default false)
- categories: name (string, required), slug (string, required)
- comments: postId (string, required), content (string, required), author (string)"
```

### Querying Data with Conditions

```text
"Show me only posts where published is true, sorted by newest first"

"Show me users with age 20 or above, sorted by name"
```

### Viewing and Modifying Schemas

```text
"Show me the schema of the users table"

"Make the email field required on the users table"

"Add an index to the users table: a unique index on the email field"
```

***

## Session Context

When Claude Code first connects to bkend, it automatically calls the `get_context` tool. This tool returns:

| Item | Description |
|------|------|
| Organization ID | The currently connected Organization |
| Project List | Accessible projects |
| API Endpoints | Available API information |
| Guidelines | Limitations and warnings |

> For details, see [MCP Context](../mcp/02-context.md).

***

## Writing Effective Requests

### Be Specific

```text
# Good example
"Create a users table in the dev environment of the my-app project"

# Ambiguous example
"Create a table"
```

### Specify Field Types

```text
# Good example
"Create a products table:
- name: string (required)
- price: number
- in_stock: boolean (default: true)
- created_at: date"

# Ambiguous example
"Create a products table. I need name and price"
```

***

## Troubleshooting

### "Tool not found" error

The MCP connection may have dropped.

1. Run `claude mcp list` to verify the bkend server is registered
2. If it is not registered, add it again
3. Restart Claude Code

### Slow responses

1. Check your network connection
2. Verify that the environment status is **Active** in the bkend console

***

## Next Steps

- [Claude Code Setup](04-claude-code-setup.md) — Initial setup guide
- [Data CRUD Tools](../mcp/05-data-tools.md) — Detailed data tool parameters
- [AI Tool Integration Overview](01-overview.md) — Supported tool list
