# REST API 개요

> bkend REST API의 공통 규칙과 사용법을 안내합니다.

## 개요

bkend REST API는 표준 HTTP 메서드를 사용하며, JSON 형식으로 요청하고 응답합니다. 관리 API와 서비스 API 두 가지 유형을 제공합니다.

---

## API 유형

| 유형 | Base URL | 인증 | 용도 |
|------|---------|------|------|
| **관리 API** | `https://api.bkend.ai/v1` | OAuth 2.1 + PKCE | 프로젝트/테이블 관리 |
| **서비스 API** | `https://api.bkend.ai/v1` | JWT (Bearer Token) | User 앱 데이터 조작 |

---

## 공통 헤더

### 서비스 API 헤더

```bash
curl -X GET "https://api.bkend.ai/v1/data/{tableName}" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json"
```

| 헤더 | 필수 | 설명 |
|------|------|------|
| `x-project-id` | ✅ | 프로젝트 ID |
| `x-environment` | - | 환경 이름 (기본값: `development`) |
| `Authorization` | ✅ | `Bearer {accessToken}` (보호된 엔드포인트) |
| `Content-Type` | ✅ | `application/json` (POST/PUT/PATCH) |

---

## HTTP 메서드

| 메서드 | 용도 | 요청 본문 | 응답 코드 |
|--------|------|----------|----------|
| **GET** | 조회 | - | 200 |
| **POST** | 생성 | ✅ | 200, 201 |
| **PATCH** | 부분 수정 | ✅ | 200 |
| **PUT** | 전체 수정 | ✅ | 200 |
| **DELETE** | 삭제 | - | 200 |

---

## 페이지네이션

목록 API는 공통 페이지네이션을 지원합니다.

### 요청 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `page` | number | 1 | 페이지 번호 |
| `limit` | number | 20 | 페이지당 항목 수 (최대 100) |

### 응답 형식

```json
{
  "items": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 정렬

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `sortBy` | string | - | 정렬 기준 필드 |
| `sortDirection` | string | `desc` | `asc` (오름차순) 또는 `desc` (내림차순) |

---

## 필터링

### AND 조건

```json
{
  "andFilters": {
    "status": { "$eq": "active" },
    "age": { "$gte": 18 }
  }
}
```

### OR 조건

```json
{
  "orFilters": {
    "role": { "$in": ["admin", "editor"] }
  }
}
```

### 지원 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `$eq` | 같음 | `{ "$eq": "active" }` |
| `$ne` | 같지 않음 | `{ "$ne": "deleted" }` |
| `$gt` | 초과 | `{ "$gt": 100 }` |
| `$gte` | 이상 | `{ "$gte": 18 }` |
| `$lt` | 미만 | `{ "$lt": 1000 }` |
| `$lte` | 이하 | `{ "$lte": 99 }` |
| `$in` | 포함 | `{ "$in": ["a", "b"] }` |
| `$nin` | 미포함 | `{ "$nin": ["x", "y"] }` |

---

## Rate Limiting

| 대상 | 제한 | 차단 기간 |
|------|------|----------|
| 로그인 시도 | 5회/15분 | 1시간 |
| 인증 코드 발송 | 3회/1시간 | 2시간 |
| 일반 API 요청 | 100회/1시간 | - |

Rate Limit 초과 시 `429 Too Many Requests` 응답이 반환됩니다.

---

## 에러 응답 형식

```json
{
  "error": {
    "code": "data/validation-error",
    "message": "필수 입력 항목입니다",
    "details": [
      {
        "field": "email",
        "reason": "올바른 이메일 형식이 아닙니다"
      }
    ]
  }
}
```

---

## 관련 문서

- [REST Database](07-rest-database.md) — Database 엔드포인트
- [REST Auth](08-rest-auth.md) — Auth 엔드포인트
- [REST Storage](09-rest-storage.md) — Storage 엔드포인트
- [에러 코드](10-error-codes.md) — 전체 에러 코드 레퍼런스
