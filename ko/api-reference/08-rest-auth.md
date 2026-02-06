# REST Auth 엔드포인트

> 서비스 API의 Authentication 엔드포인트 레퍼런스입니다.

## 이메일 인증

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| POST | `/v1/auth/email/signup` | - | 이메일 회원가입 |
| POST | `/v1/auth/email/signin` | - | 이메일 로그인 |

### 회원가입

```bash
curl -X POST "https://api.bkend.ai/v1/auth/email/signup" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "password",
    "email": "user@example.com",
    "password": "MyP@ssw0rd!",
    "name": "홍길동"
  }'
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `method` | string | ✅ | `password` 또는 `magiclink` |
| `email` | string | ✅ | 이메일 주소 |
| `password` | string | ✅ | 비밀번호 (`password` 방식) |
| `name` | string | ✅ | 사용자 이름 |
| `callbackUrl` | string | - | 매직 링크 콜백 URL (`magiclink` 방식) |

### 로그인

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

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `method` | string | ✅ | `password` |
| `email` | string | ✅ | 이메일 주소 |
| `password` | string | ✅ | 비밀번호 |
| `mfaCode` | string | - | 2FA 코드 (6자리, 활성화 시 필수) |

**응답** (회원가입/로그인 공통):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

---

## 소셜 로그인

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/v1/auth/{provider}/authorize` | - | 인증 URL 요청 |
| POST | `/v1/auth/{provider}/callback` | - | 콜백 처리 (API 방식) |
| GET | `/v1/auth/{provider}/callback` | - | 콜백 처리 (리다이렉트 방식) |

지원 제공자: `google`, `github`

---

## 토큰 관리

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/v1/auth/me` | ✅ | 현재 사용자 조회 |
| POST | `/v1/auth/refresh` | - | 토큰 갱신 |
| POST | `/v1/auth/signout` | ✅ | 로그아웃 |

### 토큰 갱신

```bash
curl -X POST "https://api.bkend.ai/v1/auth/refresh" \
  -H "x-project-id: {project_id}" \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "{refresh_token}" }'
```

---

## 비밀번호 관리

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| POST | `/v1/auth/password/reset/request` | - | 재설정 요청 |
| POST | `/v1/auth/password/reset/confirm` | - | 재설정 확인 |
| POST | `/v1/auth/password/change` | ✅ | 비밀번호 변경 |

---

## 세션 관리

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/v1/auth/sessions` | ✅ | 세션 목록 조회 |
| DELETE | `/v1/auth/sessions/{sessionId}` | ✅ | 세션 삭제 |

---

## 이메일 인증

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| POST | `/v1/auth/email/verify/send` | - | 인증 이메일 발송 |
| POST | `/v1/auth/email/verify/confirm` | - | 인증 확인 |
| POST | `/v1/auth/email/verify/resend` | - | 인증 이메일 재발송 |

---

## 계정 관리

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/v1/auth/accounts` | ✅ | 연동 계정 목록 |
| POST | `/v1/auth/accounts` | ✅ | 소셜 계정 연동 |
| DELETE | `/v1/auth/accounts/{provider}` | ✅ | 계정 연동 해제 |
| POST | `/v1/auth/accounts/check` | - | 계정 존재 확인 |
| DELETE | `/v1/auth/withdraw` | ✅ | 계정 삭제 (탈퇴) |

---

## 관련 문서

- [REST API 개요](06-rest-overview.md) — 공통 규칙
- [이메일 로그인](../authentication/04-login-email.md) — 로그인 가이드
- [소셜 로그인 개요](../authentication/07-social-overview.md) — 소셜 로그인 가이드
- [에러 코드](10-error-codes.md) — 에러 코드 레퍼런스
