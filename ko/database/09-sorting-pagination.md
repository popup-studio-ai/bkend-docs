# 정렬 & 페이지네이션

{% hint style="info" %}
💡 데이터 목록의 정렬 순서와 페이지를 제어하세요.
{% endhint %}

## 개요

목록 조회 시 `sortBy`, `sortDirection`, `page`, `limit` 파라미터로 결과의 정렬과 페이지를 제어할 수 있습니다.

***

## 정렬

### sortBy

정렬 기준 필드를 지정합니다. 테이블의 모든 필드를 정렬 기준으로 사용할 수 있습니다.

```bash
# createdAt 기준 내림차순 (최신 순)
curl -X GET "https://api-client.bkend.ai/v1/data/posts?sortBy=createdAt&sortDirection=desc" \
  -H "X-API-Key: {pk_publishable_key}"
```

### sortDirection

| 값 | 설명 |
|-----|------|
| `asc` | 오름차순 (A→Z, 1→9, 과거→최근) |
| `desc` | 내림차순 (Z→A, 9→1, 최근→과거) — **기본값** |

### 정렬 예시

```javascript
// 이름 오름차순
const params = new URLSearchParams({
  sortBy: 'name',
  sortDirection: 'asc',
});

// 가격 내림차순
const params2 = new URLSearchParams({
  sortBy: 'price',
  sortDirection: 'desc',
});

// 수정일 최신순 (기본)
const params3 = new URLSearchParams({
  sortBy: 'updatedAt',
  sortDirection: 'desc',
});
```

{% hint style="info" %}
💡 `sortBy`를 지정하지 않으면 기본 정렬 순서(보통 `_id` 기준)가 적용됩니다.
{% endhint %}

***

## 페이지네이션

### page / limit

| 파라미터 | 타입 | 기본값 | 범위 | 설명 |
|---------|------|:------:|:----:|------|
| `page` | `number` | `1` | 1~ | 페이지 번호 |
| `limit` | `number` | `20` | 1~100 | 페이지당 항목 수 |

### 기본 사용

```bash
# 1페이지, 10개씩
curl -X GET "https://api-client.bkend.ai/v1/data/posts?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}"
```

### 페이지네이션 응답

```json
{
  "items": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `total` | `number` | 전체 데이터 수 |
| `page` | `number` | 현재 페이지 |
| `limit` | `number` | 페이지당 항목 수 |
| `totalPages` | `number` | 전체 페이지 수 |
| `hasNext` | `boolean` | 다음 페이지 존재 여부 |
| `hasPrev` | `boolean` | 이전 페이지 존재 여부 |

***

## 정렬 + 페이지네이션 + 필터 조합

모든 파라미터를 조합하여 사용할 수 있습니다.

```javascript
const andFilters = JSON.stringify({ published: true });

const params = new URLSearchParams({
  page: '1',
  limit: '20',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  andFilters,
});

const response = await fetch(
  `https://api-client.bkend.ai/v1/data/posts?${params}`,
  {
    headers: {
      'X-API-Key': '{pk_publishable_key}',
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);
```

### 전체 데이터 순회

`hasNext`를 사용하여 모든 페이지를 순회할 수 있습니다.

```javascript
let page = 1;
let hasNext = true;
const allItems = [];

while (hasNext) {
  const response = await fetch(
    `https://api-client.bkend.ai/v1/data/posts?page=${page}&limit=100`,
    {
      headers: {
        'X-API-Key': '{pk_publishable_key}',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const { items, pagination } = await response.json();
  allItems.push(...items);
  hasNext = pagination.hasNext;
  page++;
}
```

***

## 다음 단계

- [필터링](08-filtering.md) — AND/OR 필터와 검색
- [목록 조회](05-list.md) — 기본 목록 조회
- [API 레퍼런스](11-api-reference.md) — 전체 파라미터 목록
