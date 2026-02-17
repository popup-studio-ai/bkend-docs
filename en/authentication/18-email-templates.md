# Email Template Customization

{% hint style="info" %}
Customize the design and content of authentication emails such as sign-up verification and password reset.
{% endhint %}

## Overview

bkend lets you customize email templates per project for emails sent during the authentication process. Set the sender email, logo, brand color, and email body freely.

***

## Get Email Template Settings

### GET /v1/auth/email-templates/config

Retrieve the global email settings (sender, logo, brand color).

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/email-templates/config \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
{
  "senderEmail": "noreply@myapp.com",
  "senderName": "MyApp",
  "logoUrl": "https://myapp.com/logo.png",
  "brandColor": "#4F46E5",
  "overrideDefaults": false
}
```

***

## Update Email Template Settings

### PUT /v1/auth/email-templates/config

```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/email-templates/config \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "senderEmail": "hello@myapp.com",
    "senderName": "MyApp Team",
    "logoUrl": "https://myapp.com/logo.png",
    "brandColor": "#2563EB",
    "overrideDefaults": true
  }'
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `senderEmail` | `string` | Sender email address |
| `senderName` | `string` | Sender name |
| `logoUrl` | `string` | Email header logo URL |
| `brandColor` | `string` | Brand color (HEX) |
| `overrideDefaults` | `boolean` | Use custom template instead of default |

***

## List Templates

### GET /v1/auth/email-templates

Retrieve the list of available email templates.

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/email-templates \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
[
  {
    "id": "signup_confirmation",
    "name": "Sign-up Verification",
    "category": "signup_confirmation",
    "subject": "[MyApp] Please verify your email",
    "customized": false,
    "locale": "ko"
  },
  {
    "id": "password_reset",
    "name": "Password Reset",
    "category": "password_reset",
    "subject": "[MyApp] Reset your password",
    "customized": true,
    "locale": "ko"
  }
]
```

### Template Categories

| Category | Description |
|----------|-------------|
| `signup_confirmation` | Sign-up email verification |
| `password_reset` | Password reset |
| `magic_link` | Magic link login |
| `email_verification` | Email verification |
| `invitation` | Invitation email |

***

## Get Individual Template

### GET /v1/auth/email-templates/:templateId

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/email-templates/password_reset \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
{
  "id": "password_reset",
  "name": "Password Reset",
  "category": "password_reset",
  "subject": "[MyApp] Reset your password",
  "body": "<html>...<a href=\"{{resetLink}}\">Reset Password</a>...</html>",
  "customized": true,
  "locale": "ko"
}
```

***

## Update Template

### PUT /v1/auth/email-templates/:templateId

```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/email-templates/password_reset \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "subject": "[MyApp] Please reset your password",
    "body": "<html><body><h1>Password Reset</h1><p>Click the button below to reset your password.</p><a href=\"{{resetLink}}\">Reset Password</a></body></html>"
  }'
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `subject` | `string` | Yes | Email subject |
| `body` | `string` | Yes | Email body (HTML) |

{% hint style="warning" %}
If template variables (such as `{{userName}}`) are entered incorrectly, they will render as empty values when actually sent. Always verify with the preview feature.
{% endhint %}

### Template Variables

Variables available in the email body.

| Variable | Description |
|----------|-------------|
| `{{userName}}` | User name |
| `{{userEmail}}` | User email |
| `{{resetLink}}` | Password reset link |
| `{{verifyLink}}` | Email verification link |
| `{{magicLink}}` | Magic link |
| `{{inviterName}}` | Inviter name |
| `{{resourceName}}` | Resource (organization/project) name |

***

## Preview Template

### GET /v1/auth/email-templates/preview/:templateId

Preview a modified template.

```bash
curl -X GET "https://api-client.bkend.ai/v1/auth/email-templates/preview/password_reset?locale=ko" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response:**

```json
{
  "subject": "[MyApp] Please reset your password",
  "htmlBody": "<html>...(rendered HTML)...</html>",
  "textBody": "Please reset your password..."
}
```

***

## Configure in the Console

You can also manage email templates in the console.

<!-- IMG: Email template list -->
![Email Templates](../.gitbook/assets/2026-02/console-email-templates.png)

<!-- IMG: Email template editor -->
![Email Template Editor](../.gitbook/assets/2026-02/console-email-template-edit.png)

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/unauthorized` | 401 | Authentication required |
| `auth/template-not-found` | 404 | Template not found |

***

## Next Steps

- [Auth Provider Configuration](17-provider-config.md) -- Authentication method settings
- [Email Verification](09-email-verification.md) -- Email verification flow
- [Password Management](08-password-management.md) -- Password reset
