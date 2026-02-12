# Claude Code 설정

{% hint style="info" %}
💡 Claude Code와 Claude Desktop에서 bkend MCP를 설정하는 방법을 안내합니다.
{% endhint %}

## 사전 준비

- bkend 계정 및 Organization ([빠른 시작 가이드](../getting-started/02-quickstart.md)에서 생성)
- Claude Code 설치 또는 Claude Desktop 설치

***

## Claude Code 설정하기

### 1단계: bkend MCP 서버 추가하기

터미널에서 다음 명령을 실행하세요.

```bash
claude mcp add bkend --transport http https://api.bkend.ai/mcp
```

### 2단계: 인증하기

Claude Code에서 bkend 관련 요청을 하면 브라우저에서 인증이 진행됩니다.

1. 브라우저가 자동으로 열립니다
2. bkend 콘솔에 로그인하세요
3. Organization을 선택하세요
4. 권한을 승인하세요

### 3단계: 연결 확인하기

```text
"bkend에 연결된 프로젝트 목록을 보여줘"
```

***

## Claude Desktop 설정하기

### 1단계: 설정 파일 열기

{% tabs %}
{% tab title="macOS" %}
```text
~/Library/Application Support/Claude/claude_desktop_config.json
```
{% endtab %}
{% tab title="Windows" %}
```text
%APPDATA%\Claude\claude_desktop_config.json
```
{% endtab %}
{% endtabs %}

### 2단계: bkend MCP 서버 추가하기

설정 파일에 다음 내용을 추가하세요.

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

### 3단계: Claude Desktop 재시작하기

설정 파일을 저장한 후 Claude Desktop을 재시작하세요.

***

## 설정 관리하기

### 등록된 MCP 서버 확인하기

```bash
claude mcp list
```

### MCP 서버 제거하기

```bash
claude mcp remove bkend
```

### MCP 서버 업데이트하기

```bash
claude mcp remove bkend
claude mcp add bkend --transport http https://api.bkend.ai/mcp
```

***

## 문제 해결

### MCP 서버가 연결되지 않을 때

1. `claude mcp list`로 bkend 서버가 등록되어 있는지 확인하세요
2. 네트워크가 `https://api.bkend.ai/mcp` 접근을 허용하는지 확인하세요
3. Claude Code를 재시작하세요

### 인증 후 도구가 표시되지 않을 때

1. bkend 콘솔에서 Organization이 있는지 확인하세요
2. `claude mcp remove bkend` 후 다시 추가하세요
3. Claude Code를 재시작하세요

### "Token expired" 오류

Refresh Token이 만료(30일)된 경우입니다. Claude Code를 재시작하면 재인증이 자동으로 진행됩니다.

{% hint style="warning" %}
⚠️ 회사 네트워크나 VPN 환경에서는 `https://api.bkend.ai/mcp`에 대한 HTTPS 아웃바운드 연결이 차단될 수 있습니다. 연결 실패 시 네트워크 관리자에게 해당 도메인의 허용 여부를 확인하세요.
{% endhint %}

***

## 다음 단계

- [Claude Code 사용법](05-claude-code-usage.md) — Claude Code에서 bkend 활용하기
- [OAuth 2.1 인증 설정](03-oauth-setup.md) — 인증 흐름 상세
- [MCP 도구 개요](../mcp/01-overview.md) — MCP 도구 목록과 파라미터
