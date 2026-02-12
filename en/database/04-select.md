# Get a Single Record

{% hint style="info" %}
Retrieve a specific record by its ID.
{% endhint %}

## Overview

Use the `GET /v1/data/:tableName/:id` endpoint to retrieve a specific record by ID.

***

## Retrieve Data

### GET /v1/data/:tableName/:id

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET https://api-client.bkend.ai/v1/data/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const postId = '507f1f77bcf86cd799439011';

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts/${postId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});

const post = await response.json();
console.log(post.title);
```
{% endtab %}
{% endtabs %}

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tableName` | `string` | ✅ | Table name |
| `id` | `string` | ✅ | Data ID |

### Response (200 OK)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "My First Post",
  "content": "Hello, this is bkend.",
  "category": "notice",
  "published": true,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

const post = await bkendFetch('/v1/data/posts/{id}');
console.log(post.title);
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrate bkend in Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Permissions

Retrieving data requires the `read` permission on the corresponding table.

| Role | Condition |
|------|-----------|
| `admin` | Always allowed |
| `user` | `permissions.user.read` is `true` |
| `guest` | `permissions.guest.read` is `true` |
| `self` | Only allowed when `createdBy` matches the requester |

{% hint style="info" %}
If only `self` permission is configured, attempting to read data created by another user returns a `403` error.
{% endhint %}

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `data/table-not-found` | 404 | Table does not exist |
| `data/not-found` | 404 | Data not found |
| `data/permission-denied` | 403 | No read permission |

***

## Next Steps

- [List Data](05-list.md) — Retrieve multiple records at once
- [Filtering](08-filtering.md) — Search data by conditions
- [Update Data](06-update.md) — Modify the retrieved data
