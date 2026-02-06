# 기타 MCP 도구

> MCP를 지원하는 기타 AI 도구에서 bkend를 연결하는 방법을 안내합니다.

## 개요

bkend MCP 서버는 [MCP 2025-03-26 스펙](https://spec.modelcontextprotocol.io/2025-03-26)을 준수하므로, MCP를 지원하는 모든 AI 도구에서 연결할 수 있습니다.

---

## 연결 정보

| 항목 | 값 |
|------|-----|
| MCP Server URL | `https://api.bkend.ai/mcp` |
| Transport | Streamable HTTP |
| 인증 | [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12) + PKCE |

---

## Streamable HTTP 지원 도구

도구가 Streamable HTTP를 직접 지원하는 경우 URL만으로 연결하세요:

```
https://api.bkend.ai/mcp
```

---

## HTTP 지원 도구 (권장)

대부분의 최신 MCP 도구는 HTTP 방식을 직접 지원합니다:

```json
{
  "mcpServers": {
    "mcp-bkend": {
      "type": "http",
      "url": "https://api.bkend.ai/mcp"
    }
  }
}
```

---

## mcp-remote 사용하기

도구가 stdio 기반 MCP만 지원하는 경우 `mcp-remote`를 사용하세요:

```json
{
  "mcpServers": {
    "bkend": {
      "command": "mcp-remote",
      "args": [
        "https://api.bkend.ai/mcp"
      ]
    }
  }
}
```

---

## VS Code (Copilot Chat)

VS Code의 Copilot Chat MCP 설정에 다음을 추가하세요:

### settings.json

```json
{
  "mcp": {
    "servers": {
      "mcp-bkend": {
        "type": "http",
        "url": "https://api.bkend.ai/mcp"
      }
    }
  }
}
```

---

## 일반적인 MCP 클라이언트 설정

대부분의 MCP 클라이언트는 다음 형식을 사용합니다:

```json
{
  "type": "http",
  "url": "https://api.bkend.ai/mcp"
}
```

---

## 문제 해결

### 도구에서 MCP 설정을 찾을 수 없을 때

각 도구의 공식 문서에서 MCP 설정 방법을 확인하세요. MCP 설정 파일의 위치와 형식이 도구마다 다릅니다.

### 연결은 되지만 도구 목록이 비어있을 때

1. 인증이 완료되었는지 확인하세요
2. bkend 콘솔에서 Organization에 프로젝트가 있는지 확인하세요
3. AI 도구를 재시작하세요

---

## 관련 문서

- [AI 도구 연동 개요](01-overview.md) — 지원 도구 목록
- [MCP 설정 기본](02-mcp-basics.md) — MCP 프로토콜 이해
- [직접 MCP 연결](10-direct-mcp.md) — MCP 프로토콜 직접 구현

## 참조 표준

- [MCP Specification 2025-03-26](https://spec.modelcontextprotocol.io/2025-03-26)
