# Claude Code 설정

{% hint style="info" %}
💡 Claude Code와 Claude Desktop에서 bkend MCP를 설정하는 방법을 안내합니다.
{% endhint %}

## 사전 준비

- bkend 계정 및 Organization ([빠른 시작 가이드](../getting-started/02-quickstart.md)에서 생성)
- Claude Code 또는 Claude Desktop 설치

***

## Claude Code 설정하기

### 1단계: MCP 서버 추가하기

터미널에서 다음 명령어를 실행하세요:

```bash
claude mcp add bkend --transport http https://api.bkend.ai/mcp
```

### 2단계: 인증하기

MCP 서버를 추가한 후 첫 요청 시 브라우저에서 인증이 진행됩니다.

1. 브라우저가 자동으로 열립니다
2. bkend 콘솔에 로그인하세요
3. Organization을 선택하세요
4. 권한을 승인하세요

### 3단계: 연결 확인하기

인증이 완료되면 다음과 같이 확인하세요:

```
"bkend에 연결된 프로젝트 목록을 보여줘"
```

{% hint style="success" %}
✅ 프로젝트 목록이 표시되면 연결이 완료된 것입니다.
{% endhint %}

***

## Claude Desktop 설정하기

### 1단계: 설정 파일 열기

Claude Desktop의 MCP 설정 파일을 열어주세요.

{% tabs %}
{% tab title="macOS" %}
```
~/Library/Application Support/Claude/claude_desktop_config.json
```
{% endtab %}
{% tab title="Windows" %}
```
%APPDATA%\Claude\claude_desktop_config.json
```
{% endtab %}
{% endtabs %}

### 2단계: MCP 서버 추가하기

다음 내용을 설정 파일에 추가하세요:

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

### 4단계: 인증하기

Claude Desktop에서 bkend 관련 요청을 하면 브라우저에서 인증이 진행됩니다.

***

## MCP 서버 관리하기

### 설정 확인하기

```bash
claude mcp list
```

### 설정 제거하기

```bash
claude mcp remove bkend
```

### 설정 업데이트하기

기존 설정을 제거하고 다시 추가하세요:

```bash
claude mcp remove bkend
claude mcp add bkend --transport http https://api.bkend.ai/mcp
```

***

## 문제 해결

### 인증 페이지가 열리지 않을 때

1. 기본 브라우저가 설정되어 있는지 확인하세요
2. 방화벽이나 프록시가 `https://api.bkend.ai/mcp` 접근을 차단하지 않는지 확인하세요

### 인증 후 연결이 안 될 때

1. bkend 콘솔에서 Organization에 프로젝트가 있는지 확인하세요
2. MCP 설정을 제거하고 다시 추가하세요

### Token이 만료되었을 때

Access Token은 1시간, Refresh Token은 30일 후 만료됩니다. 만료되면 자동으로 재인증이 요청됩니다.

***

## 다음 단계

- [Claude Code 사용법](05-claude-code-usage.md) — Claude Code로 bkend 활용하기
- [AI 도구 연동 개요](01-overview.md) — 지원 도구 목록
- [OAuth 2.1 인증 설정](03-oauth-setup.md) — 인증 흐름 상세
