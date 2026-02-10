# API 키 관리

{% hint style="info" %}
💡 접근 토큰을 생성하여 MCP 도구와 REST API에서 bkend에 접근하세요.
{% endhint %}

## 개요

bkend의 접근 토큰은 Organization 레벨에서 관리됩니다. 토큰을 생성하면 MCP 도구 또는 REST API로 프로젝트의 데이터에 접근할 수 있습니다.

***

## 토큰 목록 조회하기

1. 사이드바에서 **액세스 토큰**을 클릭하세요.
2. 활성 토큰과 비활성 토큰이 분리되어 표시됩니다.

<!-- 📸 IMG: API 키 목록 화면 -->
![API 키 목록](../.gitbook/assets/2026-02/console-api-keys.png)

### 활성 토큰 테이블

| 컬럼 | 설명 |
|------|------|
| 이름 | 토큰 이름 |
| 타입 | API_KEY / BEARER_TOKEN |
| 권한 범위 | 부여된 권한 목록 |
| 생성자 | 생성한 사용자와 역할 |
| 마지막 사용 | 마지막으로 사용된 날짜 |
| 생성일 | 토큰 생성 날짜 |
| 액션 | 권한 보기, 취소 |

### 비활성 토큰 테이블

취소되었거나 만료된 토큰이 표시됩니다. 비활성 토큰으로는 API에 접근할 수 없습니다.

***

## 토큰 생성하기

1. **새 토큰 생성** 버튼을 클릭하세요.
2. 다음 정보를 입력하세요.

| 필드 | 필수 | 설명 |
|------|:----:|------|
| **토큰 이름** | ✅ | 토큰을 식별하는 이름 |
| **토큰 타입** | ✅ | API_KEY 또는 BEARER_TOKEN |
| **권한 범위** | ✅ | 하나 이상의 권한 선택 |

<!-- 📸 IMG: API 키 생성 모달 -->
![API 키 생성](../.gitbook/assets/2026-02/console-api-key-create.png)

### 권한 범위 (Scopes)

| 그룹 | 권한 | 설명 |
|------|------|------|
| **Project** | `project:read`, `project:create`, `project:update`, `project:delete` | 프로젝트 CRUD |
| **Environment** | `environment:read`, `environment:create`, `environment:update`, `environment:delete` | 환경 CRUD |
| **Table** | `table:read`, `table:create`, `table:update`, `table:delete` | 테이블 스키마 CRUD |
| **Table Data** | `table:data:read`, `table:data:create`, `table:data:update`, `table:data:delete` | 테이블 데이터 CRUD |
| **Dashboard** | `dashboard:read` | 대시보드 조회 |
| **전체** | `*:*` | 모든 권한 |

{% hint style="info" %}
💡 `*:*` (전체 권한)를 선택하면 모든 리소스에 대한 모든 액션이 자동으로 선택됩니다.
{% endhint %}

3. **생성**을 클릭하세요.

### 토큰 확인

{% hint style="danger" %}
🚨 **위험** — 생성된 토큰은 **한 번만** 표시됩니다. 대화상자를 닫으면 다시 확인할 수 없으므로 반드시 안전한 곳에 저장하세요.
{% endhint %}

- **복사** 버튼을 클릭하여 토큰을 클립보드에 복사하세요.
- 비밀번호 관리자나 환경 변수에 저장하세요.

***

## 토큰 취소하기

1. 토큰 목록에서 해당 토큰의 **더보기(⋯)** 메뉴를 클릭하세요.
2. **Revoke**를 선택하세요.
3. 확인 대화상자에서 **취소**를 클릭하세요.

{% hint style="warning" %}
⚠️ 취소된 토큰은 즉시 비활성화되며, 해당 토큰으로는 더 이상 API에 접근할 수 없습니다.
{% endhint %}

***

## 앱에서 토큰 사용하기

콘솔에서 발급한 토큰을 앱의 REST API 요청에 사용합니다. `Authorization: Bearer {토큰}` 헤더에 포함하세요.

```bash
curl -X GET https://api-client.bkend.ai/v1/data/posts \
  -H "Authorization: Bearer {발급받은_토큰}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

앱에서 fetch 헬퍼를 활용한 연동 방법은 [앱에서 bkend 연동하기](../getting-started/06-app-integration.md)를 참고하세요.

***

## 다음 단계

- [앱에서 bkend 연동하기](../getting-started/06-app-integration.md) — 앱에 API Key 설정하기
- [API 키 이해](../security/02-api-keys.md) — 키 구조와 보안 특성
- [AI 도구 연동 개요](../ai-tools/01-overview.md) — MCP 도구를 연결하세요
- [보안 모범 사례](../security/07-best-practices.md) — 키 관리 모범 사례
