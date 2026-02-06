# API Key 관리

> API Key를 생성하고 관리하는 방법을 안내합니다.

## 개요

API Key는 서비스 API를 호출할 때 프로젝트를 식별하는 인증 수단입니다. Organization의 Owner 또는 Admin 역할을 가진 Tenant가 생성할 수 있습니다.

---

## API Key 타입

| 타입 | 접두사 | 설명 |
|------|--------|------|
| **API Key** | `ak_` | 서비스 API 호출용 |
| **Bearer Token** | `bt_` | Bearer 인증용 |

---

## API Key 생성하기

콘솔의 Organization 설정 또는 API를 통해 API Key를 생성합니다.

### 요청

```bash
curl -X POST "https://api.bkend.ai/v1/organizations/{organizationId}/access-tokens" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "type": "API_KEY",
    "scopes": ["project:read", "table:data:*"],
    "projectIds": ["{project_id}"],
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

### 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `name` | string | ✅ | API Key 이름 |
| `type` | string | ✅ | `API_KEY` 또는 `BEARER_TOKEN` |
| `scopes` | string[] | ✅ | 권한 범위 |
| `projectIds` | string[] | - | 프로젝트 범위 (미지정 시 전체 조직) |
| `expiresAt` | string | - | 만료 시간 (ISO 8601) |

> ❌ **위험** - 원본 API Key는 생성 시에만 표시됩니다. 안전한 곳에 저장하세요. 이후에는 다시 조회할 수 없습니다.

---

## API Key 보안

| 항목 | 설명 |
|------|------|
| **저장 방식** | SHA256 해시 (원본 미저장) |
| **마스킹** | UI에서 `ak_8930****...dcbb` 형태로 표시 |
| **만료** | 선택적 시간 기반 만료 |
| **폐기** | 즉시 비활성화 가능 |

---

## API Key 목록 조회하기

```bash
curl -X GET "https://api.bkend.ai/v1/organizations/{organizationId}/access-tokens" \
  -H "Authorization: Bearer {accessToken}"
```

---

## API Key 폐기하기

```bash
curl -X DELETE "https://api.bkend.ai/v1/organizations/{organizationId}/access-tokens/{accessTokenId}" \
  -H "Authorization: Bearer {accessToken}"
```

---

## 관련 문서

- [콘솔에서 Key 관리](03-api-key-console.md) — 콘솔 UI 가이드
- [Public vs Secret Key](04-public-vs-secret.md) — Key 타입 차이
- [보안 개요](01-overview.md) — 보안 모델 소개
