# File Deletion

{% hint style="info" %}
Delete registered files.
{% endhint %}

## Overview

Use the `DELETE /v1/files/:fileId` endpoint to delete file metadata.

***

## Delete a File

### DELETE /v1/files/:fileId

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/files/{fileId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch(`https://api-client.bkend.ai/v1/files/${fileId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});

if (response.ok) {
  console.log('File deleted');
}
```
{% endtab %}
{% endtabs %}

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `fileId` | `string` | ✅ | File ID |

### Response (200 OK)

```json
{
  "success": true
}
```

{% hint style="danger" %}
**Warning** — Deleted files cannot be recovered. Prompt the user for confirmation before deleting.
{% endhint %}

***

## Permissions

Only the file owner or an admin can delete files.

| User | Can Delete |
|------|:----------:|
| File owner | ✅ |
| `admin` | ✅ |
| Non-owner | ❌ |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `file/not-found` | 404 | File not found |
| `file/access-denied` | 403 | No delete permission |
| `common/authentication-required` | 401 | Authentication required |

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

// Delete file
async function deleteFile(fileId) {
  const result = await bkendFetch(`/v1/files/${fileId}`, {
    method: 'DELETE',
  });

  return result; // { success: true }
}

// Delete with confirmation
async function deleteFileWithConfirm(fileId, filename) {
  const confirmed = confirm(`Delete "${filename}"? Deleted files cannot be recovered.`);

  if (!confirmed) {
    return { cancelled: true };
  }

  try {
    await deleteFile(fileId);
    console.log('File deleted');
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error.message);
    return { success: false, error };
  }
}

// Usage example
const fileId = 'file-uuid-1234';
const result = await deleteFileWithConfirm(fileId, 'profile.jpg');

if (result.success) {
  // Remove the file item from the UI
  document.querySelector(`#file-${fileId}`).remove();
}
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrating bkend with Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Next Steps

- [File List](05-file-list.md) — Verify list after deletion
- [File Metadata](04-file-metadata.md) — Manage file information
- [Storage Overview](01-overview.md) — Overall storage architecture
