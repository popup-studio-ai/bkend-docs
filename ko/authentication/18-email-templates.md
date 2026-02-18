# 이메일 템플릿 커스터마이징

{% hint style="info" %}
💡 회원가입 인증, 비밀번호 재설정 등 인증 이메일의 디자인과 내용을 커스터마이징하세요.
{% endhint %}

## 개요

bkend는 인증 과정에서 발송되는 이메일의 템플릿을 프로젝트별로 커스터마이징할 수 있습니다. 발신자 이메일, 로고, 브랜드 색상, 이메일 본문을 자유롭게 설정하세요.

{% hint style="warning" %}
⚠️ 이메일 템플릿 설정은 관리 작업입니다. **콘솔** 또는 **MCP 도구**를 사용하여 관리하세요. 클라이언트 앱에서 직접 호출할 수 있는 API가 아닙니다.
{% endhint %}

***

## 전역 이메일 설정

모든 이메일 템플릿에 적용되는 발신자 정보, 로고, 브랜드 색상을 설정합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"현재 이메일 템플릿 설정을 보여줘."
{% endhint %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"이메일 발신자를 'hello@myapp.com', 발신자 이름을 'MyApp Team'으로 변경하고, 브랜드 색상을 #2563EB로 설정해줘. 커스텀 템플릿을 활성화해줘."
{% endhint %}

{% endtab %}
{% tab title="콘솔" %}

1. 콘솔에서 프로젝트로 이동하세요
2. **Authentication** > **Email Templates**로 이동하세요
3. **Settings** 탭에서 발신자 및 브랜딩을 설정하세요
4. **Save**를 클릭하세요

<!-- 📸 IMG: 이메일 템플릿 설정 -->
![이메일 템플릿 설정](../.gitbook/assets/2026-02/console-email-templates.png)

{% endtab %}
{% endtabs %}

### 설정 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `senderEmail` | `string` | 발신자 이메일 주소 |
| `senderName` | `string` | 발신자 이름 |
| `logoUrl` | `string` | 이메일 헤더 로고 URL |
| `brandColor` | `string` | 브랜드 색상 (HEX) |
| `overrideDefaults` | `boolean` | 기본 템플릿 대신 커스텀 사용 |

***

## 템플릿 카테고리

| 카테고리 | 설명 |
|---------|------|
| `signup_confirmation` | 회원가입 이메일 인증 |
| `password_reset` | 비밀번호 재설정 |
| `magic_link` | 매직 링크 로그인 |
| `email_verification` | 이메일 인증 |
| `invitation` | 초대 이메일 |

***

## 템플릿 편집

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"이메일 템플릿 목록을 보여줘."
{% endhint %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"비밀번호 재설정 이메일 템플릿을 수정해줘. 제목을 '[MyApp] 비밀번호를 재설정해주세요'로 변경하고, 본문에 브랜드 헤더를 추가해줘."
{% endhint %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**
"비밀번호 재설정 이메일 템플릿을 한국어로 미리보기해줘."
{% endhint %}

{% endtab %}
{% tab title="콘솔" %}

1. **Authentication** > **Email Templates**로 이동하세요
2. 편집할 템플릿을 선택하세요 (예: **비밀번호 재설정**)
3. **Subject**와 **Body** (HTML)를 수정하세요
4. **Preview** 버튼으로 확인하세요
5. **Save**를 클릭하세요

<!-- 📸 IMG: 이메일 템플릿 편집 -->
![이메일 템플릿 편집](../.gitbook/assets/2026-02/console-email-template-edit.png)

{% endtab %}
{% endtabs %}

### 템플릿 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `subject` | `string` | ✅ | 이메일 제목 |
| `body` | `string` | ✅ | 이메일 본문 (HTML) |

{% hint style="warning" %}
⚠️ 템플릿 변수(`{{userName}}` 등)를 잘못 입력하면 실제 발송 시 빈 값으로 렌더링됩니다. 미리보기를 통해 반드시 확인하세요.
{% endhint %}

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
