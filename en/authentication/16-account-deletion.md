# Account Deletion

{% hint style="info" %}
Users can delete their account to withdraw from the service.
{% endhint %}

## Overview

Account deletion (Withdraw) allows a User to delete their own account. Upon deletion, sessions are terminated and authentication data is removed.

***

## Delete Account

### DELETE /v1/auth/withdraw

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/auth/withdraw \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/auth/withdraw', {
  method: 'DELETE',
  headers: {
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
});

if (response.ok) {
  // Delete local tokens and redirect to login page
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}
```
{% endtab %}
{% endtabs %}

{% hint style="danger" %}
**Warning** -- Account deletion is irreversible. Prompt the User for confirmation before proceeding.
{% endhint %}

***

## What Happens on Deletion

| Item | Action |
|------|--------|
| Sessions | All active sessions terminated |
| Tokens | Access Token and Refresh Token invalidated |
| Linked accounts | Social login connections removed |
| User data | Processed as soft delete |

***

## Recommended Confirmation UI

When implementing the deletion feature, add the following confirmation steps.

```mermaid
flowchart TD
    A[Click delete button] --> B[Display warning message]
    B --> C{Confirmation input}
    C -->|Cancel| D[Previous page]
    C -->|Confirm| E[DELETE /auth/withdraw]
    E --> F[Delete local tokens]
    F --> G[Redirect to login page]
```

***

## Error Responses

| Error Code | HTTP | Description |
|------------|:----:|-------------|
| `auth/unauthorized` | 401 | Authentication required |

***

## Next Steps

- [Email Sign-up](02-email-signup.md) -- Create a new account
- [Session Management](10-session-management.md) -- Terminate sessions
- [Authentication Overview](01-overview.md) -- Understanding the authentication flow
