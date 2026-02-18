# Auth & User REST API Reference

{% hint style="info" %}
💡 View all authentication and user-related REST API endpoints at a glance.
{% endhint %}

## Common Information

### Base URL

```text
https://api-client.bkend.ai
```

### Required Headers

| Header | Required | Description |
|--------|:--------:|-------------|
| `X-API-Key` | Yes | `{pk_publishable_key}` -- Publishable Key issued from the console |
| `Authorization` | Conditional | `Bearer {accessToken}` -- for authenticated endpoints |
| `Content-Type` | Conditional | `application/json` -- when request body is included |

### Response Format

All responses are in JSON format. Error response structure:

```json
{
  "error": {
    "code": "auth/invalid-credentials",
    "message": "Email or password is incorrect."
  }
}
```

***

## Email Authentication

### Sign-up

```http
POST /v1/auth/email/signup
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `method` | `string` | Yes | `"password"` |
| `email` | `string` | Yes | Email address |
| `password` | `string` | Yes | Password (min 8 chars, uppercase + lowercase + number + special char) |
| `name` | `string` | Yes | User name |

**Response:** `201 Created` -- `{ accessToken, refreshToken, tokenType, expiresIn }`

-> [Email Sign-up](02-email-signup.md)

### Sign-in

```http
POST /v1/auth/email/signin
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `method` | `string` | Yes | `"password"` |
| `email` | `string` | Yes | Email address |
| `password` | `string` | Yes | Password |
| `mfaCode` | `string` | - | 6-digit TOTP code (when MFA is enabled) |

**Response:** `200 OK` -- `{ accessToken, refreshToken, tokenType, expiresIn }`

-> [Email Sign-in](03-email-signin.md)

### Magic Link Sign-up

```http
POST /v1/auth/email/signup
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `method` | `string` | Yes | `"magiclink"` |
| `email` | `string` | Yes | Email address |
| `callbackUrl` | `string` | Yes | Redirect URL after authentication |

**Response:** `201 Created` -- `{ message, email }`

### Magic Link Sign-in

```http
POST /v1/auth/email/signin
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `method` | `string` | Yes | `"magiclink"` |
| `email` | `string` | Yes | Email address |
| `callbackUrl` | `string` | Yes | Redirect URL after authentication |

**Response:** `200 OK` -- `{ message, email }`

-> [Magic Link Authentication](04-magic-link.md)

***

## Social Login (OAuth)

### Callback Handling

```http
GET /v1/auth/:provider/callback
POST /v1/auth/:provider/callback
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `code` | `string` | Yes | OAuth authorization code |
| `redirectUri` | `string` | Yes | Redirect URI used during OAuth authentication |
| `state` | `string` | Yes | CSRF prevention state value |

**Response:** `200 OK` -- `{ accessToken, refreshToken, tokenType, expiresIn }`

-> [Social Login Overview](05-social-overview.md) | [Google](06-social-google.md) | [GitHub](07-social-github.md)

***

## Password Management

### Request Reset

```http
POST /v1/auth/password/reset/request
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Registered email |

**Response:** `200 OK` -- `{ message }`

### Confirm Reset

```http
POST /v1/auth/password/reset/confirm
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Email address |
| `token` | `string` | Yes | Reset token |
| `newPassword` | `string` | Yes | New password |

**Response:** `200 OK` -- `{ message }`

### Change Password

```http
POST /v1/auth/password/change
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `currentPassword` | `string` | Yes | Current password |
| `newPassword` | `string` | Yes | New password |

**Response:** `200 OK` -- `{ message }`

-> [Password Management](08-password-management.md)

***

## Email Verification

### Resend Sign-up Verification Email

```http
POST /v1/auth/signup/email/resend
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Registered email |
| `callbackUrl` | `string` | - | Redirect URL after verification |

**Response:** `200 OK` -- `{ message, email }`

### Confirm Sign-up Email Verification

```http
GET /v1/auth/signup/email/confirm
```

| Query Parameter | Type | Required | Description |
|-----------------|------|:--------:|-------------|
| `token` | `string` | Yes | Verification token |
| `email` | `string` | Yes | Email address |
| `callbackUrl` | `string` | - | Redirect URL |

**Response:** `302 Redirect` or `200 OK` -- Redirects if `callbackUrl` is provided, otherwise returns JSON

### Send Verification Email

```http
POST /v1/auth/email/verify/send
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Email to verify |
| `callbackUrl` | `string` | - | Redirect URL after verification |

