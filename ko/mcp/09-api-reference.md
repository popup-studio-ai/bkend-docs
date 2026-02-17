# MCP API 레퍼런스

{% hint style="info" %}
💡 bkend MCP 서버가 제공하는 모든 도구의 입출력 스키마를 정리합니다.
{% endhint %}

## 고정 도구

### get_context

세션 컨텍스트를 조회합니다. AI 도구가 연결 시 자동으로 호출합니다.

| 항목 | 값 |
|------|-----|
| 파라미터 | 없음 |
| 응답 | Organization, 프로젝트 목록, API 엔드포인트, 주의사항 |

### search_docs

bkend 문서를 검색합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `query` | string | ✅ | 검색 키워드 |

***

## 프로젝트 관리 도구

### backend_org_list

| 파라미터 | 없음 |
|----------|------|

### backend_project_list

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |

### backend_project_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |

### backend_project_create

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `name` | string | ✅ | 프로젝트 이름 |
| `description` | string | | 프로젝트 설명 |

### backend_project_update

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `name` | string | | 변경할 이름 |
| `description` | string | | 변경할 설명 |

### backend_project_delete

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |

***

## 환경 관리 도구

### backend_env_list

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |

### backend_env_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |

### backend_env_create

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `name` | string | ✅ | 환경 이름 |

***

## 테이블 관리 도구

### backend_table_list

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |

### backend_table_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |

### backend_table_create

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `name` | string | ✅ | 테이블 이름 |
| `fields` | array | ✅ | 필드 배열 |

#### fields 배열

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `name` | string | ✅ | 필드 이름 |
| `type` | string | ✅ | `string`, `number`, `boolean`, `date`, `object`, `array`, `reference` |
| `required` | boolean | | 필수 여부 (기본: false) |
| `unique` | boolean | | 유니크 여부 (기본: false) |
| `defaultValue` | any | | 기본값 |

### backend_table_delete

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |

***

## 필드 / 인덱스 관리 도구

### backend_field_manage

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `action` | string | ✅ | `add`, `update`, `delete` |
| `field` | object | ✅ | 필드 정보 |

### backend_index_manage

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `action` | string | ✅ | `add`, `delete` |
| `index` | object | ✅ | 인덱스 정보 |

***

## 스키마 / 인덱스 버전 도구

### backend_schema_version_list / backend_index_version_list

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |

### backend_schema_version_get / backend_index_version_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `versionId` | string | ✅ | 버전 ID |

### backend_schema_version_apply

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `versionId` | string | ✅ | 적용할 버전 ID |

***

## 데이터 CRUD 도구

### backend_data_list

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `page` | number | | 페이지 번호 (기본: 1) |
| `limit` | number | | 항목 수 (기본: 20, 최대: 100) |
| `sortBy` | string | | 정렬 필드 |
| `sortDirection` | string | | `asc` 또는 `desc` |
| `andFilters` | object | | AND 조건 필터 |
| `orFilters` | array | | OR 조건 필터 |

### backend_data_get

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `recordId` | string | ✅ | 레코드 ID |

### backend_data_create

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `data` | object | ✅ | 생성할 데이터 |

### backend_data_update

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `recordId` | string | ✅ | 레코드 ID |
| `data` | object | ✅ | 수정할 데이터 |

### backend_data_delete

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `organizationId` | string | ✅ | Organization ID |
| `projectId` | string | ✅ | 프로젝트 ID |
| `environmentId` | string | ✅ | 환경 ID |
| `tableId` | string | ✅ | 테이블 ID |
| `recordId` | string | ✅ | 레코드 ID |

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
⚠️ 동적 도구는 프로젝트 컨텍스트 설정 후에만 사용할 수 있습니다. 반드시 `get_context`를 먼저 호출하세요.
{% endhint %}

## 다음 단계

- [MCP 도구 개요](01-overview.md) — 도구 분류와 흐름
- [컨텍스트](02-context.md) — get_context 상세
- [MCP 리소스](08-resources.md) — 리소스 URI와 조회 방법
