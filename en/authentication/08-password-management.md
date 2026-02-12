# Password Reset & Change

{% hint style="info" %}
Reset a forgotten password or change your existing one.
{% endhint %}

## Overview

bkend provides two password management features.

| Feature | Auth Required | Purpose |
|---------|:------------:|---------|
| **Password Reset** | No | Reset via email when you forget your password |
| **Password Change** | Yes | Change your password while signed in |

***

## Password Reset

A 3-step flow for Users who have forgotten their password to set a new one via email.

```mermaid
sequenceDiagram
    participant User as User
    participant API as bkend API
    participant Email as Email

    User->>API: 1. POST /auth/password/reset/request
    API->>Email: Send reset email
    Email-->>User: Email received (with token)
    User->>API: 2. POST /auth/password/reset/confirm
    API-->>User: Password reset complete
```

### Step 1: Request Reset

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/password/reset/request \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "email": "user@example.com"
  }'
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Registered email address |

{% hint style="info" %}
For security, even if an unregistered email is entered, the same success response is returned. This prevents email existence from being exposed.
{% endhint %}

### Step 2: Confirm Password Reset

Submit the token from the email along with a new password.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/password/reset/confirm \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "email": "user@example.com",
    "token": "{reset_token}",
    "newPassword": "NewP@ssw0rd!"
  }'
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Email address |
| `token` | `string` | Yes | Reset token received via email |
| `newPassword` | `string` | Yes | New password (must comply with password policy) |

***

## Password Change

Change your current password to a new one while signed in.

### POST /v1/auth/password/change

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/password/change \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "currentPassword": "MyP@ssw0rd!",
    "newPassword": "NewP@ssw0rd!"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/auth/password/change', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
  body: JSON.stringify({
    currentPassword: 'MyP@ssw0rd!',
    newPassword: 'NewP@ssw0rd!',
  }),
});
```
{% endtab %}
{% endtabs %}

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `currentPassword` | `string` | Yes | Current password |
| `newPassword` | `string` | Yes | New password (must differ from current) |

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/invalid-email` | 400 | Invalid email format |
| `auth/invalid-token` | 401 | Invalid reset token |
| `auth/token-expired` | 401 | Reset token has expired |
| `auth/invalid-password-format` | 400 | Password policy violation |
| `auth/invalid-credentials` | 401 | Current password mismatch |
| `auth/same-password` | 400 | New password is the same as current |

***

## Next Steps

- [Email Verification](09-email-verification.md) -- Verify email ownership
- [Multi-Factor Authentication (MFA)](11-mfa.md) -- Additional security setup
- [Auth Provider Configuration](17-provider-config.md) -- Change password policy
