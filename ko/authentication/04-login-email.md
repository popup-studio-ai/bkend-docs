# 이메일 로그인

> 이메일과 비밀번호로 로그인하는 방법을 안내합니다.

## 개요

이메일 로그인은 비밀번호 방식과 매직 링크 방식을 지원합니다. 이 문서에서는 비밀번호 방식의 로그인을 다룹니다.

---

## REST API로 로그인하기

### 요청

```bash
curl -X POST "https://api.bkend.ai/v1/auth/email/signin" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "password",
    "email": "user@example.com",
    "password": "MyP@ssw0rd!"
  }'
```

### 응답 (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

---

## 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `method` | string | ✅ | `password` (비밀번호 방식) |
| `email` | string | ✅ | 사용자 이메일 |
| `password` | string | ✅ | 비밀번호 |
| `mfaCode` | string | - | 2FA 코드 (6자리, 2FA 활성화 시 필수) |

---

## 2FA가 활성화된 경우

2FA가 활성화된 계정에서는 `mfaCode`를 함께 전송해야 합니다:

```bash
curl -X POST "https://api.bkend.ai/v1/auth/email/signin" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "password",
    "email": "user@example.com",
    "password": "MyP@ssw0rd!",
    "mfaCode": "123456"
  }'
```

---

## 에러 응답

| 에러 코드 | HTTP 상태 | 설명 |
|----------|----------|------|
| `auth/invalid-credentials` | 401 | 이메일/비밀번호 불일치 |
| `auth/user-not-found` | 404 | 계정이 존재하지 않음 |
| `auth/email-not-verified` | 403 | 이메일 인증이 완료되지 않음 |
| `auth/mfa-required` | 403 | 2FA 코드가 필요함 |
| `auth/invalid-mfa-code` | 401 | 유효하지 않은 2FA 코드 |
| `auth/too-many-login-attempts` | 429 | 로그인 시도 횟수 초과 |
| `auth/account-locked` | 403 | 계정이 잠김 |

---

## 관련 문서

- [이메일 회원가입](03-signup-email.md) — 회원가입 가이드
- [비밀번호 재설정](05-password-reset.md) — 비밀번호 분실 시
- [매직 링크](10-magic-link.md) — 비밀번호 없는 로그인
- [JWT 토큰](12-jwt-tokens.md) — 토큰 구조
