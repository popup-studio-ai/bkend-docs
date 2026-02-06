# 연결 문제

> bkend API 연결 문제를 진단하고 해결하는 방법을 안내합니다.

## 개요

API 요청이 실패하거나 응답이 없을 때 이 가이드를 참고하세요. 연결 문제의 원인을 체계적으로 진단할 수 있습니다.

---

## 진단 순서

```mermaid
flowchart TD
    A[API 요청 실패] --> B{응답 있음?}
    B -->|예| C[HTTP 상태 코드 확인]
    B -->|아니오| D{타임아웃?}
    C --> E[에러 코드별 해결]
    D -->|예| F[네트워크/방화벽 확인]
    D -->|아니오| G[DNS 확인]
```

---

## API URL 확인

### 올바른 URL 형식

```
https://api.bkend.io/{endpoint}
```

### 자주 하는 실수

| 잘못된 URL | 올바른 URL | 설명 |
|-----------|-----------|------|
| `http://api.bkend.io/...` | `https://api.bkend.io/...` | HTTPS 필수 |
| `https://api.bkend.io/data/Posts` | `https://api.bkend.io/data/posts` | 테이블명 대소문자 주의 |
| `https://api.bkend.io/data/posts/` | `https://api.bkend.io/data/posts` | 후행 슬래시 제거 |

---

## 인증 헤더 확인

API Key 또는 JWT 토큰이 올바르게 포함되어 있는지 확인하세요.

### API Key 인증

```typescript
const response = await fetch('https://api.bkend.io/data/posts', {
  headers: {
    'X-API-Key': 'ak_xxxxxxxx'  // API Key
  }
});
```

### JWT 인증

```typescript
const response = await fetch('https://api.bkend.io/data/posts', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiI...',  // JWT 토큰
    'X-API-Key': 'ak_xxxxxxxx'  // API Key도 함께 필요
  }
});
```

### 체크리스트

- [ ] `X-API-Key` 헤더에 올바른 API Key가 포함되어 있는지
- [ ] API Key가 폐기(revoked)되지 않았는지
- [ ] API Key의 스코프가 요청한 작업을 허용하는지
- [ ] API Key가 올바른 환경(dev/staging/prod)용인지
- [ ] JWT 토큰이 만료되지 않았는지

---

## CORS 에러

브라우저에서 CORS 에러가 발생하는 경우입니다.

### 증상

```
Access to fetch at 'https://api.bkend.io/data/posts' from origin
'http://localhost:3000' has been blocked by CORS policy
```

### 해결 방법

1. 프로젝트 설정에서 `allowedOrigins`에 도메인을 추가하세요.

```json
{
  "allowedOrigins": [
    "http://localhost:3000",
    "https://myapp.com"
  ]
}
```

2. 개발 환경에서는 와일드카드(`*`)를 사용할 수 있습니다.

> ⚠️ **주의** - 프로덕션 환경에서 `*`를 사용하지 마세요. 실제 도메인만 등록하세요.

---

## 타임아웃

### 원인

| 원인 | 설명 | 해결 방법 |
|------|------|---------|
| 네트워크 문제 | 인터넷 연결 불안정 | 네트워크 연결을 확인하세요 |
| 방화벽 차단 | 회사/학교 방화벽이 API를 차단 | 네트워크 관리자에게 문의하세요 |
| 대용량 요청 | 한 번에 너무 많은 데이터 요청 | `limit`을 줄이고 페이지네이션을 사용하세요 |

### 타임아웃 설정

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000); // 10초

try {
  const response = await fetch('https://api.bkend.io/data/posts', {
    headers: { 'X-API-Key': '{your_api_key}' },
    signal: controller.signal
  });
  clearTimeout(timeout);
  return await response.json();
} catch (error) {
  if (error instanceof Error && error.name === 'AbortError') {
    console.error('요청 타임아웃');
  }
  throw error;
}
```

---

## 환경 연결 문제

### 환경 상태 확인

콘솔의 **Environments** 페이지에서 환경 상태를 확인하세요.

| 상태 | API 사용 가능 | 대응 |
|------|:----------:|------|
| `creating` | ❌ | 프로비저닝 완료까지 대기 |
| `ready` | ✅ | 정상 사용 가능 |
| `active` | ✅ | 정상 사용 가능 |
| `failed` | ❌ | 에러 확인 후 환경 재생성 |
| `deleting` | ❌ | 삭제 완료까지 대기 |

### 환경 전환 확인

올바른 환경에 요청하고 있는지 확인하세요.

```typescript
// dev 환경 API Key를 prod 환경에서 사용하면 에러 발생
// 환경별로 별도의 API Key를 사용하세요
const API_KEY = process.env.NODE_ENV === 'production'
  ? process.env.BKEND_PROD_API_KEY
  : process.env.BKEND_DEV_API_KEY;
```

---

## MCP 연결 문제

AI 도구에서 MCP 서버에 연결할 수 없는 경우입니다.

### 진단 순서

1. **MCP 서버 URL 확인** — 콘솔에서 MCP 설정 정보를 확인하세요.
2. **OAuth 인증 확인** — MCP는 OAuth 2.1 + PKCE 인증을 사용합니다.
3. **도구 설정 확인** — AI 도구(Claude Code, Cursor 등)의 MCP 설정을 확인하세요.

### Claude Code 설정 확인

```json
{
  "mcpServers": {
    "bkend": {
      "type": "streamable-http",
      "url": "https://mcp.bkend.io/{project_id}/mcp"
    }
  }
}
```

---

## 네트워크 디버깅

### curl로 API 테스트

```bash
# API 연결 테스트
curl -v https://api.bkend.io/data/posts \
  -H "X-API-Key: {your_api_key}"

# 응답 상태 코드만 확인
curl -s -o /dev/null -w "%{http_code}" \
  https://api.bkend.io/data/posts \
  -H "X-API-Key: {your_api_key}"
```

### 체크리스트

- [ ] `curl`로 직접 API를 호출해 응답을 확인하세요
- [ ] DNS 해석이 정상인지 확인하세요 (`nslookup api.bkend.io`)
- [ ] HTTPS 인증서가 유효한지 확인하세요
- [ ] 방화벽이나 프록시가 요청을 차단하지 않는지 확인하세요

---

## 관련 문서

- [자주 발생하는 에러](01-common-errors.md) — HTTP 에러 코드별 해결
- [인증 관련 문제](03-auth-issues.md) — 인증 에러 해결
- [API Key 관리](../security/02-api-keys.md) — API Key 확인
- [MCP 설정 기본](../integrations/02-mcp-basics.md) — MCP 연결 설정