**Response:** `200 OK` -- `{ message, email }`

### Confirm Verification

```http
POST /v1/auth/email/verify/confirm
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Email address |
| `token` | `string` | Yes | Verification token |

**Response:** `200 OK` -- `{ message, verified }`

### Resend Verification Email

```http
POST /v1/auth/email/verify/resend
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `email` | `string` | Yes | Email to verify |
| `callbackUrl` | `string` | - | Redirect URL after verification |

**Response:** `200 OK` -- `{ message, email }`

-> [Email Verification](09-email-verification.md)

***

## Session & Token

### Get Current User

```http
GET /v1/auth/me
```

**Authentication required**

**Response:** `200 OK` -- `{ id, email, name, role, ... }`

### Refresh Tokens

```http
POST /v1/auth/refresh
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `refreshToken` | `string` | Yes | Refresh Token |

**Response:** `200 OK` -- `{ accessToken, refreshToken }`

### List Sessions

```http
GET /v1/auth/sessions
```

**Authentication required**

**Response:** `200 OK` -- `[ { id, device, ip, lastAccessedAt, ... } ]`

### Terminate Specific Session

```http
DELETE /v1/auth/sessions/:sessionId
```

**Authentication required**

**Response:** `200 OK` -- `{ message }`

### Sign Out

```http
POST /v1/auth/signout
```

**Authentication required**

**Response:** `200 OK` -- `{ message }`

### Switch Organization

```http
POST /v1/auth/switch-organization
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `organizationId` | `string` | Yes | Target organization ID |

**Response:** `200 OK` -- `{ accessToken, refreshToken }`

-> [Session Management](10-session-management.md)

***

## MFA (Multi-Factor Authentication)

### Request MFA Activation

```http
POST /v1/auth/mfa/enable
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `password` | `string` | Yes | Current password |

**Response:** `200 OK` -- `{ secret, qrCodeUrl, backupCodes }`

### Confirm MFA Activation

```http
POST /v1/auth/mfa/confirm
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `code` | `string` | Yes | TOTP authentication code (6 digits) |

**Response:** `200 OK` -- `{ backupCodes }`

### Disable MFA

```http
POST /v1/auth/mfa/disable
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `password` | `string` | Yes | Current password (min 8 chars) |
| `code` | `string` | - | 6-digit TOTP code |

**Response:** `200 OK` -- `{}`

-> [Multi-Factor Authentication (MFA)](11-mfa.md)

***

## Account Linking

### Link Account

```http
POST /v1/auth/accounts
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `provider` | `string` | Yes | `"google"` or `"github"` |
| `code` | `string` | - | OAuth authorization code |
| `state` | `string` | - | OAuth state token |

**Response:** `201 Created` -- `{}`

### List Linked Accounts

```http
GET /v1/auth/accounts
```

**Authentication required**

**Response:** `200 OK` -- `[ { provider, email, linkedAt } ]`

### Unlink Account

```http
DELETE /v1/auth/accounts/:provider
```

**Authentication required**

**Response:** `200 OK` -- `{ message }`

### Check Account Link

```http
POST /v1/auth/accounts/check
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `type` | `string` | Yes | `"credentials"` or `"oauth"` |
| `provider` | `string` | Yes | Provider name |
| `providerAccountId` | `string` | Yes | Provider-specific unique ID |

**Response:** `200 OK` -- `{ exists, type?, provider? }`

-> [Account Linking](12-account-linking.md)

***

## Invitations

### Create Invitation

```http
POST /v1/auth/invitations
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `resourceType` | `string` | Yes | `"organization"` or `"project"` |
| `resourceId` | `string` | Yes | Organization or project ID |
| `resourceName` | `string` | Yes | Resource name |
| `email` | `string` | Yes | Invitee email |
| `name` | `string` | Yes | Invitee name |
| `resourceRole` | `string` | Yes | Role to assign |
| `inviterName` | `string` | - | Inviter name |

**Response:** `201 Created` -- `{ id, resourceType, resourceId, resourceName, status, expiresAt, ... }`

### List Invitations

```http
GET /v1/auth/invitations
```

**Authentication required**

| Query Parameter | Type | Required | Description |
|-----------------|------|:--------:|-------------|
| `resourceType` | `string` | - | `"user"`, `"organization"`, `"project"` |
| `resourceId` | `string` | - | Resource ID filter |
| `status` | `string` | - | `pending`, `accepted`, `rejected`, `expired`, `revoked` |
| `page` | `number` | - | Page number |
| `limit` | `number` | - | Items per page |

