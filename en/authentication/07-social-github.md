# GitHub OAuth

{% hint style="info" %}
Implement social login with a GitHub account.
{% endhint %}

## Overview

GitHub OAuth uses the OAuth 2.0 protocol. It allows you to easily implement GitHub account-based authentication for developer-oriented services.

***

## Prerequisites

### Creating a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **OAuth Apps** > **New OAuth App**.
3. Enter the following information.

| Field | Description |
|-------|-------------|
| **Application name** | Your app name |
| **Homepage URL** | Your app homepage URL |
| **Authorization callback URL** | Callback URL |

4. Click **Register application**.
5. Copy the `Client ID` and click **Generate a new client secret** to create the `Client Secret`.

{% hint style="warning" %}
The `Client Secret` is only visible immediately after creation. Store it in a secure location.
{% endhint %}

### Register with bkend

Register the `Client ID` and `Client Secret` you obtained with bkend. You can configure this in [Auth Provider Configuration](17-provider-config.md).

***

## Implementing GitHub Login

### Step 1: Redirect to GitHub Auth URL

Construct the GitHub OAuth authentication URL in your app and redirect the User directly.

```javascript
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const params = new URLSearchParams({
  client_id: '{github_client_id}',
  redirect_uri: 'https://myapp.com/auth/callback',
  scope: 'user:email',
  state: crypto.randomUUID(),
});

window.location.href = `${GITHUB_AUTH_URL}?${params}`;
```

{% hint style="info" %}
`client_id` is the OAuth App Client ID obtained from GitHub Developer Settings. `state` is a random value for CSRF protection -- always verify it in the callback.
{% endhint %}

### Step 2: Obtain Tokens in the Callback

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/github/callback \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "code": "{authorization_code}",
    "redirectUri": "https://myapp.com/auth/callback",
    "state": "{state_value}"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

const response = await fetch('https://api-client.bkend.ai/v1/auth/github/callback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
  },
  body: JSON.stringify({
    code,
    redirectUri: window.location.origin + '/auth/callback',
    state,
  }),
});

const { accessToken, refreshToken, is_new_user } = await response.json();
```
{% endtab %}
{% endtabs %}

### Success Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "is_new_user": false
}
```

***

## User Information from GitHub

| Field | GitHub Scope | Description |
|-------|-------------|-------------|
| `email` | `user:email` | Email address |
| `name` | `user` | Name (display name) |
| `image` | `user` | Profile photo URL (avatar_url) |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/oauth-not-configured` | 400 | GitHub OAuth configuration is incomplete |
| `auth/invalid-oauth-code` | 401 | Invalid authorization code |
| `auth/oauth-callback-failed` | 500 | Error during callback processing |

***

## Next Steps

- [Google OAuth](06-social-google.md) -- Google login setup
- [Account Linking](12-account-linking.md) -- Link GitHub to an existing account
- [Auth Provider Configuration](17-provider-config.md) -- Change OAuth settings

## Reference Standards

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
