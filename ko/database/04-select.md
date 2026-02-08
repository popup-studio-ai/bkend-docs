# 단건 데이터 조회

{% hint style="info" %}
💡 ID를 사용하여 특정 데이터를 조회하세요.
{% endhint %}

## 개요

`GET /v1/data/:tableName/:id` 엔드포인트로 특정 데이터를 ID로 조회합니다.

***

## 데이터 조회

### GET /v1/data/:tableName/:id

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET https://api-client.bkend.ai/v1/data/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const postId = '507f1f77bcf86cd799439011';

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts/${postId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});

const post = await response.json();
console.log(post.title);
```
{% endtab %}
{% endtabs %}

### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `tableName` | `string` | ✅ | 테이블 이름 |
| `id` | `string` | ✅ | 데이터 ID |

### 응답 (200 OK)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "첫 번째 게시글",
  "content": "안녕하세요, bkend입니다.",
  "category": "notice",
  "published": true,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

***

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

const post = await bkendFetch('/v1/data/posts/{id}');
console.log(post.title);
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/06-app-integration.md)를 참고하세요.
{% endhint %}

***

## 권한

데이터 조회에는 해당 테이블의 `read` 권한이 필요합니다.

| 역할 | 조건 |
|------|------|
| `admin` | 항상 허용 |
| `user` | `permissions.user.read`가 `true` |
| `guest` | `permissions.guest.read`가 `true` |
| `self` | `createdBy`가 본인인 경우만 허용 |

{% hint style="info" %}
💡 `self` 권한만 있는 경우, 다른 사용자가 생성한 데이터를 조회하면 `403` 에러가 반환됩니다.
{% endhint %}

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `data/table-not-found` | 404 | 테이블이 존재하지 않음 |
| `data/not-found` | 404 | 데이터를 찾을 수 없음 |
| `data/permission-denied` | 403 | read 권한 없음 |

***

## 다음 단계

- [목록 조회](05-list.md) — 여러 데이터 한 번에 조회
- [필터링](08-filtering.md) — 조건으로 데이터 검색
- [데이터 수정](06-update.md) — 조회한 데이터 수정
