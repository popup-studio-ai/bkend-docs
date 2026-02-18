# Email Verification

{% hint style="info" %}
💡 Verify a User's email ownership through email verification.
{% endhint %}

## Overview

Email verification is the process of confirming that the email address entered by a User actually belongs to them. bkend supports two types: sign-up email verification and contact email verification.

***

## Verification Types

| Type | Endpoint | Purpose |
|------|----------|---------|
| **Sign-up Email Verification** | `/auth/signup/email/*` | Verify email during sign-up |
| **Contact Email Verification** | `/auth/email/verify/*` | Verify email when changing profile email |

***

## Sign-up Email Verification

### Resend Verification Email

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/signup/email/resend \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "email": "user@example.com",
    "callbackUrl": "https://myapp.com/verify"
  }'
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Email address to verify |
| `callbackUrl` | `string` | - | Redirect URL after verification |

### Confirm Verification

When the user clicks the verification link in the email, the following endpoint is called.

**GET /v1/auth/signup/email/confirm**

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|:--------:|-------------|
| `token` | Query | `string` | Yes | Verification token |
| `email` | Query | `string` | Yes | Email address |
| `callbackUrl` | Query | `string` | - | Redirect URL |

If `callbackUrl` is provided, it redirects with the verification result.

```text
https://myapp.com/verify?verified=true&email=user@example.com
```

If `callbackUrl` is not provided, a JSON response is returned.

```json
{
  "success": true,
  "data": {
    "verified": true,
    "email": "user@example.com"
  }
}
```

***

## Contact Email Verification

### Send Verification Email

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/verify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "email": "newemail@example.com",
    "callbackUrl": "https://myapp.com/verify"
  }'
```

### Confirm Verification

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/verify/confirm \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "email": "newemail@example.com",
    "token": "{verification_token}"
  }'
```

**Response:**

```json
{
  "message": "Email verified successfully",
  "verified": true
}
```

### Resend Verification Email

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/verify/resend \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "email": "newemail@example.com"
  }'
```

***

## Using in Your App

The `bkendFetch` helper automatically includes the required headers.

```javascript
import { bkendFetch } from './bkend.js';

// Send verification email
await bkendFetch('/v1/auth/email/verify/send', {
  method: 'POST',
  body: { email: 'user@example.com' },
});

// Confirm verification code
await bkendFetch('/v1/auth/email/verify/confirm', {
  method: 'POST',
  body: {
    email: 'user@example.com',
    token: '{verification_token}',
  },
});
```

{% hint style="info" %}
💡 See [Integrating bkend in Your App](../getting-started/03-app-integration.md) for `bkendFetch` setup.
{% endhint %}

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/invalid-email` | 400 | Invalid email format |
| `auth/invalid-token` | 401 | Invalid verification token |
| `auth/token-expired` | 401 | Verification token has expired |
| `auth/already-verified` | 400 | Email is already verified |

***

## Next Steps

- [Email Sign-up](02-email-signup.md) -- Create an account with email
- [Email Templates](18-email-templates.md) -- Customize verification emails
- [User Profile](14-user-profile.md) -- Change profile email
