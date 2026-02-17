# MCP API Reference

{% hint style="info" %}
This page provides the input/output schemas for all tools offered by the bkend MCP server.
{% endhint %}

## Fixed Tools

### get_context

Retrieves the session context. Automatically called by the AI tool upon connection.

| Item | Value |
|------|-------|
| Parameters | None |
| Response | Organization, project list, API endpoint, warnings |

### search_docs

Searches bkend documentation.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `query` | string | Yes | Search keyword |

***

## Project Management Tools

### backend_org_list

| Parameters | None |
|------------|------|

### backend_project_list

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |

### backend_project_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |

### backend_project_create

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `name` | string | Yes | Project name |
| `description` | string | | Project description |

### backend_project_update

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `name` | string | | New name |
| `description` | string | | New description |

### backend_project_delete

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |

***

## Environment Management Tools

### backend_env_list

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |

### backend_env_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |

### backend_env_create

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `name` | string | Yes | Environment name |

***

## Table Management Tools

### backend_table_list

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |

### backend_table_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |

### backend_table_create

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `name` | string | Yes | Table name |
| `fields` | array | Yes | Field array |

#### fields Array

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | Yes | Field name |
| `type` | string | Yes | `string`, `number`, `boolean`, `date`, `object`, `array`, `reference` |
| `required` | boolean | | Whether required (default: false) |
| `unique` | boolean | | Whether unique (default: false) |
| `defaultValue` | any | | Default value |

### backend_table_delete

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |

***

## Field / Index Management Tools

### backend_field_manage

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `action` | string | Yes | `add`, `update`, `delete` |
| `field` | object | Yes | Field information |

### backend_index_manage

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `action` | string | Yes | `add`, `delete` |
| `index` | object | Yes | Index information |

***

## Schema / Index Version Tools

### backend_schema_version_list / backend_index_version_list

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |

### backend_schema_version_get / backend_index_version_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `versionId` | string | Yes | Version ID |

### backend_schema_version_apply

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `versionId` | string | Yes | Version ID to apply |

***

## Data CRUD Tools

### backend_data_list

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `page` | number | | Page number (default: 1) |
| `limit` | number | | Items per page (default: 20, max: 100) |
| `sortBy` | string | | Sort field |
| `sortDirection` | string | | `asc` or `desc` |
| `andFilters` | object | | AND condition filters |
| `orFilters` | array | | OR condition filters |

### backend_data_get

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `recordId` | string | Yes | Record ID |

### backend_data_create

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `data` | object | Yes | Data to create |

### backend_data_update

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `recordId` | string | Yes | Record ID |
| `data` | object | Yes | Data to update |

### backend_data_delete

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | string | Yes | Organization ID |
| `projectId` | string | Yes | Project ID |
| `environmentId` | string | Yes | Environment ID |
| `tableId` | string | Yes | Table ID |
| `recordId` | string | Yes | Record ID |

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
Dynamic tools can only be used after setting the project context. Always call `get_context` first.
{% endhint %}

## Next Steps

- [MCP Tools Overview](01-overview.md) — Tool classification and flow
- [Context](02-context.md) — get_context details
- [MCP Resources](08-resources.md) — Resource URIs and how to query them
