# Usage & Prompt Guide

{% hint style="info" %}
💡 Learn how to use bkend MCP with natural language prompts in any AI tool.
{% endhint %}

## Overview

Once your AI tool is connected to bkend MCP, you can manage your backend with natural language. Create projects, design tables, perform data CRUD, and generate API code — all from a single conversation.

{% hint style="warning" %}
⚠️ If you haven't completed the setup yet, see [Setup](02-setup.md) first.
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

## Using with Code

You can write code and manage bkend at the same time.

### Generating TypeScript Interfaces

```text
"Check the schema of the users table and
create a TypeScript interface matching this table"
```

### Generating REST API Code

```text
"Write TypeScript service code that calls
CRUD operations on the bkend users table"
```

### Building Components

```text
"Create a products table in bkend and
write a React component that calls CRUD operations on this table"
```

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

## Session Context

When your AI tool first connects to bkend, it automatically calls the `get_context` tool. This tool returns:

| Item | Description |
|------|-------------|
| Organization ID | The currently connected Organization |
| Project List | Accessible projects |
| API Endpoints | Available API information |
| Guidelines | Limitations and warnings |

> For details, see [Context](06-context.md).

***

## Troubleshooting

### "Tool not found" error

The MCP connection may have dropped.

1. Verify the bkend server is registered in your tool's MCP settings
2. If it is not registered, add it again
3. Restart your AI tool

### Slow responses

1. Check your network connection
2. Verify that the environment status is **Active** in the bkend console
3. When querying large datasets, add filter conditions

***

## Next Steps

- [Setup](02-setup.md) — Initial setup guide
- [Code Generation](09-code-generation.md) — REST API code generation for Auth, Storage, Data
- [MCP Overview](01-overview.md) — Available tools and resources
