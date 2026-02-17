# Update Data

{% hint style="info" %}
Partially update fields of existing data.
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
| `/v1/data/:tableName/:id` | PATCH | Conditional | Update data |
{% endhint %}

## Overview

Use the `PATCH /v1/data/:tableName/:id` endpoint to update existing data. Include only the fields you want to change in the request (Partial Update).

***

## Update Data

### PATCH /v1/data/:tableName/:id

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/data/posts/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "Updated Title",
    "published": true
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const postId = '507f1f77bcf86cd799439011';

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts/${postId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: 'Updated Title',
    published: true,
  }),
});

const updated = await response.json();
```
{% endtab %}
{% endtabs %}

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableName` | `string` | ✅ | Table name |
| `id` | `string` | ✅ | Data ID |

### Request Body

Include only the fields you want to change. Fields not included in the request retain their existing values.

```json
{
  "title": "Updated Title",
  "published": true
}
```

{% hint style="warning" %}
System fields (`id`, `createdBy`, `createdAt`) cannot be modified. `updatedAt` is automatically refreshed.
{% endhint %}

### Response (200 OK)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Updated Title",
  "content": "Hello, this is bkend.",
  "category": "notice",
  "published": true,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T14:20:00.000Z"
}
```

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

const updated = await bkendFetch('/v1/data/posts/{id}', {
  method: 'PATCH',
  body: {
    title: 'Updated Title',
  },
});
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrate bkend in Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Permissions

Updating data requires the `update` permission on the corresponding table.

| Role | Condition |
|------|-----------|
| `admin` | Always allowed |
| `user` | `permissions.user.update` is `true` |
| `guest` | `permissions.guest.update` is `true` |
| `self` | Only data where `createdBy` matches the requester can be updated |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `data/table-not-found` | 404 | Table does not exist |
| `data/not-found` | 404 | Data not found |
| `data/validation-error` | 400 | Schema validation failed |
| `data/permission-denied` | 403 | No update permission |
| `data/scope-insufficient` | 403 | API key scope does not include `tableName:update` |

***

## Next Steps

- [Delete Data](07-delete.md) — Remove data
- [Get a Single Record](04-select.md) — Verify updated data
- [Data Model](02-data-model.md) — Understand schema and permissions
