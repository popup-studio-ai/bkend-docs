# Database MCP 도구

> Database 관련 MCP 도구의 명세와 사용법을 안내합니다.

## 개요

Database MCP 도구를 사용하면 AI 코딩 도구에서 테이블 생성, 스키마 관리, 데이터 CRUD를 수행할 수 있습니다.

---

## 문서 도구

### `0_get_context`

세션 시작 시 호출하는 필수 도구입니다. 조직 ID, 프로젝트 ID, 환경 정보를 반환합니다.

| 항목 | 값 |
|------|-----|
| **파라미터** | 없음 |
| **스코프** | 없음 |

### `1_concepts`

BSON 스키마, 역할/권한, 프로젝트/환경/테이블 계층 구조를 설명합니다.

| 항목 | 값 |
|------|-----|
| **파라미터** | 없음 |
| **스코프** | 없음 |

### `2_tutorial`

프로젝트 생성부터 테이블 생성, 인덱스/권한 설정까지 단계별 가이드를 제공합니다.

| 항목 | 값 |
|------|-----|
| **파라미터** | 없음 |
| **스코프** | 없음 |

### `4_howto_implement_data_crud`

서비스 API를 사용한 데이터 CRUD 구현 가이드와 필터링/정렬/페이지네이션 패턴을 제공합니다.

| 항목 | 값 |
|------|-----|
| **파라미터** | 없음 |
| **스코프** | 없음 |

### `5_get_operation_schema`

특정 API operation의 입출력 스키마를 동적으로 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `operation` | string | ✅ | API operation 이름 |
| `schemaType` | string | - | `input`, `output`, `both` (기본값: `output`) |

---

## 테이블 관리 도구

### `backend_table_create`

새 테이블을 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `body` | object | ✅ | 테이블 정의 (이름, 스키마, 권한) |

**스코프**: `table:create`

### `backend_table_list`

환경의 모든 테이블 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |

**스코프**: `table:read`

### `backend_table_get`

특정 테이블의 상세 정보(스키마, 권한, 인덱스)를 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `tableName` | string | ✅ | 테이블 이름 |

**스코프**: `table:read`

### `backend_table_update`

테이블 설정(권한, MCP 설정)을 수정합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `tableName` | string | ✅ | 테이블 이름 |
| `body` | object | ✅ | 수정할 설정 |

**스코프**: `table:update`

### `backend_table_delete`

테이블을 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `tableName` | string | ✅ | 테이블 이름 |

**스코프**: `table:delete`

---

## 스키마 관리 도구

### `backend_field_manage`

테이블 필드를 추가, 수정, 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `tableName` | string | ✅ | 테이블 이름 |
| `body` | object | ✅ | 필드 변경 사항 |

**body 구조**:

```json
{
  "fieldsToAddOrUpdate": {
    "age": { "bsonType": "int", "minimum": 0 }
  },
  "fieldsToRemove": ["oldField"],
  "requiredFieldsToAdd": ["age"],
  "requiredFieldsToRemove": ["oldField"]
}
```

**스코프**: `table:update`

### `backend_schema_version_list`

테이블의 스키마 버전 이력을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `tableName` | string | ✅ | 테이블 이름 |

**스코프**: `table:read`

### `backend_schema_rollback`

스키마를 특정 버전으로 롤백합니다 (새 버전으로 생성).

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `tableName` | string | ✅ | 테이블 이름 |
| `body` | object | ✅ | `{ "targetVersion": 2 }` |

**스코프**: `table:update`

---

## 인덱스 관리 도구

### `backend_index_manage`

테이블 인덱스를 추가, 수정, 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `projectId` | string | ✅ | 프로젝트 ID |
| `environment` | string | ✅ | 환경 이름 |
| `tableName` | string | ✅ | 테이블 이름 |
| `body` | object | ✅ | 인덱스 변경 사항 |

**스코프**: `table:update`

### `backend_index_version_list`

인덱스 버전 이력을 조회합니다.

**스코프**: `table:read`

### `backend_index_rollback`

인덱스를 특정 버전으로 롤백합니다.

**스코프**: `table:update`

---

## 관련 문서

- [MCP 프로토콜](02-mcp-protocol.md) — MCP 프로토콜 상세
- [Auth MCP 도구](04-auth-tools.md) — Auth 관련 도구
- [REST Database](07-rest-database.md) — REST API Database 엔드포인트
