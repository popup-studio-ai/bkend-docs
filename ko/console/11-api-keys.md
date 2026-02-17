# API 키 관리

{% hint style="info" %}
💡 REST API를 호출하기 위한 API Key를 발급하고 관리하는 방법을 안내합니다.
{% endhint %}

## 개요

앱에서 bkend REST API를 호출하려면 API Key가 필요합니다. API Key는 환경별로 독립적으로 관리됩니다. **Publishable Key**(클라이언트용)와 **Secret Key**(서버용) 두 가지 유형이 있습니다.

***

## API Keys 페이지 열기

프로젝트 레벨 사이드바에서 **API Keys**를 클릭하세요.

페이지는 두 섹션으로 나뉩니다.

| 섹션 | 접두사 | 용도 |
|------|--------|------|
| **Publishable Keys** | `pk_` | 클라이언트 사이드 (브라우저, 모바일 앱) — 제한된 권한 |
| **Secret Keys** | `sk_` | 서버 사이드 전용 — 전체 권한 |

***

## Publishable Key 생성하기

1. **Publishable Keys** 섹션에서 **Add Key** 버튼을 클릭하세요.
2. 이름을 입력하고 (예: `my-app-key`) **Create**를 클릭하세요.
3. 키가 표시됩니다. 즉시 복사하세요.

{% hint style="danger" %}
🚨 **위험** — 키는 생성 시 한 번만 표시됩니다. 분실 시 삭제 후 새로 생성해야 합니다.
{% endhint %}

***

## Secret Key 생성하기

1. **Secret Keys** 섹션에서 **Add Key** 버튼을 클릭하세요.
2. 이름을 입력하고 (예: `server-key`) **Create**를 클릭하세요.
3. 키가 표시됩니다. 즉시 복사하세요.

{% hint style="warning" %}
⚠️ Secret Key(`sk_` 접두사)는 클라이언트에 절대 노출하지 마세요. 서버 사이드 환경에서만 사용하세요.
{% endhint %}

***

## API Key 사용하기

Publishable Key를 `X-API-Key` 헤더에 포함합니다. 인증된 요청이 필요한 경우 `Authorization` 헤더를 추가하세요.

```bash
curl https://api-client.bkend.ai/v1/data/posts \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

***

## API Key 목록 확인하기

API Keys 페이지에서 현재 환경의 모든 키를 확인합니다.

| 표시 정보 | 설명 |
|----------|------|
| **Name** | 키 식별 이름 |
| **Key** | 마스킹된 키 값 (클릭하여 복사) |
| **Actions** | 삭제 버튼 |

***

## API Key 삭제하기

1. 목록에서 삭제할 키를 찾으세요.
2. **Delete** 버튼을 클릭하세요.
3. 확인 후 즉시 해당 키가 무효화됩니다.

{% hint style="warning" %}
⚠️ 키를 삭제하면 해당 키를 사용하는 모든 앱에서 API 호출이 실패합니다. 앱의 키를 먼저 교체한 후 삭제하세요.
{% endhint %}

***

## 다음 단계

- [프로젝트 설정](12-settings.md) — Project ID 확인 및 기타 설정
- [API 키 이해](../security/02-api-keys.md) — Publishable Key vs Secret Key
- [앱에서 bkend 연동하기](../getting-started/03-app-integration.md) — fetch 헬퍼로 API 연동
