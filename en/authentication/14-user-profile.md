# User Profile & Avatar

{% hint style="info" %}
View and update a User's profile information. You can also manage avatar images.
{% endhint %}

## Overview

Use the user profile API to manage profile information such as name, nickname, bio, social links, and avatar images.

***

## Get Profile

### GET /v1/users/:userId/profile

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId}/profile \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

**Response:**

```json
{
  "name": "John Doe",
  "nickname": "johnd",
  "email": "user@example.com",
  "mobile": "+821012345678",
  "gender": "male",
  "bio": "Full-stack developer.",
  "socialLinks": {
    "github": "https://github.com/johnd",
    "twitter": "https://twitter.com/johnd"
  }
}
```

***

## Update Profile

### PATCH /v1/users/:userId/profile

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "nickname": "newjohnd",
    "bio": "Backend developer.",
    "socialLinks": {
      "github": "https://github.com/newjohnd"
    }
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch(`https://api-client.bkend.ai/v1/users/${userId}/profile`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
  body: JSON.stringify({
    nickname: 'newjohnd',
    bio: 'Backend developer.',
  }),
});
```
{% endtab %}
{% endtabs %}

### Request Parameters

All fields are optional. Only send the fields you want to change.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Name (1-100 characters) |
| `nickname` | `string` \| `null` | Nickname (1-50 characters) |
| `mobile` | `string` \| `null` | Phone number (E.164 format, max 20 characters) |
| `gender` | `string` \| `null` | `none`, `male`, `female`, `etc` |
| `bio` | `string` \| `null` | Short bio (max 500 characters) |
| `socialLinks` | `object` \| `null` | Social links |

### socialLinks Fields

| Field | Type | Description |
|-------|------|-------------|
| `github` | `string` \| `null` | GitHub profile URL |
| `twitter` | `string` \| `null` | Twitter profile URL |
| `linkedin` | `string` \| `null` | LinkedIn profile URL |

{% hint style="info" %}
Passing `null` for a field removes that value.
{% endhint %}

***

## Avatar Management

### Generate Avatar Upload URL

Obtain an S3 Presigned URL and upload directly.

#### POST /v1/users/:userId/avatar/upload-url

```bash
curl -X POST https://api-client.bkend.ai/v1/users/{userId}/avatar/upload-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "filename": "avatar.jpg",
    "contentType": "image/jpeg"
  }'
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `filename` | `string` | Yes | Filename |
| `contentType` | `string` | Yes | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |

**Response:**

```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "key": "avatars/user-uuid/avatar.jpg",
  "expiresAt": "2025-01-21T01:00:00.000Z"
}
```

### Save Avatar After Upload

After uploading the file to S3, register the S3 key.

#### PATCH /v1/users/:userId/avatar

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/avatar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "s3Key": "avatars/user-uuid/avatar.jpg"
  }'
```

### Delete Avatar

#### DELETE /v1/users/:userId/avatar

```bash
curl -X DELETE https://api-client.bkend.ai/v1/users/{userId}/avatar \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `user/not-found` | 404 | User not found |
| `user/invalid-name` | 400 | Invalid name |
| `user/invalid-nickname` | 400 | Invalid nickname |
| `user/unauthorized` | 401 | Authentication required |
| `user/forbidden` | 403 | Cannot edit another user's profile |

***

## Next Steps

- [User Management](15-user-management.md) -- User list and role management
- [Public Profile](15-user-management.md#public-profile-settings) -- Profile visibility settings
- [Session Management](10-session-management.md) -- Get current user info
