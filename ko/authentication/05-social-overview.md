# 소셜 로그인 개요

{% hint style="info" %}
💡 Google, GitHub 등 외부 OAuth 제공자를 통해 간편하게 로그인하세요.
{% endhint %}

## 개요

소셜 로그인은 OAuth 2.0 프로토콜을 기반으로 외부 인증 제공자(Google, GitHub)의 계정으로 로그인하는 방식입니다. User는 별도의 비밀번호 없이 기존 소셜 계정으로 빠르게 가입하고 로그인할 수 있습니다.

***

## 지원 제공자

| 제공자 | 프로토콜 | 설명 |
|--------|---------|------|
| **Google** | OAuth 2.0 + OpenID Connect | Google 계정 로그인 |
| **GitHub** | OAuth 2.0 | GitHub 계정 로그인 |

***

## OAuth 인증 흐름

```mermaid
sequenceDiagram
    participant User as User
    participant App as 앱
    participant API as API
    participant Provider as OAuth

    User->>App: 소셜 로그인 버튼 클릭
    App->>Provider: OAuth 인증 URL로 리다이렉트
    Provider->>User: 로그인 + 권한 동의
    Provider-->>App: code + state (콜백 URL)
    App->>API: POST /v1/auth/:provider/callback
    API->>Provider: code → 토큰 교환
    Provider-->>API: 사용자 정보
    API-->>App: accessToken + refreshToken
```

***

## 1단계: OAuth 제공자 URL로 리다이렉트

앱에서 직접 OAuth 제공자의 인증 URL을 구성하여 User를 리다이렉트합니다.

{% tabs %}
{% tab title="Google" %}
```javascript
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const params = new URLSearchParams({
  client_id: '{google_client_id}',
  redirect_uri: 'https://myapp.com/auth/callback',
  response_type: 'code',
  scope: 'openid email profile',
  state: crypto.randomUUID(),
});

window.location.href = `${GOOGLE_AUTH_URL}?${params}`;
```
{% endtab %}
{% tab title="GitHub" %}
```javascript
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const params = new URLSearchParams({
  client_id: '{github_client_id}',
  redirect_uri: 'https://myapp.com/auth/callback',
  scope: 'user:email',
  state: crypto.randomUUID(),
});

window.location.href = `${GITHUB_AUTH_URL}?${params}`;
```
{% endtab %}
{% endtabs %}

| 파라미터 | 설명 |
|---------|------|
| `client_id` | OAuth 제공자의 개발자 콘솔에서 발급받은 Client ID |
| `redirect_uri` | 인증 완료 후 리다이렉트될 콜백 URL |
| `response_type` | `code` 고정 (Authorization Code Flow) |
| `scope` | 요청할 권한 범위 |
| `state` | CSRF 공격 방지를 위한 랜덤 값 — 콜백에서 반드시 검증 |

{% hint style="info" %}
💡 `client_id`는 클라이언트(프론트엔드)에서 사용해도 안전합니다. `Client Secret`은 bkend 서버에 등록하며, 클라이언트에 노출하지 마세요.
{% endhint %}

***

## 2단계: 콜백 처리

OAuth 제공자에서 인증이 완료되면 authorization code와 함께 콜백 URL로 리다이렉트됩니다. 이 code를 bkend API에 전달하여 JWT 토큰을 발급받으세요.

### POST /v1/auth/:provider/callback

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/google/callback \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "code": "{authorization_code}",
    "redirectUri": "https://myapp.com/auth/callback",
    "state": "{state_value}"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
// 콜백 URL에서 code 추출
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

const response = await fetch('https://api-client.bkend.ai/v1/auth/google/callback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
  },
  body: JSON.stringify({
    code,
    redirectUri: window.location.origin + '/auth/callback',
    state,
  }),
});

const data = await response.json();
// data.accessToken, data.refreshToken, data.is_new_user
```
{% endtab %}
{% endtabs %}

#### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `code` | `string` | 조건부 | OAuth authorization code |
| `redirectUri` | `string` | ✅ | OAuth 인증 시 사용한 redirect URI |
| `idToken` | `string` | 조건부 | ID 토큰 (Google의 경우) |
| `accessToken` | `string` | - | OAuth access token |
| `state` | `string` | - | CSRF 방지용 state 값 |

{% hint style="info" %}
💡 `code` 또는 `idToken` 중 하나 이상을 전달해야 합니다.
{% endhint %}

#### 성공 응답

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "is_new_user": true
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `is_new_user` | `boolean` | `true`: 최초 로그인 (자동 회원가입), `false`: 기존 회원 |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/unsupported-provider` | 400 | 지원하지 않는 OAuth 제공자 |
| `auth/oauth-not-configured` | 400 | OAuth 설정이 완료되지 않음 |
| `auth/invalid-oauth-code` | 401 | authorization code가 유효하지 않음 |
| `auth/oauth-callback-failed` | 500 | OAuth 콜백 처리 실패 |

***

## OAuth 설정

소셜 로그인을 사용하려면 먼저 OAuth 제공자를 설정해야 합니다.

1. 각 제공자의 개발자 콘솔에서 OAuth 앱을 생성하세요.
2. `Client ID`와 `Client Secret`을 발급받으세요.
3. bkend에서 [인증 제공자 설정](17-provider-config.md)으로 등록하세요.

***

## 다음 단계

- [Google OAuth](06-social-google.md) — Google 로그인 설정 가이드
- [GitHub OAuth](07-social-github.md) — GitHub 로그인 설정 가이드
- [소셜 계정 연동](12-account-linking.md) — 기존 계정에 소셜 로그인 추가
