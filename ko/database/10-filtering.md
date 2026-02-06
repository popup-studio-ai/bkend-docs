# 필터링 & 검색

> 데이터 목록 조회 시 필터링과 검색 기능을 사용하는 방법을 안내합니다.

## 개요

bkend Database는 AND/OR 조건 필터, 비교 연산자, 텍스트 검색을 지원합니다. 이를 조합하여 원하는 데이터를 정확하게 조회할 수 있습니다.

---

## 필터 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `$eq` | 같음 | `{"status": {"$eq": "active"}}` |
| `$ne` | 다름 | `{"status": {"$ne": "deleted"}}` |
| `$gt` | 초과 | `{"age": {"$gt": 18}}` |
| `$gte` | 이상 | `{"age": {"$gte": 18}}` |
| `$lt` | 미만 | `{"price": {"$lt": 10000}}` |
| `$lte` | 이하 | `{"price": {"$lte": 10000}}` |
| `$in` | 목록 포함 | `{"role": {"$in": ["admin", "editor"]}}` |
| `$nin` | 목록 미포함 | `{"status": {"$nin": ["deleted", "archived"]}}` |

> ⚠️ **주의** - 위 8가지 연산자만 허용됩니다. 다른 `$` 연산자는 보안을 위해 차단됩니다.

---

## AND 필터

`andFilters`에 포함된 조건은 모두 충족해야 합니다 (AND 논리).

### 단순 값 비교

```bash
curl "https://api.bkend.ai/v1/data/users?andFilters[status]=active&andFilters[role]=admin" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {token}"
```

### 연산자 사용

```bash
curl -X GET "https://api.bkend.ai/v1/data/products" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "andFilters": {
      "price": { "$gte": 1000, "$lte": 50000 },
      "category": "electronics",
      "inStock": true
    }
  }'
```

위 요청은 다음 조건을 모두 만족하는 데이터를 조회합니다:
- `price`가 1,000 이상 **그리고** 50,000 이하
- `category`가 "electronics"
- `inStock`이 `true`

---

## OR 필터

`orFilters`에 포함된 조건 중 하나라도 충족하면 됩니다 (OR 논리).

```bash
curl -X GET "https://api.bkend.ai/v1/data/users" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "orFilters": {
      "role": "admin",
      "department": "engineering"
    }
  }'
```

위 요청은 `role`이 "admin" **또는** `department`가 "engineering"인 데이터를 조회합니다.

---

## AND + OR 조합

`andFilters`와 `orFilters`를 함께 사용하면, AND 조건과 OR 조건이 동시에 적용됩니다.

```json
{
  "andFilters": {
    "active": true
  },
  "orFilters": {
    "role": "admin",
    "role": "editor"
  }
}
```

---

## 텍스트 검색

`search`와 `searchType`을 사용하여 특정 필드에서 키워드를 검색합니다. 대소문자를 구분하지 않는 부분 일치 검색(regex)을 수행합니다.

### 요청

```bash
curl "https://api.bkend.ai/v1/data/users?search=홍길동&searchType=name" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {token}"
```

### 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `search` | string | 검색 키워드 |
| `searchType` | string | 검색 대상 필드명 |

> 💡 **Tip** - `search`와 `searchType` 모두 지정해야 텍스트 검색이 동작합니다.

---

## 사용 예시

### 활성 사용자 중 나이 20~30 조회

```json
{
  "andFilters": {
    "active": true,
    "age": { "$gte": 20, "$lte": 30 }
  },
  "sortBy": "createdAt",
  "sortDirection": "desc",
  "limit": 50
}
```

### 특정 카테고리 제외 상품 조회

```json
{
  "andFilters": {
    "category": { "$nin": ["discontinued", "draft"] },
    "price": { "$gt": 0 }
  }
}
```

### 이름으로 사용자 검색 + 활성 상태 필터

```json
{
  "search": "김",
  "searchType": "name",
  "andFilters": {
    "active": true
  }
}
```

---

## 보안

bkend는 NoSQL Injection을 방지하기 위해 다음 보안 조치를 적용합니다:

- **허용된 연산자만 사용 가능** — `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`만 허용
- **위험 키 차단** — `__proto__`, `constructor`, `prototype` 차단
- **재귀 검증** — 중첩 객체까지 모든 키를 검증

허용되지 않은 연산자를 사용하면 다음 에러가 반환됩니다:

```json
{
  "error": {
    "code": "data/validation-error",
    "message": "허용되지 않은 쿼리 연산자: $where"
  }
}
```

---

## 관련 문서

- [정렬 & 페이지네이션](11-sorting-pagination.md) — 정렬/페이징 가이드
- [데이터 조회](07-select.md) — 기본 데이터 조회
- [인덱스 & 성능](14-indexes.md) — 인덱스로 필터링 성능 향상
