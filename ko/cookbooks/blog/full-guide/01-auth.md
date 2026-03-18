# 인증 설정

{% hint style="info" %}
💡 블로그 앱에 이메일 회원가입과 로그인을 구현합니다. 인증을 완료하면 Access Token을 발급받아 게시글 CRUD 등 인증이 필요한 API를 호출할 수 있습니다.
{% endhint %}

## 개요

블로그 앱은 이메일 기반 인증을 사용합니다.

| 기능 | 설명 | 엔드포인트 |
|------|------|-----------|
| 회원가입 | 이메일 + 비밀번호로 계정 생성 | `POST /v1/auth/email/signup` |
| 로그인 | 이메일 + 비밀번호로 토큰 발급 | `POST /v1/auth/email/signin` |
| 토큰 갱신 | Refresh Token으로 새 Access Token 발급 | `POST /v1/auth/refresh` |
| 내 정보 확인 | 현재 로그인한 사용자 정보 조회 | `GET /v1/auth/me` |

***

## 인증 흐름

```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant API as bkend API

    rect rgb(240, 248, 255)
        Note over Client, API: 회원가입
        Client->>API: POST /v1/auth/email/signup
        API->>API: 비밀번호 정책 검증
        API->>API: User 생성 + JWT 발급
        API-->>Client: accessToken + refreshToken
    end

    rect rgb(245, 255, 245)
        Note over Client, API: 로그인
        Client->>API: POST /v1/auth/email/signin
        API->>API: 이메일/비밀번호 확인
        API->>API: JWT 발급
        API-->>Client: accessToken + refreshToken
    end

    rect rgb(255, 248, 240)
        Note over Client, API: 인증된 요청
        Client->>API: GET /v1/auth/me
        Note right of Client: Authorization: Bearer {accessToken}
        API-->>Client: 사용자 정보
    end
```

***

## 1단계: 회원가입

이메일과 비밀번호로 새 계정을 생성합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"블로그 앱의 이메일 회원가입과 로그인 코드를 만들어줘. bkendFetch 헬퍼를 사용해서 구현해줘."
{% endhint %}

{% hint style="info" %}
💡 회원가입과 로그인은 사용자가 앱에서 직접 수행하는 기능입니다. AI에게 코드 생성을 요청하고, 생성된 코드를 앱에 추가하세요. 구현 코드는 **콘솔 + REST API** 탭에서도 확인할 수 있습니다.
{% endhint %}

{% endtab %}
{% tab title="콘솔 + REST API" %}

### curl

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/signup \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "method": "password",
    "email": "blogger@example.com",
    "password": "abc123",
    "name": "홍길동"
  }'
```

### bkendFetch

```javascript
import { bkendFetch } from './bkend.js';

const result = await bkendFetch('/v1/auth/email/signup', {
  method: 'POST',
  body: {
    method: 'password',
    email: 'blogger@example.com',
    password: 'abc123',
    name: '홍길동',
  },
});

// 토큰 저장
localStorage.setItem('accessToken', result.accessToken);
localStorage.setItem('refreshToken', result.refreshToken);
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `method` | `string` | ✅ | `"password"` 고정 |
| `email` | `string` | ✅ | 사용자 이메일 주소 |
| `password` | `string` | ✅ | 비밀번호 (최소 6자) |
| `name` | `string` | ✅ | 사용자 이름 |

### 성공 응답

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

{% endtab %}
{% endtabs %}

***

## 2단계: 로그인

등록한 이메일과 비밀번호로 로그인하여 토큰을 발급받습니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"로그인 후 토큰을 localStorage에 저장하고, 401 에러 시 자동 갱신하는 코드를 만들어줘."
{% endhint %}

{% hint style="info" %}
💡 AI가 토큰 관리 로직이 포함된 완성 코드를 생성합니다. 생성된 코드의 상세 구현은 **콘솔 + REST API** 탭을 참고하세요.
{% endhint %}

{% endtab %}
{% tab title="콘솔 + REST API" %}

### curl

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/signin \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "method": "password",
    "email": "blogger@example.com",
    "password": "abc123"
  }'
