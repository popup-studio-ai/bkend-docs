# Table Schema Query

{% hint style="info" %}
Retrieve the schema, indexes, and permission settings of a table via the REST API.
{% endhint %}

## Overview

Use the `GET /v1/data/:tableName/spec` endpoint to query a table's schema definition, index settings, and permission settings. Use this in your client app to dynamically generate forms or validate data.

***

## Query Schema

### GET /v1/data/:tableName/spec

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET https://api-client.bkend.ai/v1/data/posts/spec \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/data/posts/spec', {
  headers: {
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
});

const spec = await response.json();
console.log(spec.schema);      // Field definitions
console.log(spec.permissions);  // Permission settings
```
{% endtab %}
{% endtabs %}

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableName` | `string` | ✅ | Table name |

### Response (200 OK)

```json
{
  "tableName": "posts",
  "schema": {
    "bsonType": "object",
    "required": ["title", "content"],
    "properties": {
      "title": {
        "bsonType": "string",
        "maxLength": 200
      },
      "content": {
        "bsonType": "string"
      },
      "category": {
        "bsonType": "string",
        "enum": ["notice", "general", "event"]
      },
      "published": {
        "bsonType": "bool"
      },
      "viewCount": {
        "bsonType": "int",
        "minimum": 0
      }
    }
  },
  "indexes": [
    {
      "key": { "category": 1 }
    },
    {
      "key": { "createdAt": -1 }
    }
  ],
  "permissions": {
    "admin": {
      "create": true,
      "read": true,
      "list": true,
      "update": true,
      "delete": true
    },
    "user": {
      "create": true,
      "read": true,
      "list": true
    },
    "guest": {
      "read": true,
      "list": true
    },
    "self": {
      "update": true,
      "delete": true
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `tableName` | `string` | Table name |
| `schema` | `object` | Schema definition (fields, types, constraints) |
| `indexes` | `array` | Index list |
| `permissions` | `object` | CRUD permissions per role |

***

## Usage Examples

### Dynamic Form Generation

Use schema information to dynamically generate input forms on the client.

```javascript
const spec = await fetchTableSpec('posts');
const { properties, required } = spec.schema;

Object.entries(properties).forEach(([field, def]) => {
  const isRequired = required?.includes(field);
  const type = def.bsonType;

  // Render the appropriate input component based on field type
  if (type === 'string' && def.enum) {
    // Select component (dropdown)
  } else if (type === 'string') {
    // Text Input
  } else if (type === 'bool') {
    // Checkbox
  } else if (type === 'int' || type === 'double') {
    // Number Input (with min/max applied)
  }
});
```

### Permission Check

Show or hide UI elements based on the current user's role.

```javascript
const spec = await fetchTableSpec('posts');
const userRole = 'user'; // Current user's role

const canCreate = spec.permissions[userRole]?.create ?? false;
const canUpdate = spec.permissions[userRole]?.update ?? false;
const canDelete = spec.permissions[userRole]?.delete ?? false;

// Show/hide buttons based on permissions
```

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `data/table-not-found` | 404 | Table does not exist |
| `data/permission-denied` | 403 | No access permission |
| `data/invalid-header` | 400 | Missing required header |

***

{% hint style="warning" %}
The table schema query is available only to the `admin` role or roles that have `read` permission on the table. To query with `guest` permissions, verify the table permission settings.
{% endhint %}

## OpenAPI Spec Query

### GET /v1/data/:tableName/openapi

You can also get a full OpenAPI 3.0 specification document for a table's CRUD operations. This is useful for auto-generating client SDKs or importing into API testing tools (e.g., Postman, Swagger UI).

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET https://api-client.bkend.ai/v1/data/posts/openapi \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/data/posts/openapi', {
  headers: {
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
});

const openApiSpec = await response.json();
console.log(openApiSpec.openapi);  // "3.0.0"
console.log(openApiSpec.paths);    // Path definitions
```
{% endtab %}
{% endtabs %}

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableName` | `string` | Yes | Table name |

### Response (200 OK)

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "posts API",
    "version": "1.0.0",
    "description": "CRUD API for posts table"
  },
  "paths": {
    "/v1/data/posts": {
      "get": { "..." },
      "post": { "..." }
    },
    "/v1/data/posts/{id}": {
      "get": { "..." },
      "patch": { "..." },
      "delete": { "..." }
    }
  },
  "components": {
    "schemas": { "..." }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `openapi` | `string` | OpenAPI version (always `"3.0.0"`) |
| `info` | `object` | API metadata (title, version, description) |
| `paths` | `object` | Path definitions for CRUD operations |
| `components` | `object` | Schema component definitions |

{% hint style="info" %}
The OpenAPI spec is generated dynamically based on the table's current schema. Changes to fields, types, or constraints are immediately reflected.
{% endhint %}

***

## Next Steps

- [Data Model](02-data-model.md) -- Understand schema and permission structure
- [Create Data](03-insert.md) -- Create data that conforms to the schema
- [Table Management](../console/07-table-management.md) -- Edit schema in the console
