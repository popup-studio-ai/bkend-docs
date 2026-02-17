# Database REST API 레퍼런스

{% hint style="info" %}
💡 데이터베이스 관련 모든 REST API 엔드포인트를 한눈에 확인하세요.
{% endhint %}

## 공통 사항

### Base URL

```text
https://api-client.bkend.ai
```

### 경로

모든 엔드포인트는 두 가지 경로를 지원합니다.

| 경로 | 설명 |
|------|------|
| `/v1/data/:tableName` | 표준 경로 |
| `/v1/:tableName` | 단축 경로 (동일 동작) |

### 필수 헤더

| 헤더 | 필수 | 설명 |
|------|:----:|------|
| `X-API-Key` | ✅ | `{pk_publishable_key}` — Publishable Key |
| `Authorization` | 조건부 | `Bearer {accessToken}` — 권한에 따라 필요 |
| `Content-Type` | 조건부 | `application/json` — POST, PATCH 요청 시 |

{% hint style="info" %}
💡 Publishable Key에 프로젝트와 환경 정보가 포함되어 있어 별도 헤더가 필요하지 않습니다.
{% endhint %}

### 시스템 필드

모든 데이터에 자동 포함되는 필드입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 데이터 고유 ID |
| `createdBy` | `string` | 생성자 ID |
| `createdAt` | `string` | 생성 일시 (ISO 8601) |
| `updatedAt` | `string` | 최종 수정 일시 (ISO 8601) |

***

## 데이터 생성

```http
POST /v1/data/:tableName
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `tableName` | path | `string` | ✅ | 테이블 이름 |
| *(필드)* | body | *(다양)* | 스키마 | 테이블 스키마에 정의된 필드 |

**응답:** `201 Created` — 생성된 데이터 (시스템 필드 포함)

→ [데이터 생성](03-insert.md)

***

## 단건 조회

```http
GET /v1/data/:tableName/:id
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `tableName` | path | `string` | ✅ | 테이블 이름 |
| `id` | path | `string` | ✅ | 데이터 ID |

**응답:** `200 OK` — 데이터 객체

→ [단건 조회](04-select.md)

***

## 목록 조회

```http
GET /v1/data/:tableName
```

| 파라미터 | 위치 | 타입 | 기본값 | 설명 |
|---------|------|------|:------:|------|
| `tableName` | path | `string` | - | 테이블 이름 |
| `page` | query | `number` | `1` | 페이지 번호 (1~) |
| `limit` | query | `number` | `20` | 페이지당 항목 수 (1~100) |
| `sortBy` | query | `string` | - | 정렬 필드 |
| `sortDirection` | query | `string` | `desc` | `asc` / `desc` |
| `search` | query | `string` | - | 검색어 (부분 일치) |
| `searchType` | query | `string` | - | 검색 대상 필드 |
| `andFilters` | query | `JSON` | - | AND 조건 필터 |
| `orFilters` | query | `JSON` | - | OR 조건 필터 |
| `select` | query | `string[]` | - | 응답에 포함할 필드 (쉼표 구분) |

**응답:** `200 OK` — `{ items: [...], pagination: { total, page, limit, totalPages, hasNext, hasPrev } }`

→ [목록 조회](05-list.md) · [필터링](08-filtering.md) · [정렬 & 페이지네이션](09-sorting-pagination.md)

***

## 데이터 수정

```http
PATCH /v1/data/:tableName/:id
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `tableName` | path | `string` | ✅ | 테이블 이름 |
| `id` | path | `string` | ✅ | 데이터 ID |
| *(필드)* | body | *(다양)* | - | 수정할 필드만 (Partial Update) |

**응답:** `200 OK` — 업데이트된 데이터 (시스템 필드 포함)

→ [데이터 수정](06-update.md)

***

## 데이터 삭제

```http
DELETE /v1/data/:tableName/:id
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `tableName` | path | `string` | ✅ | 테이블 이름 |
| `id` | path | `string` | ✅ | 데이터 ID |

**응답:** `200 OK` — `{ success: true }`

