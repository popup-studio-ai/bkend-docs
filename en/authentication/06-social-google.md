# Google OAuth

{% hint style="info" %}
Implement social login with a Google account.
{% endhint %}

## Overview

Google OAuth uses the OAuth 2.0 + OpenID Connect protocol. Users can handle both sign-up and sign-in at once using their Google account.

***

## Prerequisites

### Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services** > **Credentials**.
3. Select **Create credentials** > **OAuth client ID**.
4. Choose **Web application** as the application type.
5. Add your callback URL under **Authorized redirect URIs**.
6. Copy the `Client ID` and `Client Secret`.

{% hint style="warning" %}
Never expose the `Client Secret` in client-side code (frontend). It must only be used on the server side.
{% endhint %}

### Register with bkend

Register the `Client ID` and `Client Secret` you obtained with bkend. You can configure this in [Auth Provider Configuration](17-provider-config.md).

***

## Implementing Google Login

### Step 1: Redirect to Google Auth URL

Construct the Google OAuth authentication URL in your app and redirect the User directly.

```javascript
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const params = new URLSearchParams({
  client_id: '{google_client_id}',
  redirect_uri: 'https://myapp.com/auth/callback',
  response_type: 'code',
  scope: 'openid email profile',
  state: crypto.randomUUID(),
});

window.location.href = `${GOOGLE_AUTH_URL}?${params}`;
```

{% hint style="info" %}
`client_id` is the OAuth client ID obtained from Google Cloud Console. `state` is a random value for CSRF protection -- always verify it in the callback.
{% endhint %}

### Step 2: Obtain Tokens in the Callback

After Google authentication is complete, the user is redirected to the callback URL.

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/google/callback \
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
// Run on the callback page
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

const response = await fetch('https://api-client.bkend.ai/v1/auth/google/callback', {
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

if (is_new_user) {
  // New user -> onboarding page
} else {
  // Existing user -> main page
}
```
{% endtab %}
{% endtabs %}

***

## User Information from Google

When signing up via Google OAuth, the following information is automatically saved to the User profile.

| Field | Google Scope | Description |
|-------|-------------|-------------|
| `email` | `email` | Email address |
| `name` | `profile` | Name |
| `image` | `profile` | Profile photo URL |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/oauth-not-configured` | 400 | Google OAuth configuration is incomplete |
| `auth/invalid-oauth-code` | 401 | Invalid authorization code |
| `auth/oauth-callback-failed` | 500 | Error during callback processing |

***

## Next Steps

- [GitHub OAuth](07-social-github.md) -- GitHub login setup
- [Account Linking](12-account-linking.md) -- Link Google to an existing account
- [Auth Provider Configuration](17-provider-config.md) -- Change OAuth settings

## Reference Standards

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OpenID Connect](https://openid.net/connect/)
