# REST Database 엔드포인트

> 서비스 API의 Database 엔드포인트 레퍼런스입니다.

## 데이터 CRUD

### 데이터 생성 (Insert)

```
POST /v1/data/{tableName}
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `tableName` | string | ✅ | 테이블 이름 (Path) |
| Body | object | ✅ | 삽입할 데이터 |

**요청 예시**:

```bash
curl -X POST "https://api.bkend.ai/v1/data/posts" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "첫 번째 글",
    "content": "내용입니다",
    "status": "published"
  }'
```

**응답**: `200 OK`

```json
{
  "_id": "data_abc123",
  "title": "첫 번째 글",
  "content": "내용입니다",
  "status": "published",
  "createdBy": "user_xyz789",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 단일 데이터 조회 (Select)

```
GET /v1/data/{tableName}/{id}
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `tableName` | string | ✅ | 테이블 이름 |
| `id` | string | ✅ | 데이터 ID |

---

### 데이터 목록 조회 (List)

```
GET /v1/data/{tableName}
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `tableName` | string | ✅ | 테이블 이름 |
| `page` | number | - | 페이지 번호 (기본값: 1) |
| `limit` | number | - | 페이지당 항목 수 (기본값: 20, 최대: 100) |
| `search` | string | - | 텍스트 검색어 |
| `sortBy` | string | - | 정렬 기준 필드 |
| `sortDirection` | string | - | `asc` 또는 `desc` (기본값: `desc`) |
| `andFilters` | object | - | AND 조건 필터 |
| `orFilters` | object | - | OR 조건 필터 |

**응답**: `200 OK`

```json
{
  "items": [ ... ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 데이터 수정 (Update)

```
PATCH /v1/data/{tableName}/{id}
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `tableName` | string | ✅ | 테이블 이름 |
| `id` | string | ✅ | 데이터 ID |
| Body | object | ✅ | 수정할 필드 (부분 업데이트) |

---

### 데이터 삭제 (Delete)

```
DELETE /v1/data/{tableName}/{id}
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `tableName` | string | ✅ | 테이블 이름 |
| `id` | string | ✅ | 데이터 ID |

**응답**: `200 OK`

```json
{
  "success": true
}
```

---

## 테이블 스키마 조회

```
GET /v1/data/{tableName}/spec
```

테이블의 스키마 정의를 조회합니다.

```
GET /v1/data/{tableName}/openapi
```

테이블의 OpenAPI 스펙을 조회합니다.

---

## 시스템 필드

모든 데이터에 자동 추가되는 필드:

| 필드 | 타입 | 설명 |
|------|------|------|
| `_id` | string | 데이터 고유 ID (`data_` 접두사) |
| `createdBy` | string | 생성자 ID |
| `createdAt` | string | 생성 시점 (ISO 8601) |
| `updatedAt` | string | 수정 시점 (ISO 8601) |

---

## 관련 문서

- [REST API 개요](06-rest-overview.md) — 공통 규칙
- [데이터 삽입](../database/06-insert.md) — Insert 가이드
- [필터링](../database/10-filtering.md) — 필터링 상세
- [에러 코드](10-error-codes.md) — 에러 코드 레퍼런스
