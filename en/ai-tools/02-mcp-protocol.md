# Understanding the MCP Protocol

{% hint style="info" %}
💡 Learn the core concepts of MCP (Model Context Protocol) and how the bkend MCP server works.
{% endhint %}

## Overview

[MCP (Model Context Protocol)](https://spec.modelcontextprotocol.io/2025-03-26) is a standard protocol for AI tools to communicate with external services. bkend uses the Streamable HTTP transport defined in the MCP 2025-03-26 specification.

```mermaid
flowchart LR
    A[AI Tool] -->|JSON-RPC 2.0| B[bkend MCP Server]
    B -->|Internal API Call| C[bkend Backend]
```

***

## Supported Specifications

| Item | Details |
|------|------|
| **Protocol Version** | 2025-03-26 |
| **Transport** | Streamable HTTP |
| **Message Format** | JSON-RPC 2.0 |
| **Authentication** | [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12) + PKCE |
| **Endpoint** | `https://api.bkend.ai/mcp` |

### Streamable HTTP

bkend uses **Streamable HTTP** instead of SSE.

| Characteristic | Streamable HTTP (Current) | SSE (Legacy) |
|------|----------------------|----------------|
| **Transport Method** | Simple POST request/response | Server-to-client stream |
| **Connection Behavior** | Connects only per request | Always open |
| **Server Resources** | Released after request | Memory held per connection |
| **Scalability** | Easy to auto-scale | Hard to scale by connection |

***

## Core Components

### Tools

Functions that AI tools can invoke. bkend provides two types.

**Fixed Tools** — Context retrieval and documentation search:

| Tool | Description |
|------|------|
| `get_context` | Must be called at session start — provides Organization ID and resource hierarchy |
| `search_docs` | Search bkend documentation |

**API Tools** — Invoke management functions on the bkend backend.

> For the full list of tools, see the [MCP Tools Overview](../mcp/01-overview.md).

### Resources

Data resources provided by the MCP server.

```text
Organization
  └── Project
        └── Environment (dev/staging/prod)
              └── Table
                    ├── Fields
                    └── Indexes
```

> For resource details, see [MCP Resources](../mcp/08-resources.md).

***

## Permission Scopes

Permissions granted to the MCP token.

| Scope | Description |
|--------|------|
| `organization:read` | View Organization information |
| `project:read` / `project:create` / `project:update` / `project:delete` | Manage Projects |
| `environment:read` / `environment:create` / `environment:delete` | Manage Environments |
| `table:read` / `table:create` / `table:update` / `table:delete` | Manage table schemas |
| `table:data:read` / `table:data:create` / `table:data:update` / `table:data:delete` | Table data CRUD |
| `access-token:read` | View Access Tokens |

### Wildcard Scopes

| Pattern | Description |
|------|------|
| `*:*` | Full access |
| `project:*` | All actions on Projects |
| `*:read` | Read access to all resources |

***

{% hint style="warning" %}
⚠️ You **must call `get_context` at the start of each session** before invoking other MCP tools. Subsequent tool calls will fail without the Organization ID and resource hierarchy.
{% endhint %}

## Error Codes

| Code | Meaning | Description |
|------|------|------|
| `-32700` | Parse Error | JSON parsing failed |
| `-32600` | Invalid Request | Malformed request |
| `-32601` | Method Not Found | Non-existent method |
| `-32602` | Invalid Params | Invalid parameters |
| `-32603` | Internal Error | Server internal error |
| `-32001` | Unauthorized | Authentication failed |
| `-32002` | Not Found | Resource not found / Session expired |

***

## Next Steps

- [OAuth 2.1 Authentication Setup](03-oauth-setup.md) — Detailed authentication flow
- [Claude Code Setup](04-claude-code-setup.md) — Claude Code integration
- [MCP Tools Reference](../mcp/09-api-reference.md) — Full MCP tool schema

## Reference Standards

- [MCP Specification 2025-03-26](https://spec.modelcontextprotocol.io/2025-03-26)
- [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
