# 데이터 생성

{% hint style="info" %}
💡 테이블에 새 데이터를 추가하세요.
{% endhint %}

## 개요

`POST /v1/data/:tableName` 엔드포인트로 테이블에 새 데이터를 생성합니다. 요청 본문에 필드를 직접 포함하면 됩니다.

***

## 데이터 생성

### POST /v1/data/:tableName

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "title": "첫 번째 게시글",
    "content": "안녕하세요, bkend입니다.",
    "category": "notice",
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
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
  body: JSON.stringify({
    title: '첫 번째 게시글',
    content: '안녕하세요, bkend입니다.',
    category: 'notice',
    published: true,
  }),
});

const data = await response.json();
console.log(data.id); // 생성된 데이터 ID
```
{% endtab %}
{% endtabs %}

### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `tableName` | `string` | ✅ | 테이블 이름 |

### 요청 본문

테이블 스키마에 정의된 필드를 직접 포함합니다. 별도의 wrapper 없이 최상위에 필드를 전달하세요.

```json
{
  "title": "첫 번째 게시글",
  "content": "안녕하세요, bkend입니다.",
  "category": "notice",
  "published": true
}
```

{% hint style="warning" %}
⚠️ 시스템 필드(`id`, `createdBy`, `createdAt`, `updatedAt`)는 자동으로 설정됩니다. 요청에 포함하지 마세요.
{% endhint %}

### 응답 (201 Created)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "첫 번째 게시글",
  "content": "안녕하세요, bkend입니다.",
  "category": "notice",
  "published": true,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

***

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

const post = await bkendFetch('/v1/data/posts', {
  method: 'POST',
  body: {
    title: '새 게시글',
    content: '안녕하세요!',
    published: true,
  },
});

console.log(post.id); // 생성된 데이터 ID
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/06-app-integration.md)를 참고하세요.
{% endhint %}

***

## 단축 경로

표준 경로 외에 단축 경로도 사용할 수 있습니다.

```bash
# 표준 경로
POST /v1/data/posts

# 단축 경로 (동일하게 동작)
POST /v1/posts
```

***

## 스키마 검증

데이터 생성 시 테이블 스키마에 따라 자동 검증이 수행됩니다.

| 검증 | 실패 시 |
|------|--------|
| 필수 필드 누락 | `400` — `data/validation-error` |
| 타입 불일치 | `400` — `data/validation-error` |
| 패턴 불일치 | `400` — `data/validation-error` |
| 범위 초과 | `400` — `data/validation-error` |
| Unique 제약 위반 | `409` — `data/duplicate-value` |

***

## 권한

데이터 생성에는 해당 테이블의 `create` 권한이 필요합니다.

| 역할 | 조건 |
|------|------|
| `admin` | 항상 허용 |
| `user` | 테이블 `permissions.user.create`가 `true` |
| `guest` | 테이블 `permissions.guest.create`가 `true` |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `data/table-not-found` | 404 | 테이블이 존재하지 않음 |
| `data/validation-error` | 400 | 스키마 검증 실패 |
| `data/duplicate-value` | 409 | Unique 제약 위반 |
| `data/permission-denied` | 403 | create 권한 없음 |
| `data/invalid-header` | 400 | 필수 헤더 누락 |

***

## 다음 단계

- [단건 조회](04-select.md) — 생성한 데이터 조회
- [데이터 모델](02-data-model.md) — 스키마와 권한 이해
- [필터링](08-filtering.md) — 데이터 검색
