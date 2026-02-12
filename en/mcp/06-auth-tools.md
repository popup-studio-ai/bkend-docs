# Auth Tools

{% hint style="info" %}
This page explains how to implement authentication (Auth) features from your AI tool. Auth uses REST API calls, not MCP tools.
{% endhint %}

## Overview

The bkend MCP server does not include dedicated auth tools. Instead, the AI tool uses `search_docs` to find auth documentation and automatically generates REST API calling code.

```mermaid
flowchart LR
    A[Request auth from AI] --> B[search_docs finds documentation]
    B --> C[Auth guide returned]
    C --> D[REST API code generated]
```

***

## Using from Your AI Tool

Ask your AI tool in natural language and it will generate the auth code.

```text
"Implement email signup and login"

"Add social login (Google, GitHub)"

"Create a token refresh flow"
```

***

## Built-in Documents

Auth-related built-in documents that `search_docs` can find:

| Document ID | Content |
|-------------|---------|
| `3_howto_implement_auth` | Auth implementation guide (signup, login, token management) |
| `6_code_examples_auth` | Auth code examples (email, social, magic link) |

***

## Key Auth REST API Endpoints

Main endpoints the AI tool uses when generating code:

### Email Auth

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/v1/auth/email/signup` | POST | Email signup |
| `/v1/auth/email/login` | POST | Email login |
| `/v1/auth/email/verify` | POST | Email verification |
| `/v1/auth/email/verify/resend` | POST | Resend verification email |

### Social Auth

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/v1/auth/social/{provider}/authorize` | GET | Start social login |
| `/v1/auth/social/{provider}/callback` | GET | Social login callback |

### Token Management

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/v1/auth/refresh` | POST | Refresh token |
| `/v1/auth/logout` | POST | Logout |

### Password Management

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/v1/auth/password/forgot` | POST | Request password reset |
| `/v1/auth/password/reset` | POST | Reset password |
| `/v1/auth/password/change` | POST | Change password |

### User Management

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/v1/users/me` | GET | Get my profile |
| `/v1/users/me` | PATCH | Update my profile |
| `/v1/users/me/avatar` | PUT | Change profile image |

***

## Code Generation Example

When you ask the AI tool to "create an email login feature," it generates code like this:

{% tabs %}
{% tab title="TypeScript" %}
```typescript
const response = await fetch(
  "https://api-client.bkend.ai/v1/auth/email/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Project-Id": PROJECT_ID,
      "X-Environment": "dev",
    },
    body: JSON.stringify({
      email: "user@example.com",
      password: "password123",
      method: "password",
    }),
  }
);

const { accessToken, refreshToken } = await response.json();
```
{% endtab %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/login \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {PROJECT_ID}" \
  -H "X-Environment: dev" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "method": "password"
  }'
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
All auth API calls require the `X-Project-Id` and `X-Environment` headers. After authentication, pass the issued JWT via the `Authorization: Bearer {accessToken}` header.
{% endhint %}

***

## Next Steps

- [Storage Tools](07-storage-tools.md) — File upload/download implementation
- [Data Tools](05-data-tools.md) — Data CRUD operations
- [Auth Overview](../authentication/01-overview.md) — Detailed auth guide
