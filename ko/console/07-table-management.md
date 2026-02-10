# 테이블 관리

{% hint style="info" %}
💡 콘솔에서 데이터베이스 테이블을 생성하고 관리하세요. 테이블은 데이터를 저장하는 기본 단위입니다.
{% endhint %}

## 개요

데이터베이스 테이블은 콘솔 UI 또는 MCP 도구로 생성하고 관리합니다. 테이블을 생성하면 해당 환경에서 REST API로 데이터를 CRUD할 수 있습니다.

```mermaid
flowchart LR
    A[Tenant] -->|콘솔 / MCP| B[테이블 생성]
    B --> C[스키마 정의]
    C --> D[데이터 CRUD 가능]
    E[User 앱] -->|REST API| D
```

***

## 테이블 목록 조회하기

1. 프로젝트를 선택하세요.
2. 사이드바에서 **데이터베이스**를 클릭하세요.
3. 상단 탭에서 환경을 선택하세요 (dev / staging / prod).

<!-- 📸 IMG: 테이블 목록 화면 -->
![테이블 목록](../.gitbook/assets/2026-02/console-table-list.png)

### 테이블 목록 컬럼

| 컬럼 | 설명 |
|------|------|
| 이름 | 테이블명 |
| 상태 | deployed, deploying, updating, failed |
| 행 수 | 테이블에 저장된 데이터 건수 |
| 업데이트됨 | 마지막 수정 날짜 |

{% hint style="info" %}
💡 검색창에 테이블 이름을 입력하여 빠르게 찾을 수 있습니다.
{% endhint %}

***

## 테이블 생성하기

1. **테이블 생성** 버튼을 클릭하세요.
2. 테이블 이름을 입력하세요.
3. 필드를 추가하세요.
4. **생성**을 클릭하세요.

<!-- 📸 IMG: 테이블 생성 모달 -->
![테이블 생성](../.gitbook/assets/2026-02/console-table-create.png)

### 테이블 이름 규칙

- 소문자, 숫자, 언더스코어(`_`)만 사용 가능
- 반드시 영문자로 시작
- 예: `posts`, `user_profiles`, `order_items`

### 시스템 필드

모든 테이블에 자동으로 생성되는 필드입니다. 수정하거나 삭제할 수 없습니다.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `_id` | String | 문서 고유 ID |
| `createdBy` | String | 생성자 ID |
| `createdAt` | Date | 생성 시간 |
| `updatedAt` | Date | 마지막 수정 시간 |

### 커스텀 필드 추가

**필드 추가** 버튼을 클릭하고 다음 정보를 입력하세요.

| 항목 | 설명 |
|------|------|
| **필드명** | 영문자로 시작, 영문/숫자/언더스코어 허용 |
| **타입** | String, Number, Boolean, Date, Array, Object, Mixed |
| **Required** | 필수 여부 체크 |

### 기본 권한

테이블 생성 시 다음 기본 역할이 자동으로 설정됩니다.

| 역할 | 생성 | 읽기 | 수정 | 삭제 |
|------|:----:|:----:|:----:|:----:|
| admin | ✅ | ✅ | ✅ | ✅ |
| user | ✅ | ✅ | ✅ | ❌ |
| guest | ❌ | ✅ | ❌ | ❌ |

{% hint style="info" %}
💡 AI 도구에서도 자연어로 테이블을 생성할 수 있습니다. 자세한 내용은 [Database MCP 도구](../ai-tools/12-mcp-db-tools.md)를 참고하세요.
{% endhint %}

***

## 테이블 상세 보기

테이블을 클릭하면 상세 페이지가 표시됩니다. 다음 탭으로 구성됩니다.

| 탭 | 설명 |
|-----|------|
| **Data** | 테이블 데이터 조회 및 편집 |
| **Schema** | 필드 정의 관리 |
| **Indexes** | 인덱스 생성 및 관리 |
| **Permissions** | 역할별 CRUD 권한 설정 |
| **API Docs** | REST API 문서 |

### Data 탭

테이블에 저장된 데이터를 콘솔에서 직접 조회하고 편집할 수 있습니다. 개발 중 테스트 데이터를 확인하거나 수동으로 데이터를 추가/수정할 때 유용합니다.

{% hint style="info" %}
💡 Data 탭은 **테스트/확인 용도**입니다. 앱에서 데이터를 생성·조회·수정·삭제할 때는 REST API를 사용하세요. → [데이터 CRUD 앱 패턴](../database/12-crud-app-patterns.md)
{% endhint %}

### Permissions 탭

역할별로 CRUD 권한을 세밀하게 설정할 수 있습니다.

1. 테이블 상세 페이지에서 **Permissions** 탭을 클릭하세요.
2. 각 역할(`admin`, `user`, `guest`)의 **생성 / 읽기 / 수정 / 삭제** 권한을 토글하세요.
3. **저장**을 클릭하세요.

| 역할 | 설명 | 기본 권한 |
|------|------|----------|
| `admin` | 모든 데이터에 접근 가능 | 생성 ✅ 읽기 ✅ 수정 ✅ 삭제 ✅ |
| `user` | 인증된 사용자 | 생성 ✅ 읽기 ✅ 수정 ✅ 삭제 ❌ |
| `guest` | 인증 없는 사용자 | 생성 ❌ 읽기 ✅ 수정 ❌ 삭제 ❌ |

{% hint style="warning" %}
⚠️ 앱에서 `403 Forbidden` 에러가 발생하면 이 탭에서 해당 역할에 필요한 권한이 부여되어 있는지 확인하세요.
{% endhint %}

***

## 테이블 삭제하기

{% hint style="danger" %}
🚨 **위험** — 테이블을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.
{% endhint %}

1. 테이블 상세 페이지에서 **더보기(⋯)** 메뉴를 클릭하세요.
2. **Delete Table**을 선택하세요.
3. 테이블 이름을 입력하여 확인하세요.
4. **삭제**를 클릭하세요.

***

## 테이블 생성 후: 앱에서 REST API로 데이터 관리

콘솔에서 테이블을 생성하고 권한을 설정했다면, 앱에서 REST API로 데이터를 CRUD할 수 있습니다.

```mermaid
flowchart LR
    A["1. 콘솔에서<br/>테이블 생성"] --> B["2. Permissions<br/>권한 설정"]
    B --> C["3. API Key<br/>발급"]
    C --> D["4. 앱에서<br/>REST API CRUD"]
```

| 단계 | 확인 위치 | 다음 문서 |
|:----:|----------|----------|
| 1~2 | 이 문서 참고 | — |
| 3 | 콘솔 → **액세스 토큰** → **새 토큰 생성** | [API 키 관리](11-api-keys.md) |
| 4 | 앱 코드 | [앱에서 bkend 연동하기](../getting-started/06-app-integration.md) |

데이터 CRUD 구현 패턴은 [데이터 CRUD 앱 패턴](../database/12-crud-app-patterns.md)을 참고하세요.

***

## 다음 단계

- [스키마 편집기](08-schema-editor.md) — 필드를 추가하고 수정하세요
- [인덱스 관리](09-index-management.md) — 인덱스를 생성하세요
- [앱에서 bkend 연동하기](../getting-started/06-app-integration.md) — REST API 연동 설정
- [데이터 CRUD 앱 패턴](../database/12-crud-app-patterns.md) — 앱에서 데이터 관리하기
- [데이터 생성](../database/03-insert.md) — REST API로 데이터를 삽입하세요
