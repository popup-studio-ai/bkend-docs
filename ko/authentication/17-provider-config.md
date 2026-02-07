# 인증 제공자 설정

{% hint style="info" %}
💡 이메일 인증 정책과 OAuth 제공자(Google, GitHub)를 프로젝트별로 설정하세요.
{% endhint %}

## 개요

인증 제공자 설정은 프로젝트의 인증 방식을 관리하는 기능입니다. 비밀번호 정책, 매직 링크 활성화 여부, OAuth 제공자별 Client ID/Secret 등을 설정할 수 있습니다.

***

## 전체 설정 조회

### GET /v1/auth/providers

모든 인증 제공자의 설정을 한 번에 조회합니다.

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## 이메일 인증 설정

### GET /v1/auth/providers/email

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers/email \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

**응답:**

```json
{
  "provider": "email",
  "passwordPolicy": {
    "minLength": 8,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true
  },
  "magicLinkEnabled": true,
  "magicLinkExpirationMinutes": 15
}
```

### PUT /v1/auth/providers/email

이메일 인증 설정을 수정합니다.

```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/providers/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "passwordPolicy": {
      "minLength": 10,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true
    },
    "magicLinkEnabled": true,
    "magicLinkExpirationMinutes": 30
  }'
```

### 비밀번호 정책 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `minLength` | `number` | 최소 비밀번호 길이 |
| `requireUppercase` | `boolean` | 대문자 필수 |
| `requireLowercase` | `boolean` | 소문자 필수 |
| `requireNumbers` | `boolean` | 숫자 필수 |
| `requireSpecialChars` | `boolean` | 특수문자 필수 |
| `expirationDays` | `number` | 비밀번호 만료 기간 (일, 선택) |

### 매직 링크 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `magicLinkEnabled` | `boolean` | 매직 링크 활성화 여부 |
| `magicLinkExpirationMinutes` | `number` | 링크 만료 시간 (분) |

***

## OAuth 제공자 설정

### OAuth 설정 목록 조회

#### GET /v1/auth/providers/oauth

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers/oauth \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### 개별 OAuth 제공자 조회

#### GET /v1/auth/providers/oauth/:provider

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/providers/oauth/google \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

**응답:**

```json
{
  "provider": "google",
  "clientId": "123456789.apps.googleusercontent.com",
  "redirectUri": "https://api-client.bkend.ai/v1/auth/google/callback",
  "scopes": ["openid", "email", "profile"],
  "enabled": true
}
```

{% hint style="info" %}
💡 보안을 위해 `clientSecret`은 응답에 포함되지 않습니다.
{% endhint %}

### OAuth 제공자 설정 수정

#### PUT /v1/auth/providers/oauth/:provider

{% tabs %}
{% tab title="Google" %}
```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/providers/oauth/google \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "clientId": "{google_client_id}",
    "clientSecret": "{google_client_secret}",
    "redirectUri": "https://api-client.bkend.ai/v1/auth/google/callback",
    "scopes": ["openid", "email", "profile"],
    "enabled": true
  }'
```
{% endtab %}
{% tab title="GitHub" %}
```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/providers/oauth/github \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "clientId": "{github_client_id}",
    "clientSecret": "{github_client_secret}",
    "redirectUri": "https://api-client.bkend.ai/v1/auth/github/callback",
    "scopes": ["user:email"],
    "enabled": true
  }'
```
{% endtab %}
{% endtabs %}

### OAuth 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `clientId` | `string` | ✅ | OAuth Client ID |
| `clientSecret` | `string` | ✅ | OAuth Client Secret (암호화 저장) |
| `redirectUri` | `string` | ✅ | 콜백 URL |
| `scopes` | `string[]` | ✅ | 요청 권한 범위 |
| `enabled` | `boolean` | ✅ | 활성화 여부 |

### OAuth 제공자 삭제

#### DELETE /v1/auth/providers/oauth/:provider

```bash
curl -X DELETE https://api-client.bkend.ai/v1/auth/providers/oauth/github \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## 콘솔에서 설정하기

콘솔에서도 인증 제공자를 설정할 수 있습니다. 프로젝트의 **Authentication** 설정에서 각 제공자를 활성화하고 키를 입력하세요.

<!-- 📸 IMG: 인증 제공자 설정 화면 -->
![인증 제공자 설정](../.gitbook/assets/2026-02/console-auth-providers.png)

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/unauthorized` | 401 | 인증이 필요함 |
| `auth/unsupported-provider` | 400 | 지원하지 않는 제공자 |
| `auth/oauth-not-configured` | 400 | OAuth 설정이 완료되지 않음 |

***

## 다음 단계

- [Google OAuth](06-social-google.md) — Google 로그인 구현
- [GitHub OAuth](07-social-github.md) — GitHub 로그인 구현
- [이메일 템플릿](18-email-templates.md) — 인증 이메일 커스터마이징
