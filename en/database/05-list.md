# List Data

{% hint style="info" %}
Retrieve data from a table as a list. Supports filtering, sorting, and pagination.
{% endhint %}

## Overview

Use the `GET /v1/data/:tableName` endpoint to retrieve a list of data from a table. Apply pagination, sorting, and filtering through query parameters.

***

## List Query

### GET /v1/data/:tableName

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET "https://api-client.bkend.ai/v1/data/posts?page=1&limit=20&sortBy=createdAt&sortDirection=desc" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const params = new URLSearchParams({
  page: '1',
  limit: '20',
  sortBy: 'createdAt',
  sortDirection: 'desc',
});

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts?${params}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});

const { items, pagination } = await response.json();
```
{% endtab %}
{% endtabs %}

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|:-------:|-------------|
| `page` | `number` | `1` | Page number (starts from 1) |
| `limit` | `number` | `20` | Items per page (1-100) |
| `sortBy` | `string` | - | Sort field |
| `sortDirection` | `string` | `desc` | `asc` or `desc` |
| `search` | `string` | - | Search term (partial match) |
| `searchType` | `string` | - | Field to search |
| `andFilters` | `JSON` | - | AND condition filters |
| `orFilters` | `JSON` | - | OR condition filters |

{% hint style="info" %}
For more details on filtering and sorting, see [Filtering](08-filtering.md) and [Sorting & Pagination](09-sorting-pagination.md).
{% endhint %}

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "My First Post",
      "content": "Hello, this is bkend.",
      "category": "notice",
      "published": true,
      "createdBy": "user-uuid-1234",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Second Post",
      "content": "Nice to meet you.",
      "category": "general",
      "published": false,
      "createdBy": "user-uuid-5678",
      "createdAt": "2025-01-14T09:00:00.000Z",
      "updatedAt": "2025-01-14T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Pagination Response

| Field | Type | Description |
|-------|------|-------------|
| `total` | `number` | Total number of records |
| `page` | `number` | Current page |
| `limit` | `number` | Items per page |
| `totalPages` | `number` | Total number of pages |
| `hasNext` | `boolean` | Whether a next page exists |
| `hasPrev` | `boolean` | Whether a previous page exists |

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

const result = await bkendFetch('/v1/data/posts?page=1&limit=10');
console.log(result.items);       // Data array
console.log(result.pagination);  // Pagination info
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrate bkend in Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Permissions

Listing data requires the `list` permission on the corresponding table.

| Role | Condition |
|------|-----------|
| `admin` | Access to all data |
| `user` | `permissions.user.list` is `true` |
| `guest` | `permissions.guest.list` is `true` |
| `self` | Automatically adds a `createdBy` filter (own data only) |

{% hint style="warning" %}
When only `self` permission is configured, only data created by the requester is returned, even without an explicit filter.
{% endhint %}

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `data/table-not-found` | 404 | Table does not exist |
| `data/permission-denied` | 403 | No list permission |

***

## Next Steps

- [Filtering](08-filtering.md) — AND/OR filters, search
- [Sorting & Pagination](09-sorting-pagination.md) — Sort order and page control
- [Get a Single Record](04-select.md) — Retrieve a specific record by ID
