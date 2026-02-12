# Database REST API Reference

{% hint style="info" %}
View all database REST API endpoints at a glance.
{% endhint %}

## Common

### Base URL

```text
https://api-client.bkend.ai
```

### Paths

All endpoints support two path formats.

| Path | Description |
|------|-------------|
| `/v1/data/:tableName` | Standard path |
| `/v1/:tableName` | Shorthand path (identical behavior) |

### Required Headers

| Header | Required | Description |
|--------|:--------:|-------------|
| `X-Project-Id` | ✅ | Project ID |
| `X-Environment` | ✅ | `dev` / `staging` / `prod` |
| `Authorization` | Conditional | `Bearer {accessToken}` — Required depending on permissions |
| `Content-Type` | Conditional | `application/json` — Required for POST and PATCH requests |

### System Fields

Fields automatically included in every record.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique data ID |
| `createdBy` | `string` | Creator ID |
| `createdAt` | `string` | Creation timestamp (ISO 8601) |
| `updatedAt` | `string` | Last modified timestamp (ISO 8601) |

***

## Create Data

```http
POST /v1/data/:tableName
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `tableName` | path | `string` | ✅ | Table name |
| *(fields)* | body | *(varies)* | Schema | Fields defined in the table schema |

**Response:** `201 Created` — Created data (including system fields)

> [Create Data](03-insert.md)

***

## Get a Single Record

```http
GET /v1/data/:tableName/:id
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `tableName` | path | `string` | ✅ | Table name |
| `id` | path | `string` | ✅ | Data ID |

**Response:** `200 OK` — Data object

> [Get a Single Record](04-select.md)

***

## List Data

```http
GET /v1/data/:tableName
```

| Parameter | Location | Type | Default | Description |
|-----------|----------|------|:-------:|-------------|
| `tableName` | path | `string` | - | Table name |
| `page` | query | `number` | `1` | Page number (1+) |
| `limit` | query | `number` | `20` | Items per page (1-100) |
| `sortBy` | query | `string` | - | Sort field |
| `sortDirection` | query | `string` | `desc` | `asc` / `desc` |
| `search` | query | `string` | - | Search term (partial match) |
| `searchType` | query | `string` | - | Target field for search |
| `andFilters` | query | `JSON` | - | AND condition filters |
| `orFilters` | query | `JSON` | - | OR condition filters |

**Response:** `200 OK` — `{ items: [...], pagination: { total, page, limit, totalPages, hasNext, hasPrev } }`

> [List Data](05-list.md) | [Filtering](08-filtering.md) | [Sorting & Pagination](09-sorting-pagination.md)

***

## Update Data

```http
PATCH /v1/data/:tableName/:id
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `tableName` | path | `string` | ✅ | Table name |
| `id` | path | `string` | ✅ | Data ID |
| *(fields)* | body | *(varies)* | - | Only the fields to update (Partial Update) |

**Response:** `200 OK` — Updated data (including system fields)

> [Update Data](06-update.md)

***

## Delete Data

```http
DELETE /v1/data/:tableName/:id
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `tableName` | path | `string` | ✅ | Table name |
| `id` | path | `string` | ✅ | Data ID |

**Response:** `200 OK` — `{ success: true }`

> [Delete Data](07-delete.md)

***

## Table Schema Query

```http
GET /v1/data/:tableName/spec
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `tableName` | path | `string` | ✅ | Table name |

**Response:** `200 OK` — `{ tableName, schema, indexes, permissions }`

> [Table Schema Query](10-table-spec.md)

***

## Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| *(direct value)* | Equal to | `{ "status": "active" }` |
| `$eq` | Equal to | `{ "status": { "$eq": "active" } }` |
| `$ne` | Not equal to | `{ "status": { "$ne": "deleted" } }` |
| `$gt` | Greater than | `{ "age": { "$gt": 18 } }` |
| `$gte` | Greater than or equal to | `{ "age": { "$gte": 18 } }` |
| `$lt` | Less than | `{ "price": { "$lt": 10000 } }` |
| `$lte` | Less than or equal to | `{ "price": { "$lte": 10000 } }` |
| `$in` | Matches any value | `{ "role": { "$in": ["admin", "editor"] } }` |
| `$nin` | Matches no value | `{ "status": { "$nin": ["deleted"] } }` |
| `$regex` | Regex match | `{ "email": { "$regex": "@example.com" } }` |
| `$exists` | Field existence | `{ "bio": { "$exists": true } }` |

***

## Permission Matrix

| Operation | `admin` | `user` | `guest` | `self` |
|-----------|:-------:|:------:|:-------:|:------:|
| create | ✅ | Configurable | Configurable | - |
| read | ✅ | Configurable | Configurable | Own only |
| list | ✅ | Configurable | Configurable | Own only |
| update | ✅ | Configurable | Configurable | Own only |
| delete | ✅ | Configurable | Configurable | Own only |

***

## Endpoint Summary

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/data/:tableName` | Create data |
| `GET` | `/v1/data/:tableName/:id` | Get a single record |
| `GET` | `/v1/data/:tableName` | List data |
| `PATCH` | `/v1/data/:tableName/:id` | Update data |
| `DELETE` | `/v1/data/:tableName/:id` | Delete data |
| `GET` | `/v1/data/:tableName/spec` | Query schema |

{% hint style="info" %}
All endpoints also support the `/v1/:tableName` shorthand path.
{% endhint %}

***

## Error Codes

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `data/table-not-found` | 404 | Table does not exist |
| `data/environment-not-found` | 404 | Environment does not exist |
| `data/not-found` | 404 | Data not found |
| `data/validation-error` | 400 | Schema validation failed |
| `data/duplicate-value` | 409 | Unique constraint violation |
| `data/permission-denied` | 403 | Permission denied |
| `data/system-table-access` | 403 | System table access denied |
| `data/invalid-header` | 400 | Missing required header |
| `data/rate-limit-exceeded` | 429 | API rate limit exceeded |
