# Email Template Customization

{% hint style="info" %}
💡 Customize the design and content of authentication emails such as sign-up verification and password reset.
{% endhint %}

## Overview

bkend lets you customize email templates per project for emails sent during the authentication process. Set the sender email, logo, brand color, and email body freely.

{% hint style="warning" %}
⚠️ Email template configuration is a management operation. Use the **console** or **MCP tools** to manage templates. These APIs are not available from client apps.
{% endhint %}

***

## Global Email Settings

Configure sender information, logo, and brand color that apply to all email templates.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Show me the current email template settings."
{% endhint %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Update the email sender to 'hello@myapp.com' with sender name 'MyApp Team'. Set the brand color to #2563EB and enable custom templates."
{% endhint %}

{% endtab %}
{% tab title="Console" %}

1. Go to your project in the console
2. Navigate to **Authentication** > **Email Templates**
3. In the **Settings** tab, configure sender and branding
4. Click **Save**

<!-- 📸 IMG: Email template settings -->
![Email Template Settings](../.gitbook/assets/2026-02/console-email-templates.png)

{% endtab %}
{% endtabs %}

### Settings Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `senderEmail` | `string` | Sender email address |
| `senderName` | `string` | Sender name |
| `logoUrl` | `string` | Email header logo URL |
| `brandColor` | `string` | Brand color (HEX) |
| `overrideDefaults` | `boolean` | Use custom template instead of default |

***

## Template Categories

| Category | Description |
|----------|-------------|
| `signup_confirmation` | Sign-up email verification |
| `password_reset` | Password reset |
| `magic_link` | Magic link login |
| `email_verification` | Email verification |
| `invitation` | Invitation email |

***

## Edit a Template

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Show me the list of email templates."
{% endhint %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Update the password reset email template. Change the subject to '[MyApp] Please reset your password' and update the body to include our brand header."
{% endhint %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Preview the password reset email template in Korean."
{% endhint %}

{% endtab %}
{% tab title="Console" %}

1. Navigate to **Authentication** > **Email Templates**
2. Select the template to edit (e.g., **Password Reset**)
3. Modify the **Subject** and **Body** (HTML)
4. Use the **Preview** button to verify
5. Click **Save**

<!-- 📸 IMG: Email template editor -->
![Email Template Editor](../.gitbook/assets/2026-02/console-email-template-edit.png)

{% endtab %}
{% endtabs %}

### Template Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `subject` | `string` | Yes | Email subject |
| `body` | `string` | Yes | Email body (HTML) |

{% hint style="warning" %}
⚠️ If template variables (such as `{{userName}}`) are entered incorrectly, they will render as empty values when actually sent. Always verify with the preview feature.
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
