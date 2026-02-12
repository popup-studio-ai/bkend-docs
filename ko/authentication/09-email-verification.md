# 이메일 인증

{% hint style="info" %}
💡 이메일 인증을 통해 User의 이메일 소유권을 확인하세요.
{% endhint %}

## 개요

이메일 인증은 User가 입력한 이메일 주소가 실제 본인 소유인지 확인하는 과정입니다. bkend는 회원가입 이메일 인증과 연락용 이메일 인증 두 가지를 지원합니다.

***

## 인증 유형

| 유형 | 엔드포인트 | 용도 |
|------|-----------|------|
| **회원가입 이메일 인증** | `/auth/signup/email/*` | 회원가입 시 이메일 확인 |
| **연락용 이메일 인증** | `/auth/email/verify/*` | 프로필 이메일 변경 시 확인 |

***

## 회원가입 이메일 인증

### 인증 이메일 재발송

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/signup/email/resend \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "email": "user@example.com",
    "callbackUrl": "https://myapp.com/verify"
  }'
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `email` | `string` | ✅ | 인증할 이메일 주소 |
| `callbackUrl` | `string` | - | 인증 완료 후 리다이렉트 URL |

### 인증 확인

이메일의 인증 링크를 클릭하면 다음 엔드포인트가 호출됩니다.

**GET /v1/auth/signup/email/confirm**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `token` | Query | `string` | ✅ | 인증 토큰 |
| `email` | Query | `string` | ✅ | 이메일 주소 |
| `callbackUrl` | Query | `string` | - | 리다이렉트 URL |

`callbackUrl`이 있으면 인증 결과와 함께 리다이렉트됩니다.

```text
https://myapp.com/verify?verified=true&email=user@example.com
```

`callbackUrl`이 없으면 JSON 응답을 반환합니다.

```json
{
  "success": true,
  "data": {
    "verified": true,
    "email": "user@example.com"
  }
}
```

***

## 연락용 이메일 인증

### 인증 이메일 발송

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/verify/send \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "email": "newemail@example.com",
    "callbackUrl": "https://myapp.com/verify"
  }'
```

### 인증 확인

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/verify/confirm \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "email": "newemail@example.com",
    "token": "{verification_token}"
  }'
```

**응답:**

```json
{
  "message": "Email verified successfully",
  "verified": true
}
```

### 인증 이메일 재발송

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/verify/resend \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "email": "newemail@example.com"
  }'
```

***

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

// 인증 메일 발송
await bkendFetch('/v1/auth/email/verify/send', {
  method: 'POST',
  body: { email: 'user@example.com' },
});

// 인증 코드 확인
await bkendFetch('/v1/auth/email/verify/confirm', {
  method: 'POST',
  body: {
    email: 'user@example.com',
    token: '{verification_token}',
  },
});
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/03-app-integration.md)를 참고하세요.
{% endhint %}

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/invalid-email` | 400 | 이메일 형식이 올바르지 않음 |
| `auth/invalid-token` | 401 | 인증 토큰이 유효하지 않음 |
| `auth/token-expired` | 401 | 인증 토큰이 만료됨 |
| `auth/already-verified` | 400 | 이미 인증된 이메일 |

***

## 다음 단계

- [이메일 회원가입](02-email-signup.md) — 이메일로 계정 생성
- [이메일 템플릿](18-email-templates.md) — 인증 이메일 커스터마이징
- [사용자 프로필](14-user-profile.md) — 프로필 이메일 변경
