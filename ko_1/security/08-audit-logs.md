# 감사 로그

> 프로젝트의 관리 작업 이력을 조회하는 방법을 안내합니다.

## 개요

bkend는 모든 관리 작업을 자동으로 감사 로그에 기록합니다. 콘솔의 Organization 설정에서 감사 로그를 조회할 수 있습니다.

---

## 콘솔에서 감사 로그 조회하기

1. 콘솔 상단에서 Organization을 선택하세요.
2. **설정** 메뉴로 이동하세요.
3. **Audit** 탭을 클릭하세요.
4. 필요한 경우 엔티티 타입이나 액션으로 필터링하세요.

---

## 기록되는 이벤트

### 조직 이벤트

| 이벤트 | 설명 |
|--------|------|
| `organization_created` | 조직 생성 |
| `organization_updated` | 조직 정보 수정 |
| `organization_deleted` | 조직 삭제 |

### 프로젝트 이벤트

| 이벤트 | 설명 |
|--------|------|
| `project_created` | 프로젝트 생성 |
| `project_updated` | 프로젝트 수정 |
| `project_deleted` | 프로젝트 삭제 |

### 환경 이벤트

| 이벤트 | 설명 |
|--------|------|
| `environment_created` | 환경 생성 |
| `environment_deployed` | 환경 배포 |
| `environment_updated` | 환경 수정 |
| `environment_deleted` | 환경 삭제 |

### 테이블 이벤트

| 이벤트 | 설명 |
|--------|------|
| `table_created` | 테이블 생성 |
| `table_updated` | 테이블 수정 |
| `table_deleted` | 테이블 삭제 |

### API Key 이벤트

| 이벤트 | 설명 |
|--------|------|
| `access_token_created` | API Key 생성 |
| `access_token_updated` | API Key 수정 |
| `access_token_deleted` | API Key 폐기 |

### 팀 멤버 이벤트

| 이벤트 | 설명 |
|--------|------|
| `invitation_created` | 멤버 초대 |
| `invitation_accepted` | 초대 수락 |
| `invitation_revoked` | 초대 취소 |
| `member_role_updated` | 멤버 역할 변경 |
| `member_removed` | 멤버 제거 |

---

## 필터링

| 필터 | 옵션 |
|------|------|
| **엔티티 타입** | organization, project, environment, table, access_token, invitation, member |
| **액션** | created, updated, deleted, deployed, accepted, revoked |

---

## 감사 로그 필드

| 필드 | 설명 |
|------|------|
| **이벤트** | 이벤트 타입 |
| **수행자** | 작업을 수행한 Tenant |
| **대상** | 변경된 리소스 |
| **메시지** | 작업 설명 |
| **시간** | 작업 수행 시점 |
| **메타데이터** | 변경된 데이터 상세 |

---

## 로그인 이벤트

로그인 시도는 별도의 감사 로그에 기록됩니다.

| 필드 | 설명 |
|------|------|
| **제공자** | 인증 방식 (email, google, github) |
| **상태** | success, failed, blocked |
| **실패 사유** | invalid_credentials, account_locked, too_many_attempts 등 |
| **IP 주소** | 접속 IP |
| **User Agent** | 브라우저 정보 |
| **지역** | 접속 국가/도시 |

---

## 관련 문서

- [보안 개요](01-overview.md) — 보안 모델 소개
- [보안 모범 사례](09-best-practices.md) — 보안 권장사항
- [콘솔에서 Auth 관리](../authentication/02-console-ui.md) — 유저 활동 로그
