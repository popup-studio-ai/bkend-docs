# 다음 단계

{% hint style="info" %}
💡 bkend의 핵심 개념을 이해했다면, 시나리오에 맞는 가이드로 이동하세요.
{% endhint %}

## 개요

bkend의 기본 구조를 파악했습니다. 아래 세 가지 시나리오 중 가장 가까운 것을 선택하세요.

***

## 시나리오 1: 앱 개발하기 (REST API)

REST API로 앱에 bkend 백엔드를 연동합니다. 가장 일반적인 사용 방식입니다.

| 단계 | 작업 | 문서 |
|:----:|------|------|
| 1 | fetch 헬퍼 설정 | [앱에서 bkend 연동하기](03-app-integration.md) |
| 2 | 회원가입/로그인 구현 | [인증 폼 구현 패턴](../authentication/21-auth-form-patterns.md) |
| 3 | 데이터 CRUD 구현 | [데이터 CRUD 앱 패턴](../database/12-crud-app-patterns.md) |
| 4 | 파일 업로드 구현 | [파일 업로드 앱 패턴](../storage/10-upload-app-patterns.md) |
| 5 | 접근 권한 설정 | [RLS 정책 작성](../security/05-rls-policies.md) |

{% hint style="success" %}
✅ 프레임워크별 초기 설정은 [프레임워크별 빠른 시작](07-quickstart-framework.md)을 참고하세요.
{% endhint %}

***

## 시나리오 2: AI 도구로 백엔드 관리하기 (MCP)

Claude Code, Cursor 같은 AI 도구에서 자연어로 백엔드를 설계하고 관리합니다.

| 단계 | 작업 | 문서 |
|:----:|------|------|
| 1 | MCP 서버 연결 | [AI 도구 연동 개요](../ai-tools/01-overview.md) |
| 2 | AI 도구에서 테이블 설계 | [Claude Code 사용법](../ai-tools/05-claude-code-usage.md) |
| 3 | MCP 도구로 데이터 관리 | [데이터 CRUD 도구](../mcp/05-data-tools.md) |

***

## 시나리오 3: 실전 앱 따라 만들기 (쿡북)

블로그, 소셜 네트워크 등 완성된 앱을 처음부터 끝까지 따라 만들어봅니다.

| 쿡북 | 난이도 | 주요 기능 |
|------|:------:|----------|
| [블로그](../../cookbooks/blog/) | 입문 | 게시글 CRUD, 이미지, 태그 |
| [소셜 네트워크](../../cookbooks/social-network/) | 초급 | 프로필, 게시물, 팔로우 |
| [레시피 앱](../../cookbooks/recipe-app/) | 중급 | 레시피, 식단 계획 |
| [쇼핑몰](../../cookbooks/shopping-mall/) | 중급 | 상품, 장바구니, 주문 |

***

## 도움이 필요하면

- [공통 에러 코드](../troubleshooting/01-common-errors.md) — 일반적인 문제 해결
- [에러 처리 가이드](../guides/11-error-handling.md) — 앱에서 에러 대응하기
- [자주 묻는 질문](../troubleshooting/05-faq.md) — FAQ
