# MCP 컨텍스트 (get_context)

{% hint style="info" %}
💡 MCP 세션 시작 시 자동 호출되는 `0_get_context` 도구의 반환 정보를 이해합니다.
{% endhint %}

## 개요

`0_get_context`는 MCP 세션이 시작될 때 AI 도구가 자동으로 호출하는 도구입니다. bkend의 리소스 계층, 인증 레이어, API 엔드포인트 등 세션에 필요한 전체 컨텍스트를 반환합니다.

***

## 도구 정보

| 항목 | 값 |
|------|-----|
| 도구 이름 | `0_get_context` |
| 설명 | 세션 시작 시 필수 호출 — 리소스 계층 및 주의사항 안내 |
| 입력 파라미터 | 없음 |
| 호출 시점 | 매 세션 시작 시 자동 호출 |

***

## 반환 정보

### 리소스 계층 (Resource Hierarchy)

bkend의 리소스 구조를 안내합니다.

```
Organization
  └── Project
        └── Environment (dev / staging / prod)
              └── Table
                    ├── Fields (컬럼)
                    └── Indexes (인덱스)
```

### 리소스 ID 조회 방법

각 리소스의 ID를 어떤 도구로 얻을 수 있는지 안내합니다.

| 리소스 | 조회 도구 |
|--------|----------|
| Organization ID | `backend_org_list` |
| Project ID | `backend_project_list` |
| Environment | `backend_env_list` |
| Table 목록 | `backend_table_list` |

### 인증 레이어

MCP OAuth와 앱 서비스 API의 차이를 안내합니다.

| 레이어 | 용도 | 인증 방식 |
|--------|------|----------|
| MCP OAuth | AI 도구에서 관리 작업 | OAuth 2.1 JWT |
| 서비스 API | 앱에서 데이터 CRUD | `Authorization: Bearer {accessToken}` + 프로젝트 헤더 |

### API 엔드포인트

환경별 서비스 API 엔드포인트를 안내합니다.

| 환경 | 엔드포인트 |
|------|----------|
| dev | `https://api-client.bkend.ai` |
| staging | `https://api-client.bkend.ai` |
| prod | `https://api-client.bkend.ai` |

### 필수 헤더

서비스 API 호출 시 필요한 헤더를 안내합니다.

| 헤더 | 필수 | 설명 |
|------|:----:|------|
| `X-Project-Id` | ✅ | 프로젝트 ID |
| `X-Environment` | ✅ | `dev` / `staging` / `prod` |
| `Authorization` | 조건부 | `Bearer {accessToken}` |

### 주요 경고

데이터 사용 시 주의사항을 안내합니다.

{% hint style="warning" %}
⚠️ **데이터 구조 주의** — 목록 조회 응답은 `data.items` 배열 구조입니다. `data` 직접 접근 시 오류가 발생할 수 있습니다.
{% endhint %}

{% hint style="warning" %}
⚠️ **ID 필드** — 문서의 고유 식별자는 `id` 필드입니다 (`_id` 아님).
{% endhint %}

***

## 동적 정보

`0_get_context`는 정적 콘텐츠와 함께 세션별 동적 정보도 반환합니다.

| 항목 | 설명 |
|------|------|
| Organization ID | 현재 MCP 세션에 연결된 Organization |
| 사용자 ID | 인증된 사용자 |

***

## 다음 단계

- [Database MCP 도구](12-mcp-db-tools.md) — 테이블/필드/인덱스 관리 도구
- [MCP 리소스](15-mcp-resources.md) — 리소스 URI와 조회 방법
- [AI 도구 연동 개요](01-overview.md) — 전체 도구 목록
