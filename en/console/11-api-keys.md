# API Key Management

{% hint style="info" %}
This guide explains how to issue and manage API Keys (access tokens) for calling the REST API.
{% endhint %}

## Overview

To call the bkend REST API from your app, you need an API Key. API Keys are managed independently per environment, and you can configure permission scopes.

***

## Issuing an API Key

1. Click **Settings** in the project-level sidebar.
2. In the **Access Tokens** section, click the **Create New Token** button.
3. Enter the following information.

| Field | Description |
|-------|-------------|
| **Token Name** | A name for identification (e.g., `web-app-key`) |
| **Token Type** | BEARER_TOKEN |
| **Permission Scope** | Select the resources the token can access |

4. Click **Create**.

{% hint style="danger" %}
**Danger** — The token is displayed only once at creation time. If lost, you must regenerate it. Copy and store it securely.
{% endhint %}

***

## Using an API Key

Include the issued API Key in the `Authorization` header of your REST API requests.

```bash
curl https://api-client.bkend.ai/v1/data/posts \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## Viewing the API Key List

Check all tokens for the current environment in **Settings** → **Access Tokens** section.

| Displayed Info | Description |
|----------------|-------------|
| **Token Name** | Identifying name of the token |
| **Created At** | Date and time the token was issued |
| **Last Used** | Date and time of the last API call |

***

## Deleting an API Key

1. Find the token you want to delete in the token list.
2. Click the **Delete** button.
3. After confirmation, the token is immediately invalidated.

{% hint style="warning" %}
Deleting a token causes API calls to fail for all apps using that token. Replace the token in your apps before deleting it.
{% endhint %}

***

## Next Steps

- [Project Settings](12-settings.md) — Check your Project ID and other settings
- [Understanding API Keys](../security/02-api-keys.md) — Public Key vs Secret Key
- [Integrating bkend with Your App](../getting-started/03-app-integration.md) — Connect your API with a fetch helper
