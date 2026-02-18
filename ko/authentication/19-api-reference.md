# Auth & User REST API 레퍼런스

{% hint style="info" %}
💡 인증 및 사용자 관련 모든 REST API 엔드포인트를 한눈에 확인하세요.
{% endhint %}

## 공통 사항

### Base URL

```text
https://api-client.bkend.ai
```

### 필수 헤더

| 헤더 | 필수 | 설명 |
|------|:----:|------|
| `X-API-Key` | ✅ | Publishable Key (`pk_` 접두사) |
| `Authorization` | 조건부 | `Bearer {accessToken}` — 인증 필요 엔드포인트 |
| `Content-Type` | 조건부 | `application/json` — 요청 본문 포함 시 |

### 응답 형식

모든 응답은 JSON 형식입니다. 에러 응답 구조:

```json
{
  "error": {
    "code": "auth/invalid-credentials",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

***

## 이메일 인증

### 회원가입

```http
POST /v1/auth/email/signup
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `method` | `string` | ✅ | `"password"` |
| `email` | `string` | ✅ | 이메일 주소 |
| `password` | `string` | ✅ | 비밀번호 (최소 8자, 대문자+소문자+숫자+특수문자) |
| `name` | `string` | ✅ | 사용자 이름 |

**응답:** `201 Created` — `{ accessToken, refreshToken, tokenType, expiresIn }`

→ [이메일 회원가입](02-email-signup.md)

### 로그인

```http
POST /v1/auth/email/signin
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `method` | `string` | ✅ | `"password"` |
| `email` | `string` | ✅ | 이메일 주소 |
| `password` | `string` | ✅ | 비밀번호 |
| `mfaCode` | `string` | - | 6자리 TOTP 코드 (MFA 활성화 시) |

**응답:** `200 OK` — `{ accessToken, refreshToken, tokenType, expiresIn }`

→ [이메일 로그인](03-email-signin.md)

### 매직 링크 회원가입

```http
POST /v1/auth/email/signup
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `method` | `string` | ✅ | `"magiclink"` |
| `email` | `string` | ✅ | 이메일 주소 |
| `callbackUrl` | `string` | ✅ | 인증 후 리다이렉트 URL |

**응답:** `201 Created` — `{ message, email }`

### 매직 링크 로그인

```http
POST /v1/auth/email/signin
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `method` | `string` | ✅ | `"magiclink"` |
| `email` | `string` | ✅ | 이메일 주소 |
| `callbackUrl` | `string` | ✅ | 인증 후 리다이렉트 URL |

**응답:** `200 OK` — `{ message, email }`

→ [매직 링크 인증](04-magic-link.md)

***

## 소셜 로그인 (OAuth)

### 콜백 처리

```http
GET /v1/auth/:provider/callback
POST /v1/auth/:provider/callback
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `code` | `string` | ✅ | OAuth 인가 코드 |
| `redirectUri` | `string` | ✅ | OAuth 인증 시 사용한 redirect URI |
| `state` | `string` | ✅ | CSRF 방지 상태값 |

**응답:** `200 OK` — `{ accessToken, refreshToken, tokenType, expiresIn }`

→ [소셜 로그인 개요](05-social-overview.md) · [Google](06-social-google.md) · [GitHub](07-social-github.md)

***

## 비밀번호 관리

### 재설정 요청

```http
POST /v1/auth/password/reset/request
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `email` | `string` | ✅ | 가입 이메일 |

**응답:** `200 OK` — `{ message }`

### 재설정 확인

```http
POST /v1/auth/password/reset/confirm
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `email` | `string` | ✅ | 이메일 주소 |
| `token` | `string` | ✅ | 재설정 토큰 |
| `newPassword` | `string` | ✅ | 새 비밀번호 |

**응답:** `200 OK` — `{ message }`

### 비밀번호 변경

```http
POST /v1/auth/password/change
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `currentPassword` | `string` | ✅ | 현재 비밀번호 |
| `newPassword` | `string` | ✅ | 새 비밀번호 |

**응답:** `200 OK` — `{ message }`

→ [비밀번호 관리](08-password-management.md)

***

## 이메일 인증

### 가입 인증 메일 재발송

```http
POST /v1/auth/signup/email/resend
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `email` | `string` | ✅ | 가입 이메일 |
| `callbackUrl` | `string` | - | 인증 후 리다이렉트 URL |