```

### bkendFetch

```javascript
const result = await bkendFetch('/v1/auth/email/signin', {
  method: 'POST',
  body: {
    method: 'password',
    email: 'blogger@example.com',
    password: 'abc123',
  },
});

// 토큰 저장
localStorage.setItem('accessToken', result.accessToken);
localStorage.setItem('refreshToken', result.refreshToken);
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `method` | `string` | ✅ | `"password"` 고정 |
| `email` | `string` | ✅ | 등록된 이메일 주소 |
| `password` | `string` | ✅ | 비밀번호 |

### 성공 응답

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `accessToken` | `string` | JWT Access Token — API 인증에 사용 |
| `refreshToken` | `string` | JWT Refresh Token — Access Token 갱신에 사용 |
| `tokenType` | `string` | 토큰 타입 (`"Bearer"`) |
| `expiresIn` | `number` | Access Token 만료 시간 (초) |

{% endtab %}
{% endtabs %}

***

## 3단계: 토큰 저장

발급받은 토큰을 앱에서 관리합니다. `bkendFetch` 헬퍼가 자동으로 `Authorization` 헤더에 토큰을 포함합니다.

### 토큰 유효 시간

| 토큰 | 유효 시간 | 용도 |
|------|:---------:|------|
| Access Token | 1시간 | API 인증 |
| Refresh Token | 30일 | Access Token 갱신 |

### 토큰 갱신

Access Token이 만료되면 Refresh Token으로 새 토큰을 발급받으세요.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "refreshToken": "{refresh_token}"
  }'
```

```javascript
// bkendFetch 헬퍼는 401 응답 시 자동으로 토큰을 갱신합니다.
// 별도 처리 없이 bkendFetch를 사용하면 됩니다.
```

{% hint style="info" %}
💡 `bkendFetch` 헬퍼의 자동 토큰 갱신 로직은 [앱에서 bkend 연동하기](../../../getting-started/06-app-integration.md)에서 확인할 수 있습니다.
{% endhint %}

***

## 4단계: 인증 상태 확인

현재 로그인한 사용자 정보를 조회합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"현재 로그인한 사용자 정보를 표시하는 프로필 컴포넌트를 만들어줘. /v1/auth/me API를 사용해줘."
{% endhint %}

{% endtab %}
{% tab title="콘솔 + REST API" %}

### curl

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/me \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### bkendFetch

```javascript
const user = await bkendFetch('/v1/auth/me');

console.log(user);
// { id: "user_abc123", email: "blogger@example.com", name: "홍길동", ... }
```

### 성공 응답

```json
{
  "id": "user_abc123",
  "email": "blogger@example.com",
  "name": "홍길동",
  "emailVerified": false,
  "createdAt": "2026-02-08T10:00:00Z"
}
```

{% endtab %}
{% endtabs %}

{% hint style="success" %}
✅ `/v1/auth/me`에서 사용자 정보가 반환되면 인증 설정이 완료된 것입니다. 이제 게시글 CRUD를 구현할 준비가 되었습니다.
{% endhint %}

***

## 에러 처리

### 회원가입 에러

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/invalid-email` | 400 | 이메일 형식이 올바르지 않음 |
| `auth/invalid-password-format` | 400 | 비밀번호 정책 위반 (최소 6자) |
| `auth/email-already-exists` | 409 | 이미 등록된 이메일 |

### 로그인 에러

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/invalid-email` | 400 | 이메일 형식이 올바르지 않음 |
| `auth/invalid-credentials` | 401 | 이메일 또는 비밀번호 불일치 |
| `auth/account-banned` | 403 | 이용이 정지된 계정 |

### 토큰 에러

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/token-expired` | 401 | Access Token 만료 → 토큰 갱신 필요 |
| `auth/invalid-refresh-token` | 401 | Refresh Token 만료 → 재로그인 필요 |

***

## 참고 문서

- [이메일 회원가입](../../../authentication/02-email-signup.md) — 회원가입 상세
- [이메일 로그인](../../../authentication/03-email-signin.md) — 로그인 상세
- [토큰 관리](../../../authentication/20-token-management.md) — 토큰 저장 및 갱신 패턴

## 다음 단계

[게시글 CRUD](02-articles.md)에서 articles 테이블을 생성하고 게시글을 작성합니다.
