# Public vs Secret Key

> API Key 타입의 차이와 올바른 사용법을 안내합니다.

## 개요

bkend API Key는 `ak_`(API Key)와 `bt_`(Bearer Token) 두 가지 접두사로 구분됩니다. 사용 목적에 따라 적절한 타입을 선택하세요.

---

## Key 타입 비교

| 항목 | API Key (`ak_`) | Bearer Token (`bt_`) |
|------|-----------------|---------------------|
| **접두사** | `ak_` | `bt_` |
| **용도** | 서비스 API 호출 | Bearer 인증 |
| **노출 범위** | 서버 사이드만 권장 | 서버 사이드만 |
| **스코프** | 커스텀 설정 가능 | 커스텀 설정 가능 |
| **만료** | 선택적 | 선택적 |

---

## 안전한 사용 가이드

### 서버 사이드 (안전)

API Key를 서버 환경변수로 관리하세요.

```typescript
// 서버 사이드 코드 (Node.js)
const API_KEY = process.env.BKEND_API_KEY;

const response = await fetch('https://api.bkend.ai/v1/data/posts', {
  headers: {
    'x-project-id': process.env.BKEND_PROJECT_ID,
    'Authorization': `Bearer ${API_KEY}`,
  },
});
```

### 클라이언트 사이드 (주의 필요)

클라이언트 앱에서는 JWT Access Token을 사용하세요. API Key를 직접 포함하지 마세요.

```typescript
// 클라이언트 사이드 코드 (브라우저)
// ✅ User의 JWT 토큰 사용
const response = await fetch('https://api.bkend.ai/v1/data/posts', {
  headers: {
    'x-project-id': PROJECT_ID,
    'Authorization': `Bearer ${userAccessToken}`,
  },
});
```

> ❌ **위험** - API Key를 클라이언트 코드, 소스 저장소, 로그에 절대 포함하지 마세요.

---

## 스코프 설정

API Key 생성 시 필요한 최소한의 스코프만 부여하세요.

| 스코프 패턴 | 설명 |
|------------|------|
| `project:read` | 프로젝트 읽기만 |
| `table:data:read` | 데이터 읽기만 |
| `table:data:*` | 데이터 전체 CRUD |
| `*:read` | 모든 리소스 읽기 |

---

## 관련 문서

- [API Key 관리](02-api-keys.md) — API Key 생성과 관리
- [보안 모범 사례](09-best-practices.md) — 보안 권장사항
