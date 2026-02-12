# API 키 관리

{% hint style="info" %}
💡 REST API를 호출하기 위한 API Key(액세스 토큰)를 발급하고 관리하는 방법을 안내합니다.
{% endhint %}

## 개요

앱에서 bkend REST API를 호출하려면 API Key가 필요합니다. API Key는 환경별로 독립적으로 관리되며, 권한 범위를 설정할 수 있습니다.

***

## API Key 발급하기

1. 프로젝트 레벨 사이드바에서 **설정**을 클릭하세요.
2. **액세스 토큰** 섹션에서 **새 토큰 생성** 버튼을 클릭하세요.
3. 다음 정보를 입력하세요.

| 필드 | 설명 |
|------|------|
| **토큰 이름** | 식별을 위한 이름 (예: `web-app-key`) |
| **토큰 타입** | BEARER_TOKEN |
| **권한 범위** | 접근할 수 있는 리소스 선택 |

4. **생성**을 클릭하세요.

{% hint style="danger" %}
🚨 **위험** — 토큰은 생성 시 한 번만 표시됩니다. 분실 시 재생성해야 합니다. 안전하게 복사하여 보관하세요.
{% endhint %}

***

## API Key 사용하기

발급받은 API Key를 REST API 요청의 `Authorization` 헤더에 포함합니다.

```bash
curl https://api-client.bkend.ai/v1/data/posts \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## API Key 목록 확인하기

**설정** → **액세스 토큰** 섹션에서 현재 환경의 모든 토큰을 확인합니다.

| 표시 정보 | 설명 |
|----------|------|
| **토큰 이름** | 토큰 식별 이름 |
| **생성일** | 토큰 발급 일시 |
| **마지막 사용** | 마지막 API 호출 일시 |

***

## API Key 삭제하기

1. 토큰 목록에서 삭제할 토큰을 찾으세요.
2. **삭제** 버튼을 클릭하세요.
3. 확인 후 즉시 해당 토큰이 무효화됩니다.

{% hint style="warning" %}
⚠️ 토큰을 삭제하면 해당 토큰을 사용하는 모든 앱에서 API 호출이 실패합니다. 앱의 토큰을 먼저 교체한 후 삭제하세요.
{% endhint %}

***

## 다음 단계

- [프로젝트 설정](12-settings.md) — Project ID 확인 및 기타 설정
- [API 키 이해](../security/02-api-keys.md) — Public Key vs Secret Key
- [앱에서 bkend 연동하기](../getting-started/03-app-integration.md) — fetch 헬퍼로 API 연동