**응답:** `200 OK` — `{ message, email }`

### 가입 이메일 인증 확인

```http
GET /v1/auth/signup/email/confirm
```

| 쿼리 파라미터 | 타입 | 필수 | 설명 |
|-------------|------|:----:|------|
| `token` | `string` | ✅ | 인증 토큰 |
| `email` | `string` | ✅ | 이메일 주소 |
| `callbackUrl` | `string` | - | 리다이렉트 URL |

**응답:** `302 Redirect` 또는 `200 OK` — `callbackUrl` 제공 시 리다이렉트, 아닌 경우 JSON 반환

### 인증 메일 발송

```http
POST /v1/auth/email/verify/send
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `email` | `string` | ✅ | 인증할 이메일 |
| `callbackUrl` | `string` | - | 인증 후 리다이렉트 URL |

**응답:** `200 OK` — `{ message, email }`

### 인증 확인

```http
POST /v1/auth/email/verify/confirm
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `email` | `string` | ✅ | 이메일 주소 |
| `token` | `string` | ✅ | 인증 토큰 |

**응답:** `200 OK` — `{ message, verified }`

### 인증 메일 재발송

```http
POST /v1/auth/email/verify/resend
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `email` | `string` | ✅ | 인증할 이메일 |
| `callbackUrl` | `string` | - | 인증 후 리다이렉트 URL |

**응답:** `200 OK` — `{ message, email }`

→ [이메일 인증](09-email-verification.md)

***

## 세션 & 토큰

### 현재 사용자 조회

```http
GET /v1/auth/me
```

**인증 필요**

**응답:** `200 OK` — `{ id, email, name, role, ... }`

### 토큰 갱신

```http
POST /v1/auth/refresh
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `refreshToken` | `string` | ✅ | Refresh Token |

**응답:** `200 OK` — `{ accessToken, refreshToken }`

### 세션 목록 조회

```http
GET /v1/auth/sessions
```

**인증 필요**

**응답:** `200 OK` — `[ { id, device, ip, lastAccessedAt, ... } ]`

### 특정 세션 종료

```http
DELETE /v1/auth/sessions/:sessionId
```

**인증 필요**

**응답:** `200 OK` — `{ message }`

### 로그아웃

```http
POST /v1/auth/signout
```

**인증 필요**

**응답:** `200 OK` — `{ message }`

### 조직 전환

```http
POST /v1/auth/switch-organization
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `organizationId` | `string` | ✅ | 전환할 조직 ID |

**응답:** `200 OK` — `{ accessToken, refreshToken }`

→ [세션 관리](10-session-management.md)

***

## MFA (다중 인증)

### MFA 활성화 요청

```http
POST /v1/auth/mfa/enable
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `password` | `string` | ✅ | 현재 비밀번호 |

**응답:** `200 OK` — `{ secret, qrCodeUrl, backupCodes }`

### MFA 활성화 확인

```http
POST /v1/auth/mfa/confirm
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `code` | `string` | ✅ | TOTP 인증 코드 (6자리) |

**응답:** `200 OK` — `{ backupCodes }`

### MFA 비활성화

```http
POST /v1/auth/mfa/disable
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `password` | `string` | ✅ | 현재 비밀번호 (최소 8자) |
| `code` | `string` | - | 6자리 TOTP 코드 |

**응답:** `200 OK` — `{}`

→ [다중 인증 (MFA)](11-mfa.md)

***

## 소셜 계정 연동

### 계정 연동

```http
POST /v1/auth/accounts
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `provider` | `string` | ✅ | `"google"` 또는 `"github"` |
| `code` | `string` | - | OAuth 인가 코드 |
| `state` | `string` | - | OAuth state 토큰 |

**응답:** `201 Created` — `{}`

### 연동 계정 목록

```http
GET /v1/auth/accounts
```

**인증 필요**

**응답:** `200 OK` — `[ { provider, email, linkedAt } ]`

### 계정 연동 해제

```http
DELETE /v1/auth/accounts/:provider
```

**인증 필요**

**응답:** `200 OK` — `{ message }`

### 계정 연동 확인

```http
POST /v1/auth/accounts/check
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `type` | `string` | ✅ | `"credentials"` 또는 `"oauth"` |
| `provider` | `string` | ✅ | 제공자 이름 |
| `providerAccountId` | `string` | ✅ | 제공자별 고유 ID |