**Response:** `200 OK` -- `{ items: [...], pagination }`

### Get Invitation Details

```http
GET /v1/auth/invitations/:invitationId
```

**Authentication required**

**Response:** `200 OK` -- `{ id, resourceType, resourceId, resourceName, status, expiresAt, ... }`

### Accept Invitation

```http
POST /v1/auth/invitations/accept
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `token` | `string` | Yes | Invitation token (SHA256 hash) |
| `email` | `string` | - | Email address (for verification) |

**Response:** `200 OK` -- `{ id, resourceType, resourceId, status, ... }`

### Decline Invitation

```http
POST /v1/auth/invitations/reject
```

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `token` | `string` | Yes | Invitation token |
| `email` | `string` | Yes | Email address of the invitee |

**Response:** `200 OK` -- `{}`

### Revoke Invitation

```http
DELETE /v1/auth/invitations/:invitationId
```

**Authentication required**

**Response:** `200 OK` -- `{ message }`

-> [Invitation System](13-invitation.md)

***

## Account Deletion

```http
DELETE /v1/auth/withdraw
```

**Authentication required**

**Response:** `200 OK` -- `{ message }`

-> [Account Deletion](16-account-deletion.md)

***

## User Management

### List Users

```http
GET /v1/users
```

**Authentication required**

| Query Parameter | Type | Description |
|-----------------|------|-------------|
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Items per page (1-100, default: 20) |
| `search` | `string` | Search by name/nickname/email |
| `searchType` | `string` | `name`, `nickname`, `email` |
| `sortBy` | `string` | `createdAt`, `updatedAt`, `name`, `email`, `role` |
| `sortDirection` | `string` | `asc` or `desc` |
| `includeAccounts` | `boolean` | Include linked accounts |

**Response:** `200 OK` -- `{ items: [...], pagination }`

### Create User

```http
POST /v1/users
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `name` | `string` | Yes | Name |
| `email` | `string` | Yes | Email |
| `role` | `string` | - | `admin`, `user`, `guest` |

**Response:** `201 Created` -- Created user object

### Get User Details

```http
GET /v1/users/:userId
```

**Authentication required**

**Response:** `200 OK` -- User object

### Update User

```http
PATCH /v1/users/:userId
```

**Authentication required**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Name |

**Response:** `200 OK` -- Updated user object

### Delete User

```http
DELETE /v1/users/:userId
```

**Authentication required**

**Response:** `200 OK` -- `{ message }`

### Change Role

```http
PATCH /v1/users/:userId/role
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `role` | `string` | Yes | `admin`, `user`, `guest` |

**Response:** `200 OK` -- Updated user object

-> [User Management](15-user-management.md)

***

## User Profile

### Get Profile

```http
GET /v1/users/:userId/profile
```

**Authentication required**

**Response:** `200 OK` -- `{ name, nickname, email, mobile, gender, bio, socialLinks }`

### Update Profile

```http
PATCH /v1/users/:userId/profile
```

**Authentication required**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Name (1-100 characters) |
| `nickname` | `string` \| `null` | Nickname (1-50 characters) |
| `mobile` | `string` \| `null` | Phone number (E.164) |
| `gender` | `string` \| `null` | `none`, `male`, `female`, `etc` |
| `bio` | `string` \| `null` | Bio (max 500 characters) |
| `socialLinks` | `object` \| `null` | `{ github, twitter, linkedin }` |

**Response:** `200 OK` -- Updated profile object

-> [User Profile](14-user-profile.md)

***

## Avatar

### Generate Upload URL

```http
POST /v1/users/:userId/avatar/upload-url
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `filename` | `string` | Yes | Filename |
| `contentType` | `string` | Yes | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |

**Response:** `200 OK` -- `{ uploadUrl, key, expiresAt }`

### Save Avatar

```http
PATCH /v1/users/:userId/avatar
```

**Authentication required**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `s3Key` | `string` | Yes | Uploaded file key |

**Response:** `200 OK` -- `{ image }`

### Delete Avatar

```http
DELETE /v1/users/:userId/avatar
```

**Authentication required**

**Response:** `200 OK` -- `{ message }`

-> [User Profile & Avatar](14-user-profile.md)

***

## Preferences

### Get Preferences

```http
GET /v1/users/:userId/preferences
```

