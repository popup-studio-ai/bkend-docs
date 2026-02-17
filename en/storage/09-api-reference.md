# Storage REST API Reference

{% hint style="info" %}
View all storage-related REST API endpoints at a glance.
{% endhint %}

## Common Information

### Base URL

```text
https://api-client.bkend.ai
```

### Required Headers

| Header | Required | Description |
|--------|:--------:|-------------|
| `X-API-Key` | ✅ | `{pk_publishable_key}` — Publishable Key |
| `Authorization` | ✅ | `Bearer {accessToken}` |
| `Content-Type` | Conditional | `application/json` — for POST and PATCH requests |

***

## Presigned URL Upload

```http
POST /v1/files/presigned-url
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `filename` | `string` | ✅ | Original file name |
| `contentType` | `string` | ✅ | MIME type |
| `fileSize` | `number` | - | File size in bytes |
| `visibility` | `string` | - | `public`, `private` (default), `protected`, `shared` |
| `category` | `string` | - | `images`, `documents`, `media`, `attachments`, `exports`, `backups`, `temp` |

**Response:** `200 OK` — `{ url, key, filename, contentType }`

> [Single File Upload](02-upload-single.md)

***

## Multipart Upload

### Initialize

```http
POST /v1/files/multipart/init
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `filename` | `string` | ✅ | Original file name |
| `contentType` | `string` | ✅ | MIME type |
| `fileSize` | `number` | ✅ | File size in bytes |
| `visibility` | `string` | - | Access scope |
| `category` | `string` | - | File category |

**Response:** `200 OK` — `{ uploadId, key, filename }`

### Part URL

```http
POST /v1/files/multipart/presigned-url
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `key` | `string` | ✅ | S3 key from init response |
| `uploadId` | `string` | ✅ | Upload ID from init response |
| `partNumber` | `number` | ✅ | Part number (1–10000) |

**Response:** `200 OK` — `{ url, partNumber }`

### Complete

```http
POST /v1/files/multipart/complete
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `key` | `string` | ✅ | S3 key |
| `uploadId` | `string` | ✅ | Upload ID |
| `parts` | `array` | ✅ | `[{ partNumber, etag }]` |

**Response:** `200 OK` — `{ key, location }`

### Abort

```http
POST /v1/files/multipart/abort
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `key` | `string` | ✅ | S3 key |
| `uploadId` | `string` | ✅ | Upload ID |

**Response:** `200 OK` — `{ success, key }`

> [Large File Upload](03-upload-multipart.md)

***

## Create File Metadata

```http
POST /v1/files
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `s3Key` | `string` | ✅ | `key` from Presigned URL response |
| `originalName` | `string` | ✅ | Original file name |
| `mimeType` | `string` | ✅ | MIME type |
| `size` | `number` | ✅ | File size in bytes |
| `width` | `number` | - | Image width in pixels |
| `height` | `number` | - | Image height in pixels |
| `visibility` | `string` | - | Access scope |
| `bucket` | `string` | - | Bucket (`avatars`, `documents`, `media`, `files`, `images`, `temp`) |
| `metadata` | `object` | - | `{ category, tags, description, alt, relatedEntityId, custom }` |

**Response:** `201 Created` — File metadata object

> [File Metadata](04-file-metadata.md)

***

## Retrieve File

```http
GET /v1/files/:fileId
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `fileId` | path | `string` | ✅ | File ID |

**Response:** `200 OK` — File metadata object (RLS filter applied)

> [File Metadata](04-file-metadata.md)

***

## List Files

```http
GET /v1/files
```

| Parameter | Type | Default | Description |
|-----------|------|:-------:|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `20` | Items per page |
| `sortBy` | `string` | - | Sort field |
| `sortDirection` | `string` | `desc` | `asc` / `desc` |
| `visibility` | `string` | - | Access scope filter |
| `ownerType` | `string` | - | Owner type filter |
| `ownerId` | `string` | - | Owner ID filter |
| `bucket` | `string` | - | Bucket filter |
| `mimeType` | `string` | - | MIME type filter |
| `search` | `string` | - | File name search |

**Response:** `200 OK` — `{ items: [...], pagination: { total, page, limit, totalPages, hasNextPage, hasPrevPage } }`

> [File List](05-file-list.md)

***

## Update File Metadata

```http
PATCH /v1/files/:fileId
```

| Parameter | Location | Type | Description |
|-----------|----------|------|-------------|
| `fileId` | path | `string` | File ID |
| `originalName` | body | `string` | Change file name |
| `visibility` | body | `string` | Change access scope |
| `metadata` | body | `object` | Partial metadata update |

**Response:** `200 OK` — `{ id, updatedAt }`

> [File Metadata](04-file-metadata.md)

***

## Delete File

```http
DELETE /v1/files/:fileId
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `fileId` | path | `string` | ✅ | File ID |

**Response:** `200 OK` — `{ success: true }`

> [File Deletion](07-file-delete.md)

***

## File Download

```http
POST /v1/files/:fileId/download-url
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `fileId` | path | `string` | ✅ | File ID |

**Response:** `200 OK` — `{ url, filename, contentType, size, expiresAt }`

> [File Download](06-download.md)

***

## Endpoint Summary

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/v1/files/presigned-url` | ✅ | Issue Presigned URL |
| `POST` | `/v1/files/multipart/init` | ✅ | Initialize multipart |
| `POST` | `/v1/files/multipart/presigned-url` | ✅ | Issue part URL |
| `POST` | `/v1/files/multipart/complete` | ✅ | Complete multipart |
| `POST` | `/v1/files/multipart/abort` | ✅ | Abort multipart |
| `POST` | `/v1/files` | ✅ | Register metadata |
| `GET` | `/v1/files/:fileId` | ✅ | Retrieve file |
| `GET` | `/v1/files` | ✅ | List files |
| `PATCH` | `/v1/files/:fileId` | ✅ | Update metadata |
| `DELETE` | `/v1/files/:fileId` | ✅ | Delete file |
| `POST` | `/v1/files/:fileId/download-url` | ✅ | Issue download URL |

***

{% hint style="warning" %}
All storage APIs require authentication. A `401 common/authentication-required` error is returned if the `Authorization: Bearer {accessToken}` header is missing.
{% endhint %}

## Error Codes

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `file/not-found` | 404 | File not found |
| `file/invalid-name` | 400 | Invalid file name |
| `file/file-too-large` | 400 | File size exceeded |
| `file/file-too-small` | 400 | File size too small |
| `file/invalid-format` | 400 | Unsupported format |
| `file/invalid-path` | 400 | Invalid path |
| `file/bucket-not-configured` | 500 | S3 bucket not configured |
| `file/invalid-part-number-range` | 400 | Part number out of range |
| `file/upload-init-failed` | 500 | Multipart initialization failed |
| `file/invalid-parts-array` | 400 | Invalid parts array |
| `file/access-denied` | 403 | Access denied |
| `file/s3-key-already-exists` | 409 | Duplicate S3 key |
| `file/s3-key-too-long` | 400 | S3 key too long |
| `file/original-name-too-long` | 400 | File name too long |
| `file/mime-type-too-long` | 400 | MIME type too long |
| `file/size-negative` | 400 | Negative file size |
| `common/authentication-required` | 401 | Authentication required |
