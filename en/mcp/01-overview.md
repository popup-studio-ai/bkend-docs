# MCP Tools Overview

{% hint style="info" %}
This page provides a complete list and classification of tools and resources offered by the bkend MCP server.
{% endhint %}

## Overview

The bkend MCP server provides **Tools** and **Resources** so you can manage your backend from AI tools. Tools convert natural language requests into actual backend operations, and Resources let you query the current state.

***

## Tool Classification

### Fixed Tools

These tools are always available when you connect to the MCP server.

| Tool | Description | Details |
|------|-------------|---------|
| `get_context` | Retrieve session context (Organization, project, environment) | [Context](02-context.md) |
| `search_docs` | Search bkend documentation | [Context](02-context.md) |

### API Tools

These tools directly manage your backend. They all use the `backend_` prefix.

| Category | Tool Count | Description | Details |
|----------|:----------:|-------------|---------|
| Project Management | 6 | Manage Organizations, projects, and environments | [Project Tools](03-project-tools.md) |
| Table Management | 9 | Manage tables, fields, indexes, and schema versions | [Table Tools](04-table-tools.md) |
| Data CRUD | 5 | Query, create, update, and delete data | [Data Tools](05-data-tools.md) |

***

## Features Without Tools

Auth and Storage do not have dedicated MCP tools. Instead, use the **documentation search tool** in your AI tool to look up implementation guides, then generate **REST API code**.

| Feature | MCP Tool | Alternative |
|---------|:--------:|-------------|
| Auth | N/A | Generate REST API code — [Auth Tools](06-auth-tools.md) |
| Storage | N/A | Generate REST API code — [Storage Tools](07-storage-tools.md) |

{% hint style="info" %}
When you ask your AI tool to "implement a login feature," `search_docs` automatically finds the relevant authentication docs and generates the REST API calling code.
{% endhint %}

***

## Resources

MCP Resources let you query the current state in read-only mode through the `bkend://` URI schema.

| Resource | URI Pattern | Description |
|----------|-------------|-------------|
| Organization | `bkend://orgs` | List of Organizations |
| Project | `bkend://orgs/{orgId}/projects` | List of projects |
| Environment | `bkend://orgs/{orgId}/projects/{projectId}/environments` | List of environments |
| Table | `bkend://orgs/{orgId}/projects/{projectId}/environments/{envId}/tables` | List of tables |

> For details, see [MCP Resources](08-resources.md).

***

## Complete Tool List

```mermaid
graph TD
    subgraph Fixed["Fixed Tools"]
        A[get_context]
        B[search_docs]
    end

    subgraph Project["Project Management"]
        D[backend_org_list]
        E[backend_project_*]
        F[backend_env_*]
    end

    subgraph Table["Table Management"]
        G[backend_table_*]
        H[backend_field_manage]
        I[backend_index_manage]
        J[backend_schema_version_*]
    end

    subgraph Data["Data CRUD"]
        K[backend_data_list]
        L[backend_data_get]
        M[backend_data_create]
        N[backend_data_update]
        O[backend_data_delete]
    end

    Fixed --> Project
    Project --> Table
    Table --> Data
```

***

## Next Steps

- [Context](02-context.md) — Details on `get_context` and `search_docs`
- [Project Tools](03-project-tools.md) — Manage Organizations, projects, and environments
- [Data Tools](05-data-tools.md) — Data CRUD operations
- [MCP Resources](08-resources.md) — Resource URIs and how to query them
