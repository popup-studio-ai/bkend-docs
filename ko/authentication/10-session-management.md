# 세션 & 토큰 관리

{% hint style="info" %}
💡 활성 세션을 조회하고, 토큰을 갱신하고, 원격으로 세션을 종료하세요.
{% endhint %}

## 개요

bkend는 JWT 기반 인증과 함께 세션 관리 기능을 제공합니다. User는 자신의 활성 세션 목록을 확인하고, 다른 기기의 세션을 원격으로 종료할 수 있습니다.

***

## 내 정보 조회

### GET /v1/auth/me

현재 로그인된 User의 정보를 조회합니다.

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/me \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**응답:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "role": "user",
  "name": "홍길동",
  "email": "user@example.com",
  "emailVerified": "2025-01-15T09:30:00.000Z",
  "image": "https://example.com/avatar.jpg",
  "onboardingStatus": "completed",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

***

## 토큰 갱신

### POST /v1/auth/refresh

Access Token이 만료되었을 때 Refresh Token으로 새 토큰 쌍을 발급받습니다.

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "refreshToken": "{refresh_token}"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
  },
  body: JSON.stringify({
    refreshToken: localStorage.getItem('refreshToken'),
  }),
});

const { accessToken, refreshToken } = await response.json();
// 새 토큰 저장
```
{% endtab %}
{% endtabs %}

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `refreshToken` | `string` | ✅ | JWT Refresh Token |

**응답:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

{% hint style="warning" %}
⚠️ 토큰 갱신 시 새 Refresh Token이 발급됩니다. 이전 Refresh Token은 즉시 무효화되므로 반드시 새 토큰을 저장하세요.
{% endhint %}

***

## 세션 목록 조회

### GET /v1/auth/sessions

현재 User의 모든 활성 세션을 조회합니다.

```bash
curl -X GET "https://api-client.bkend.ai/v1/auth/sessions?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `page` | Query | `number` | - | 페이지 번호 (기본값: 1) |
| `limit` | Query | `number` | - | 페이지당 항목 수 (기본값: 10) |

**응답:**

```json
{
  "items": [
    {
      "id": "session-uuid-1",
      "userId": "user-uuid",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
      "ipAddress": "203.0.113.1",
      "deviceInfo": "Chrome on macOS",
      "lastActivityAt": "2025-01-20T14:30:00.000Z",
      "createdAt": "2025-01-20T09:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3
  }
}
```

***

## 세션 삭제

### DELETE /v1/auth/sessions/:sessionId

특정 세션을 종료합니다. 다른 기기에서 로그인된 세션을 원격으로 종료할 때 사용합니다.

```bash
curl -X DELETE https://api-client.bkend.ai/v1/auth/sessions/{sessionId} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

{% hint style="warning" %}
⚠️ 현재 사용 중인 세션을 삭제하면 즉시 로그아웃됩니다.
{% endhint %}

***

## 로그아웃

### POST /v1/auth/signout

현재 세션을 종료하고 토큰을 무효화합니다.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/signout \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/unauthorized` | 401 | 인증이 필요함 |
| `auth/invalid-token` | 401 | 토큰이 유효하지 않음 |
| `auth/invalid-refresh-token` | 401 | Refresh Token 불일치 또는 세션 없음 |
| `auth/session-expired` | 401 | 세션 만료 (7일) |
| `auth/session-not-found` | 404 | 세션을 찾을 수 없음 |
| `auth/user-not-found` | 404 | 사용자가 삭제됨 |

***

## 다음 단계

- [다중 인증 (MFA)](11-mfa.md) — 보안 강화
- [이메일 로그인](03-email-signin.md) — 로그인 방법
- [보안 모범 사례](../security/07-best-practices.md) — 토큰 관리 권장 사항
