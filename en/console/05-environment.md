# Environment Management

{% hint style="info" %}
An Environment is a unit of data isolation. This guide explains how to create and manage dev, staging, and prod environments.
{% endhint %}

## Overview

Environments isolate data within a project. You can create separate development (`dev`), staging (`staging`), and production (`prod`) environments to develop and deploy safely.

***

## Viewing the Environment List

1. Click **Environments** in the project-level sidebar.
2. View all environments in the current project.

| Displayed Info | Description |
|----------------|-------------|
| **Environment Name** | dev, staging, prod, etc. |
| **Type** | Development / Staging / Production / Custom |
| **Status** | Creating / Ready / Active / Failed / Deleting |
| **Created At** | Date and time the environment was created |

***

## Creating an Environment

1. Click the **Create Environment** button in the environment list.
2. Enter the environment name (e.g., `staging`).
3. Click **Create**.

{% hint style="warning" %}
Environment provisioning takes approximately 30 seconds. Wait until it reaches **Active** status.
{% endhint %}

***

## Switching Environments

Use the environment selector tabs at the top of the console to switch between environments. When you switch environments, the tables, Users, and file data for that environment are displayed.

{% hint style="warning" %}
Data is completely isolated between environments. Tables and data created in the `dev` environment do not exist in the `prod` environment.
{% endhint %}

***

## Isolation Scope per Environment

| Data | Isolated per Environment | Description |
|------|:------------------------:|-------------|
| Table schema | ✅ | Independent table structure per environment |
| Table data | ✅ | Independent data per environment |
| Users | ✅ | Independent user pool per environment |
| API Keys | ✅ | Independent tokens per environment |
| Files | ✅ | Independent storage per environment |

***

## Specifying an Environment in REST API

Each environment has its own Publishable Key (`pk_` prefix). Use the `X-API-Key` header with the appropriate key to target a specific environment.

```bash
curl https://api-client.bkend.ai/v1/data/posts \
  -H "X-API-Key: {pk_publishable_key}"
```

***

## Next Steps

- [Team Management](06-team-management.md) — Invite members and assign roles
- [Table Management](07-table-management.md) — Create tables in your environment
- [API Key Management](11-api-keys.md) — Issue API Keys per environment
