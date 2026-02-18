# Filtering

{% hint style="info" %}
💡 Find exactly the data you need using AND/OR filters and search.
{% endhint %}

{% hint style="info" %}
💡 **API used in this document**

| Endpoint | Method | Auth | Description |
|----------|:------:|:----:|-------------|
| `/v1/data/:tableName` | GET | Conditional | Filtered query |
{% endhint %}

## Overview

When listing data, use the `andFilters`, `orFilters`, and `search` parameters to filter results. Pass filters as JSON strings via query parameters.

***

## AND Filters

`andFilters` returns only data that satisfies all conditions.

```bash
# Data where status is "active" AND age is 18 or above
curl -X GET "https://api-client.bkend.ai/v1/data/users?andFilters=%7B%22status%22%3A%22active%22%2C%22age%22%3A%7B%22%24gte%22%3A18%7D%7D" \
  -H "X-API-Key: {pk_publishable_key}"
```

```javascript
const andFilters = JSON.stringify({
  status: 'active',
  age: { $gte: 18 },
});

const response = await fetch(
  `https://api-client.bkend.ai/v1/data/users?andFilters=${encodeURIComponent(andFilters)}`,
  {
    headers: {
      'X-API-Key': '{pk_publishable_key}',
    },
  }
);
```

***

## OR Filters

`orFilters` returns data that satisfies at least one condition.

```javascript
const orFilters = JSON.stringify({
  category: 'notice',
  priority: 'high',
});

// Data where category is "notice" OR priority is "high"
const url = `https://api-client.bkend.ai/v1/data/posts?orFilters=${encodeURIComponent(orFilters)}`;
```

***

## Combining AND + OR

You can use both filters together.

```javascript
const andFilters = JSON.stringify({ published: true });
const orFilters = JSON.stringify({ category: 'notice', category: 'event' });

// Data where published is true AND category is "notice" or "event"
const url = `https://api-client.bkend.ai/v1/data/posts?andFilters=${encodeURIComponent(andFilters)}&orFilters=${encodeURIComponent(orFilters)}`;
```

***

## Operators

Use operators in filter values to specify conditions precisely.

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ "status": { "$eq": "active" } }` |
| `$ne` | Not equal to | `{ "status": { "$ne": "deleted" } }` |
| `$gt` | Greater than | `{ "age": { "$gt": 18 } }` |
| `$gte` | Greater than or equal to | `{ "age": { "$gte": 18 } }` |
| `$lt` | Less than | `{ "price": { "$lt": 10000 } }` |
| `$lte` | Less than or equal to | `{ "price": { "$lte": 10000 } }` |

### Inclusion Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$in` | Matches any value in the array | `{ "role": { "$in": ["admin", "editor"] } }` |
| `$nin` | Matches no value in the array | `{ "status": { "$nin": ["deleted", "banned"] } }` |

### Other Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$regex` | Regex match | `{ "email": { "$regex": "@example.com" } }` |
| `$exists` | Field existence | `{ "bio": { "$exists": true } }` |

### Direct Value Filter

Specifying a value without an operator works the same as `$eq`.

```json
{
  "status": "active",
  "published": true
}
```

***

## Search

Use the `search` parameter for partial-match search across all fields.

```bash
# Search for "bkend" across all fields
curl -X GET "https://api-client.bkend.ai/v1/data/posts?search=bkend" \
  -H "X-API-Key: {pk_publishable_key}"
```

### Search a Specific Field

Use `searchType` to target a specific field for the search.

```bash
# Search for "bkend" only in the title field
curl -X GET "https://api-client.bkend.ai/v1/data/posts?search=bkend&searchType=title" \
  -H "X-API-Key: {pk_publishable_key}"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | `string` | Search term (partial match) |
| `searchType` | `string` | Target field for search (all fields if unspecified) |

***

## Usage Examples

### Active users from the last 7 days

```javascript
const andFilters = JSON.stringify({
  status: 'active',
  createdAt: { $gte: '2025-01-08T00:00:00Z' },
});
```

### Published posts in specific categories

```javascript
const andFilters = JSON.stringify({
  published: true,
  category: { $in: ['notice', 'event'] },
});
```

### Search users by email domain

```javascript
const andFilters = JSON.stringify({
  email: { $regex: '@example\\.com$' },
});
```

***

### Filter Encoding Patterns

{% tabs %}
{% tab title="Correct Usage" %}
```javascript
const filters = { status: 'active', age: { $gte: 18 } };
const encoded = encodeURIComponent(JSON.stringify(filters));
const url = `https://api-client.bkend.ai/v1/data/users?andFilters=${encoded}`;
```
{% endtab %}
{% tab title="Incorrect Usage" %}
```javascript
// ❌ Passing directly without JSON.stringify
const url = `/v1/data/users?andFilters={status:'active'}`;

// ❌ Passing without encodeURIComponent
const url = `/v1/data/users?andFilters={"status":"active"}`;
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
⚠️ The values for `andFilters` and `orFilters` must be URL-encoded JSON strings. Without encoding, the parameters will not be parsed correctly.
{% endhint %}

## Next Steps

- [Sorting & Pagination](09-sorting-pagination.md) — Sort results and control pages
- [List Data](05-list.md) — Basic list query
- [API Reference](11-api-reference.md) — Full parameter listing
