# 5분 만에 시작하기

{% hint style="info" %}
💡 블로그 프로젝트의 핵심 기능을 빠르게 체험합니다. 테이블을 만들고, 첫 게시글을 작성하고, 확인하는 과정을 5분 안에 완료하세요.
{% endhint %}

## 사전 준비

| 항목 | 설명 |
|------|------|
| bkend 프로젝트 | 콘솔에서 프로젝트 생성 완료 |
| API Key | 콘솔 → **API 키**에서 발급 |

***

## 1단계: articles 테이블 만들기

게시글을 저장할 동적 테이블을 생성합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"블로그 글을 저장하고 싶어요. 제목, 본문, 공개 여부를 관리할 수 있게 해주세요. 만들기 전에 어떤 구조로 만들지 먼저 보여주세요."
{% endhint %}

{% hint style="info" %}
💡 AI가 아래와 비슷한 구조를 제안하는지 확인하세요.

| 필드 | 설명 | 예시 값 |
|------|------|---------|
| title | 게시글 제목 | "나의 첫 블로그" |
| content | 본문 내용 | "안녕하세요..." |
| isPublished | 공개 여부 | `true` / `false` |
{% endhint %}

AI가 테이블 생성 도구를 호출하여 articles 테이블을 만듭니다.

{% endtab %}
{% tab title="콘솔" %}

1. 콘솔에 로그인하세요.
2. 좌측 메뉴에서 **데이터베이스**를 클릭하세요.
3. **테이블 생성** 버튼을 클릭하세요.
4. 테이블 이름에 `articles`를 입력하세요.
5. 다음 필드를 추가하세요:

| 필드명 | 타입 | 필수 | 비고 |
|--------|------|:----:|------|
| `title` | String | ✅ | 게시글 제목 |
| `content` | String | ✅ | 본문 내용 |
| `isPublished` | Boolean | - | 기본값: `false` |

6. **생성**을 클릭하세요.

{% endtab %}
{% endtabs %}

***

## 2단계: 첫 게시글 작성하기

articles 테이블에 데이터를 추가합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"블로그에 새 글을 작성해주세요. 제목은 '나의 첫 블로그', 내용은 'bkend로 만든 블로그입니다'로 하고, 바로 공개해주세요."
{% endhint %}

AI가 데이터 생성 도구를 호출하여 게시글을 추가합니다.

{% endtab %}
{% tab title="콘솔 + REST API" %}

### curl

```bash
curl -X POST https://api-client.bkend.ai/v1/data/articles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "나의 첫 블로그",
    "content": "bkend로 만든 블로그입니다.",
    "isPublished": true
  }'
```

### bkendFetch

```javascript
import { bkendFetch } from './bkend.js';

const article = await bkendFetch('/v1/data/articles', {
  method: 'POST',
  body: {
    title: '나의 첫 블로그',
    content: 'bkend로 만든 블로그입니다.',
    isPublished: true,
  },
});

console.log(article);
// { id: "...", title: "나의 첫 블로그", ... }
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../../getting-started/06-app-integration.md)를 참고하세요.
{% endhint %}

{% endtab %}
{% endtabs %}

### 성공 응답

```json
{
  "id": "683a1b2c...",
  "title": "나의 첫 블로그",
  "content": "bkend로 만든 블로그입니다.",
  "isPublished": true,
  "createdBy": "user_abc123",
  "createdAt": "2026-02-08T10:00:00Z",
  "updatedAt": "2026-02-08T10:00:00Z"
}
```

***

## 3단계: 게시글 확인하기

작성한 게시글을 조회합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"블로그에 작성된 글 목록을 보여주세요"
{% endhint %}

AI가 데이터 조회 도구를 호출하여 게시글 목록을 반환합니다.

{% endtab %}
{% tab title="콘솔 + REST API" %}

### curl

```bash
curl -X GET https://api-client.bkend.ai/v1/data/articles \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### bkendFetch

```javascript
const articles = await bkendFetch('/v1/data/articles');

console.log(articles);
// { items: [{ id: "...", title: "나의 첫 블로그", ... }], total: 1, ... }
```

{% endtab %}
{% endtabs %}

{% hint style="success" %}
✅ 게시글이 정상적으로 조회되면 기본 설정이 완료된 것입니다.
{% endhint %}

***

## 다음 단계

전체 가이드를 따라 완전한 블로그를 구축하세요:

- [프로젝트 개요](full-guide/00-overview.md) — 전체 구조와 테이블 설계 이해
- [인증 설정](full-guide/01-auth.md) — 회원가입/로그인 구현
- [게시글 CRUD](full-guide/02-articles.md) — 게시글 작성, 수정, 삭제 상세

***

## 참고 문서

- [앱에서 bkend 연동하기](../../getting-started/06-app-integration.md) — bkendFetch 헬퍼 설정
- [데이터 입력](../../database/03-insert.md) — 동적 테이블 데이터 생성
- [데이터 조회](../../database/04-select.md) — 단건 조회
- [blog-web 예제 프로젝트](../../../examples/blog-web/) — 이 쿡북을 Next.js로 구현한 전체 코드
