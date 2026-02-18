# Auth Provider Configuration

{% hint style="info" %}
💡 Configure email authentication policies and OAuth providers (Google, GitHub) per project.
{% endhint %}

## Overview

Auth provider configuration manages the authentication methods for your project. You can set password policies, enable/disable magic links, and configure Client ID/Secret for each OAuth provider.

{% hint style="warning" %}
⚠️ Provider configuration is a management operation. Use the **console** or **MCP tools** to manage settings. These APIs are not available from client apps.
{% endhint %}

***

## Email Authentication Settings

Manage password policy and magic link settings for email-based authentication.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Show me the current email authentication settings for my project."
{% endhint %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Update the password policy to require minimum 10 characters with uppercase, lowercase, numbers, and special characters. Also enable magic link with 30-minute expiration."
{% endhint %}

{% endtab %}
{% tab title="Console" %}

1. Go to your project in the console
2. Navigate to **Authentication** > **Providers**
3. Select **Email** provider
4. Configure password policy and magic link settings
5. Click **Save**

<!-- 📸 IMG: Email provider settings screen -->
![Email Provider Settings](../.gitbook/assets/2026-02/console-auth-providers.png)

{% endtab %}
{% endtabs %}

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

Configure OAuth providers (Google, GitHub) with Client ID and Secret for social login.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Show me the current OAuth provider settings."
{% endhint %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Set up Google OAuth with client ID 'xxx' and client secret 'yyy'. Enable it with openid, email, and profile scopes."
{% endhint %}

{% hint style="success" %}
✅ **Ask your AI agent:**
"Remove the GitHub OAuth configuration."
{% endhint %}

{% endtab %}
{% tab title="Console" %}

### Add or Update an OAuth Provider

1. Go to your project in the console
2. Navigate to **Authentication** > **Providers**
3. Select the OAuth provider (e.g., **Google**, **GitHub**)
4. Enter the **Client ID** and **Client Secret** from the provider's developer console
5. Verify the **Redirect URI** is correct
6. Toggle **Enabled** on
7. Click **Save**

### Delete an OAuth Provider

1. Navigate to **Authentication** > **Providers**
2. Select the OAuth provider to remove
3. Click **Delete** and confirm

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

{% hint style="info" %}
💡 For security, `clientSecret` is never returned in responses. You can only set or update it.
{% endhint %}

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