**Authentication required**

**Response:** `200 OK` -- `{ locale, timezone, theme }`

### Update Preferences

```http
PATCH /v1/users/:userId/preferences
```

**Authentication required**

| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | `string` \| `null` | Language (`ko`, `en`, `ja`) |
| `timezone` | `string` \| `null` | Timezone (IANA, e.g., `Asia/Seoul`) |
| `theme` | `string` \| `null` | `light`, `dark`, `system` |

**Response:** `200 OK` -- Updated preferences object

-> [User Management](15-user-management.md)

***

## Notification Settings

### Get Notification Settings

```http
GET /v1/users/:userId/notifications
```

**Authentication required**

**Response:** `200 OK` -- `{ service, marketing, push, email, sms, nightTime, securityAlerts }`

### Update Notification Settings

```http
PATCH /v1/users/:userId/notifications
```

**Authentication required**

| Parameter | Type | Default | Description |
|-----------|------|:-------:|-------------|
| `service` | `boolean` | `true` | Service notifications |
| `marketing` | `boolean` | `false` | Marketing notifications |
| `push` | `boolean` | `true` | Push notifications |
| `email` | `boolean` | `true` | Email notifications |
| `sms` | `boolean` | `false` | SMS notifications |
| `nightTime` | `boolean` | `false` | Night-time notifications |
| `securityAlerts` | `boolean` | `true` | Security alerts |

**Response:** `200 OK` -- Updated notification settings object

-> [User Management](15-user-management.md)

***

## Onboarding

### Get Onboarding Status

```http
GET /v1/users/:userId/onboarding
```

**Authentication required**

**Response:** `200 OK` -- Onboarding status object

### Update Onboarding Status

```http
PATCH /v1/users/:userId/onboarding
```

**Authentication required**

**Response:** `200 OK` -- Updated onboarding status object

-> [User Management](15-user-management.md)

***

## Public Profile Settings

### Get Public Settings

```http
GET /v1/users/:userId/public-settings
```

**Authentication required**

**Response:** `200 OK` -- `{ slug, isPublic }`

### Update Public Settings

```http
PATCH /v1/users/:userId/public-settings
```

**Authentication required**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | `string` \| `null` | Public profile URL slug |
| `isPublic` | `boolean` | Whether profile is public |

**Response:** `200 OK` -- Updated settings object

-> [User Management](15-user-management.md)

***

## Error Codes