**응답:** `200 OK` — `{ exists, type?, provider? }`

→ [소셜 계정 연동](12-account-linking.md)

***

## 초대

### 초대 생성

```http
POST /v1/auth/invitations
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `resourceType` | `string` | ✅ | `"organization"` 또는 `"project"` |
| `resourceId` | `string` | ✅ | 조직 또는 프로젝트 ID |
| `resourceName` | `string` | ✅ | 리소스 이름 |
| `email` | `string` | ✅ | 초대 대상 이메일 |
| `name` | `string` | ✅ | 초대 대상 이름 |
| `resourceRole` | `string` | ✅ | 부여할 역할 |
| `inviterName` | `string` | - | 초대자 이름 |

**응답:** `201 Created` — `{ id, resourceType, resourceId, resourceName, status, expiresAt, ... }`

### 초대 목록 조회

```http
GET /v1/auth/invitations
```

**인증 필요**

| 쿼리 파라미터 | 타입 | 필수 | 설명 |
|-------------|------|:----:|------|
| `resourceType` | `string` | - | `"user"`, `"organization"`, `"project"` |
| `resourceId` | `string` | - | 리소스 ID 필터 |
| `status` | `string` | - | `pending`, `accepted`, `rejected`, `expired`, `revoked` |
| `page` | `number` | - | 페이지 번호 |
| `limit` | `number` | - | 페이지당 항목 수 |

**응답:** `200 OK` — `{ items: [...], pagination }`

### 초대 상세 조회

```http
GET /v1/auth/invitations/:invitationId
```

**인증 필요**

**응답:** `200 OK` — `{ id, resourceType, resourceId, resourceName, status, expiresAt, ... }`

### 초대 수락

```http
POST /v1/auth/invitations/accept
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `token` | `string` | ✅ | 초대 토큰 (SHA256 해시) |
| `email` | `string` | - | 이메일 주소 (추가 검증용) |

**응답:** `200 OK` — `{ id, resourceType, resourceId, status, ... }`

### 초대 거절

```http
POST /v1/auth/invitations/reject
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `token` | `string` | ✅ | 초대 토큰 |
| `email` | `string` | ✅ | 초대 대상 이메일 주소 |

**응답:** `200 OK` — `{}`

### 초대 취소

```http
DELETE /v1/auth/invitations/:invitationId
```

**인증 필요**

**응답:** `200 OK` — `{ message }`

→ [초대 시스템](13-invitation.md)

***

## 회원 탈퇴

```http
DELETE /v1/auth/withdraw
```

**인증 필요**

**응답:** `200 OK` — `{ message }`

→ [회원 탈퇴](16-account-deletion.md)

***

## 사용자 관리

### 사용자 목록 조회

```http
GET /v1/users
```

**인증 필요**

| 쿼리 파라미터 | 타입 | 설명 |
|-------------|------|------|
| `page` | `number` | 페이지 번호 (기본값: 1) |
| `limit` | `number` | 페이지당 항목 수 (1~100, 기본값: 20) |
| `search` | `string` | 이름/닉네임/이메일 검색 |
| `searchType` | `string` | `name`, `nickname`, `email` |
| `sortBy` | `string` | `createdAt`, `updatedAt`, `name`, `email`, `role` |
| `sortDirection` | `string` | `asc` 또는 `desc` |
| `includeAccounts` | `boolean` | 연동 계정 포함 |

**응답:** `200 OK` — `{ items: [...], pagination }`

### 사용자 생성

```http
POST /v1/users
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `name` | `string` | ✅ | 이름 |
| `email` | `string` | ✅ | 이메일 |
| `role` | `string` | - | `admin`, `user`, `guest` |

**응답:** `201 Created` — 생성된 사용자 객체

### 사용자 상세 조회

```http
GET /v1/users/:userId
```

**인증 필요**

