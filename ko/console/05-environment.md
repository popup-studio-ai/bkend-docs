# 환경 관리

{% hint style="info" %}
💡 Environment는 데이터가 격리되는 단위입니다. dev, staging, prod 환경을 생성하고 관리하는 방법을 안내합니다.
{% endhint %}

## 개요

환경은 프로젝트 내에서 데이터를 격리하는 단위입니다. 개발(`dev`), 스테이징(`staging`), 운영(`prod`) 환경을 별도로 생성하여 안전하게 개발하고 배포할 수 있습니다.

***

## 환경 목록 확인하기

1. 프로젝트 레벨 사이드바에서 **환경**을 클릭하세요.
2. 현재 프로젝트의 모든 환경 목록을 확인합니다.

| 표시 정보 | 설명 |
|----------|------|
| **환경 이름** | dev, staging, prod 등 |
| **타입** | Development / Staging / Production / Custom |
| **상태** | Creating / Ready / Active / Failed / Deleting |
| **생성일** | 환경 생성 일시 |

***

## 환경 생성하기

1. 환경 목록에서 **환경 생성** 버튼을 클릭하세요.
2. 환경 이름을 입력하세요 (예: `staging`).
3. **생성**을 클릭하세요.

{% hint style="warning" %}
⚠️ 환경 프로비저닝에 약 30초가 소요됩니다. **Active** 상태가 될 때까지 기다리세요.
{% endhint %}

{% hint style="warning" %}
⚠️ **Free 요금제**에서는 `dev` 환경만 생성할 수 있습니다. `staging`, `production` 환경이 필요하면 유료 플랜으로 업그레이드하세요.
{% endhint %}

***

## 환경 전환하기

콘솔 상단의 환경 선택 탭에서 작업할 환경을 전환할 수 있습니다. 환경을 전환하면 해당 환경의 테이블, User, 파일 데이터가 표시됩니다.

{% hint style="warning" %}
⚠️ 환경 간 데이터는 완전히 격리되어 있습니다. `dev` 환경에서 생성한 테이블과 데이터는 `prod` 환경에 존재하지 않습니다.
{% endhint %}

***

## 환경별 격리 범위

| 데이터 | 환경별 격리 | 설명 |
|--------|:---------:|------|
| 테이블 스키마 | ✅ | 환경마다 독립적인 테이블 구조 |
| 테이블 데이터 | ✅ | 환경마다 독립적인 데이터 |
| User | ✅ | 환경마다 독립적인 사용자 풀 |
| API Key | ✅ | 환경마다 독립적인 토큰 |
| 파일 | ✅ | 환경마다 독립적인 저장소 |

***

## REST API에서 환경 지정하기

API Key는 환경별로 발급됩니다. `X-API-Key` 헤더에 해당 환경의 API Key를 사용하면 자동으로 해당 환경에 접근합니다.

```bash
curl https://api-client.bkend.ai/v1/data/posts \
  -H "X-API-Key: {pk_publishable_key}"
```

***

## 다음 단계

- [팀원 관리](06-team-management.md) — 팀원 초대 및 역할 설정
- [테이블 관리](07-table-management.md) — 환경에 테이블 생성
- [API 키 관리](11-api-keys.md) — 환경별 API Key 발급
