# 빠른 시작

{% hint style="info" %}
💡 10분 만에 bkend에서 프로젝트를 생성하고, 첫 데이터를 앱에서 조회해봅니다.
{% endhint %}

## 개요

이 가이드에서는 회원가입부터 첫 REST API 호출까지 전체 과정을 안내합니다.

***

## 전체 과정

```mermaid
flowchart LR
    A[1. 회원가입] --> B[2. 조직 생성]
    B --> C[3. 프로젝트 생성]
    C --> D[4. AI 도구 연결]
    D --> E[5. 테이블 생성]
    E --> F[6. API Key 발급]
    F --> G[7. 첫 API 호출]
```

***

## 사전 준비

- 웹 브라우저
- AI 도구 설치 (Claude Code, Cursor 등 하나 이상) — MCP 없이 REST API만 사용한다면 선택사항

***

## 1단계: 회원가입하기

1. [bkend 콘솔](https://console.bkend.ai)에 접속하세요.
2. **Google** 또는 **GitHub** 계정으로 로그인하세요. 매직 링크 로그인도 지원합니다.

{% hint style="success" %}
✅ 로그인하면 자동으로 콘솔 홈 화면으로 이동합니다.
{% endhint %}

***

## 2단계: 조직 생성하기

1. 콘솔에서 **조직 생성** 버튼을 클릭하세요.
2. 조직 이름을 입력하세요 (예: `My Startup`).
3. **생성**을 클릭하세요.

***

## 3단계: 프로젝트 생성하기

1. 조직 페이지에서 **프로젝트** 메뉴를 클릭하세요.
2. **프로젝트 생성** 버튼을 클릭하세요.
3. 다음 정보를 입력하세요.

| 필드 | 예시 | 설명 |
|------|------|------|
| **프로젝트 이름** | My Blog | 프로젝트 표시 이름 |
| **프로젝트 Slug** | my-blog | URL 식별자 (자동 생성 가능) |
| **리전** | Seoul (ap-northeast-2) | 데이터 저장 리전 |
| **클라우드** | AWS | 클라우드 제공자 |

4. **생성**을 클릭하세요.

{% hint style="warning" %}
⚠️ 프로젝트를 생성하면 `dev` 환경이 자동으로 프로비저닝됩니다. **Active** 상태가 될 때까지 약 30초를 기다리세요.
{% endhint %}

***

## 4단계: AI 도구 연결하기

{% tabs %}
{% tab title="Claude Code" %}
`~/.claude.json` 파일에 다음을 추가하세요.

```json
{
  "mcpServers": {
    "bkend": {
      "type": "http",
      "url": "https://api.bkend.ai/mcp"
    }
  }
}
```

Claude Code를 재시작하면 OAuth 2.1 인증 흐름이 자동으로 시작됩니다.
{% endtab %}
{% tab title="Cursor" %}
Cursor 설정에서 MCP 서버를 추가하세요.

```json
{
  "mcpServers": {
    "bkend": {
      "type": "http",
      "url": "https://api.bkend.ai/mcp"
    }
  }
}
```
{% endtab %}
{% endtabs %}

***

## 5단계: 첫 테이블 생성하기

AI 도구에서 다음과 같이 요청하세요.

```text
"posts 테이블을 만들어줘.
- title: 문자열 (필수)
- content: 문자열 (필수)
- author_name: 문자열
- published: 불리언 (기본값: false)"
```

콘솔의 **데이터베이스** 메뉴에서 생성된 테이블을 확인하세요.

{% hint style="info" %}
💡 테이블이 생성되었지만 앱에서 데이터를 넣으려면 **API Key**가 필요합니다. 6~7단계로 이어서 진행하세요.
{% endhint %}

***

## 6단계: API Key 발급하기

앱에서 REST API를 호출하려면 API Key가 필요합니다.

1. 사이드바에서 **액세스 토큰**을 클릭하세요.
2. **새 토큰 생성** 버튼을 클릭하세요.
3. 다음 정보를 입력하세요.

| 필드 | 값 |
|------|-----|
| **토큰 이름** | my-app-key |
| **토큰 타입** | BEARER_TOKEN |
| **권한 범위** | Table Data (read, create, update, delete) |

4. **생성**을 클릭하면 토큰이 표시됩니다. 이 값을 안전하게 복사해두세요.

{% hint style="warning" %}
⚠️ 이 토큰은 **Public Key**입니다. 클라이언트(브라우저, 앱)에서 사용하며, 제한된 권한만 가집니다. 서버 전용의 **Secret Key**와의 차이는 [Public Key vs Secret Key](../security/03-public-vs-secret.md)를 참고하세요.
{% endhint %}

{% hint style="danger" %}
🚨 **위험** — 토큰은 생성 시 한 번만 표시됩니다. 분실 시 재생성해야 합니다.
{% endhint %}

***

## 7단계: 첫 데이터 생성하기

발급받은 API Key로 앱에서 데이터를 생성합니다. 콘솔 **프로젝트 설정**에서 Project ID를 확인하세요.

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "title": "Hello bkend!",
    "content": "첫 번째 게시글입니다.",
    "published": true
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/data/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {accessToken}',
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
  body: JSON.stringify({
    title: 'Hello bkend!',
    content: '첫 번째 게시글입니다.',
    published: true,
  }),
});

