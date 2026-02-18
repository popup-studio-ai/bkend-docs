# Session & Token Management

{% hint style="info" %}
💡 View active sessions, refresh tokens, and terminate sessions remotely.
{% endhint %}

## Overview

bkend provides session management alongside JWT-based authentication. Users can view their list of active sessions and remotely terminate sessions on other devices.

***

## Get Current User

### GET /v1/auth/me

Retrieve the currently signed-in User's information.

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/me \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "role": "user",
  "name": "John Doe",
  "email": "user@example.com",
  "emailVerified": "2025-01-15T09:30:00.000Z",
  "image": "https://example.com/avatar.jpg",
  "onboardingStatus": "completed",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

***

## Token Refresh

### POST /v1/auth/refresh

Obtain a new token pair using the Refresh Token when the Access Token has expired.

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "refreshToken": "{refresh_token}"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
  },
  body: JSON.stringify({
    refreshToken: localStorage.getItem('refreshToken'),
  }),
});

const { accessToken, refreshToken } = await response.json();
// Save new tokens
```
{% endtab %}
{% endtabs %}

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `refreshToken` | `string` | Yes | JWT Refresh Token |

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

{% hint style="warning" %}
⚠️ A new Refresh Token is issued during token refresh. The previous Refresh Token is immediately invalidated, so always save the new tokens.
{% endhint %}

***

## List Sessions

### GET /v1/auth/sessions

Retrieve all active sessions for the current User.

```bash
curl -X GET "https://api-client.bkend.ai/v1/auth/sessions?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `page` | Query | `number` | - | Page number (default: 1) |
| `limit` | Query | `number` | - | Items per page (default: 10) |

**Response:**

```json
{
  "items": [
    {
      "id": "session-uuid-1",
      "userId": "user-uuid",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
      "ipAddress": "203.0.113.1",
      "deviceInfo": "Chrome on macOS",
      "lastActivityAt": "2025-01-20T14:30:00.000Z",
      "createdAt": "2025-01-20T09:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3
  }
}
```

***

## Delete a Session

### DELETE /v1/auth/sessions/:sessionId

Terminate a specific session. Use this to remotely terminate sessions on other devices.

```bash
curl -X DELETE https://api-client.bkend.ai/v1/auth/sessions/{sessionId} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

{% hint style="warning" %}
⚠️ Deleting your current active session will immediately sign you out.
{% endhint %}

***

## Sign Out

### POST /v1/auth/signout

Terminate the current session and invalidate the tokens.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/signout \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/unauthorized` | 401 | Authentication required |
| `auth/invalid-token` | 401 | Invalid token |
| `auth/invalid-refresh-token` | 401 | Refresh Token does not match or session not found |
| `auth/session-expired` | 401 | Session has expired (7 days) |
| `auth/session-not-found` | 404 | Session not found |
| `auth/user-not-found` | 404 | User has been deleted |

***

## Next Steps

- [Multi-Factor Authentication (MFA)](11-mfa.md) -- Enhance security
- [Email Sign-in](03-email-signin.md) -- Sign-in methods
- [Security Best Practices](../security/07-best-practices.md) -- Token management recommendations
