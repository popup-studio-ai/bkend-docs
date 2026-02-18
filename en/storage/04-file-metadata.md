# File Metadata Management

{% hint style="info" %}
Register and manage file metadata. You must register metadata after uploading a file.
{% endhint %}

{% hint style="info" %}
**Before you start** — You need the following to proceed:
- [Project creation](../getting-started/02-quickstart.md) completed
- User authentication completed (JWT token required — all file APIs require authentication)
{% endhint %}

**APIs used in this document:**

| Endpoint | Method | Auth | Description |
|----------|:------:|:----:|-------------|
| `/v1/files` | POST | JWT | Create metadata |
| `/v1/files/:fileId` | GET | JWT | Retrieve file |
| `/v1/files/:fileId` | PATCH | JWT | Update metadata |

## Overview

After uploading a file to storage, you need to register file metadata with the bkend API. Metadata includes information such as file name, size, MIME type, category, and tags.

***

## Register Metadata

### POST /v1/files

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/files \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "s3Key": "{key from presigned response}",
    "originalName": "profile.jpg",
    "mimeType": "image/jpeg",
    "size": 1048576,
    "visibility": "private",
    "metadata": {
      "category": "profile",
      "tags": ["avatar", "user"],
      "alt": "User profile image"
    }
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/files', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    s3Key: presigned.key,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    visibility: 'private',
  }),
});

const fileData = await response.json();
console.log(fileData.id); // File ID
```
{% endtab %}
{% endtabs %}

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `s3Key` | `string` | ✅ | `key` from the Presigned URL response |
| `originalName` | `string` | ✅ | Original file name |
| `mimeType` | `string` | ✅ | MIME type |
| `size` | `number` | ✅ | File size in bytes |
| `width` | `number` | - | Image width in pixels |
| `height` | `number` | - | Image height in pixels |
| `visibility` | `string` | - | `public`, `private` (default), `protected`, `shared` |
| `bucket` | `string` | - | `avatars`, `documents`, `media`, `files`, `images`, `temp` |
| `metadata` | `object` | - | Extended metadata |

### metadata Fields

| Field | Type | Description |
|-------|------|-------------|
| `category` | `string` | File classification |
| `tags` | `string[]` | Tag list |
| `description` | `string` | File description |
| `alt` | `string` | Image alt text |
| `relatedEntityId` | `string` | Related entity ID |
| `custom` | `object` | Custom data |

### Response (201 Created)

```json
{
  "id": "file-uuid-1234",
  "s3Key": "files/a1b2c3d4/profile.jpg",
  "originalName": "profile.jpg",
  "mimeType": "image/jpeg",
  "size": 1048576,
  "visibility": "private",
  "ownerId": "user-uuid-1234",
  "ownerType": "user",
  "metadata": {
    "category": "profile",
    "tags": ["avatar", "user"],
    "alt": "User profile image"
  },
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

***

## Retrieve File

### GET /v1/files/:fileId

```bash
curl -X GET https://api-client.bkend.ai/v1/files/{fileId} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### Response (200 OK)

```json
{
  "id": "file-uuid-1234",
  "s3Key": "files/a1b2c3d4/profile.jpg",
  "originalName": "profile.jpg",
  "mimeType": "image/jpeg",
  "size": 1048576,
  "visibility": "private",
  "ownerId": "user-uuid-1234",
  "ownerType": "user",
  "metadata": {
    "category": "profile",
    "tags": ["avatar", "user"]
  },
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

{% hint style="info" %}
When a non-owner retrieves a file, only public fields are returned. Admins (`admin`) can view all fields.
{% endhint %}

***

## Update Metadata

### PATCH /v1/files/:fileId

```bash
curl -X PATCH https://api-client.bkend.ai/v1/files/{fileId} \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "originalName": "new-profile.jpg",
    "visibility": "public",
    "metadata": {
      "description": "Updated profile image"
    }
  }'
```

### Updatable Fields

| Parameter | Type | Description |
|-----------|------|-------------|
| `originalName` | `string` | Change file name |
| `visibility` | `string` | Change access scope |
| `metadata` | `object` | Partial metadata update |

### Response (200 OK)

```json
{
  "id": "file-uuid-1234",
  "updatedAt": "2025-01-15T14:20:00.000Z"
}
```

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `file/not-found` | 404 | File not found |
| `file/s3-key-already-exists` | 409 | Duplicate file key |
| `file/invalid-name` | 400 | Invalid file name |
| `file/access-denied` | 403 | Access denied |
| `common/authentication-required` | 401 | Authentication required |

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

// Register metadata
async function registerFileMetadata(s3Key, file) {
  const metadata = await bkendFetch('/v1/files', {
    method: 'POST',
    body: {
      s3Key,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      visibility: 'private',
      metadata: {
        category: 'profile',
        tags: ['avatar', 'user'],
        alt: 'User profile image',
      },
    },
  });

  return metadata; // { id, s3Key, originalName, ... }
}

// Retrieve file
async function getFileMetadata(fileId) {
  const file = await bkendFetch(`/v1/files/${fileId}`);
  console.log(file.originalName, file.size);
  return file;
}

// Update metadata
async function updateFileMetadata(fileId, updates) {
  const result = await bkendFetch(`/v1/files/${fileId}`, {
    method: 'PATCH',
    body: {
      originalName: 'new-profile.jpg',
      visibility: 'public',
      metadata: {
        description: 'Updated profile image',
      },
    },
  });

  return result; // { id, updatedAt }
}
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrating bkend with Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Next Steps

- [File List](05-file-list.md) — Search/filter files
- [File Download](06-download.md) — Get file download URLs
- [File Access Permissions](08-permissions.md) — Visibility and owner control