### Authentication Errors

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/invalid-credentials` | 401 | Email or password error |
| `auth/email-already-exists` | 409 | Email already registered |
| `auth/email-not-verified` | 403 | Email not verified |
| `auth/unauthorized` | 401 | Authentication required |
| `auth/token-expired` | 401 | Token expired |
| `auth/invalid-token` | 401 | Invalid token |
| `auth/session-not-found` | 404 | Session not found |
| `auth/weak-password` | 400 | Password policy not met |
| `auth/mfa-required` | 403 | MFA authentication required |
| `auth/mfa-already-enabled` | 409 | MFA already enabled |
| `auth/mfa-not-enabled` | 400 | MFA not enabled |
| `auth/invalid-mfa-code` | 401 | MFA code error |
| `auth/account-already-linked` | 409 | Account already linked |
| `auth/last-auth-method` | 400 | Cannot unlink last auth method |
| `auth/invitation-not-found` | 404 | Invitation not found |
| `auth/invitation-expired` | 410 | Invitation expired |
| `auth/invalid-refresh-token` | 401 | Refresh token invalid or session not found |
| `auth/session-expired` | 401 | Session expired (7 days) |
| `auth/invalid-password-format` | 400 | Password policy violation |
| `auth/same-as-previous-password` | 400 | New password same as current |
| `auth/verification-token-not-found` | 404 | Reset/verification token not found |
| `auth/verification-token-expired` | 401 | Reset/verification token expired |
| `auth/too-many-requests` | 429 | Too many requests |
| `auth/too-many-login-attempts` | 429 | Too many login attempts |
| `auth/too-many-code-requests` | 429 | Too many verification code requests |
| `auth/unsupported-provider` | 400 | Unsupported provider |
| `auth/oauth-not-configured` | 400 | OAuth not configured |
| `auth/template-not-found` | 404 | Template not found |

### User Errors

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `user/not-found` | 404 | User not found |
| `user/unauthorized` | 401 | Authentication required |
| `user/forbidden` | 403 | Permission denied |
| `user/invalid-role` | 400 | Invalid role |
| `user/invalid-name` | 400 | Invalid name |
| `user/invalid-nickname` | 400 | Invalid nickname |

***

## Endpoint Summary

### Auth Endpoints (32)

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/v1/auth/email/signup` | - | Email sign-up |
| `POST` | `/v1/auth/email/signin` | - | Email sign-in |
| `GET` | `/v1/auth/:provider/callback` | - | OAuth callback (GET) |
| `POST` | `/v1/auth/:provider/callback` | - | OAuth callback (POST) |
| `GET` | `/v1/auth/me` | Yes | Get current user |
| `POST` | `/v1/auth/refresh` | - | Refresh tokens |
| `POST` | `/v1/auth/signout` | Yes | Sign out |
| `DELETE` | `/v1/auth/withdraw` | Yes | Account deletion |
| `POST` | `/v1/auth/switch-organization` | Yes | Switch organization |
| `POST` | `/v1/auth/password/reset/request` | - | Request password reset |
| `POST` | `/v1/auth/password/reset/confirm` | - | Confirm password reset |
| `POST` | `/v1/auth/password/change` | Yes | Change password |
| `GET` | `/v1/auth/sessions` | Yes | List sessions |
| `DELETE` | `/v1/auth/sessions/:sessionId` | Yes | Terminate session |
| `POST` | `/v1/auth/mfa/enable` | Yes | Enable MFA |
| `POST` | `/v1/auth/mfa/confirm` | Yes | Confirm MFA |
| `POST` | `/v1/auth/mfa/disable` | Yes | Disable MFA |
| `POST` | `/v1/auth/accounts` | Yes | Link account |
| `GET` | `/v1/auth/accounts` | Yes | List linked accounts |
| `DELETE` | `/v1/auth/accounts/:provider` | Yes | Unlink account |
| `POST` | `/v1/auth/accounts/check` | - | Check account link |
| `POST` | `/v1/auth/invitations` | Yes | Create invitation |
| `GET` | `/v1/auth/invitations` | Yes | List invitations |
| `GET` | `/v1/auth/invitations/:invitationId` | Yes | Invitation details |
| `POST` | `/v1/auth/invitations/accept` | - | Accept invitation |
| `POST` | `/v1/auth/invitations/reject` | - | Decline invitation |
| `DELETE` | `/v1/auth/invitations/:invitationId` | Yes | Revoke invitation |
| `POST` | `/v1/auth/email/verify/send` | - | Send verification email |
| `POST` | `/v1/auth/email/verify/confirm` | - | Confirm verification |
| `POST` | `/v1/auth/email/verify/resend` | - | Resend verification email |
| `POST` | `/v1/auth/signup/email/resend` | - | Resend sign-up verification |
| `GET` | `/v1/auth/signup/email/confirm` | - | Confirm sign-up verification |

### User Endpoints (19)

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `GET` | `/v1/users` | Yes | List users |
| `POST` | `/v1/users` | Yes | Create user |
| `GET` | `/v1/users/:userId` | Yes | User details |
| `PATCH` | `/v1/users/:userId` | Yes | Update user |
| `DELETE` | `/v1/users/:userId` | Yes | Delete user |
| `PATCH` | `/v1/users/:userId/role` | Yes | Change role |
| `GET` | `/v1/users/:userId/profile` | Yes | Get profile |
| `PATCH` | `/v1/users/:userId/profile` | Yes | Update profile |
| `POST` | `/v1/users/:userId/avatar/upload-url` | Yes | Avatar upload URL |
| `PATCH` | `/v1/users/:userId/avatar` | Yes | Save avatar |
| `DELETE` | `/v1/users/:userId/avatar` | Yes | Delete avatar |
| `GET` | `/v1/users/:userId/preferences` | Yes | Get preferences |
| `PATCH` | `/v1/users/:userId/preferences` | Yes | Update preferences |
| `GET` | `/v1/users/:userId/notifications` | Yes | Get notification settings |
| `PATCH` | `/v1/users/:userId/notifications` | Yes | Update notification settings |
| `GET` | `/v1/users/:userId/onboarding` | Yes | Get onboarding |
| `PATCH` | `/v1/users/:userId/onboarding` | Yes | Update onboarding |
| `GET` | `/v1/users/:userId/public-settings` | Yes | Get public settings |
| `PATCH` | `/v1/users/:userId/public-settings` | Yes | Update public settings |
