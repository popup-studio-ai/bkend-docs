# Performance Optimization

{% hint style="info" %}
Learn how to optimize the performance of your bkend project.
{% endhint %}

## Overview

To optimize the performance of your bkend project, consider index management, query optimization, file storage usage, and API call efficiency.

***

## Index Management

### Default Indexes

bkend automatically creates the following indexes when a table is created.

| Index Name | Field | Sort Order | Description |
|-----------|-------|------------|-------------|
| `_id_` | `_id` | Ascending | Primary key index (system) |
| `idx_createdAt_desc` | `createdAt` | Descending | Sort by creation date |
| `idx_updatedAt_desc` | `updatedAt` | Descending | Sort by modification date |
| `idx_createdBy` | `createdBy` | Ascending | Filter by author |

{% hint style="warning" %}
Default indexes and the system index (`_id_`) cannot be modified or deleted.
{% endhint %}

### Adding Custom Indexes

Adding indexes to frequently queried fields significantly improves query performance.

```json
{
  "name": "idx_status_createdAt",
  "fields": {
    "status": 1,
    "createdAt": -1
  }
}
```

### Index Types

| Type | Description | Example |
|------|-------------|---------|
| **Single Field** | Index on a single field | `{ "email": 1 }` |
| **Compound** | Index combining multiple fields | `{ "status": 1, "createdAt": -1 }` |
| **Unique** | Prevents duplicate values | Email, slug, etc. |
| **Sparse** | Index excluding null values | Optional fields |

Manage indexes from the **console** or **MCP tools**.

→ [Index Management (Console)](../console/09-index-management.md), [Table Management Tools](../mcp/04-table-tools.md)

***

## Query Optimization

### Filter by Indexed Fields

Use indexed fields as your primary filter conditions.

```bash
# Good example — filtering by indexed fields
curl -X GET "https://api-client.bkend.ai/v1/data/posts?andFilters[status]=published&sort=-createdAt&limit=20" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {api_key}"
```

### Use Pagination

Always use `limit` and `offset` when querying large datasets.

| Parameter | Description | Recommended |
|-----------|-------------|:-----------:|
| `limit` | Number of records per request | 10–50 |
| `offset` | Number of records to skip | page × limit |

```javascript
// Pagination
const page = 1;
const limit = 20;
const offset = (page - 1) * limit;

const response = await fetch(
  `https://api-client.bkend.ai/v1/data/posts?limit=${limit}&offset=${offset}`,
  {
    headers: {
      'X-API-Key': '{pk_publishable_key}',
      'Authorization': `Bearer ${apiKey}`,
    },
  }
);
```

### Select Only Required Fields

Reduce response size by selecting only the fields you need.

```bash
# Query only required fields
curl -X GET "https://api-client.bkend.ai/v1/data/posts?fields=title,status,createdAt" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {api_key}"
```

***

## File Storage Optimization

### File Size Optimization

| File Type | Recommendation |
|-----------|---------------|
| **Images** | Compress before upload, use WebP format |
| **Documents** | Store only required formats, compress PDFs |
| **Large files** | Use multipart upload |

### CDN Usage

| Access Method | Response Speed | Expiry | Best For |
|--------------|:--------------:|:------:|---------|
| **CDN** (public) | Fast | None | Profile images, static files |
| **Presigned URL** (private) | Normal | Has expiry | Sensitive files |

{% hint style="info" %}
Set frequently accessed non-sensitive files to `public` to take advantage of CDN.
{% endhint %}

***

## API Call Optimization

### Batch Processing

Process multiple records at once to reduce the number of API calls.

```javascript
// Bad example — individual inserts (N calls)
for (const item of items) {
  await fetch('https://api-client.bkend.ai/v1/data/posts', {
    method: 'POST',
    headers: { /* ... */ },
    body: JSON.stringify(item),
  });
}

// Good example — batch insert (1 call)
await fetch('https://api-client.bkend.ai/v1/data/posts', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify(items), // Pass as array
});
```

### Client-Side Caching

Cache data that does not change frequently on the client side.

```javascript
const cache = new Map();

async function fetchWithCache(url, options, ttl = 60000) {
  const cached = cache.get(url);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const response = await fetch(url, options);
  const data = await response.json();
  cache.set(url, { data, expiry: Date.now() + ttl });
  return data;
}
```

***

## Performance Checklist

- [ ] Added indexes for frequently filtered fields
- [ ] Applied pagination
- [ ] Querying only required fields (excluding unnecessary ones)
- [ ] Using CDN for public files
- [ ] Minimized API calls with batch processing
- [ ] Applied client-side caching

***

## Next Steps

- [Filtering](../database/08-filtering.md) — Write efficient queries
- [Sorting & Pagination](../database/09-sorting-pagination.md) — Use pagination effectively
- [File Upload](../storage/02-upload-single.md) — Optimize file uploads
