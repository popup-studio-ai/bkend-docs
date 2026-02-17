# Account Linking

{% hint style="info" %}
Link multiple social logins to your existing account to sign in with various methods.
{% endhint %}

## Overview

Account Linking lets you connect multiple social logins (Google, GitHub) to a single User account. You can add Google login to an email-based account or additionally link GitHub to a Google account.

***

## Link a Social Account

### POST /v1/auth/accounts

Link a new social login to an existing account.

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/accounts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "provider": "google",
    "code": "{authorization_code}"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
// 1. Redirect to Google auth URL
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const params = new URLSearchParams({
  client_id: '{google_client_id}',
  redirect_uri: 'https://myapp.com/link-callback',
  response_type: 'code',
  scope: 'openid email profile',
  state: crypto.randomUUID(),
});
window.location.href = `${GOOGLE_AUTH_URL}?${params}`;

// 2. Extract code from callback after Google auth
// 3. Link account
const response = await fetch('https://api-client.bkend.ai/v1/auth/accounts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    provider: 'google',
    code: urlParams.get('code'),
  }),
});
```
{% endtab %}
{% endtabs %}

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `provider` | `string` | Yes | `"google"` or `"github"` |
| `code` | `string` | Conditional | OAuth authorization code |
| `idToken` | `string` | Conditional | ID token |
| `accessToken` | `string` | - | OAuth access token |

***

## List Linked Accounts

### GET /v1/auth/accounts

```bash
curl -X GET "https://api-client.bkend.ai/v1/auth/accounts?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
{
  "items": [
    {
      "id": "account-uuid-1",
      "userId": "user-uuid",
      "provider": "email",
      "providerAccountId": "user@example.com",
      "connectedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "account-uuid-2",
      "userId": "user-uuid",
      "provider": "google",
      "providerAccountId": "117012345678901234567",
      "connectedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2
  }
}
```

***

## Unlink a Social Account

### DELETE /v1/auth/accounts/:provider

```bash
curl -X DELETE https://api-client.bkend.ai/v1/auth/accounts/google \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

{% hint style="warning" %}
You cannot unlink the last remaining sign-in method (email or social). At least one authentication method must remain.
{% endhint %}

***

## Check Account Existence

### POST /v1/auth/accounts/check

Check whether a specific email or social account is already registered. This can be used without authentication.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/accounts/check \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "type": "email",
    "provider": "email",
    "providerAccountId": "user@example.com"
  }'
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `type` | `string` | Yes | `"email"` or `"oauth"` |
| `provider` | `string` | Yes | Provider name |
| `providerAccountId` | `string` | Yes | Provider-specific unique ID or email |

**Response:**

```json
{
  "exists": true,
  "accountIds": ["account-uuid-1"]
}
```

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/account-already-linked` | 409 | Social account already linked |
| `auth/cannot-unlink-last-account` | 400 | Cannot unlink the last auth method |
| `auth/unsupported-provider` | 400 | Unsupported provider |
| `auth/unauthorized` | 401 | Authentication required |

***

## Next Steps

- [Social Login Overview](05-social-overview.md) -- OAuth authentication flow
- [User Profile](14-user-profile.md) -- Profile management
- [Google OAuth](06-social-google.md) -- Google account setup
