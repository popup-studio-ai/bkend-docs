# User Management

{% hint style="info" %}
View Users registered in your project and manage their roles, settings, and notifications.
{% endhint %}

## Overview

The user management API allows you to list users, view details, change roles, configure preferences, and manage notification settings for Users registered in your project.

***

## List Users

### GET /v1/users

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET "https://api-client.bkend.ai/v1/users?page=1&limit=20&sortBy=createdAt&sortDirection=desc" \
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

const response = await fetch(`https://api-client.bkend.ai/v1/users?${params}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});
```
{% endtab %}
{% endtabs %}

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `page` | `number` | - | Page number (default: 1) |
| `limit` | `number` | - | Items per page (1-100, default: 20) |
| `search` | `string` | - | Search by name/nickname/email |
| `searchType` | `string` | - | `name`, `nickname`, `email` |
| `sortBy` | `string` | - | `createdAt`, `updatedAt`, `name`, `email`, `role` |
| `sortDirection` | `string` | - | `asc` or `desc` (default: `desc`) |
| `includeAccounts` | `boolean` | - | Include linked account information |

### Response

```json
{
  "items": [
    {
      "id": "user-uuid",
      "role": "user",
      "name": "John Doe",
      "nickname": "johnd",
      "email": "user@example.com",
      "image": "https://...",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

{% hint style="info" %}
Response fields are filtered based on the requester's role. Admins can view all fields, while regular Users can only see public fields.
{% endhint %}

***

## Get User Details

### GET /v1/users/:userId

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## Create User

### POST /v1/users

Create a User directly from the server.

```bash
curl -X POST https://api-client.bkend.ai/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "role": "user"
  }'
```

***

## Update User

### PATCH /v1/users/:userId

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "name": "Updated Name"
  }'
```

***

## Delete User

### DELETE /v1/users/:userId

```bash
curl -X DELETE https://api-client.bkend.ai/v1/users/{userId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

{% hint style="danger" %}
**Warning** -- User deletion is processed as a soft delete. Deleted user data is retained for a certain period.
{% endhint %}

***

## Change Role

### PATCH /v1/users/:userId/role

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "role": "admin"
  }'
```

| Role | Description |
|------|-------------|
| `admin` | Administrator |
| `user` | Regular user |
| `guest` | Guest |

***

## Preferences

### GET /v1/users/:userId/preferences

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId}/preferences \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### PATCH /v1/users/:userId/preferences

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "locale": "ko",
    "timezone": "Asia/Seoul",
    "theme": "dark"
  }'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | `string` \| `null` | Language setting (e.g., `ko`, `en`, `ja`) |
| `timezone` | `string` \| `null` | Timezone (IANA format, e.g., `Asia/Seoul`) |
| `theme` | `string` \| `null` | Theme (`light`, `dark`, `system`) |

***

## Notification Settings

### GET /v1/users/:userId/notifications

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId}/notifications \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### PATCH /v1/users/:userId/notifications

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "marketing": false,
    "push": true,
    "email": true,
    "sms": false,
    "nightTime": false
  }'
```

| Parameter | Type | Default | Description |
|-----------|------|:-------:|-------------|
| `service` | `boolean` | `true` | Service notifications |
| `marketing` | `boolean` | `false` | Marketing notifications |
| `push` | `boolean` | `true` | Push notifications |
| `email` | `boolean` | `true` | Email notifications |
| `sms` | `boolean` | `false` | SMS notifications |
| `nightTime` | `boolean` | `false` | Night-time notifications (22:00-08:00) |
| `securityAlerts` | `boolean` | `true` | Security alerts |

***

## Public Profile Settings

### PATCH /v1/users/:userId/public-settings

Configure the visibility of your profile.

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/public-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "slug": "johnd",
    "isPublic": true
  }'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | `string` \| `null` | Public profile URL slug |
| `isPublic` | `boolean` | Whether profile is public (default: `false`) |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `user/not-found` | 404 | User not found |
| `user/unauthorized` | 401 | Authentication required |
| `user/forbidden` | 403 | Permission denied |
| `user/invalid-role` | 400 | Invalid role |

***

## Next Steps

- [User Profile](14-user-profile.md) -- Profile and avatar management
- [Invitation System](13-invitation.md) -- Invite new users
- [RLS Policies](../security/05-rls-policies.md) -- Role-based data access
