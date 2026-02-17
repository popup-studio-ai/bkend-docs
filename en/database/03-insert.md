# Create Data

{% hint style="info" %}
Add new data to a table.
{% endhint %}

{% hint style="info" %}
**Before you start** — You need the following to proceed:
- [Create a project](../getting-started/02-quickstart.md) completed
- [Create a table](../console/07-table-management.md) completed
- Authentication setup — Public tables require no auth; tables with RLS require a JWT
{% endhint %}

{% hint style="info" %}
**API used in this document**

| Endpoint | Method | Auth | Description |
|----------|:------:|:----:|-------------|
| `/v1/data/:tableName` | POST | Conditional | Create data |
{% endhint %}

## Overview

Use the `POST /v1/data/:tableName` endpoint to create new data in a table. Include the fields directly in the request body.

***

## Create Data

### POST /v1/data/:tableName

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/posts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "My First Post",
    "content": "Hello, this is bkend.",
    "category": "notice",
    "published": true
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/data/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: 'My First Post',
    content: 'Hello, this is bkend.',
    category: 'notice',
    published: true,
  }),
});

const data = await response.json();
console.log(data.id); // Created data ID
```
{% endtab %}
{% endtabs %}

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableName` | `string` | ✅ | Table name |

### Request Body

Include the fields defined in the table schema directly. Pass the fields at the top level without any wrapper.

```json
{
  "title": "My First Post",
  "content": "Hello, this is bkend.",
  "category": "notice",
  "published": true
}
```

{% hint style="warning" %}
System fields (`id`, `createdBy`, `createdAt`, `updatedAt`) are set automatically. Do not include them in your request.
{% endhint %}

### Response (201 Created)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "My First Post",
  "content": "Hello, this is bkend.",
  "category": "notice",
  "published": true,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

const post = await bkendFetch('/v1/data/posts', {
  method: 'POST',
  body: {
    title: 'New Post',
    content: 'Hello!',
    published: true,
  },
});

console.log(post.id); // Created data ID
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrate bkend in Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Shorthand Path

You can also use the shorthand path in addition to the standard path.

```bash
# Standard path
POST /v1/data/posts

# Shorthand path (works identically)
POST /v1/posts
```

***

## Schema Validation

Automatic schema validation is performed when creating data.

| Validation | On Failure |
|------------|-----------|
| Missing required field | `400` — `data/validation-error` |
| Type mismatch | `400` — `data/validation-error` |
| Pattern mismatch | `400` — `data/validation-error` |
| Out of range | `400` — `data/validation-error` |
| Unique constraint violation | `409` — `data/duplicate-value` |

***

## Permissions

Creating data requires the `create` permission on the corresponding table.

| Role | Condition |
|------|-----------|
| `admin` | Always allowed |
| `user` | `permissions.user.create` is `true` |
| `guest` | `permissions.guest.create` is `true` |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `data/table-not-found` | 404 | Table does not exist |
| `data/validation-error` | 400 | Schema validation failed |
| `data/duplicate-value` | 409 | Unique constraint violation |
| `data/permission-denied` | 403 | No create permission |
| `data/scope-insufficient` | 403 | API key scope does not include `tableName:create` |
| `data/system-table-access` | 403 | Non-admin attempted to access a system table |
| `data/invalid-header` | 400 | Missing required header |

***

## Next Steps

- [Get a Single Record](04-select.md) — Retrieve the data you created
- [Data Model](02-data-model.md) — Understand schema and permissions
- [Filtering](08-filtering.md) — Search your data
