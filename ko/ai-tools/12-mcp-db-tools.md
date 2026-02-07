# Database MCP 도구

{% hint style="info" %}
💡 MCP를 통해 사용할 수 있는 Database 관리 도구와 데이터 CRUD 도구를 확인합니다.
{% endhint %}

## 개요

bkend MCP는 Database 관련 도구를 두 가지 카테고리로 제공합니다:

- **관리 도구**: Organization, Project, Environment, 테이블, 필드, 인덱스 관리
- **데이터 도구**: 테이블 데이터 CRUD (생성, 조회, 수정, 삭제)

{% hint style="info" %}
💡 MCP 도구는 OpenAPI 스펙에서 동적으로 생성됩니다. 도구 이름은 `backend_` prefix로 시작합니다.
{% endhint %}

***

## 관리 도구

### Organization

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_org_list` | Organization 목록 조회 | — |

### Project

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_project_list` | Project 목록 조회 | `organizationId` |
| `backend_project_create` | Project 생성 | `organizationId`, `body: { name, region }` |
| `backend_project_get` | Project 상세 조회 | `projectId` |
| `backend_project_update` | Project 수정 | `projectId`, `body: { ... }` |
| `backend_project_delete` | Project 삭제 | `projectId` |

### Environment

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_env_list` | Environment 목록 조회 | `projectId` |
| `backend_env_create` | Environment 생성 | `projectId`, `body: { name }` |
| `backend_env_delete` | Environment 삭제 | `projectId`, `environmentId` |

### Table

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_table_list` | 테이블 목록 조회 | `projectId`, `environment` |
| `backend_table_create` | 테이블 생성 | `projectId`, `environment`, `body: { name, ... }` |
| `backend_table_get` | 테이블 상세 조회 | `projectId`, `environment`, `tableName` |
| `backend_table_delete` | 테이블 삭제 | `projectId`, `environment`, `tableName` |

### Field (필드)

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_field_manage` | 필드 추가/수정/삭제 | `projectId`, `environment`, `tableName`, `body: { action, fields }` |

### Index (인덱스)

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_index_manage` | 인덱스 추가/삭제 | `projectId`, `environment`, `tableName`, `body: { action, indexes }` |

### Schema/Index 버전

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_schema_version_list` | 스키마 버전 이력 조회 | `projectId`, `environment`, `tableName` |
| `backend_schema_version_rollback` | 스키마 버전 롤백 | `projectId`, `environment`, `tableName`, `body: { version }` |
| `backend_index_version_list` | 인덱스 버전 이력 조회 | `projectId`, `environment`, `tableName` |

***

## 데이터 CRUD 도구

데이터 CRUD는 Portal API를 통해 실행됩니다.

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `backend_data_list` | 데이터 목록 조회 | `projectId`, `environment`, `tableName` |
| `backend_data_get` | 데이터 단건 조회 | `projectId`, `environment`, `tableName`, `id` |
| `backend_data_create` | 데이터 생성 | `projectId`, `environment`, `tableName`, `body: { ... }` |
| `backend_data_update` | 데이터 수정 | `projectId`, `environment`, `tableName`, `id`, `body: { ... }` |
| `backend_data_delete` | 데이터 삭제 | `projectId`, `environment`, `tableName`, `id` |

***

## 유틸리티 도구

| 도구 | 설명 | 필수 파라미터 |
|------|------|-------------|
| `0_get_context` | 세션 컨텍스트 조회 | — |
| `5_get_operation_schema` | 도구의 상세 스키마 조회 | `operation`, `schemaType` (input/output/both) |
| `search_docs` | bkend 문서 검색 | `query` |

{% hint style="info" %}
💡 `5_get_operation_schema`를 사용하면 특정 도구의 입출력 스키마를 상세하게 확인할 수 있습니다.
{% endhint %}

***

## 사용 예시

### 자연어로 사용하기

AI 도구에서는 도구 이름을 직접 호출할 필요 없이 자연어로 요청하면 됩니다.

```
"my-app 프로젝트의 dev 환경에 users 테이블을 만들어줘.
name(문자열, 필수), email(문자열, 필수, 유니크), role(문자열) 필드가 필요해"
```

AI 도구가 내부적으로 다음 도구를 순차 호출합니다:
1. `backend_project_list` → projectId 확인
2. `backend_table_create` → 테이블 생성
3. `backend_field_manage` → 필드 추가

### 직접 호출하기

MCP를 직접 구현한 경우 `tools/call` 메서드로 호출합니다.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "backend_table_list",
    "arguments": {
      "projectId": "{project_id}",
      "environment": "dev"
    }
  }
}
```

***

## 다음 단계

- [Storage MCP 도구](13-mcp-storage-tools.md) — 스토리지 도구
- [MCP 리소스](15-mcp-resources.md) — 리소스 URI와 조회 방법
- [MCP 컨텍스트](11-mcp-context.md) — get_context 상세
