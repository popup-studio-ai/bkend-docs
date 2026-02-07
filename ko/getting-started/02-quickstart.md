# 빠른 시작

{% hint style="info" %}
💡 5분 만에 bkend에서 프로젝트를 생성하고 AI 도구로 데이터를 관리해봅니다.
{% endhint %}

## 개요

이 가이드에서는 회원가입부터 AI 도구 연결, 첫 테이블 생성까지 전체 과정을 안내합니다.

***

## 전체 과정

```mermaid
flowchart LR
    A[1. 회원가입] --> B[2. 조직 생성]
    B --> C[3. 프로젝트 생성]
    C --> D[4. AI 도구 연결]
    D --> E[5. 테이블 생성]
```

***

## 사전 준비

- AI 도구 설치 (Claude Code, Cursor 등 하나 이상)
- 웹 브라우저

***

## 1단계: 회원가입하기

1. [bkend 콘솔](https://console.bkend.ai)에 접속하세요.
2. **Google** 또는 **GitHub** 계정으로 로그인하세요. 매직 링크 로그인도 지원합니다.

{% hint style="success" %}
✅ 로그인하면 자동으로 콘솔 홈 화면으로 이동합니다.
{% endhint %}

***

## 2단계: 조직 생성하기

1. 콘솔에서 **조직 생성** 버튼을 클릭하세요.
2. 조직 이름을 입력하세요 (예: `My Startup`).
3. **생성**을 클릭하세요.

***

## 3단계: 프로젝트 생성하기

1. 조직 페이지에서 **프로젝트** 메뉴를 클릭하세요.
2. **프로젝트 생성** 버튼을 클릭하세요.
3. 다음 정보를 입력하세요.

| 필드 | 예시 | 설명 |
|------|------|------|
| **프로젝트 이름** | My Blog | 프로젝트 표시 이름 |
| **프로젝트 Slug** | my-blog | URL 식별자 (자동 생성 가능) |
| **리전** | Seoul (ap-northeast-2) | 데이터 저장 리전 |
| **클라우드** | AWS | 클라우드 제공자 |

4. **생성**을 클릭하세요.

{% hint style="warning" %}
⚠️ 프로젝트를 생성하면 `dev` 환경이 자동으로 프로비저닝됩니다. **Active** 상태가 될 때까지 약 30초를 기다리세요.
{% endhint %}

***

## 4단계: AI 도구 연결하기

{% tabs %}
{% tab title="Claude Code" %}
`~/.claude.json` 파일에 다음을 추가하세요.

```json
{
  "mcpServers": {
    "bkend": {
      "type": "http",
      "url": "https://api.bkend.ai/mcp"
    }
  }
}
```

Claude Code를 재시작하면 OAuth 2.1 인증 흐름이 자동으로 시작됩니다.
{% endtab %}
{% tab title="Cursor" %}
Cursor 설정에서 MCP 서버를 추가하세요.

```json
{
  "mcpServers": {
    "bkend": {
      "type": "http",
      "url": "https://api.bkend.ai/mcp"
    }
  }
}
```
{% endtab %}
{% endtabs %}

***

## 5단계: 첫 테이블 생성하기

AI 도구에서 다음과 같이 요청하세요.

```
"posts 테이블을 만들어줘.
- title: 문자열 (필수)
- content: 문자열 (필수)
- author_name: 문자열
- published: 불리언 (기본값: false)"
```

콘솔의 **데이터베이스** 메뉴에서 생성된 테이블을 확인하세요.

{% hint style="success" %}
✅ 첫 번째 프로젝트가 준비되었습니다!
{% endhint %}

***

## 다음 단계

- [핵심 개념](03-core-concepts.md) — Organization, Project, Environment 구조
- [콘솔 개요](../console/01-overview.md) — 콘솔 UI 둘러보기
- [AI 도구 연동 개요](../ai-tools/01-overview.md) — MCP 도구 상세 가이드
- [테이블 관리](../console/07-table-management.md) — 콘솔에서 테이블 설계하기
