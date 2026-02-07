# 필터링

{% hint style="info" %}
💡 AND/OR 필터와 검색으로 원하는 데이터를 정확하게 찾으세요.
{% endhint %}

## 개요

목록 조회 시 `andFilters`, `orFilters`, `search` 파라미터를 사용하여 데이터를 필터링할 수 있습니다. 쿼리 파라미터로 JSON 형식의 필터를 전달합니다.

***

## AND 필터

`andFilters`는 모든 조건을 만족하는 데이터만 반환합니다.

```bash
# status가 "active"이고 age가 18 이상인 데이터
curl -X GET "https://api-client.bkend.ai/v1/data/users?andFilters=%7B%22status%22%3A%22active%22%2C%22age%22%3A%7B%22%24gte%22%3A18%7D%7D" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```

```javascript
const andFilters = JSON.stringify({
  status: 'active',
  age: { $gte: 18 },
});

const response = await fetch(
  `https://api-client.bkend.ai/v1/data/users?andFilters=${encodeURIComponent(andFilters)}`,
  {
    headers: {
      'X-Project-Id': '{project_id}',
      'X-Environment': 'prod',
    },
  }
);
```

***

## OR 필터

`orFilters`는 하나 이상의 조건을 만족하는 데이터를 반환합니다.

```javascript
const orFilters = JSON.stringify({
  category: 'notice',
  priority: 'high',
});

// category가 "notice" 이거나 priority가 "high"인 데이터
const url = `https://api-client.bkend.ai/v1/data/posts?orFilters=${encodeURIComponent(orFilters)}`;
```

***

## AND + OR 조합

두 필터를 함께 사용할 수 있습니다.

```javascript
const andFilters = JSON.stringify({ published: true });
const orFilters = JSON.stringify({ category: 'notice', category: 'event' });

// published가 true이면서, category가 "notice" 또는 "event"인 데이터
const url = `https://api-client.bkend.ai/v1/data/posts?andFilters=${encodeURIComponent(andFilters)}&orFilters=${encodeURIComponent(orFilters)}`;
```

***

## 연산자

필터 값에 연산자를 사용하여 조건을 세밀하게 지정할 수 있습니다.

### 비교 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `$eq` | 같음 | `{ "status": { "$eq": "active" } }` |
| `$ne` | 다름 | `{ "status": { "$ne": "deleted" } }` |
| `$gt` | 초과 | `{ "age": { "$gt": 18 } }` |
| `$gte` | 이상 | `{ "age": { "$gte": 18 } }` |
| `$lt` | 미만 | `{ "price": { "$lt": 10000 } }` |
| `$lte` | 이하 | `{ "price": { "$lte": 10000 } }` |

### 포함 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `$in` | 값 포함 | `{ "role": { "$in": ["admin", "editor"] } }` |
| `$nin` | 값 미포함 | `{ "status": { "$nin": ["deleted", "banned"] } }` |

### 기타 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `$regex` | 정규식 매칭 | `{ "email": { "$regex": "@example.com" } }` |
| `$exists` | 필드 존재 여부 | `{ "bio": { "$exists": true } }` |

### 단순 값 필터

연산자 없이 값을 직접 지정하면 `$eq`와 동일하게 동작합니다.

```json
{
  "status": "active",
  "published": true
}
```

***

## 검색

`search` 파라미터로 전체 필드에 대한 부분 일치 검색을 수행합니다.

```bash
# 모든 필드에서 "bkend" 검색
curl -X GET "https://api-client.bkend.ai/v1/data/posts?search=bkend" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```

### 특정 필드 검색

`searchType`으로 검색 대상 필드를 지정할 수 있습니다.

```bash
# title 필드에서만 "bkend" 검색
curl -X GET "https://api-client.bkend.ai/v1/data/posts?search=bkend&searchType=title" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `search` | `string` | 검색어 (부분 일치) |
| `searchType` | `string` | 검색 대상 필드 (미지정 시 전체 필드) |

***

## 활용 예시

### 최근 일주일 내 활성 사용자

```javascript
const andFilters = JSON.stringify({
  status: 'active',
  createdAt: { $gte: '2025-01-08T00:00:00Z' },
});
```

### 특정 카테고리의 공개 게시글

```javascript
const andFilters = JSON.stringify({
  published: true,
  category: { $in: ['notice', 'event'] },
});
```

### 이메일 도메인으로 사용자 검색

```javascript
const andFilters = JSON.stringify({
  email: { $regex: '@example\\.com$' },
});
```

***

## 다음 단계

- [정렬 & 페이지네이션](09-sorting-pagination.md) — 결과 정렬과 페이지 제어
- [목록 조회](05-list.md) — 기본 목록 조회
- [API 레퍼런스](11-api-reference.md) — 전체 파라미터 목록
