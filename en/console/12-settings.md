# Project Settings

{% hint style="info" %}
This guide explains how to manage your project's basic information and settings.
{% endhint %}

## Overview

On the project settings page, you can check the Project ID, modify project information, configure authentication settings, and delete the project.

***

## Opening the Settings Page

Click **Settings** in the project-level sidebar.

***

## Checking the Project ID

The **Project ID** is displayed at the top of the project settings page. Use this value in the `X-Project-Id` header when making REST API calls.

```bash
-H "X-Project-Id: {project_id}"
```

{% hint style="info" %}
The Project ID is an auto-generated unique identifier. It cannot be changed.
{% endhint %}

***

## Modifying Project Information

| Field | Editable | Description |
|-------|:--------:|-------------|
| **Project Name** | ✅ | Change the display name |
| **Project Slug** | ✅ | Change the URL identifier |
| **Region** | ❌ | Cannot be changed after creation |
| **Project ID** | ❌ | Auto-generated, cannot be changed |

***

## Authentication Provider Settings

Enable or disable authentication providers for User authentication in the project settings.

- [Authentication Provider Configuration](../authentication/17-provider-config.md) — Detailed setup guide

***

## Deleting a Project

{% hint style="danger" %}
**Danger** — Deleting a project permanently removes all environments, tables, Users, files, and API Keys. This action cannot be undone.
{% endhint %}

1. Scroll to the **Delete Project** section at the bottom of the settings page.
2. Click the **Delete** button.
3. Enter the project name and click **Confirm Delete**.

***

## Next Steps

- [API Key Management](11-api-keys.md) — Issue access tokens
- [Environment Management](05-environment.md) — Create and switch environments
- [Console Overview](01-overview.md) — Full console structure
