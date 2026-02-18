# Project Settings

{% hint style="info" %}
💡 This guide explains how to manage your project's basic information and settings.
{% endhint %}

## Overview

On the project settings page, you can check the Project ID, modify project information, configure authentication settings, and delete the project.

***

## Opening the Settings Page

Click **Project Settings** in the project-level sidebar.

***

## Project Information

The top section of the settings page displays key project information.

| Field | Description |
|-------|-------------|
| **Project ID** | Auto-generated unique identifier (click to copy) |
| **Project Slug** | URL identifier |
| **Cloud Provider** | Cloud provider (e.g., AWS) |
| **Region** | Deployment region (e.g., ap-northeast-2) |
| **Created At** | Date and time the project was created |

{% hint style="info" %}
💡 The Project ID is auto-generated and cannot be changed. The Publishable Key (`pk_` prefix) embeds the project ID and environment, so you only need the `X-API-Key` header for REST API calls.
{% endhint %}

```bash
-H "X-API-Key: {pk_publishable_key}"
```

***

## Modifying Project Settings

| Field | Editable | Description |
|-------|:--------:|-------------|
| **Project Name** | ✅ | Change the display name |
| **Description** | ✅ | Change the project description |
| **Project Slug** | ❌ | Cannot be changed after creation |
| **Cloud Provider** | ❌ | Cannot be changed after creation |
| **Region** | ❌ | Cannot be changed after creation |
| **Project ID** | ❌ | Auto-generated, cannot be changed |

***

## CORS (Allowed Origins)

Click **CORS** in the project-level sidebar to manage allowed origins for cross-origin API requests.

1. Enter the origin URL (e.g., `https://my-app.com`) and click **Add**.
2. The origin is added to the allowed list.

| Rule | Description |
|------|-------------|
| **Maximum** | Up to 3 origins per project |
| **Format** | Must be a valid URL including protocol (e.g., `https://`) |
| **Wildcard** | Wildcard (`*`) is not allowed |
| **localhost** | `http://localhost` origins are allowed for development |

To remove an origin, click the **Delete** button next to it.

{% hint style="warning" %}
⚠️ API requests from origins not in the allowed list will be blocked by the browser's CORS policy.
{% endhint %}

***

## Deleting a Project

{% hint style="danger" %}
🚨 **Danger** — Deleting a project permanently removes all environments, tables, Users, files, and API Keys. This action cannot be undone.
{% endhint %}

1. Scroll to the **Delete Project** section at the bottom of the settings page.
2. Click the **Delete** button.
3. Enter the project name and click **Confirm Delete**.

***

## Next Steps

- [API Key Management](11-api-keys.md) — Issue access tokens
- [Environment Management](05-environment.md) — Create and switch environments
- [Console Overview](01-overview.md) — Full console structure
