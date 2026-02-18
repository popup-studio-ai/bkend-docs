# Sorting & Pagination

{% hint style="info" %}
💡 Control the sort order and page of your data list.
{% endhint %}

## Overview

When listing data, use the `sortBy`, `sortDirection`, `page`, and `limit` parameters to control sorting and pagination of results.

***

## Sorting

### sortBy

Specify the field to sort by. Any field in the table can be used as a sort key.

```bash
# Sort by createdAt in descending order (newest first)
curl -X GET "https://api-client.bkend.ai/v1/data/posts?sortBy=createdAt&sortDirection=desc" \
  -H "X-API-Key: {pk_publishable_key}"
```

### sortDirection

| Value | Description |
|-------|-------------|
| `asc` | Ascending (A to Z, 1 to 9, oldest to newest) |
| `desc` | Descending (Z to A, 9 to 1, newest to oldest) — **default** |

### Sorting Examples

```javascript
// Sort by name ascending
const params = new URLSearchParams({
  sortBy: 'name',
  sortDirection: 'asc',
});

// Sort by price descending
const params2 = new URLSearchParams({
  sortBy: 'price',
  sortDirection: 'desc',
});

// Sort by updatedAt newest first (default)
const params3 = new URLSearchParams({
  sortBy: 'updatedAt',
  sortDirection: 'desc',
});
```

{% hint style="info" %}
💡 If `sortBy` is not specified, the default sort order (by `id`) is applied.
{% endhint %}

***

## Pagination

### page / limit

| Parameter | Type | Default | Range | Description |
|-----------|------|:-------:|:-----:|-------------|
| `page` | `number` | `1` | 1+ | Page number |
| `limit` | `number` | `20` | 1-100 | Items per page |

### Basic Usage

```bash
# Page 1, 10 items per page
curl -X GET "https://api-client.bkend.ai/v1/data/posts?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}"
```

### Pagination Response

```json
{
  "items": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `total` | `number` | Total number of records |
| `page` | `number` | Current page |
| `limit` | `number` | Items per page |
| `totalPages` | `number` | Total number of pages |
| `hasNext` | `boolean` | Whether a next page exists |
| `hasPrev` | `boolean` | Whether a previous page exists |

***

## Combining Sorting + Pagination + Filters

You can combine all parameters together.

```javascript
const andFilters = JSON.stringify({ published: true });

const params = new URLSearchParams({
  page: '1',
  limit: '20',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  andFilters,
});

const response = await fetch(
  `https://api-client.bkend.ai/v1/data/posts?${params}`,
  {
    headers: {
      'X-API-Key': '{pk_publishable_key}',
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);
```

### Iterating Through All Data

Use `hasNext` to iterate through all pages.

```javascript
let page = 1;
let hasNext = true;
const allItems = [];

while (hasNext) {
  const response = await fetch(
    `https://api-client.bkend.ai/v1/data/posts?page=${page}&limit=100`,
    {
      headers: {
        'X-API-Key': '{pk_publishable_key}',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const { items, pagination } = await response.json();
  allItems.push(...items);
  hasNext = pagination.hasNext;
  page++;
}
```

***

## Next Steps

- [Filtering](08-filtering.md) — AND/OR filters and search
- [List Data](05-list.md) — Basic list query
- [API Reference](11-api-reference.md) — Full parameter listing
