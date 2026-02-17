# Google OAuth

{% hint style="info" %}
💡 Google 계정으로 소셜 로그인을 구현하세요.
{% endhint %}

## 개요

Google OAuth는 OAuth 2.0 + OpenID Connect 프로토콜을 사용합니다. User는 Google 계정으로 회원가입과 로그인을 동시에 처리할 수 있습니다.

***

## 사전 준비

### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속하세요.
2. **API 및 서비스** > **사용자 인증 정보**로 이동하세요.
3. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID**를 선택하세요.
4. 애플리케이션 유형: **웹 애플리케이션**을 선택하세요.
5. **승인된 리다이렉션 URI**에 콜백 URL을 추가하세요.
6. `Client ID`와 `Client Secret`을 복사하세요.

{% hint style="warning" %}
⚠️ `Client Secret`은 절대 클라이언트 코드(프론트엔드)에 노출하지 마세요. 서버 측에서만 사용해야 합니다.
{% endhint %}

### bkend에 등록

발급받은 `Client ID`와 `Client Secret`을 bkend에 등록하세요. [인증 제공자 설정](17-provider-config.md)에서 설정할 수 있습니다.

***

## Google 로그인 구현

### 1단계: Google 인증 URL로 리다이렉트

앱에서 Google OAuth 인증 URL을 구성하여 User를 직접 리다이렉트합니다.

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

{% hint style="info" %}
💡 `client_id`는 Google Cloud Console에서 발급받은 OAuth 클라이언트 ID입니다. `state`는 CSRF 공격 방지를 위한 랜덤 값으로, 콜백에서 반드시 검증하세요.
{% endhint %}

### 2단계: 콜백에서 토큰 발급

Google 인증 완료 후 콜백 URL로 리다이렉트됩니다.

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
// 콜백 페이지에서 실행
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

const { accessToken, refreshToken, is_new_user } = await response.json();

if (is_new_user) {
  // 신규 가입 → 온보딩 페이지로
} else {
  // 기존 회원 → 메인 페이지로
}
```
{% endtab %}
{% endtabs %}

***

## Google에서 제공하는 사용자 정보

Google OAuth로 가입 시 다음 정보가 자동으로 User 프로필에 저장됩니다.

| 필드 | Google Scope | 설명 |
|------|-------------|------|
| `email` | `email` | 이메일 주소 |
| `name` | `profile` | 이름 |
| `image` | `profile` | 프로필 사진 URL |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/oauth-not-configured` | 400 | Google OAuth 설정이 완료되지 않음 |
| `auth/invalid-oauth-code` | 401 | authorization code가 유효하지 않음 |
| `auth/oauth-callback-failed` | 500 | 콜백 처리 중 오류 발생 |

***

## 다음 단계

- [GitHub OAuth](07-social-github.md) — GitHub 로그인 설정
- [소셜 계정 연동](12-account-linking.md) — 기존 계정에 Google 연결
- [인증 제공자 설정](17-provider-config.md) — OAuth 설정 변경

## 참조 표준

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [OpenID Connect](https://openid.net/connect/)
