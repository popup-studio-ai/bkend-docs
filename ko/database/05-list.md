# 데이터 목록 조회

{% hint style="info" %}
💡 테이블의 데이터를 목록으로 조회하세요. 필터링, 정렬, 페이지네이션을 지원합니다.
{% endhint %}

## 개요

`GET /v1/data/:tableName` 엔드포인트로 테이블의 데이터 목록을 조회합니다. 쿼리 파라미터로 페이지네이션, 정렬, 필터링을 적용할 수 있습니다.

***

## 목록 조회

### GET /v1/data/:tableName

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET "https://api-client.bkend.ai/v1/data/posts?page=1&limit=20&sortBy=createdAt&sortDirection=desc" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const params = new URLSearchParams({
  page: '1',
  limit: '20',
  sortBy: 'createdAt',
  sortDirection: 'desc',
});

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts?${params}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'prod',
  },
});

const { items, pagination } = await response.json();
```
{% endtab %}
{% endtabs %}

### 쿼리 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|:------:|------|
| `page` | `number` | `1` | 페이지 번호 (1부터 시작) |
| `limit` | `number` | `20` | 페이지당 항목 수 (1~100) |
| `sortBy` | `string` | - | 정렬 필드 |
| `sortDirection` | `string` | `desc` | `asc` 또는 `desc` |
| `search` | `string` | - | 검색어 (부분 일치) |
| `searchType` | `string` | - | 검색 대상 필드 |
| `andFilters` | `JSON` | - | AND 조건 필터 |
| `orFilters` | `JSON` | - | OR 조건 필터 |

{% hint style="info" %}
💡 필터링과 정렬에 대한 자세한 내용은 [필터링](08-filtering.md)과 [정렬 & 페이지네이션](09-sorting-pagination.md)을 참고하세요.
{% endhint %}

### 응답 (200 OK)

```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "첫 번째 게시글",
      "content": "안녕하세요, bkend입니다.",
      "category": "notice",
      "published": true,
      "createdBy": "user-uuid-1234",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "두 번째 게시글",
      "content": "반갑습니다.",
      "category": "general",
      "published": false,
      "createdBy": "user-uuid-5678",
      "createdAt": "2025-01-14T09:00:00.000Z",
      "updatedAt": "2025-01-14T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 페이지네이션 응답

| 필드 | 타입 | 설명 |
|------|------|------|
| `total` | `number` | 전체 데이터 수 |
| `page` | `number` | 현재 페이지 |
| `limit` | `number` | 페이지당 항목 수 |
| `totalPages` | `number` | 전체 페이지 수 |
| `hasNext` | `boolean` | 다음 페이지 존재 여부 |
| `hasPrev` | `boolean` | 이전 페이지 존재 여부 |

***

## 권한

목록 조회에는 해당 테이블의 `list` 권한이 필요합니다.

| 역할 | 조건 |
|------|------|
| `admin` | 모든 데이터 조회 |
| `user` | `permissions.user.list`가 `true` |
| `guest` | `permissions.guest.list`가 `true` |
| `self` | 자동으로 `createdBy` 필터 추가 (본인 데이터만) |

{% hint style="warning" %}
⚠️ `self` 권한만 있는 경우, 명시적인 필터 없이도 본인이 생성한 데이터만 반환됩니다.
{% endhint %}

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `data/table-not-found` | 404 | 테이블이 존재하지 않음 |
| `data/permission-denied` | 403 | list 권한 없음 |

***

## 다음 단계

- [필터링](08-filtering.md) — AND/OR 필터, 검색
- [정렬 & 페이지네이션](09-sorting-pagination.md) — 정렬 순서와 페이지 제어
- [단건 조회](04-select.md) — ID로 특정 데이터 조회
