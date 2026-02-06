# 유저 프로필 관리

> 로그인한 User의 프로필 정보를 조회하고 연동된 계정을 관리하는 방법을 안내합니다.

## 개요

로그인한 User는 자신의 프로필 정보를 조회할 수 있습니다. 프로필에는 이름, 이메일, 프로필 이미지, 연동된 소셜 계정 등의 정보가 포함됩니다.

---

## 프로필 조회하기

### 요청

```bash
curl -X GET "https://api.bkend.ai/v1/auth/me" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

### 응답 (200 OK)

```json
{
  "id": "user_abc123",
  "role": "user",
  "name": "홍길동",
  "nickname": "gildong",
  "email": "user@example.com",
  "emailVerified": "2024-01-01T00:00:00Z",
  "image": "https://example.com/avatar.jpg",
  "mobile": "+82-10-1234-5678",
  "gender": "male",
  "bio": "개발자입니다",
  "socialLinks": {
    "github": "https://github.com/gildong"
  },
  "preferences": {
    "theme": "dark",
    "language": "ko"
  },
  "accounts": [
    {
      "provider": "google",
      "providerAccountId": "123456789"
    }
  ],
  "lastLoginAt": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 프로필 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 사용자 ID |
| `role` | string | 시스템 역할 |
| `name` | string | 이름 |
| `nickname` | string | 닉네임 |
| `email` | string | 이메일 주소 |
| `emailVerified` | string | 이메일 인증 시점 (미인증 시 `null`) |
| `image` | string | 프로필 이미지 URL |
| `mobile` | string | 휴대폰 번호 |
| `gender` | string | 성별 (`none`, `male`, `female`, `etc`) |
| `bio` | string | 자기소개 |
| `socialLinks` | object | 소셜 미디어 링크 |
| `preferences` | object | 사용자 환경설정 |
| `accounts` | array | 연동된 소셜 계정 목록 |
| `lastLoginAt` | string | 마지막 로그인 시점 |

---

## 소셜 계정 연동하기

기존 계정에 소셜 계정을 추가로 연동할 수 있습니다.

### 요청

```bash
curl -X POST "https://api.bkend.ai/v1/auth/accounts" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "code": "{authorization_code}",
    "redirectUri": "https://myapp.com/callback"
  }'
```

### 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `provider` | string | ✅ | OAuth 제공자 (`google`, `github`) |
| `code` | string | - | Authorization Code (웹 방식) |
| `idToken` | string | - | ID Token (모바일 방식) |
| `redirectUri` | string | - | Code 교환에 사용한 리다이렉트 URI |

### 응답 (201 Created)

```json
{}
```

---

## 연동 계정 목록 조회하기

### 요청

```bash
curl -X GET "https://api.bkend.ai/v1/auth/accounts" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

### 응답 (200 OK)

```json
{
  "items": [
    {
      "id": "account_abc123",
      "userId": "user_xyz789",
      "type": "credentials",
      "provider": "email",
      "providerAccountId": "user@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "account_def456",
      "userId": "user_xyz789",
      "type": "oauth",
      "provider": "google",
      "providerAccountId": "123456789",
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10
  }
}
```

---

## 계정 연동 해제하기

### 요청

```bash
curl -X DELETE "https://api.bkend.ai/v1/auth/accounts/{provider}" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

### 응답 (200 OK)

```json
{}
```

> ⚠️ **주의** - 마지막 로그인 수단을 해제하면 로그인할 수 없게 됩니다.

---

## 계정 존재 여부 확인하기

특정 이메일이나 소셜 계정의 가입 여부를 확인할 수 있습니다.

### 요청

```bash
curl -X POST "https://api.bkend.ai/v1/auth/accounts/check" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "credentials",
    "provider": "email",
    "providerAccountId": "user@example.com"
  }'
```

### 응답 (200 OK)

```json
{
  "exists": true,
  "type": "credentials",
  "provider": "email"
}
```

---

## 에러 응답

| 에러 코드 | HTTP 상태 | 설명 |
|----------|----------|------|
| `auth/unauthorized` | 401 | 인증되지 않은 요청 |
| `auth/account-already-linked` | 409 | 이미 연동된 계정 |
| `auth/account-exists-different-provider` | 409 | 다른 방식으로 가입된 이메일 |
| `auth/unsupported-provider` | 400 | 지원하지 않는 OAuth 제공자 |

---

## 관련 문서

- [소셜 로그인 개요](07-social-overview.md) — 소셜 로그인 가이드
- [이메일 인증](06-email-verification.md) — 이메일 인증
- [계정 삭제](16-account-deletion.md) — 계정 탈퇴
