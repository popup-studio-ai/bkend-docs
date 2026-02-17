# Project Management

{% hint style="info" %}
A Project corresponds to a single service or app. This guide explains how to create and manage projects.
{% endhint %}

## Overview

A Project is created under an Organization. When you create a project, a `dev` environment is automatically provisioned, and you gain access to all features including table design, authentication setup, and API Key issuance.

***

## Creating a Project

1. Click **Projects** in the sidebar.
2. Click the **Create Project** button.
3. Enter the following information.

| Field | Description | Example |
|-------|-------------|---------|
| **Project Name** | Display name for the project | My Blog |
| **Project Slug** | URL identifier (can be auto-generated) | my-blog |
| **Region** | Data storage region | Seoul (ap-northeast-2) |
| **Cloud** | Cloud provider | AWS |

4. Click **Create**.

{% hint style="warning" %}
When you create a project, a `dev` environment is automatically provisioned. Wait approximately 30 seconds until it reaches **Active** status.
{% endhint %}

***

## Viewing the Project List

Click **Projects** in the sidebar to view all projects in the current Organization.

| Displayed Info | Description |
|----------------|-------------|
| **Project Name** | Display name of the project |
| **Slug** | URL identifier |
| **Region** | Data storage location |
| **Environments** | Number of created environments |
| **Status** | Active / Provisioning |

***

## Selecting a Project

Click a project in the list to switch to the **project-level sidebar**. From there, you can access project-specific features such as environment management, database, authentication, and storage.

***

## Updating Project Settings

Click **Project Settings** in the project-level sidebar to modify project information.

{% hint style="info" %}
You can find the Project ID on the project settings page. The Publishable Key (`pk_` prefix) includes the project ID and environment information, so you only need the `X-API-Key` header for REST API calls.
{% endhint %}

***

## Deleting a Project

{% hint style="danger" %}
**Danger** — Deleting a project permanently removes all environments, tables, Users, and files. This action cannot be undone.
{% endhint %}

1. Click **Project Settings** in the project-level sidebar.
2. In the **Delete Project** section at the bottom of the page, click **Delete**.
3. Enter the project name and click **Confirm Delete**.

***

## Next Steps

- [Environment Management](05-environment.md) — Configure dev / staging / prod environments
- [Table Management](07-table-management.md) — Create your first table
- [API Key Management](11-api-keys.md) — Issue REST API access tokens
- [Project Settings](12-settings.md) — Modify detailed settings
