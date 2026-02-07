# Cursor 설정

> Cursor에서 bkend MCP를 설정하는 방법을 안내합니다.

## 사전 준비

- bkend 계정 및 Organization ([빠른 시작](../getting-started/02-quickstart.md)에서 생성)
- Cursor 설치 (v0.45 이상)

---

## 설정하기

### 1단계: MCP 설정 파일 열기

Cursor의 MCP 설정 파일을 열어주세요:

- **전역 설정**: `~/.cursor/mcp.json`
- **프로젝트 설정**: 프로젝트 루트의 `.cursor/mcp.json`

> 💡 **Tip** - 프로젝트 설정을 사용하면 프로젝트마다 다른 MCP 서버를 연결할 수 있습니다.

### 2단계: bkend MCP 서버 추가하기

설정 파일에 다음 내용을 추가하세요:

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

### 3단계: Cursor 재시작하기

설정 파일을 저장한 후 Cursor를 재시작하세요.

### 4단계: 인증하기

Cursor의 AI Chat에서 bkend 관련 요청을 하면 브라우저에서 인증이 진행됩니다:

1. 브라우저가 자동으로 열립니다
2. bkend 콘솔에 로그인하세요
3. Organization을 선택하세요
4. 권한을 승인하세요

### 5단계: 연결 확인하기

Cursor AI Chat에서 다음과 같이 확인하세요:

```
"bkend에 연결된 프로젝트 목록을 보여줘"
```

---

## 설정 관리하기

### MCP 서버 상태 확인하기

Cursor의 **Settings** > **MCP** 탭에서 연결 상태를 확인할 수 있습니다.

### 설정 제거하기

MCP 설정 파일에서 `mcp-bkend` 항목을 삭제하고 Cursor를 재시작하세요.

---

## 문제 해결

### MCP 서버가 연결되지 않을 때

1. 방화벽이 `https://api.bkend.ai/mcp` 접근을 차단하지 않는지 확인하세요
2. 설정 파일의 JSON 형식이 올바른지 확인하세요
3. Cursor를 재시작하세요

### 인증 후 도구가 표시되지 않을 때

1. Cursor를 재시작하세요
2. **Settings** > **MCP** 탭에서 bkend 서버의 상태를 확인하세요
3. 설정 파일의 JSON 형식이 올바른지 확인하세요

---

## 관련 문서

- [Cursor 사용법](06-cursor-usage.md) — Cursor에서 bkend 활용하기
- [AI 도구 연동 개요](01-overview.md) — 지원 도구 목록
- [MCP 설정 기본](02-mcp-basics.md) — MCP 프로토콜 이해