**응답:** `200 OK` — 사용자 객체

### 사용자 수정

```http
PATCH /v1/users/:userId
```

**인증 필요**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `name` | `string` | 이름 |

**응답:** `200 OK` — 업데이트된 사용자 객체

### 사용자 삭제

```http
DELETE /v1/users/:userId
```

**인증 필요**

**응답:** `200 OK` — `{ message }`

### 역할 변경

```http
PATCH /v1/users/:userId/role
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `role` | `string` | ✅ | `admin`, `user`, `guest` |

**응답:** `200 OK` — 업데이트된 사용자 객체

→ [사용자 관리](15-user-management.md)

***

## 사용자 프로필

### 프로필 조회

```http
GET /v1/users/:userId/profile
```

**인증 필요**

**응답:** `200 OK` — `{ name, nickname, email, mobile, gender, bio, socialLinks }`

### 프로필 수정

```http
PATCH /v1/users/:userId/profile
```

**인증 필요**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `name` | `string` | 이름 (1~100자) |
| `nickname` | `string` \| `null` | 닉네임 (1~50자) |
| `mobile` | `string` \| `null` | 연락처 (E.164) |
| `gender` | `string` \| `null` | `none`, `male`, `female`, `etc` |
| `bio` | `string` \| `null` | 소개 (최대 500자) |
| `socialLinks` | `object` \| `null` | `{ github, twitter, linkedin }` |

**응답:** `200 OK` — 업데이트된 프로필 객체

→ [사용자 프로필](14-user-profile.md)

***

## 아바타

### 업로드 URL 생성

```http
POST /v1/users/:userId/avatar/upload-url
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `filename` | `string` | ✅ | 파일명 |
| `contentType` | `string` | ✅ | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |

**응답:** `200 OK` — `{ uploadUrl, key, expiresAt }`

### 아바타 저장

```http
PATCH /v1/users/:userId/avatar
```

**인증 필요**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `s3Key` | `string` | ✅ | 업로드된 파일 키 |

**응답:** `200 OK` — `{ image }`

### 아바타 삭제

```http
DELETE /v1/users/:userId/avatar
```

**인증 필요**

**응답:** `200 OK` — `{ message }`

→ [사용자 프로필 & 아바타](14-user-profile.md)

***

## 선호도 설정

### 선호도 조회

```http
GET /v1/users/:userId/preferences
```

**인증 필요**

**응답:** `200 OK` — `{ locale, timezone, theme }`

### 선호도 수정

```http
PATCH /v1/users/:userId/preferences
```

**인증 필요**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `locale` | `string` \| `null` | 언어 (`ko`, `en`, `ja`) |
| `timezone` | `string` \| `null` | 시간대 (IANA, 예: `Asia/Seoul`) |
| `theme` | `string` \| `null` | `light`, `dark`, `system` |

**응답:** `200 OK` — 업데이트된 선호도 객체

→ [사용자 관리](15-user-management.md)

***

## 알림 설정

### 알림 설정 조회

```http
GET /v1/users/:userId/notifications
```

**인증 필요**

**응답:** `200 OK` — `{ service, marketing, push, email, sms, nightTime, securityAlerts }`

### 알림 설정 수정

```http
PATCH /v1/users/:userId/notifications
```

**인증 필요**

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|:------:|------|
| `service` | `boolean` | `true` | 서비스 알림 |
| `marketing` | `boolean` | `false` | 마케팅 알림 |
| `push` | `boolean` | `true` | 푸시 알림 |
| `email` | `boolean` | `true` | 이메일 알림 |
| `sms` | `boolean` | `false` | SMS 알림 |
| `nightTime` | `boolean` | `false` | 야간 알림 |
| `securityAlerts` | `boolean` | `true` | 보안 알림 |

**응답:** `200 OK` — 업데이트된 알림 설정 객체

→ [사용자 관리](15-user-management.md)

***

## 온보딩

### 온보딩 상태 조회

```http
GET /v1/users/:userId/onboarding
```

**인증 필요**

**응답:** `200 OK` — 온보딩 상태 객체

### 온보딩 상태 수정

```http
PATCH /v1/users/:userId/onboarding
```

**인증 필요**