const data = await response.json();
console.log(data.id); // 생성된 데이터 ID
```
{% endtab %}
{% endtabs %}

### 응답 예시

```json
{
  "id": "abc123",
  "title": "Hello bkend!",
  "content": "첫 번째 게시글입니다.",
  "published": true,
  "createdAt": "2026-02-12T00:00:00.000Z",
  "updatedAt": "2026-02-12T00:00:00.000Z"
}
```

콘솔의 **데이터베이스** → **posts** 테이블에서 생성된 데이터를 확인하세요.

{% hint style="success" %}
✅ 첫 번째 프로젝트가 준비되었고, REST API로 데이터를 생성했습니다!
{% endhint %}

***

## 보너스: 인증 연동하기

데이터 생성까지 성공했다면, 사용자 인증을 추가하여 "누가 만든 데이터인지" 관리할 수 있습니다.

### 8단계: 회원가입 API 호출

```javascript
const response = await fetch('https://api-client.bkend.ai/v1/auth/email/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
  body: JSON.stringify({
    method: 'password',
    email: 'user@example.com',
    password: 'MyP@ssw0rd!',
    name: '홍길동',
  }),
});

const { accessToken, refreshToken } = await response.json();
// 토큰을 안전하게 저장하세요
```

### 9단계: 인증된 데이터 생성

발급받은 `accessToken`으로 데이터를 생성하면 `createdBy` 필드에 사용자 ID가 자동 기록됩니다.

```javascript
const post = await fetch('https://api-client.bkend.ai/v1/data/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
  body: JSON.stringify({
    title: '인증된 게시글',
    content: '로그인한 사용자가 작성했습니다.',
    published: true,
  }),
});

const data = await post.json();
console.log(data.createdBy); // 사용자 ID
```

{% hint style="info" %}
💡 인증을 연동하면 RLS(Row Level Security)로 "본인이 만든 데이터만 수정/삭제 가능"과 같은 정책을 적용할 수 있습니다. → [RLS 정책 작성](../security/05-rls-policies.md)
{% endhint %}

***

## 에러가 발생했다면

| 에러 코드 | 원인 | 해결 |
|----------|------|------|
| `401 Unauthorized` | API Key가 잘못되었거나 누락됨 | `Authorization` 헤더 확인 |
| `404 Not Found` | 테이블이 존재하지 않음 | 콘솔에서 테이블 생성 여부 확인 |
| `400 Bad Request` | 필수 필드 누락 또는 타입 불일치 | 요청 body 확인 |
| `403 Forbidden` | 환경이 Active 상태가 아님 | 콘솔에서 환경 상태 확인 |

***

## 다음 단계

- [앱에서 bkend 연동하기](03-app-integration.md) — 앱에 bkend 연결하는 방법
- [핵심 개념](04-core-concepts.md) — Organization, Project, Environment 구조
- [콘솔 개요](../console/01-overview.md) — 콘솔 UI 둘러보기
- [AI 도구 연동 개요](../ai-tools/01-overview.md) — AI 도구 설정 상세 가이드
- [MCP 도구 개요](../mcp/01-overview.md) — MCP 도구 레퍼런스
- [테이블 관리](../console/07-table-management.md) — 콘솔에서 테이블 설계하기
- [실전 프로젝트 쿡북](../../cookbooks/README.md) — 블로그부터 쇼핑몰까지, 실전 앱 구축 튜토리얼
