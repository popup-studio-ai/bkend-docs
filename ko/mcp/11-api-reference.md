# MCP API 레퍼런스

{% hint style="info" %}
💡 bkend MCP 서버가 제공하는 모든 도구의 입출력 스키마를 정리합니다.
{% endhint %}

## 고정 도구

### get_context

세션 컨텍스트를 조회합니다. 매 세션마다 반드시 가장 먼저 호출하세요.

| 항목 | 값 |
|------|-----|
| 파라미터 | 없음 |
| 응답 | Organization ID, REST API Base URL, 리소스 계층이 포함된 Markdown 텍스트 |

### search_docs

GitBook을 통해 bkend 문서를 검색합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `query` | string | Yes | 검색 키워드 (예: "회원가입 인증") |

***

## Organization 도구

### backend_org_list

| 항목 | 값 |
|------|-----|
| 파라미터 | 없음 |
| 응답 | 접근 가능한 Organization 목록 |

### backend_org_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | Yes | Organization ID |

***

## 액세스 토큰 도구

### backend_access_token_list

| 항목 | 값 |
|------|-----|
| 파라미터 | 없음 (Organization 기준으로 자동 필터링) |
| 응답 | 액세스 토큰 목록 |

### backend_access_token_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `accessTokenId` | string | Yes | 액세스 토큰 ID |

***

## 프로젝트 도구

### backend_project_list

| 항목 | 값 |
|------|-----|
| 파라미터 | 없음 (Organization 기준으로 자동 필터링) |
| 응답 | 프로젝트 목록 (설정, 환경 수 포함) |

### backend_project_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `projectId` | string | Yes | 프로젝트 ID |

### backend_project_create

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `body` | object | Yes | 프로젝트 생성 데이터 |

#### body 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `organizationId` | string | Yes | Organization ID |
| `slug` | string | Yes | URL 친화적 고유 슬러그 |
| `name` | string | Yes | 프로젝트 이름 |
| `primaryCloud` | string | Yes | `aws`, `gcp`, 또는 `azu` |
| `primaryRegion` | string | Yes | 배포 리전 |
| `description` | string | | 프로젝트 설명 |

### backend_project_update

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `projectId` | string | Yes | 프로젝트 ID |
| `body` | object | | 수정할 필드 (`name`, `slug`, `description`, `settings`) |

***

## 환경 도구

### backend_env_list

| 항목 | 값 |
|------|-----|
| 파라미터 | 없음 (Organization 기준으로 자동 필터링) |
| 응답 | 환경 목록 (배포 상태 포함) |

### backend_env_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `environmentId` | string | Yes | 환경 ID |

### backend_env_create

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `body` | object | Yes | 환경 생성 데이터 |

#### body 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `projectId` | string | Yes | 프로젝트 ID |
| `environment` | string | Yes | 환경 이름 (예: `dev`, `staging`, `prod`) |
| `environmentType` | string | Yes | `dev`, `staging`, `prod`, 또는 `custom` |

***

## 테이블 도구

### backend_table_list

| 항목 | 값 |
|------|-----|
| 파라미터 | 없음 (Organization 기준으로 자동 필터링) |
| 응답 | 테이블 목록 (스키마 정의, 문서 수 포함) |

### backend_table_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `tableId` | string | Yes | 테이블 ID |

### backend_table_create

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `body` | object | Yes | 테이블 생성 데이터 |

#### body 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `projectId` | string | Yes | 프로젝트 ID |
| `environment` | string | Yes | 환경 이름 |
| `tableName` | string | Yes | 테이블 이름 (최대 64자, 영숫자 + 밑줄/하이픈) |
| `schema` | object | Yes | 테이블 스키마 (BSON 스키마 형식) |
| `displayName` | string | | 표시 이름 |
| `description` | string | | 테이블 설명 |

### backend_table_update

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `tableId` | string | Yes | 테이블 ID |
| `body` | object | | 수정할 필드 (`displayName`, `description`, `permissions`) |

***

## 필드 / 인덱스 관리 도구

### backend_field_manage

테이블 ID로 필드를 관리합니다. 새 스키마 버전을 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `tableId` | string | Yes | 테이블 ID |
| `body` | object | | 필드 관리 작업 |

#### body 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `fieldsToAddOrUpdate` | object | 추가 또는 수정할 필드 (BSON 스키마 형식) |
| `fieldsToRemove` | string[] | 삭제할 필드 이름 |
| `requiredFieldsToAdd` | string[] | 필수 목록에 추가할 필드 이름 |
| `requiredFieldsToRemove` | string[] | 필수 목록에서 제거할 필드 이름 |

### backend_index_manage

테이블 ID로 인덱스를 관리합니다. 새 인덱스 버전을 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `tableId` | string | Yes | 테이블 ID |
| `body` | object | | 인덱스 관리 작업 |

#### body 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `indexesToAddOrUpdate` | array | 추가 또는 수정할 인덱스 |
| `indexesToRemove` | string[] | 삭제할 인덱스 이름 |

`indexesToAddOrUpdate`의 각 인덱스 객체:

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `name` | string | Yes | 인덱스 이름 |
| `fields` | object | Yes | 인덱스 필드 (`1` 오름차순, `-1` 내림차순) |
| `unique` | boolean | | 유니크 인덱스 (기본: false) |
| `sparse` | boolean | | 스파스 인덱스 (기본: false) |

***

## 스키마 / 인덱스 버전 도구

### backend_schema_version_list

테이블 ID로 스키마 버전 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `tableId` | string | Yes | 테이블 ID |
| `page` | number | | 페이지 번호 |
| `limit` | number | | 페이지당 항목 수 |

### backend_index_version_list

테이블 ID로 인덱스 버전 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `tableId` | string | Yes | 테이블 ID |
| `page` | number | | 페이지 번호 |
| `limit` | number | | 페이지당 항목 수 |

***

## 공통 응답 패턴

### 목록 응답

```json
{
  "items": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 단건 응답

```json
{
  "id": "rec_abc123",
  "field1": "value1",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### 에러 응답

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

***

{% hint style="warning" %}
⚠️ 모든 API 도구는 OAuth 2.1 인증이 필요합니다. 반드시 `get_context`를 먼저 호출하여 세션을 설정하세요.
{% endhint %}

## 다음 단계

- [MCP 도구 개요](01-overview.md) — 도구 분류와 흐름
- [컨텍스트](06-context.md) — get_context 상세
- [MCP 리소스](10-resources.md) — 리소스 URI와 조회 방법