→ [데이터 삭제](07-delete.md)

***

## 테이블 스키마 조회

```http
GET /v1/data/:tableName/spec
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `tableName` | path | `string` | ✅ | 테이블 이름 |

**응답:** `200 OK` — `{ tableName, schema, indexes, permissions }`

→ [테이블 스키마 조회](10-table-spec.md)

***

## OpenAPI 스펙 조회

```http
GET /v1/data/:tableName/openapi
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `tableName` | path | `string` | ✅ | 테이블 이름 |

**응답:** `200 OK` — OpenAPI 3.0 스펙 문서

```json
{
  "openapi": "3.0.0",
  "info": { "title": "...", "version": "1.0.0" },
  "paths": { "..." : { "..." } },
  "components": { "..." }
}
```

{% hint style="info" %}
지정한 테이블의 CRUD 작업에 대한 OpenAPI 3.0 스펙을 반환합니다. 클라이언트 SDK 자동 생성이나 API 테스트 도구 연동에 활용할 수 있습니다.
{% endhint %}

***

## 필터 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| *(값 직접)* | 같음 | `{ "status": "active" }` |
| `$eq` | 같음 | `{ "status": { "$eq": "active" } }` |
| `$ne` | 다름 | `{ "status": { "$ne": "deleted" } }` |
| `$gt` | 초과 | `{ "age": { "$gt": 18 } }` |
| `$gte` | 이상 | `{ "age": { "$gte": 18 } }` |
| `$lt` | 미만 | `{ "price": { "$lt": 10000 } }` |
| `$lte` | 이하 | `{ "price": { "$lte": 10000 } }` |
| `$in` | 값 포함 | `{ "role": { "$in": ["admin", "editor"] } }` |
| `$nin` | 값 미포함 | `{ "status": { "$nin": ["deleted"] } }` |
| `$regex` | 정규식 | `{ "email": { "$regex": "@example.com" } }` |
| `$exists` | 필드 존재 | `{ "bio": { "$exists": true } }` |

***

## 권한 매트릭스

| 작업 | `admin` | `user` | `guest` | `self` |
|------|:-------:|:------:|:-------:|:------:|
| create | ✅ | 설정 | 설정 | - |
| read | ✅ | 설정 | 설정 | 본인만 |
| list | ✅ | 설정 | 설정 | 본인만 |
| update | ✅ | 설정 | 설정 | 본인만 |
| delete | ✅ | 설정 | 설정 | 본인만 |

***

## 엔드포인트 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/v1/data/:tableName` | 데이터 생성 |
| `GET` | `/v1/data/:tableName/:id` | 단건 조회 |
| `GET` | `/v1/data/:tableName` | 목록 조회 |
| `PATCH` | `/v1/data/:tableName/:id` | 데이터 수정 |
| `DELETE` | `/v1/data/:tableName/:id` | 데이터 삭제 |
| `GET` | `/v1/data/:tableName/spec` | 스키마 조회 |
| `GET` | `/v1/data/:tableName/openapi` | OpenAPI 3.0 스펙 |

{% hint style="info" %}
💡 모든 엔드포인트는 `/v1/:tableName` 단축 경로도 지원합니다.
{% endhint %}

***

## 에러 코드

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `data/table-not-found` | 404 | 테이블이 존재하지 않음 |
| `data/environment-not-found` | 404 | 환경이 존재하지 않음 |
| `data/not-found` | 404 | 데이터를 찾을 수 없음 |
| `data/validation-error` | 400 | 스키마 검증 실패 |
| `data/duplicate-value` | 409 | Unique 제약 위반 |
| `data/permission-denied` | 403 | 권한 없음 |
| `data/system-table-access` | 403 | 시스템 테이블 접근 불가 |
| `data/scope-insufficient` | 403 | API 키 scope에 필요한 권한이 포함되지 않음 |
| `data/project-access-denied` | 403 | Access Token의 프로젝트 ID 불일치 |
| `data/invalid-header` | 400 | 필수 헤더 누락 |
| `data/rate-limit-exceeded` | 429 | API 호출 한도 초과 |
