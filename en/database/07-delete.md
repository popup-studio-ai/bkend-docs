# Delete Data

{% hint style="info" %}
Remove data from a table.
{% endhint %}

{% hint style="info" %}
**Before you start** — You need the following to proceed:
- [Create a project](../getting-started/02-quickstart.md) completed
- [Create a table](../console/07-table-management.md) completed
- Authentication setup — Public tables require no auth; tables with RLS require a JWT
{% endhint %}

{% hint style="info" %}
**API used in this document**

| Endpoint | Method | Auth | Description |
|----------|:------:|:----:|-------------|
| `/v1/data/:tableName/:id` | DELETE | Conditional | Delete data |
{% endhint %}

## Overview

Use the `DELETE /v1/data/:tableName/:id` endpoint to delete a specific record.

***

## Delete Data

### DELETE /v1/data/:tableName/:id

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/data/posts/507f1f77bcf86cd799439011 \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const postId = '507f1f77bcf86cd799439011';

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts/${postId}`, {
  method: 'DELETE',
  headers: {
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
});

const result = await response.json();
console.log(result.success); // true
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
  "success": true
}
```

{% hint style="danger" %}
**Warning** — Deleted data cannot be recovered. Always prompt the user for confirmation before deleting.
{% endhint %}

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

await bkendFetch('/v1/data/posts/{id}', {
  method: 'DELETE',
});
```

{% hint style="info" %}
For `bkendFetch` setup, see [Integrate bkend in Your App](../getting-started/03-app-integration.md).
{% endhint %}

***

## Permissions

Deleting data requires the `delete` permission on the corresponding table.

| Role | Condition |
|------|-----------|
| `admin` | Always allowed |
| `user` | `permissions.user.delete` is `true` |
| `guest` | `permissions.guest.delete` is `true` |
| `self` | Only data where `createdBy` matches the requester can be deleted |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `data/table-not-found` | 404 | Table does not exist |
| `data/not-found` | 404 | Data not found |
| `data/permission-denied` | 403 | No delete permission |
| `data/scope-insufficient` | 403 | API key scope does not include `tableName:delete` |

***

## Next Steps

- [Create Data](03-insert.md) — Add new data
- [List Data](05-list.md) — Verify the list after deletion
- [Data Model](02-data-model.md) — Understand permission settings
