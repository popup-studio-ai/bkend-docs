# User Profile & Avatar

{% hint style="info" %}
💡 View and update a User's profile information. You can also manage avatar images.
{% endhint %}

## Overview

Use the user profile API to manage profile information such as name, nickname, bio, social links, and avatar images.

***

## Get Profile

### GET /v1/users/:userId/profile

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId}/profile \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
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
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
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
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
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
💡 Passing `null` for a field removes that value.
{% endhint %}

***

## Avatar Management

### Generate Avatar Upload URL

Obtain a Presigned URL and upload directly.

#### POST /v1/users/:userId/avatar/upload-url

```bash
curl -X POST https://api-client.bkend.ai/v1/users/{userId}/avatar/upload-url \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
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
  "url": "https://storage.example.com/...?signature=...",
  "key": "{file_key}",
  "expiresAt": "2025-01-21T01:00:00.000Z"
}
```

### Save Avatar After Upload

After uploading the file to storage, register the file key.

#### PATCH /v1/users/:userId/avatar

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/avatar \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "s3Key": "{key}"
  }'
```

### Delete Avatar

#### DELETE /v1/users/:userId/avatar

```bash
curl -X DELETE https://api-client.bkend.ai/v1/users/{userId}/avatar \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
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
