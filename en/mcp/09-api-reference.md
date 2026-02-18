# MCP API Reference

{% hint style="info" %}
💡 This page provides the input/output schemas for all tools offered by the bkend MCP server.
{% endhint %}

## Fixed Tools

### get_context

Retrieves session context. Call this first in every new session.

| Item | Value |
|------|-------|
| Parameters | None |
| Response | Markdown text with Organization ID, REST API Base URL, resource hierarchy |

### search_docs

Searches bkend documentation via GitBook.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `query` | string | Yes | Search query (e.g., "signup authentication") |

***

## Organization Tools

### backend_org_list

| Item | Value |
|------|-------|
| Parameters | None |
| Response | List of accessible Organizations |

### backend_org_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |

***

## Access Token Tools

### backend_access_token_list

| Item | Value |
|------|-------|
| Parameters | None (filtered by Organization automatically) |
| Response | List of access tokens |

### backend_access_token_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `accessTokenId` | string | Yes | Access Token ID |

***

## Project Tools

### backend_project_list

| Item | Value |
|------|-------|
| Parameters | None (filtered by Organization automatically) |
| Response | List of projects with settings and environment count |

### backend_project_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `projectId` | string | Yes | Project ID |

### backend_project_create

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `body` | object | Yes | Project creation data |

#### body Fields

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `slug` | string | Yes | URL-friendly unique slug |
| `name` | string | Yes | Project name |
| `primaryCloud` | string | Yes | `aws`, `gcp`, or `azu` |
| `primaryRegion` | string | Yes | Deployment region |
| `description` | string | | Project description |

### backend_project_update

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `projectId` | string | Yes | Project ID |
| `body` | object | | Fields to update (`name`, `slug`, `description`, `settings`) |

***

## Environment Tools

### backend_env_list

| Item | Value |
|------|-------|
| Parameters | None (filtered by Organization automatically) |
| Response | List of environments with deployment status |

### backend_env_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `environmentId` | string | Yes | Environment ID |

### backend_env_create

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `body` | object | Yes | Environment creation data |

#### body Fields

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `projectId` | string | Yes | Project ID |
| `environment` | string | Yes | Environment name (e.g., `dev`, `staging`, `prod`) |
| `environmentType` | string | Yes | `dev`, `staging`, `prod`, or `custom` |

***

## Table Tools

### backend_table_list

| Item | Value |
|------|-------|
| Parameters | None (filtered by Organization automatically) |
| Response | List of tables with schema definition and document count |

### backend_table_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableId` | string | Yes | Table ID |

### backend_table_create

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `body` | object | Yes | Table creation data |

#### body Fields

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `projectId` | string | Yes | Project ID |
| `environment` | string | Yes | Environment name |
| `tableName` | string | Yes | Table name (max 64 chars, alphanumeric + underscore/hyphen) |
| `schema` | object | Yes | Table schema (BSON schema format) |
| `displayName` | string | | Display name |
| `description` | string | | Table description |

### backend_table_update

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableId` | string | Yes | Table ID |
| `body` | object | | Fields to update (`displayName`, `description`, `permissions`) |

***

## Field / Index Management Tools

### backend_field_manage

Manage table fields by table ID. Creates a new schema version.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableId` | string | Yes | Table ID |
| `body` | object | | Field management operations |

#### body Fields

| Field | Type | Description |
|-------|------|-------------|
| `fieldsToAddOrUpdate` | object | Fields to add or update (BSON schema format) |
| `fieldsToRemove` | string[] | Field names to remove |
| `requiredFieldsToAdd` | string[] | Field names to add to required list |
| `requiredFieldsToRemove` | string[] | Field names to remove from required list |

### backend_index_manage

Manage table indexes by table ID. Creates a new index version.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableId` | string | Yes | Table ID |
| `body` | object | | Index management operations |

#### body Fields

| Field | Type | Description |
|-------|------|-------------|
| `indexesToAddOrUpdate` | array | Indexes to add or update |
| `indexesToRemove` | string[] | Index names to remove |

Each index object in `indexesToAddOrUpdate`:

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | Yes | Index name |
| `fields` | object | Yes | Index fields (`1` ascending, `-1` descending) |
| `unique` | boolean | | Unique index (default: false) |
| `sparse` | boolean | | Sparse index (default: false) |

***

## Schema / Index Version Tools

### backend_schema_version_list

List schema versions by table ID.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableId` | string | Yes | Table ID |
| `page` | number | | Page number |
| `limit` | number | | Items per page |

### backend_index_version_list

List index versions by table ID.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableId` | string | Yes | Table ID |
| `page` | number | | Page number |
| `limit` | number | | Items per page |

***

## Common Response Patterns

### List Response

```json
{
  "items": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Single Item Response

```json
{
  "id": "rec_abc123",
  "field1": "value1",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Error Response

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

***

{% hint style="warning" %}
⚠️ All API tools require authentication via OAuth 2.1. Always call `get_context` first to establish the session.
{% endhint %}

## Next Steps

- [MCP Tools Overview](01-overview.md) — Tool classification and flow
- [Context](02-context.md) — get_context details
- [MCP Resources](08-resources.md) — Resource URIs and how to query them
