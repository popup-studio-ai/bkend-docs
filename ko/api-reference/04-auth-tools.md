# Auth MCP 도구

> Authentication 관련 MCP 도구의 명세와 사용법을 안내합니다.

## 개요

Auth MCP 도구는 인증 구현에 필요한 가이드와 코드 예시를 제공합니다. 서비스 API의 인증 엔드포인트를 AI 코딩 도구에서 효과적으로 활용할 수 있도록 안내합니다.

---

## 문서 도구

### `3_howto_implement_auth`

서비스 API 인증 구현의 고급 패턴을 제공합니다.

| 항목 | 값 |
|------|-----|
| **파라미터** | 없음 |
| **스코프** | 없음 |

**제공 내용**:
- 회원가입(signup) 요청/응답 스키마
- 로그인(signin) 요청/응답 스키마
- 토큰 갱신(refresh) 패턴
- 현재 사용자 조회(me) 패턴
- 로그아웃(signout) 패턴
- 에러 코드 목록

### `6_code_examples_auth`

인증 관련 코드 예시를 제공합니다.

| 항목 | 값 |
|------|-----|
| **파라미터** | 없음 |
| **스코프** | 없음 |

**제공 내용**:
- 회원가입 코드 예시 (약관 동의 포함)
- 로그인 코드 예시
- MFA(2단계 인증) 코드 예시
- 토큰 갱신 코드 예시
- 현재 사용자 조회 코드 예시

---

## Auth REST API 엔드포인트 요약

MCP 문서 도구에서 안내하는 서비스 API 인증 엔드포인트:

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/v1/auth/email/signup` | POST | 이메일 회원가입 |
| `/v1/auth/email/signin` | POST | 이메일 로그인 |
| `/v1/auth/{provider}/authorize` | GET | 소셜 로그인 인증 URL |
| `/v1/auth/{provider}/callback` | POST | 소셜 로그인 콜백 |
| `/v1/auth/me` | GET | 현재 사용자 조회 |
| `/v1/auth/refresh` | POST | 토큰 갱신 |
| `/v1/auth/signout` | POST | 로그아웃 |
| `/v1/auth/withdraw` | DELETE | 계정 삭제 |
| `/v1/auth/password/reset/request` | POST | 비밀번호 재설정 요청 |
| `/v1/auth/password/reset/confirm` | POST | 비밀번호 재설정 확인 |
| `/v1/auth/password/change` | POST | 비밀번호 변경 |
| `/v1/auth/sessions` | GET | 세션 목록 |
| `/v1/auth/sessions/{sessionId}` | DELETE | 세션 삭제 |
| `/v1/auth/email/verify/send` | POST | 이메일 인증 발송 |
| `/v1/auth/email/verify/confirm` | POST | 이메일 인증 확인 |
| `/v1/auth/accounts` | GET/POST | 계정 연동 목록/추가 |
| `/v1/auth/accounts/{provider}` | DELETE | 계정 연동 해제 |

> 💡 **Tip** - 각 엔드포인트의 상세 파라미터와 응답은 `5_get_operation_schema` 도구로 조회할 수 있습니다.

---

## 관련 문서

- [MCP 프로토콜](02-mcp-protocol.md) — MCP 프로토콜 상세
- [Database MCP 도구](03-db-tools.md) — Database 관련 도구
- [REST Auth](08-rest-auth.md) — REST API Auth 엔드포인트
- [이메일 로그인](../authentication/04-login-email.md) — 이메일 로그인 가이드
