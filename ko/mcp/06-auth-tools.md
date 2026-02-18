# 인증 도구

{% hint style="info" %}
💡 AI 도구에서 인증(Auth) 기능을 구현하는 방법을 안내합니다. 인증은 MCP 도구가 아닌 REST API를 사용합니다.
{% endhint %}

## 개요

bkend MCP 서버에는 인증 전용 도구가 없습니다. 대신 AI 도구가 `search_docs`로 인증 문서를 검색하고, REST API 호출 코드를 자동으로 생성합니다.

```mermaid
flowchart LR
    A[AI에 인증 요청] --> B[search_docs로 문서 검색]
    B --> C[인증 가이드 문서 반환]
    C --> D[REST API 코드 생성]
```

***

## AI 도구에서 사용하기

AI 도구에 자연어로 요청하면 인증 코드를 생성합니다.

```text
"이메일 회원가입과 로그인 기능을 구현해줘"

"소셜 로그인(Google, GitHub)을 추가해줘"

"토큰 갱신 로직을 만들어줘"
```

***

## 주요 인증 REST API

AI 도구가 코드를 생성할 때 사용하는 주요 엔드포인트:

### 이메일 인증

| 엔드포인트 | 메서드 | 설명 |
|-----------|:------:|------|
| `/v1/auth/email/signup` | POST | 이메일 회원가입 |
| `/v1/auth/email/signin` | POST | 이메일 로그인 |
| `/v1/auth/email/verify/send` | POST | 이메일 인증 발송 |
| `/v1/auth/email/verify/confirm` | POST | 이메일 인증 확인 |
| `/v1/auth/email/verify/resend` | POST | 인증 이메일 재발송 |

### 소셜 인증 (OAuth)

| 엔드포인트 | 메서드 | 설명 |
|-----------|:------:|------|
| `/v1/auth/{provider}/callback` | GET | OAuth 콜백 처리 (리다이렉트) |
| `/v1/auth/{provider}/callback` | POST | OAuth 콜백 처리 (API 플로우) |

### 토큰 관리

| 엔드포인트 | 메서드 | 설명 |
|-----------|:------:|------|
| `/v1/auth/me` | GET | 내 정보 조회 |
| `/v1/auth/refresh` | POST | 토큰 갱신 |
| `/v1/auth/signout` | POST | 로그아웃 |

### 비밀번호 관리

| 엔드포인트 | 메서드 | 설명 |
|-----------|:------:|------|
| `/v1/auth/password/reset/request` | POST | 비밀번호 재설정 요청 |
| `/v1/auth/password/reset/confirm` | POST | 비밀번호 재설정 확인 |
| `/v1/auth/password/change` | POST | 비밀번호 변경 |

### 사용자 관리

| 엔드포인트 | 메서드 | 설명 |
|-----------|:------:|------|
| `/v1/users/{userId}` | GET | 사용자 정보 조회 |
| `/v1/users/{userId}` | PATCH | 사용자 정보 수정 |
| `/v1/users/{userId}/avatar/upload-url` | POST | 프로필 이미지 업로드 URL 생성 |

***

## 코드 생성 예시

AI 도구가 "이메일 로그인 기능을 만들어줘"라고 요청하면 다음과 같은 코드를 생성합니다:

{% tabs %}
{% tab title="TypeScript" %}
```typescript
const response = await fetch(
  "https://api-client.bkend.ai/v1/auth/email/signin",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": PUBLISHABLE_KEY,
    },
    body: JSON.stringify({
      email: "user@example.com",
      password: "password123",
      method: "password",
    }),
  }
);

const { accessToken, refreshToken } = await response.json();
```
{% endtab %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/signin \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "method": "password"
  }'
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
💡 모든 인증 API 호출에는 `X-API-Key` 헤더가 필요합니다. 인증 후 발급받은 JWT를 `Authorization: Bearer {accessToken}` 헤더로 전달하세요.
{% endhint %}

***

## 다음 단계

- [스토리지 도구](07-storage-tools.md) — 파일 업로드/다운로드 구현
- [데이터 도구](05-data-tools.md) — 데이터 CRUD 작업
- [인증 개요](../authentication/01-overview.md) — 인증 상세 가이드
