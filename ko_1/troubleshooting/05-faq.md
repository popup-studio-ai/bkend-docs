# FAQ & 용어집

> bkend에 대해 자주 묻는 질문과 용어를 정리합니다.

## 자주 묻는 질문

### 일반

**Q: bkend는 어떤 서비스인가요?**

A: bkend는 AI 도구와 연동할 수 있는 Backend 서비스 플랫폼입니다. Database, Authentication, Storage를 제공하며, MCP (Model Context Protocol)를 통해 Claude Code, Cursor 등 AI 도구에서 직접 백엔드를 관리할 수 있습니다.

---

**Q: bkend는 어떤 데이터베이스를 사용하나요?**

A: MongoDB를 사용합니다. 동적 BSON Schema를 지원하여 테이블과 컬럼을 유연하게 관리할 수 있습니다.

---

**Q: 무료로 사용할 수 있나요?**

A: Free 플랜으로 무료 시작할 수 있습니다. dev 환경 1개, 월 10,000 API 호출, 1 GB 저장소를 제공합니다.

---

### 데이터베이스

**Q: SQL을 사용할 수 있나요?**

A: 아닙니다. bkend는 MongoDB 기반으로 REST API와 MCP 도구를 통해 데이터를 조작합니다. SQL 대신 JSON 기반의 필터링과 정렬을 사용합니다.

---

**Q: 테이블 간 조인(JOIN)이 가능한가요?**

A: 가능합니다. 관계(Relation)를 설정하고 조인 쿼리로 관련 데이터를 함께 조회할 수 있습니다. 자세한 내용은 [조인 쿼리](../database/13-joins.md)를 참고하세요.

---

**Q: 데이터 백업은 어떻게 하나요?**

A: bkend는 MongoDB Atlas를 사용하며, 자동 백업이 적용됩니다. 수동 백업이 필요하면 API를 통해 데이터를 내보낼 수 있습니다.

---

### 인증

**Q: JWT 토큰의 유효 기간은 얼마인가요?**

A: Access Token은 1시간, Refresh Token은 7일입니다. Access Token 만료 시 Refresh Token으로 갱신할 수 있습니다.

---

**Q: 소셜 로그인은 어떤 프로바이더를 지원하나요?**

A: Google, GitHub, Apple, Kakao, Naver를 지원합니다. 각 프로바이더의 설정 방법은 [소셜 로그인 개요](../authentication/07-social-overview.md)를 참고하세요.

---

**Q: 비밀번호를 잊어버렸어요. 어떻게 하나요?**

A: 비밀번호 재설정 API를 통해 재설정 이메일을 발송할 수 있습니다. 자세한 내용은 [비밀번호 재설정](../authentication/05-password-reset.md)을 참고하세요.

---

### Storage

**Q: 최대 파일 크기 제한이 있나요?**

A: 단일 Presigned URL 업로드는 파일 크기 제한이 있을 수 있습니다. 대용량 파일은 멀티파트 업로드를 사용하세요. 자세한 내용은 [대용량 파일 업로드](../storage/06-upload-large.md)를 참고하세요.

---

**Q: 파일 URL은 영구적인가요?**

A: public 파일의 CDN URL은 만료되지 않습니다. private 파일의 Presigned URL은 1시간 후 만료됩니다.

---

### MCP / AI 도구

**Q: MCP란 무엇인가요?**

A: Model Context Protocol의 약자로, AI 도구가 외부 서비스와 소통하기 위한 표준 프로토콜입니다. 자세한 내용은 [MCP란?](../getting-started/07-what-is-mcp.md)을 참고하세요.

---

**Q: 어떤 AI 도구를 지원하나요?**

A: Claude Code, Cursor, Windsurf 등 MCP를 지원하는 모든 AI 도구와 연동할 수 있습니다. 자세한 내용은 [AI 도구 연동 개요](../integrations/01-overview.md)를 참고하세요.

---

### 보안

**Q: API Key가 노출되었어요. 어떻게 하나요?**

A: 즉시 콘솔에서 해당 API Key를 폐기(Revoke)하고 새 API Key를 발급하세요. API Key는 서버 사이드에서만 사용하고, 클라이언트 코드에 포함하지 마세요.

---

**Q: Public Key와 Secret Key의 차이는 무엇인가요?**

A: Public Key는 클라이언트에서 제한된 작업에, Secret Key는 서버에서 모든 작업에 사용합니다. 자세한 내용은 [Public vs Secret Key](../security/04-public-vs-secret.md)를 참고하세요.

---

### 플랜 / 결제

**Q: 플랜을 다운그레이드하면 데이터가 삭제되나요?**

A: 아닙니다. 데이터는 유지됩니다. 단, 현재 사용량이 하위 플랜의 한도를 초과하면 다운그레이드가 제한될 수 있습니다.

---

**Q: Free 플랜에서 staging/prod 환경을 사용할 수 있나요?**

A: 아닙니다. Free 플랜은 dev 환경 1개만 지원합니다. staging/prod 환경은 Starter 플랜 이상에서 사용할 수 있습니다.

---

## 용어집

| 용어 | 설명 |
|------|------|
| **bkend** | AI 도구 연동을 지원하는 Backend 서비스 플랫폼 |
| **Organization** | 프로젝트를 관리하는 조직 단위. 약어: Org |
| **Project** | 서비스 단위. Organization 내에 여러 프로젝트를 생성할 수 있음 |
| **Environment** | 프로젝트의 실행 환경. dev, staging, prod, custom 타입 지원 |
| **Tenant** | bkend를 사용하여 서비스를 구축하는 사용자 |
| **User** | Tenant가 구축한 서비스의 최종 사용자 |
| **MCP** | Model Context Protocol. AI 도구와 서비스 간 표준 통신 프로토콜 |
| **API Key** | API 인증에 사용되는 키. `ak_` (API Key) 또는 `bt_` (Bearer Token) 접두사 |
| **JWT** | JSON Web Token. 사용자 인증에 사용되는 토큰 형식 |
| **RBAC** | Role-Based Access Control. 역할 기반 접근 제어 |
| **RLS** | Row Level Security. 행 수준 접근 제어 |
| **CRUD** | Create, Read, Update, Delete의 약자. 데이터 기본 작업 |
| **OAuth 2.1** | 소셜 로그인 등에 사용되는 인증/인가 프로토콜 |
| **PKCE** | Proof Key for Code Exchange. OAuth 보안 확장 |
| **Presigned URL** | 일정 시간 동안 유효한 파일 접근 URL |
| **CDN** | Content Delivery Network. 전 세계에 분산된 파일 전송 네트워크 |
| **CORS** | Cross-Origin Resource Sharing. 교차 출처 리소스 공유 |
| **관리 API** | 프로젝트 설정, 테이블 관리 등에 사용하는 API |
| **서비스 API** | User 앱에서 데이터를 조작하는 API |
| **Webhook** | 이벤트 발생 시 외부 URL로 알림을 전송하는 기능 |

---

## 관련 문서

- [자주 발생하는 에러](01-common-errors.md) — 에러 해결
- [연결 문제](02-connection-issues.md) — 연결 문제 해결
- [인증 관련 문제](03-auth-issues.md) — 인증 문제 해결
- [성능 문제](04-performance-issues.md) — 성능 문제 해결
- [bkend란?](../getting-started/01-what-is-bkend.md) — bkend 소개
