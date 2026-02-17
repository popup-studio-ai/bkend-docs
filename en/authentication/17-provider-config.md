# Auth Provider Configuration

{% hint style="info" %}
Configure email authentication policies and OAuth providers (Google, GitHub) per project.
{% endhint %}

## Overview

Auth provider configuration manages the authentication methods for your project. You can set password policies, enable/disable magic links, and configure Client ID/Secret for each OAuth provider.

***

## Get All Provider Settings

### GET /v1/auth/providers

Retrieve all authentication provider settings at once.

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

***

## Email Authentication Settings

### GET /v1/auth/providers/email

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers/email \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
{
  "provider": "email",
  "passwordPolicy": {
    "minLength": 8,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true
  },
  "magicLinkEnabled": true,
  "magicLinkExpirationMinutes": 15
}
```

### PUT /v1/auth/providers/email

Update email authentication settings.

```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/providers/email \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "passwordPolicy": {
      "minLength": 10,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true
    },
    "magicLinkEnabled": true,
    "magicLinkExpirationMinutes": 30
  }'
```

### Password Policy Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `minLength` | `number` | Minimum password length |
| `requireUppercase` | `boolean` | Require uppercase letters |
| `requireLowercase` | `boolean` | Require lowercase letters |
| `requireNumbers` | `boolean` | Require numbers |
| `requireSpecialChars` | `boolean` | Require special characters |
| `expirationDays` | `number` | Password expiration period (days, optional) |

### Magic Link Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `magicLinkEnabled` | `boolean` | Whether magic link is enabled |
| `magicLinkExpirationMinutes` | `number` | Link expiration time (minutes) |

***

## OAuth Provider Settings

### List OAuth Settings

#### GET /v1/auth/providers/oauth

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers/oauth \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### Get Individual OAuth Provider

#### GET /v1/auth/providers/oauth/:provider

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers/oauth/google \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
{
  "provider": "google",
  "clientId": "123456789.apps.googleusercontent.com",
  "redirectUri": "https://api-client.bkend.ai/v1/auth/google/callback",
  "scopes": ["openid", "email", "profile"],
  "enabled": true
}
```

{% hint style="info" %}
For security, `clientSecret` is not included in the response.
{% endhint %}

### Update OAuth Provider Settings

#### PUT /v1/auth/providers/oauth/:provider

{% tabs %}
{% tab title="Google" %}
```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/providers/oauth/google \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "clientId": "{google_client_id}",
    "clientSecret": "{google_client_secret}",
    "redirectUri": "https://api-client.bkend.ai/v1/auth/google/callback",
    "scopes": ["openid", "email", "profile"],
    "enabled": true
  }'
```
{% endtab %}
{% tab title="GitHub" %}
```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/providers/oauth/github \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "clientId": "{github_client_id}",
    "clientSecret": "{github_client_secret}",
    "redirectUri": "https://api-client.bkend.ai/v1/auth/github/callback",
    "scopes": ["user:email"],
    "enabled": true
  }'
```
{% endtab %}
{% endtabs %}

### OAuth Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `clientId` | `string` | Yes | OAuth Client ID |
| `clientSecret` | `string` | Yes | OAuth Client Secret (stored encrypted) |
| `redirectUri` | `string` | Yes | Callback URL |
| `scopes` | `string[]` | Yes | Requested permission scopes |
| `enabled` | `boolean` | Yes | Whether enabled |

### Delete OAuth Provider

#### DELETE /v1/auth/providers/oauth/:provider

```bash
curl -X DELETE https://api-client.bkend.ai/v1/auth/providers/oauth/github \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

***

## Configure in the Console

You can also configure auth providers in the console. Go to **Authentication** settings in your project and enable each provider with the appropriate keys.

<!-- IMG: Auth provider settings screen -->
![Auth Provider Configuration](../.gitbook/assets/2026-02/console-auth-providers.png)

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/unauthorized` | 401 | Authentication required |
| `auth/unsupported-provider` | 400 | Unsupported provider |
| `auth/oauth-not-configured` | 400 | OAuth configuration is incomplete |

***

## Next Steps

- [Google OAuth](06-social-google.md) -- Implement Google login
- [GitHub OAuth](07-social-github.md) -- Implement GitHub login
- [Email Templates](18-email-templates.md) -- Customize authentication emails
