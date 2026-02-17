# Project Settings

{% hint style="info" %}
This guide explains how to manage your project's basic information and settings.
{% endhint %}

## Overview

On the project settings page, you can check the Project ID, modify project information, configure authentication settings, and delete the project.

***

## Opening the Settings Page

Click **Project Settings** in the project-level sidebar.

***

## Checking the Project ID

The **Project ID** is displayed at the top of the project settings page. The Publishable Key (`pk_` prefix) includes the project ID and environment information, so you only need the `X-API-Key` header for REST API calls.

```bash
-H "X-API-Key: {pk_publishable_key}"
```

{% hint style="info" %}
The Project ID is an auto-generated unique identifier. It cannot be changed. The Publishable Key is issued per environment and embeds the project ID.
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
