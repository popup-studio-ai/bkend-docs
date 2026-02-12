# GitHub OAuth

{% hint style="info" %}
💡 GitHub 계정으로 소셜 로그인을 구현하세요.
{% endhint %}

## 개요

GitHub OAuth는 OAuth 2.0 프로토콜을 사용합니다. 개발자 중심 서비스에서 GitHub 계정 기반 인증을 간편하게 구현할 수 있습니다.

***

## 사전 준비

### GitHub OAuth App 생성

1. [GitHub Developer Settings](https://github.com/settings/developers)에 접속하세요.
2. **OAuth Apps** > **New OAuth App**을 클릭하세요.
3. 다음 정보를 입력하세요.

| 필드 | 설명 |
|------|------|
| **Application name** | 앱 이름 |
| **Homepage URL** | 앱 홈페이지 URL |
| **Authorization callback URL** | 콜백 URL |

4. **Register application**을 클릭하세요.
5. `Client ID`를 복사하고, **Generate a new client secret**으로 `Client Secret`을 생성하세요.

{% hint style="warning" %}
⚠️ `Client Secret`은 생성 직후에만 확인할 수 있습니다. 안전한 곳에 저장하세요.
{% endhint %}

### bkend에 등록

발급받은 `Client ID`와 `Client Secret`을 bkend에 등록하세요. [인증 제공자 설정](17-provider-config.md)에서 설정할 수 있습니다.

***

## GitHub 로그인 구현

### 1단계: GitHub 인증 URL로 리다이렉트

앱에서 GitHub OAuth 인증 URL을 구성하여 User를 직접 리다이렉트합니다.

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

{% hint style="info" %}
💡 `client_id`는 GitHub Developer Settings에서 발급받은 OAuth App의 Client ID입니다. `state`는 CSRF 공격 방지를 위한 랜덤 값으로, 콜백에서 반드시 검증하세요.
{% endhint %}

### 2단계: 콜백에서 토큰 발급

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/auth/github/callback \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "code": "{authorization_code}",
    "redirectUri": "https://myapp.com/auth/callback",
    "state": "{state_value}"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

const response = await fetch('https://api-client.bkend.ai/v1/auth/github/callback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
  body: JSON.stringify({
    code,
    redirectUri: window.location.origin + '/auth/callback',
    state,
  }),
});

const { accessToken, refreshToken, is_new_user } = await response.json();
```
{% endtab %}
{% endtabs %}

### 성공 응답

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "is_new_user": false
}
```

***

## GitHub에서 제공하는 사용자 정보

| 필드 | GitHub Scope | 설명 |
|------|-------------|------|
| `email` | `user:email` | 이메일 주소 |
| `name` | `user` | 이름 (display name) |
| `image` | `user` | 프로필 사진 URL (avatar_url) |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/oauth-not-configured` | 400 | GitHub OAuth 설정이 완료되지 않음 |
| `auth/invalid-oauth-code` | 401 | authorization code가 유효하지 않음 |
| `auth/oauth-callback-failed` | 500 | 콜백 처리 중 오류 발생 |

***

## 다음 단계

- [Google OAuth](06-social-google.md) — Google 로그인 설정
- [소셜 계정 연동](12-account-linking.md) — 기존 계정에 GitHub 연결
- [인증 제공자 설정](17-provider-config.md) — OAuth 설정 변경

## 참조 표준

- [GitHub OAuth 문서](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
