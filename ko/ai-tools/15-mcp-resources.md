# MCP 리소스

{% hint style="info" %}
💡 bkend MCP 서버가 제공하는 리소스 URI와 조회 방법을 확인합니다.
{% endhint %}

## 개요

MCP 리소스는 AI 도구가 읽을 수 있는 데이터를 URI 기반으로 제공합니다. bkend MCP는 Organization, Project, Environment, Table 등의 리소스를 `bkend://` URI 스키마로 노출합니다.

***

## URI 스키마

bkend MCP 리소스는 `bkend://` prefix를 사용합니다.

### 리소스 계층

```
bkend://organizations
  └── bkend://organizations/{organizationId}
        └── bkend://organizations/{organizationId}/projects
              └── bkend://projects/{projectId}
                    └── bkend://projects/{projectId}/environments
                          └── bkend://projects/{projectId}/environments/{environment}
                                └── bkend://projects/{projectId}/environments/{environment}/tables
                                      └── bkend://projects/{projectId}/environments/{environment}/tables/{tableName}
```

***

## 리소스 목록

### Organization 리소스

| URI | 설명 |
|-----|------|
| `bkend://organizations` | Organization 목록 |
| `bkend://organizations/{organizationId}` | Organization 상세 |
| `bkend://organizations/{organizationId}/projects` | Organization의 Project 목록 |

### Project 리소스

| URI | 설명 |
|-----|------|
| `bkend://projects/{projectId}` | Project 상세 |
| `bkend://projects/{projectId}/environments` | Environment 목록 |

### Environment 리소스

| URI | 설명 |
|-----|------|
| `bkend://projects/{projectId}/environments/{environment}` | Environment 상세 |
| `bkend://projects/{projectId}/environments/{environment}/tables` | 테이블 목록 |

### Table 리소스

| URI | 설명 |
|-----|------|
| `bkend://projects/{projectId}/environments/{environment}/tables/{tableName}` | 테이블 상세 (스키마 포함) |
| `bkend://.../tables/{tableName}/schema/versions` | 스키마 버전 이력 |
| `bkend://.../tables/{tableName}/indexes/versions` | 인덱스 버전 이력 |

***

## 리소스 조회

### resources/list

사용 가능한 리소스 목록을 조회합니다.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list"
}
```

**응답:**

```json
{
  "resources": [
    {
      "uri": "bkend://organizations",
      "name": "Organizations",
      "description": "Organization 목록 조회",
      "mimeType": "application/json"
    },
    {
      "uri": "bkend://organizations/{organizationId}/projects",
      "name": "Projects",
      "description": "Organization의 Project 목록",
      "mimeType": "application/json"
    }
  ]
}
```

### resources/read

특정 리소스의 데이터를 조회합니다.

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "bkend://organizations"
  }
}
```

**응답:**

```json
{
  "contents": [
    {
      "uri": "bkend://organizations",
      "mimeType": "application/json",
      "text": "[{\"id\":\"org-uuid\",\"name\":\"My Organization\",\"plan\":\"pro\"}]"
    }
  ]
}
```

***

## 캐싱

MCP 리소스 조회 결과는 서버에서 자동으로 캐싱됩니다.

| 항목 | 값 |
|------|-----|
| 캐시 TTL | 60초 |
| 캐시 격리 | Organization 단위 |
| 캐시 저장소 | Redis |

{% hint style="info" %}
💡 리소스 데이터가 변경된 직후에는 캐시로 인해 이전 데이터가 반환될 수 있습니다. 최대 60초 후 자동 갱신됩니다.
{% endhint %}

***

## 리소스 vs 도구

| 비교 | 리소스 (Resources) | 도구 (Tools) |
|------|-------------------|-------------|
| **목적** | 데이터 읽기 | 데이터 읽기/쓰기 |
| **메서드** | `resources/read` | `tools/call` |
| **캐싱** | 서버 캐시 (60초) | 캐시 없음 |
| **적합한 작업** | 목록 조회, 상태 확인 | 생성, 수정, 삭제 |

***

## 다음 단계

- [Database MCP 도구](12-mcp-db-tools.md) — 도구를 통한 데이터 관리
- [MCP 컨텍스트](11-mcp-context.md) — 세션 컨텍스트 상세
- [MCP 프로토콜 이해](02-mcp-protocol.md) — MCP 프로토콜 상세
