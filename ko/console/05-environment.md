# 환경 관리

{% hint style="info" %}
💡 Environment는 데이터가 격리되는 단위입니다. dev, staging, prod 환경으로 개발과 운영을 분리하세요.
{% endhint %}

## 개요

Environment는 프로젝트 내에서 데이터를 격리하는 단위입니다. 프로젝트를 생성하면 `dev` 환경이 자동으로 프로비저닝됩니다. 각 환경은 독립된 데이터베이스, 사용자 풀, 파일 저장소, API Key를 가집니다.

***

## 환경 조회하기

1. 프로젝트를 선택하세요.
2. 사이드바에서 **환경**을 클릭하세요.

<!-- 📸 IMG: 환경 목록 화면 -->
![환경 목록](../.gitbook/assets/2026-02/console-env-list.png)

### 환경 카드 정보

| 항목 | 설명 |
|------|------|
| 환경명 | 환경 이름 (예: dev, staging, prod) |
| 상태 | creating, ready, active, failed, deleting |
| 클라우드 | 클라우드 제공자 |
| 리전 | 데이터 저장 위치 |
| 클러스터 정보 | staging/prod 환경에서 전용 클러스터 정보 표시 |
| 생성 날짜 | 환경 생성일 |

### 환경 상태

| 상태 | 설명 |
|------|------|
| `creating` | 환경 프로비저닝 중 |
| `ready` | 프로비저닝 완료, 사용 가능 |
| `active` | 활성 상태 |
| `failed` | 프로비저닝 실패 (에러 메시지 확인) |
| `deleting` | 삭제 진행 중 |

{% hint style="warning" %}
⚠️ `dev` 환경은 공유 클러스터에서 실행됩니다. `staging`과 `prod` 환경은 전용 클러스터에서 실행됩니다.
{% endhint %}

***

## 환경 간 데이터 격리

| 데이터 | 환경 간 공유 | 설명 |
|--------|:---------:|------|
| 테이블 스키마 | ❌ | 환경별 독립 스키마 |
| 테이블 데이터 | ❌ | 환경별 독립 데이터 |
| User | ❌ | 환경별 독립 User 풀 |
| API Key | ❌ | 환경별 독립 Key |
| 파일 | ❌ | 환경별 독립 저장소 |
| 프로젝트 설정 | ✅ | 모든 환경에서 공유 |
| 팀 멤버 | ✅ | Organization 단위로 공유 |

***

## 환경 전환하기

데이터베이스, 스토리지 등의 페이지에서 상단 탭으로 환경을 전환할 수 있습니다.

<!-- 📸 IMG: 환경 전환 탭 -->
![환경 전환](../.gitbook/assets/2026-02/console-env-switch.png)

{% hint style="warning" %}
⚠️ 환경을 전환하면 다른 데이터가 표시됩니다. `dev`에서 작업한 데이터는 `prod`에 자동으로 반영되지 않습니다.
{% endhint %}

***

## 예정 기능

{% hint style="info" %}
💡 다음 기능이 준비 중입니다:
- GitHub Integration
- Database Branching
- Migrations
- Environment Variables
{% endhint %}

***

## 다음 단계

- [테이블 관리](07-table-management.md) — 환경별 테이블을 생성하세요
- [API 키 관리](11-api-keys.md) — 환경별 API Key를 발급하세요
- [프로젝트 설정](12-settings.md) — 프로젝트 설정을 변경하세요
