# Antigravity 설정

{% hint style="info" %}
💡 Antigravity에서 bkend MCP를 설정하고 사용하는 방법을 안내합니다.
{% endhint %}

## 사전 준비

- bkend 계정 및 Organization ([빠른 시작 가이드](../getting-started/02-quickstart.md)에서 생성)
- Antigravity 설치

***

## 설정하기

### 1단계: MCP 설정 열기

Antigravity의 **Settings** > **MCP Servers** 메뉴를 열어주세요.

### 2단계: bkend MCP 서버 추가하기

다음 설정을 추가하세요:

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

### 3단계: 인증하기

MCP 서버를 추가한 후 첫 요청 시 브라우저에서 인증이 진행됩니다.

1. 브라우저가 자동으로 열립니다
2. bkend 콘솔에 로그인하세요
3. Organization을 선택하세요
4. 권한을 승인하세요

***

## 사용하기

Antigravity의 AI Chat에서 자연어로 요청하세요:

```text
"bkend에 연결된 프로젝트 목록을 보여줘"

"dev 환경에 products 테이블을 만들어줘"

"products 테이블에 샘플 데이터를 추가해줘"
```

***

## 문제 해결

### MCP 서버가 연결되지 않을 때

1. Node.js 18 이상이 설치되어 있는지 확인하세요
2. `mcp-remote`가 설치되어 있는지 확인하세요:
   ```bash
   npx mcp-remote --version
   ```
3. Antigravity를 재시작하세요
4. MCP 설정을 삭제하고 다시 추가하세요

{% hint style="warning" %}
⚠️ Antigravity는 `mcp-remote`를 통해 Streamable HTTP를 stdio로 변환합니다. `mcp-remote` 프로세스가 비정상 종료되면 연결이 끊길 수 있으니, 문제 발생 시 Antigravity 재시작을 먼저 시도하세요.
{% endhint %}

***

## 다음 단계

- [AI 도구 연동 개요](01-overview.md) — 지원 도구 목록
- [MCP 프로토콜 이해](02-mcp-protocol.md) — MCP 프로토콜 상세
- [기타 AI 도구](09-other-tools.md) — 다른 AI 도구 연동