**응답:** `200 OK` — 업데이트된 온보딩 상태 객체

→ [사용자 관리](15-user-management.md)

***

## 공개 프로필 설정

### 공개 설정 조회

```http
GET /v1/users/:userId/public-settings
```

**인증 필요**

**응답:** `200 OK` — `{ slug, isPublic }`

### 공개 설정 수정

```http
PATCH /v1/users/:userId/public-settings
```

**인증 필요**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `slug` | `string` \| `null` | 공개 프로필 URL 슬러그 |
| `isPublic` | `boolean` | 프로필 공개 여부 |

**응답:** `200 OK` — 업데이트된 설정 객체

→ [사용자 관리](15-user-management.md)

***

## 에러 코드

### 인증 에러

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/invalid-credentials` | 401 | 이메일 또는 비밀번호 오류 |
| `auth/email-already-exists` | 409 | 이미 가입된 이메일 |
| `auth/email-not-verified` | 403 | 이메일 미인증 |
| `auth/unauthorized` | 401 | 인증이 필요함 |
| `auth/token-expired` | 401 | 토큰 만료 |
| `auth/invalid-token` | 401 | 유효하지 않은 토큰 |
| `auth/session-not-found` | 404 | 세션을 찾을 수 없음 |
| `auth/weak-password` | 400 | 비밀번호 정책 미충족 |
| `auth/mfa-required` | 403 | MFA 인증 필요 |
| `auth/mfa-already-enabled` | 409 | MFA 이미 활성화 |
| `auth/mfa-not-enabled` | 400 | MFA 미활성화 |
| `auth/invalid-mfa-code` | 401 | MFA 코드 오류 |
| `auth/account-already-linked` | 409 | 이미 연동된 계정 |
| `auth/last-auth-method` | 400 | 마지막 인증 수단 해제 불가 |
| `auth/invitation-not-found` | 404 | 초대를 찾을 수 없음 |
| `auth/invitation-expired` | 410 | 초대 만료 |
| `auth/invalid-refresh-token` | 401 | Refresh Token 불일치 또는 세션 없음 |
| `auth/session-expired` | 401 | 세션 만료 (7일) |
| `auth/invalid-password-format` | 400 | 비밀번호 형식 오류 (대문자, 소문자, 숫자, 특수문자 필수) |
| `auth/same-as-previous-password` | 400 | 새 비밀번호가 현재와 동일 |
| `auth/verification-token-not-found` | 404 | 재설정/인증 토큰을 찾을 수 없음 |
| `auth/verification-token-expired` | 401 | 재설정/인증 토큰 만료 (24시간) |
| `auth/too-many-requests` | 429 | 너무 많은 요청 |
| `auth/too-many-login-attempts` | 429 | 로그인 시도 횟수 초과 |
| `auth/too-many-code-requests` | 429 | 인증 코드 요청 횟수 초과 |
| `auth/unsupported-provider` | 400 | 지원하지 않는 제공자 |
| `auth/oauth-not-configured` | 400 | OAuth 미설정 |
| `auth/template-not-found` | 404 | 템플릿 없음 |

### 사용자 에러

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `user/not-found` | 404 | 사용자를 찾을 수 없음 |
| `user/unauthorized` | 401 | 인증이 필요함 |
| `user/forbidden` | 403 | 권한 없음 |
| `user/invalid-role` | 400 | 유효하지 않은 역할 |
| `user/invalid-name` | 400 | 이름이 유효하지 않음 |
| `user/invalid-nickname` | 400 | 닉네임이 유효하지 않음 |

***

## 엔드포인트 요약

### Auth 엔드포인트 (32)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| `POST` | `/v1/auth/email/signup` | - | 이메일 회원가입 |
| `POST` | `/v1/auth/email/signin` | - | 이메일 로그인 |
| `GET` | `/v1/auth/:provider/callback` | - | OAuth 콜백 (GET) |
| `POST` | `/v1/auth/:provider/callback` | - | OAuth 콜백 (POST) |
| `GET` | `/v1/auth/me` | ✅ | 현재 사용자 조회 |
| `POST` | `/v1/auth/refresh` | - | 토큰 갱신 |
| `POST` | `/v1/auth/signout` | ✅ | 로그아웃 |
| `DELETE` | `/v1/auth/withdraw` | ✅ | 회원 탈퇴 |
| `POST` | `/v1/auth/switch-organization` | ✅ | 조직 전환 |
| `POST` | `/v1/auth/password/reset/request` | - | 비밀번호 재설정 요청 |
| `POST` | `/v1/auth/password/reset/confirm` | - | 비밀번호 재설정 확인 |
| `POST` | `/v1/auth/password/change` | ✅ | 비밀번호 변경 |
| `GET` | `/v1/auth/sessions` | ✅ | 세션 목록 |
| `DELETE` | `/v1/auth/sessions/:sessionId` | ✅ | 세션 종료 |
| `POST` | `/v1/auth/mfa/enable` | ✅ | MFA 활성화 |
| `POST` | `/v1/auth/mfa/confirm` | ✅ | MFA 확인 |
| `POST` | `/v1/auth/mfa/disable` | ✅ | MFA 비활성화 |
| `POST` | `/v1/auth/accounts` | ✅ | 계정 연동 |
| `GET` | `/v1/auth/accounts` | ✅ | 연동 목록 |
| `DELETE` | `/v1/auth/accounts/:provider` | ✅ | 연동 해제 |
| `POST` | `/v1/auth/accounts/check` | - | 연동 확인 |
| `POST` | `/v1/auth/invitations` | ✅ | 초대 생성 |
| `GET` | `/v1/auth/invitations` | ✅ | 초대 목록 |
| `GET` | `/v1/auth/invitations/:invitationId` | ✅ | 초대 상세 |
| `POST` | `/v1/auth/invitations/accept` | - | 초대 수락 |
| `POST` | `/v1/auth/invitations/reject` | - | 초대 거절 |
| `DELETE` | `/v1/auth/invitations/:invitationId` | ✅ | 초대 취소 |
| `POST` | `/v1/auth/email/verify/send` | - | 인증 메일 발송 |
| `POST` | `/v1/auth/email/verify/confirm` | - | 인증 확인 |
| `POST` | `/v1/auth/email/verify/resend` | - | 인증 메일 재발송 |
| `POST` | `/v1/auth/signup/email/resend` | - | 가입 인증 재발송 |
| `GET` | `/v1/auth/signup/email/confirm` | - | 가입 인증 확인 |

### User 엔드포인트 (19)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| `GET` | `/v1/users` | ✅ | 사용자 목록 |
| `POST` | `/v1/users` | ✅ | 사용자 생성 |
| `GET` | `/v1/users/:userId` | ✅ | 사용자 상세 |
| `PATCH` | `/v1/users/:userId` | ✅ | 사용자 수정 |
| `DELETE` | `/v1/users/:userId` | ✅ | 사용자 삭제 |
| `PATCH` | `/v1/users/:userId/role` | ✅ | 역할 변경 |
| `GET` | `/v1/users/:userId/profile` | ✅ | 프로필 조회 |
| `PATCH` | `/v1/users/:userId/profile` | ✅ | 프로필 수정 |
| `POST` | `/v1/users/:userId/avatar/upload-url` | ✅ | 아바타 업로드 URL |
| `PATCH` | `/v1/users/:userId/avatar` | ✅ | 아바타 저장 |
| `DELETE` | `/v1/users/:userId/avatar` | ✅ | 아바타 삭제 |
| `GET` | `/v1/users/:userId/preferences` | ✅ | 선호도 조회 |
| `PATCH` | `/v1/users/:userId/preferences` | ✅ | 선호도 수정 |
| `GET` | `/v1/users/:userId/notifications` | ✅ | 알림 설정 조회 |
| `PATCH` | `/v1/users/:userId/notifications` | ✅ | 알림 설정 수정 |
| `GET` | `/v1/users/:userId/onboarding` | ✅ | 온보딩 조회 |
| `PATCH` | `/v1/users/:userId/onboarding` | ✅ | 온보딩 수정 |
| `GET` | `/v1/users/:userId/public-settings` | ✅ | 공개 설정 조회 |
| `PATCH` | `/v1/users/:userId/public-settings` | ✅ | 공개 설정 수정 |
