# 직접 MCP 연결

> MCP 프로토콜을 직접 구현하여 bkend에 연결하는 방법을 안내합니다.

## 개요

AI 도구가 아닌 자체 클라이언트에서 bkend MCP 서버에 직접 연결하려면 [MCP 프로토콜](https://spec.modelcontextprotocol.io/2025-03-26)을 직접 구현해야 합니다. 이 문서에서는 Streamable HTTP 방식으로 bkend MCP에 연결하는 방법을 안내합니다.

---

## 연결 정보

| 항목 | 값 |
|------|-----|
| MCP 엔드포인트 | `https://api.bkend.ai/mcp` |
| Transport | Streamable HTTP (POST) |
| Message Format | JSON-RPC 2.0 |
| 인증 | [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12) + PKCE |

---

## 인증 구현하기

### 1단계: OAuth 메타데이터 조회하기

```bash
curl -X GET "https://api.bkend.ai/.well-known/oauth-authorization-server"
```

```json
{
  "issuer": "https://api.bkend.ai/mcp",
  "authorization_endpoint": "https://api.bkend.ai/mcp/oauth/authorize",
  "token_endpoint": "https://api.bkend.ai/mcp/oauth/token",
  "registration_endpoint": "https://api.bkend.ai/mcp/oauth/register",
  "revocation_endpoint": "https://api.bkend.ai/mcp/oauth/revoke",
  "code_challenge_methods_supported": ["S256"]
}
```

### 2단계: Dynamic Client Registration

```bash
curl -X POST "https://api.bkend.ai/mcp/oauth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "My Custom Client",
    "redirect_uris": ["http://localhost:3000/callback"]
  }'
```

```json
{
  "client_id": "dyn-xxxxxxxx",
  "client_name": "My Custom Client"
}
```

### 3단계: PKCE Code Challenge 생성하기

```typescript
// code_verifier 생성 (43~128자)
const codeVerifier = generateRandomString(64);

// code_challenge 생성 (S256)
const codeChallenge = base64url(sha256(codeVerifier));
```

### 4단계: Authorization Code 요청하기

브라우저에서 다음 URL을 열어주세요:

```
https://api.bkend.ai/mcp/oauth/authorize?
  response_type=code&
  client_id={client_id}&
  code_challenge={code_challenge}&
  code_challenge_method=S256&
  redirect_uri=http://localhost:3000/callback&
  scope=*:*
```

사용자가 로그인하고 Organization을 선택하면 `redirect_uri`로 Authorization Code가 전달됩니다.

### 5단계: Token 교환하기

```bash
curl -X POST "https://api.bkend.ai/mcp/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code={auth_code}&code_verifier={code_verifier}&client_id={client_id}&redirect_uri=http://localhost:3000/callback"
```

```json
{
  "access_token": "{jwt_token}",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "{refresh_token}"
}
```

---

## MCP 프로토콜 사용하기

### Initialize

```bash
curl -X POST "https://api.bkend.ai/mcp" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "clientInfo": {
        "name": "my-client",
        "version": "1.0.0"
      }
    }
  }'
```

응답 헤더에서 `mcp-session-id`를 저장하세요.

### Tools List

```bash
curl -X POST "https://api.bkend.ai/mcp" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: {session_id}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }'
```

### Tools Call

```bash
curl -X POST "https://api.bkend.ai/mcp" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: {session_id}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "backend_table_list",
      "arguments": {
        "projectId": "{project_id}",
        "environment": "dev"
      }
    }
  }'
```

### Session End

```bash
curl -X DELETE "https://api.bkend.ai/mcp" \
  -H "Authorization: Bearer {access_token}" \
  -H "mcp-session-id: {session_id}"
```

---

## Token 갱신하기

Access Token이 만료되면 Refresh Token으로 갱신하세요:

```bash
curl -X POST "https://api.bkend.ai/mcp/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token={refresh_token}&client_id={client_id}"
```

---

## 주의사항

> ⚠️ **주의** - Access Token은 1시간, Refresh Token은 30일 후 만료됩니다. Token 갱신 로직을 구현하세요.

> ⚠️ **주의** - `mcp-session-id` 헤더 없이 요청하면 404 오류가 반환됩니다 (`initialize` 제외). 항상 세션 ID를 포함하세요.

> ❌ **위험** - `code_verifier`와 `refresh_token`은 안전하게 저장하세요. 클라이언트 사이드 코드에 하드코딩하지 마세요.

---

## 관련 문서

- [MCP 설정 기본](02-mcp-basics.md) — MCP 프로토콜 이해
- [MCP 프로토콜 설명](../api-reference/02-mcp-protocol.md) — 기술 레퍼런스
- [에러 코드 레퍼런스](../api-reference/10-error-codes.md) — 에러 코드 목록

## 참조 표준

- [MCP Specification 2025-03-26](https://spec.modelcontextprotocol.io/2025-03-26)
- [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12)
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [RFC 7591 — Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591)
