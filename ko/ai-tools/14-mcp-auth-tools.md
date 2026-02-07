# Auth & User MCP 도구

{% hint style="info" %}
💡 인증 및 사용자 관련 MCP 도구와 REST API 활용 방법을 확인합니다.
{% endhint %}

## 개요

현재 bkend MCP는 **Database 관리** 및 **데이터 CRUD**에 초점을 맞추고 있습니다. 인증(Auth) 및 사용자(User) 관리는 서비스 API(`https://api-client.bkend.ai`)를 통해 직접 구현합니다.

***

## AI 도구에서 인증 코드 생성하기

AI 도구에서 인증 관련 코드를 생성하도록 요청할 수 있습니다.

### 문서 도구 활용

MCP 문서 도구가 인증 구현 가이드를 제공합니다.

| 도구 | 설명 |
|------|------|
| `3_howto_implement_auth` | 인증 구현 API 레퍼런스 |
| `6_code_examples_auth` | 인증 코드 예시 (TypeScript/JavaScript) |

### 인증 코드 생성 예시

```
"bkend를 사용한 이메일 회원가입/로그인 코드를 TypeScript로 작성해줘"

"bkend의 Google OAuth 소셜 로그인을 React에서 구현하는 코드를 만들어줘"

"bkend의 JWT 토큰 갱신 로직을 포함한 API 클라이언트를 작성해줘"
```

{% hint style="info" %}
💡 AI 도구가 `3_howto_implement_auth`와 `6_code_examples_auth` 도구를 참고하여 정확한 인증 코드를 생성합니다.
{% endhint %}

***

## Auth REST API 요약

AI 도구가 코드를 생성할 때 참조하는 주요 인증 API입니다.

### 이메일 인증

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/v1/auth/email/signup` | 이메일 회원가입 |
| `POST` | `/v1/auth/email/signin` | 이메일 로그인 |
| `POST` | `/v1/auth/refresh` | 토큰 갱신 |
| `POST` | `/v1/auth/signout` | 로그아웃 |
| `GET` | `/v1/auth/me` | 내 정보 조회 |

### 소셜 로그인

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/v1/auth/:provider/authorize` | OAuth 인증 URL 생성 |
| `GET` | `/v1/auth/:provider/callback` | OAuth 콜백 (Redirect) |
| `POST` | `/v1/auth/:provider/callback` | OAuth 콜백 (API) |

### 사용자 관리

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/v1/users` | 사용자 목록 조회 |
| `GET` | `/v1/users/:userId` | 사용자 상세 조회 |
| `PATCH` | `/v1/users/:userId/profile` | 프로필 수정 |
| `PATCH` | `/v1/users/:userId/role` | 역할 변경 |

→ 상세는 [Auth & User REST API 레퍼런스](../authentication/19-api-reference.md)를 참고하세요.

***

## 다음 단계

- [Database MCP 도구](12-mcp-db-tools.md) — 테이블/데이터 관리 도구
- [Storage MCP 도구](13-mcp-storage-tools.md) — 스토리지 관련 도구
- [인증 시스템 개요](../authentication/01-overview.md) — 인증 전체 구조
