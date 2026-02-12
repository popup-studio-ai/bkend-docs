# Organization Management

{% hint style="info" %}
An Organization is the top-level management unit in bkend. This guide explains how to create and configure organizations.
{% endhint %}

## Overview

An Organization is the top-level resource that groups projects and team members together. You can create multiple projects within a single Organization and invite team members to collaborate.

***

## Creating an Organization

1. On the console home, click the **Create Organization** button.
2. Enter the following information.

| Field | Description | Example |
|-------|-------------|---------|
| **Organization Name** | Display name for the organization | My Startup |
| **Organization Slug** | URL identifier (can be auto-generated) | my-startup |

3. Click **Create**.

{% hint style="success" %}
When you create an organization, you are automatically assigned the **Owner** role.
{% endhint %}

***

## Organization Roles

| Role | Project Management | Team Management | Billing Management | Delete Organization |
|------|:------------------:|:---------------:|:------------------:|:-------------------:|
| **Owner** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ❌ | ❌ |
| **Member** | ✅ | ❌ | ❌ | ❌ |
| **Billing** | ❌ | ❌ | ✅ | ❌ |

***

## Updating Organization Settings

1. Click **Settings** in the sidebar.
2. Modify the organization name or other settings.
3. Click **Save**.

***

## Deleting an Organization

{% hint style="danger" %}
**Danger** — Deleting an organization permanently removes all projects, environments, and data within it. This action cannot be undone.
{% endhint %}

1. Click **Settings** in the sidebar.
2. In the **Delete Organization** section at the bottom of the page, click **Delete**.
3. Enter the organization name in the confirmation prompt and click **Confirm Delete**.

***

## Next Steps

- [Project Management](04-project-management.md) — Create a project within your organization
- [Team Management](06-team-management.md) — Invite members and assign roles
- [Core Concepts](../getting-started/04-core-concepts.md) — Understand the Organization → Project → Environment hierarchy
