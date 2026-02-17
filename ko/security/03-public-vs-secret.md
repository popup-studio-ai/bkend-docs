# Publishable Key vs Secret Key

{% hint style="info" %}
💡 Publishable Key(pk_)와 Secret Key(sk_)의 차이점과 올바른 사용법을 이해합니다.
{% endhint %}

## 개요

bkend는 두 가지 유형의 API 키를 제공합니다. 각 키는 사용 환경과 권한이 다르므로, 용도에 맞게 사용해야 합니다. 두 키 모두 프로젝트 ID와 환경 정보를 포함하고 있어 별도의 컨텍스트 헤더가 불필요합니다.

***

## 키 비교

| 항목 | Publishable Key (`pk_`) | Secret Key (`sk_`) |
|------|------------------------|-------------------|
| **사용 환경** | 클라이언트 (브라우저, 모바일) | 서버 사이드만 |
| **권한** | RLS 기반 제한된 접근 | 전체 접근 (admin) |
| **노출 위험** | 낮음 (RLS로 보호) | 높음 (전체 권한) |
| **용도** | 프론트엔드 앱, 모바일 앱 | 서버 간 통신, 관리 작업 |

***

## Publishable Key (`pk_`)

클라이언트 사이드 애플리케이션에서 사용하는 키입니다.

### 특징

- 브라우저 JavaScript, 모바일 앱에서 안전하게 사용
- **RLS 정책에 따라 접근 제한** (user/guest 권한)
- 사용자 JWT와 함께 사용하면 `user` 권한
- JWT 없이 사용하면 `guest` 권한

### 사용 예시

```javascript
// 프론트엔드에서 Publishable Key 사용 (guest 권한)
const response = await fetch('https://api-client.bkend.ai/v1/data/posts', {
  headers: {
    'X-API-Key': '{pk_publishable_key}',
  },
});

// Publishable Key + JWT (user 권한)
const response = await fetch('https://api-client.bkend.ai/v1/data/posts', {
  headers: {
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': 'Bearer {accessToken}',
  },
});
```

{% hint style="info" %}
💡 Publishable Key는 소스 코드에 포함해도 안전합니다. RLS 정책이 데이터 접근을 제어합니다.
{% endhint %}

***

## Secret Key (`sk_`)

서버 사이드에서만 사용하는 키입니다.

### 특징

- **서버 환경에서만 사용** (환경 변수로 관리)
- `admin` 권한으로 모든 데이터 접근
- RLS 정책을 우회하여 전체 데이터 조회 가능
- API 키 생성/관리, 사용자 관리 등 관리 작업 수행

### 사용 예시

```javascript
// 서버 사이드에서 Secret Key 사용
const response = await fetch('https://api-client.bkend.ai/v1/data/users', {
  headers: {
    'X-API-Key': process.env.BKEND_SECRET_KEY, // sk_xxx
  },
});
```

{% hint style="danger" %}
🚨 **위험** — Secret Key를 클라이언트 코드에 포함하지 마세요. 브라우저 DevTools나 앱 디컴파일로 노출될 수 있습니다.
{% endhint %}

***

## 사용 시나리오

### 프론트엔드 앱 (Publishable Key)

```mermaid
flowchart LR
    A[브라우저] -->|"X-API-Key: pk_ + JWT"| B[bkend API]
    B -->|RLS: user 권한| C[본인 데이터만]
```

### 서버 사이드 (Secret Key)

```mermaid
flowchart LR
    A[백엔드 서버] -->|"X-API-Key: sk_"| B[bkend API]
    B -->|admin 권한| C[전체 데이터]
```

### 권장 패턴

| 시나리오 | 사용할 키 | 헤더 |
|---------|----------|------|
| React/Vue 프론트엔드 | `pk_` + 사용자 JWT | `X-API-Key` + `Authorization` |
| Next.js API Routes | `sk_` | `X-API-Key`만 |
| 모바일 앱 | `pk_` + 사용자 JWT | `X-API-Key` + `Authorization` |
| 배치 작업/크론잡 | `sk_` | `X-API-Key`만 |
| Webhook 처리 | `sk_` | `X-API-Key`만 |

***

## 보안 규칙

### 반드시 지켜야 할 규칙

1. **Secret Key는 환경 변수로 관리하세요**
2. **Secret Key를 Git에 커밋하지 마세요** (`.env` 파일은 `.gitignore`에 추가)
3. **프론트엔드에서는 Publishable Key만 사용하세요**
4. **Secret Key가 노출되면 즉시 폐기하고 새로 생성하세요**

***

## 다음 단계

- [RLS 개요](04-rls-overview.md) — Publishable Key 사용 시 데이터 접근 제어
- [API 키 관리 (콘솔)](../console/11-api-keys.md) — 키 생성 및 관리
- [보안 모범 사례](07-best-practices.md) — 전체 보안 권장 사항
