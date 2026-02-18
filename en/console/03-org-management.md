# Organization Management

{% hint style="info" %}
💡 An Organization is the top-level management unit in bkend. This guide explains how to create and configure organizations.
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
✅ When you create an organization, you are automatically assigned the **Owner** role.
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

## Organization Settings Page

Click **Organization Settings** in the sidebar. The settings page has the following tabs.

| Tab | Description |
|-----|-------------|
| **General** | Organization info and basic settings |
| **Billing** | Plan and payment management (Coming Soon) |
| **Security** | Security settings (Coming Soon) |
| **Audit** | Organization-level activity logs |
| **Danger** | Ownership transfer, leave, and deletion |

***

## Updating Organization Settings

1. Click the **General** tab on the Organization Settings page.
2. View organization info (Organization ID, slug, plan, status).
3. Modify the **Organization Name**, **Display Name**, or **Description** in the settings form.
4. Click **Save**.

***

## Transferring Ownership

1. Click the **Danger** tab on the Organization Settings page.
2. In the **Transfer Ownership** section, select a member from the dropdown.
3. Type `transfer` in the confirmation field and click **Transfer**.

{% hint style="danger" %}
🚨 **Danger** — After transferring ownership, you lose Owner privileges and cannot undo this action.
{% endhint %}

***

## Leaving an Organization

Non-owners can leave an organization voluntarily.

1. Click the **Danger** tab on the Organization Settings page.
2. In the **Leave Organization** section, type `leave` in the confirmation field.
3. Click **Leave**.

{% hint style="warning" %}
⚠️ After leaving, you lose access to all projects within the organization. Ask an admin to re-invite you if needed.
{% endhint %}

***

## Deleting an Organization

{% hint style="danger" %}
🚨 **Danger** — Deleting an organization permanently removes all projects, environments, and data within it. This action cannot be undone.
{% endhint %}

1. Click the **Danger** tab on the Organization Settings page.
2. In the **Delete Organization** section, click **Delete**.
3. Enter the organization name in the confirmation prompt and click **Confirm Delete**.

***

## Next Steps

- [Project Management](04-project-management.md) — Create a project within your organization
- [Team Management](06-team-management.md) — Invite members and assign roles
- [Core Concepts](../getting-started/04-core-concepts.md) — Understand the Organization → Project → Environment hierarchy
