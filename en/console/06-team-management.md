# Team Management

{% hint style="info" %}
This guide explains how to invite team members to your Organization and manage their roles.
{% endhint %}

## Overview

Team management is handled at the Organization level. Invited team members can access all projects within the Organization. Permissions vary by role.

***

## Inviting Team Members

1. Click **Team** in the organization-level sidebar.
2. Click the **Invite Member** button.
3. Enter the following information.

| Field | Description |
|-------|-------------|
| **Email** | Email address of the team member to invite |
| **Role** | Choose from Owner, Admin, Member, or Billing |

4. Click **Send Invitation**.

{% hint style="info" %}
When the invited member clicks the link in the invitation email, they automatically join the Organization.
{% endhint %}

***

## Permissions by Role

| Permission | Owner | Admin | Member | Billing |
|------------|:-----:|:-----:|:------:|:-------:|
| Create/delete projects | ✅ | ✅ | ❌ | ❌ |
| Manage tables/schemas | ✅ | ✅ | ✅ | ❌ |
| Invite/manage members | ✅ | ✅ | ❌ | ❌ |
| Manage billing/plans | ✅ | ❌ | ❌ | ✅ |
| Delete organization | ✅ | ❌ | ❌ | ❌ |

***

## Changing a Member's Role

1. Find the member in the team list.
2. Select a new role from the role dropdown.
3. The change takes effect immediately.

{% hint style="danger" %}
**Danger** — Transferring the Owner role to another member may change your own Owner permissions.
{% endhint %}

***

## Removing a Member

1. Find the member in the team list.
2. Click the **Remove** button.
3. After confirmation, access is revoked immediately.

***

## Next Steps

- [Table Management](07-table-management.md) — Create and manage tables
- [Project Settings](12-settings.md) — Configure project-specific settings
- [Organization Management](03-org-management.md) — Modify organization settings
