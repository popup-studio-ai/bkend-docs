# 소셜 계정 연동

{% hint style="info" %}
💡 기존 계정에 여러 소셜 로그인을 연결하여 다양한 방법으로 로그인하세요.
{% endhint %}

## 개요

계정 연동(Account Linking)은 하나의 User 계정에 여러 소셜 로그인(Google, GitHub)을 연결하는 기능입니다. 이메일로 가입한 계정에 Google 로그인을 추가하거나, Google 계정에 GitHub을 추가로 연결할 수 있습니다.

***

## 소셜 계정 연결

### POST /v1/auth/accounts

기존 계정에 새 소셜 로그인을 연결합니다.

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/accounts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "provider": "google",
    "code": "{authorization_code}"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
// 1. Google 인증 URL로 리다이렉트
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const params = new URLSearchParams({
  client_id: '{google_client_id}',
  redirect_uri: 'https://myapp.com/link-callback',
  response_type: 'code',
  scope: 'openid email profile',
  state: crypto.randomUUID(),
});
window.location.href = `${GOOGLE_AUTH_URL}?${params}`;

// 2. Google 인증 후 콜백에서 code 추출
// 3. 계정 연결
const response = await fetch('https://api-client.bkend.ai/v1/auth/accounts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    provider: 'google',
    code: urlParams.get('code'),
  }),
});
```
{% endtab %}
{% endtabs %}

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `provider` | `string` | ✅ | `"google"` 또는 `"github"` |
| `code` | `string` | 조건부 | OAuth authorization code |
| `idToken` | `string` | 조건부 | ID 토큰 |
| `accessToken` | `string` | - | OAuth access token |

***

## 연결된 계정 목록 조회

### GET /v1/auth/accounts

```bash
curl -X GET "https://api-client.bkend.ai/v1/auth/accounts?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**응답:**

```json
{
  "items": [
    {
      "id": "account-uuid-1",
      "userId": "user-uuid",
      "provider": "email",
      "providerAccountId": "user@example.com",
      "connectedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "account-uuid-2",
      "userId": "user-uuid",
      "provider": "google",
      "providerAccountId": "117012345678901234567",
      "connectedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2
  }
}
```

***

## 소셜 계정 연결 해제

### DELETE /v1/auth/accounts/:provider

```bash
curl -X DELETE https://api-client.bkend.ai/v1/auth/accounts/google \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

{% hint style="warning" %}
⚠️ 마지막 로그인 수단(이메일 또는 소셜)은 연결 해제할 수 없습니다. 최소 하나의 인증 수단이 남아있어야 합니다.
{% endhint %}

***

## 계정 존재 여부 확인

### POST /v1/auth/accounts/check

특정 이메일이나 소셜 계정이 이미 등록되어 있는지 확인합니다. 인증 없이 사용할 수 있습니다.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/accounts/check \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "type": "email",
    "provider": "email",
    "providerAccountId": "user@example.com"
  }'
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `type` | `string` | ✅ | `"email"` 또는 `"oauth"` |
| `provider` | `string` | ✅ | 제공자 이름 |
| `providerAccountId` | `string` | ✅ | 제공자별 고유 ID 또는 이메일 |

**응답:**

```json
{
  "exists": true,
  "accountIds": ["account-uuid-1"]
}
```

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/account-already-linked` | 409 | 이미 연결된 소셜 계정 |
| `auth/cannot-unlink-last-account` | 400 | 마지막 인증 수단은 해제 불가 |
| `auth/unsupported-provider` | 400 | 지원하지 않는 제공자 |
| `auth/unauthorized` | 401 | 인증이 필요함 |

***

## 다음 단계

- [소셜 로그인 개요](05-social-overview.md) — OAuth 인증 흐름
- [사용자 프로필](14-user-profile.md) — 프로필 관리
- [Google OAuth](06-social-google.md) — Google 계정 설정
