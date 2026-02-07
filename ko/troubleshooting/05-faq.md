# 자주 묻는 질문

{% hint style="info" %}
💡 bkend에 대해 자주 묻는 질문과 용어를 정리합니다.
{% endhint %}

## 일반

**Q: bkend는 어떤 서비스인가요?**

bkend는 AI 도구와 연동할 수 있는 Backend 서비스입니다. Database, Authentication, Storage를 제공하며, MCP (Model Context Protocol)를 통해 Claude Code, Cursor 등 AI 도구에서 직접 백엔드를 관리할 수 있습니다.

***

**Q: bkend는 어떤 데이터베이스를 사용하나요?**

MongoDB를 사용합니다. 동적 BSON Schema를 지원하여 테이블과 컬럼을 유연하게 관리할 수 있습니다.

***

**Q: SQL을 사용할 수 있나요?**

아닙니다. bkend는 MongoDB 기반으로 REST API와 MCP 도구를 통해 데이터를 조작합니다. SQL 대신 JSON 기반의 필터링과 정렬을 사용합니다.

***

## 데이터베이스

**Q: 테이블 간 조인(JOIN)이 가능한가요?**

🚧 확인 필요 — 관계(Relation) 설정 후 조인 쿼리 가능 여부를 확인 중입니다.

***

**Q: 데이터 백업은 어떻게 하나요?**

bkend는 MongoDB Atlas를 사용하며, 자동 백업이 적용됩니다. 수동 백업이 필요하면 API를 통해 데이터를 내보낼 수 있습니다.

***

## 인증

**Q: JWT 토큰의 유효 기간은 얼마인가요?**

Access Token은 1시간, Refresh Token은 30일입니다. Access Token 만료 시 Refresh Token으로 갱신할 수 있습니다.

→ [세션 & 토큰 관리](../authentication/10-session-management.md)

***

**Q: 소셜 로그인은 어떤 프로바이더를 지원하나요?**

Google과 GitHub을 지원합니다. 각 프로바이더의 설정 방법은 소셜 로그인 문서를 참고하세요.

→ [소셜 로그인 개요](../authentication/05-social-overview.md)

***

**Q: 비밀번호를 잊어버렸어요. 어떻게 하나요?**

비밀번호 재설정 기능을 사용하세요. 등록된 이메일로 재설정 링크가 발송됩니다.

→ [비밀번호 재설정/변경](../authentication/08-password-management.md)

***

## 스토리지

**Q: 최대 파일 크기 제한이 있나요?**

단일 Presigned URL 업로드에는 크기 제한이 있을 수 있습니다. 대용량 파일은 멀티파트 업로드를 사용하세요.

→ [대용량 파일 업로드](../storage/03-upload-multipart.md)

***

**Q: 파일 URL은 영구적인가요?**

public 파일의 CDN URL은 만료되지 않습니다. private 파일의 Presigned URL은 유효 기간이 있습니다.

***

## MCP / AI 도구

**Q: MCP란 무엇인가요?**

Model Context Protocol의 약자로, AI 도구가 외부 서비스와 소통하기 위한 표준 프로토콜입니다.

→ [MCP 프로토콜 이해](../ai-tools/02-mcp-protocol.md)

***

**Q: 어떤 AI 도구를 지원하나요?**

Claude Code, Cursor, Antigravity 등 MCP를 지원하는 모든 AI 도구와 연동할 수 있습니다.

→ [AI 도구 연동 개요](../ai-tools/01-overview.md)

***

## 보안

**Q: API Key가 노출되었어요. 어떻게 하나요?**

즉시 콘솔에서 해당 API Key를 **폐기**(Revoke)하고 새 API Key를 발급하세요. Secret Key는 서버 사이드에서만 사용하고, 클라이언트 코드에 포함하지 마세요.

→ [API 키 관리 (콘솔)](../console/11-api-keys.md)

***

**Q: Public Key와 Secret Key의 차이는 무엇인가요?**

Public Key는 클라이언트에서 제한된 권한(RLS 기반)으로, Secret Key는 서버에서 전체 권한(admin)으로 사용합니다.

→ [Public Key vs Secret Key](../security/03-public-vs-secret.md)

***

## 용어집

| 용어 | 설명 |
|------|------|
| **bkend** | AI 도구 연동을 지원하는 Backend 서비스 |
| **Organization** | 프로젝트를 관리하는 조직 단위 |
| **Project** | 서비스 단위. Organization 내에 여러 프로젝트 생성 가능 |
| **Environment** | 프로젝트의 실행 환경 (dev, staging, prod) |
| **Tenant** | bkend를 사용하여 서비스를 구축하는 사용자 |
| **User** | Tenant가 구축한 서비스의 최종 사용자 |
| **MCP** | Model Context Protocol. AI 도구와 서비스 간 표준 통신 프로토콜 |
| **API Key** | API 인증에 사용되는 키 (`ak_` prefix) |
| **JWT** | JSON Web Token. 사용자 인증에 사용되는 토큰 형식 |
| **RLS** | Row Level Security. 행 수준 접근 제어 |
| **CRUD** | Create, Read, Update, Delete의 약자 |
| **OAuth 2.1** | 소셜 로그인 등에 사용되는 인증/인가 프로토콜 |
| **PKCE** | Proof Key for Code Exchange. OAuth 보안 확장 |
| **Presigned URL** | 일정 시간 동안 유효한 파일 접근 URL |
| **CDN** | Content Delivery Network. 전 세계에 분산된 파일 전송 네트워크 |

***

## 다음 단계

- [공통 에러 코드](01-common-errors.md) — 에러 해결
- [연결 문제 해결](02-connection-issues.md) — 연결 문제
- [인증 문제 해결](03-auth-issues.md) — 인증 문제
- [bkend 소개](../getting-started/01-what-is-bkend.md) — bkend 개요
