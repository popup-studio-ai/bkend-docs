# 이메일 템플릿 커스터마이징

{% hint style="info" %}
💡 회원가입 인증, 비밀번호 재설정 등 인증 이메일의 디자인과 내용을 커스터마이징하세요.
{% endhint %}

## 개요

bkend는 인증 과정에서 발송되는 이메일의 템플릿을 프로젝트별로 커스터마이징할 수 있습니다. 발신자 이메일, 로고, 브랜드 색상, 이메일 본문을 자유롭게 설정하세요.

***

## 이메일 템플릿 설정 조회

### GET /v1/auth/email-templates/config

전역 이메일 설정(발신자, 로고, 브랜드 색상)을 조회합니다.

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/email-templates/config \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```

**응답:**

```json
{
  "senderEmail": "noreply@myapp.com",
  "senderName": "MyApp",
  "logoUrl": "https://myapp.com/logo.png",
  "brandColor": "#4F46E5",
  "overrideDefaults": false
}
```

***

## 이메일 템플릿 설정 수정

### PUT /v1/auth/email-templates/config

```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/email-templates/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod" \
  -d '{
    "senderEmail": "hello@myapp.com",
    "senderName": "MyApp Team",
    "logoUrl": "https://myapp.com/logo.png",
    "brandColor": "#2563EB",
    "overrideDefaults": true
  }'
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `senderEmail` | `string` | 발신자 이메일 주소 |
| `senderName` | `string` | 발신자 이름 |
| `logoUrl` | `string` | 이메일 헤더 로고 URL |
| `brandColor` | `string` | 브랜드 색상 (HEX) |
| `overrideDefaults` | `boolean` | 기본 템플릿 대신 커스텀 사용 |

***

## 템플릿 목록 조회

### GET /v1/auth/email-templates

사용 가능한 이메일 템플릿 목록을 조회합니다.

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/email-templates \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```

**응답:**

```json
[
  {
    "id": "signup_confirmation",
    "name": "회원가입 인증",
    "category": "signup_confirmation",
    "subject": "[MyApp] 이메일 인증을 완료해주세요",
    "customized": false,
    "locale": "ko"
  },
  {
    "id": "password_reset",
    "name": "비밀번호 재설정",
    "category": "password_reset",
    "subject": "[MyApp] 비밀번호를 재설정하세요",
    "customized": true,
    "locale": "ko"
  }
]
```

### 템플릿 카테고리

| 카테고리 | 설명 |
|---------|------|
| `signup_confirmation` | 회원가입 이메일 인증 |
| `password_reset` | 비밀번호 재설정 |
| `magic_link` | 매직 링크 로그인 |
| `email_verification` | 이메일 인증 |
| `invitation` | 초대 이메일 |

***

## 개별 템플릿 조회

### GET /v1/auth/email-templates/:templateId

```bash
curl -X GET https://api-client.bkend.ai/v1/auth/email-templates/password_reset \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```

**응답:**

```json
{
  "id": "password_reset",
  "name": "비밀번호 재설정",
  "category": "password_reset",
  "subject": "[MyApp] 비밀번호를 재설정하세요",
  "body": "<html>...<a href=\"{{resetLink}}\">비밀번호 재설정</a>...</html>",
  "customized": true,
  "locale": "ko"
}
```

***

## 템플릿 수정

### PUT /v1/auth/email-templates/:templateId

```bash
curl -X PUT https://api-client.bkend.ai/v1/auth/email-templates/password_reset \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod" \
  -d '{
    "subject": "[MyApp] 비밀번호를 재설정해주세요",
    "body": "<html><body><h1>비밀번호 재설정</h1><p>아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p><a href=\"{{resetLink}}\">재설정하기</a></body></html>"
  }'
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `subject` | `string` | ✅ | 이메일 제목 |
| `body` | `string` | ✅ | 이메일 본문 (HTML) |

### 템플릿 변수

이메일 본문에서 사용할 수 있는 변수입니다.

| 변수 | 설명 |
|------|------|
| `{{userName}}` | 사용자 이름 |
| `{{userEmail}}` | 사용자 이메일 |
| `{{resetLink}}` | 비밀번호 재설정 링크 |
| `{{verifyLink}}` | 이메일 인증 링크 |
| `{{magicLink}}` | 매직 링크 |
| `{{inviterName}}` | 초대자 이름 |
| `{{resourceName}}` | 리소스(조직/프로젝트) 이름 |

***

## 템플릿 미리보기

### GET /v1/auth/email-templates/preview/:templateId

수정한 템플릿을 미리보기합니다.

```bash
curl -X GET "https://api-client.bkend.ai/v1/auth/email-templates/preview/password_reset?locale=ko" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```

**응답:**

```json
{
  "subject": "[MyApp] 비밀번호를 재설정해주세요",
  "htmlBody": "<html>...(렌더링된 HTML)...</html>",
  "textBody": "비밀번호를 재설정해주세요..."
}
```

***

## 콘솔에서 설정하기

콘솔에서도 이메일 템플릿을 관리할 수 있습니다.

<!-- 📸 IMG: 이메일 템플릿 목록 -->
![이메일 템플릿](../.gitbook/assets/2026-02/console-email-templates.png)

<!-- 📸 IMG: 이메일 템플릿 편집 -->
![이메일 템플릿 편집](../.gitbook/assets/2026-02/console-email-template-edit.png)

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `auth/unauthorized` | 401 | 인증이 필요함 |
| `auth/template-not-found` | 404 | 템플릿을 찾을 수 없음 |

***

## 다음 단계

- [인증 제공자 설정](17-provider-config.md) — 인증 방식 설정
- [이메일 인증](09-email-verification.md) — 이메일 인증 흐름
- [비밀번호 관리](08-password-management.md) — 비밀번호 재설정
