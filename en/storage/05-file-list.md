# File List

{% hint style="info" %}
Filter, sort, and search registered files to retrieve them as a list.
{% endhint %}

## Overview

Use the `GET /v1/files` endpoint to retrieve a list of file metadata. You can filter by visibility, MIME type, owner, and more.

***

## Retrieve File List

### GET /v1/files

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET "https://api-client.bkend.ai/v1/files?page=1&limit=20&visibility=private&sortBy=createdAt&sortDirection=desc" \
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
  visibility: 'private',
  sortBy: 'createdAt',
  sortDirection: 'desc',
});

const response = await fetch(`https://api-client.bkend.ai/v1/files?${params}`, {
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
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `20` | Items per page (1–100) |
| `sortBy` | `string` | - | Sort field |
| `sortDirection` | `string` | `desc` | `asc` / `desc` |
| `visibility` | `string` | - | `public`, `private`, `protected`, `shared` |
| `ownerType` | `string` | - | `user`, `session`, `service`, `public` |
| `ownerId` | `string` | - | Owner ID |
| `bucket` | `string` | - | Bucket name |
| `mimeType` | `string` | - | MIME type filter |
| `search` | `string` | - | File name search |

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "file-uuid-1234",
      "s3Key": "files/a1b2c3d4/profile.jpg",
      "originalName": "profile.jpg",
      "mimeType": "image/jpeg",
      "size": 1048576,
      "visibility": "private",
      "ownerId": "user-uuid-1234",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

***

## Filter Examples

### Retrieve Only Image Files

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?mimeType=image/jpeg" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### Retrieve Only Public Files

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?visibility=public" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### Search by File Name

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?search=profile" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## Access Control

RLS (Row Level Security) is applied when retrieving file lists.

| User | Visible Scope |
|------|---------------|
| `admin` | All files |
| Owner | All fields for own files |
| Non-owner | Public fields only |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `common/authentication-required` | 401 | Authentication required |
| `file/access-denied` | 403 | Access denied |

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

// Retrieve file list
async function getFileList(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || '1',
    limit: filters.limit || '20',
    sortBy: filters.sortBy || 'createdAt',
    sortDirection: filters.sortDirection || 'desc',
    ...(filters.visibility && { visibility: filters.visibility }),
    ...(filters.mimeType && { mimeType: filters.mimeType }),
    ...(filters.search && { search: filters.search }),
  });

  const result = await bkendFetch(`/v1/files?${params}`);

  return result; // { items: [...], pagination: { ... } }
}

// Retrieve only image files
async function getImageFiles() {
  const result = await getFileList({
    mimeType: 'image/jpeg',
    page: 1,
    limit: 10,
  });

  console.log(`Total ${result.pagination.total} image files`);
  result.items.forEach(file => {
    console.log(file.originalName, file.size);
  });

  return result;
}

// Search files by name
async function searchFiles(query) {
  const result = await getFileList({
    search: query,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  return result.items;
}

// Usage example
const files = await getFileList({
  visibility: 'private',
  page: 1,
  limit: 20,
});

console.log('File list:', files.items);
console.log('Total pages:', files.pagination.totalPages);
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrating bkend with Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Next Steps

- [File Metadata](04-file-metadata.md) — View file details
- [File Download](06-download.md) — Get download URLs
- [File Deletion](07-file-delete.md) — Delete files
