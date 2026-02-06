# 에러 코드 레퍼런스

> bkend API에서 반환하는 에러 코드의 전체 목록입니다.

## 에러 응답 형식

```json
{
  "error": {
    "code": "auth/invalid-credentials",
    "message": "이메일/비밀번호가 일치하지 않습니다"
  }
}
```

---

## Authentication 에러

### 로그인/회원가입

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `auth/invalid-credentials` | 401 | 이메일/비밀번호 불일치 |
| `auth/user-not-found` | 404 | 계정이 존재하지 않음 |
| `auth/email-already-exists` | 409 | 이미 사용 중인 이메일 |
| `auth/invalid-email-format` | 400 | 잘못된 이메일 형식 |
| `auth/invalid-password-format` | 400 | 비밀번호 정책 미충족 |
| `auth/invalid-name-format` | 400 | 이름 형식 오류 |
| `auth/account-locked` | 403 | 계정 잠김 |
| `auth/too-many-login-attempts` | 429 | 로그인 시도 횟수 초과 |

### 2FA

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `auth/mfa-required` | 403 | 2FA 코드가 필요함 |
| `auth/invalid-mfa-code` | 401 | 유효하지 않은 2FA 코드 |

### 토큰

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `auth/unauthorized` | 401 | 인증되지 않은 요청 |
| `auth/invalid-token-format` | 400 | 잘못된 토큰 형식 |
| `auth/invalid-refresh-token` | 401 | 유효하지 않은 Refresh Token |
| `auth/session-expired` | 401 | 세션 만료 |
| `auth/session-not-found` | 404 | 세션을 찾을 수 없음 |

### 비밀번호 재설정

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `auth/invalid-password-reset-token` | 400 | 유효하지 않은 재설정 토큰 |
| `auth/expired-password-reset-token` | 400 | 만료된 재설정 토큰 |
| `auth/same-as-previous-password` | 400 | 이전과 동일한 비밀번호 |
| `auth/invalid-password` | 401 | 현재 비밀번호 오류 |
| `auth/too-many-code-requests` | 429 | 요청 횟수 초과 |

### 이메일 인증

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `auth/verification-token-not-found` | 400 | 인증 토큰을 찾을 수 없음 |
| `auth/verification-token-expired` | 400 | 만료된 인증 토큰 |
| `auth/email-already-verified` | 400 | 이미 인증된 이메일 |
| `auth/email-not-verified` | 403 | 이메일 인증 미완료 |
| `auth/too-many-requests` | 429 | 요청 횟수 초과 |

### 매직 링크

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `auth/invalid-token` | 400 | 유효하지 않은 매직 링크 토큰 |
| `auth/token-expired` | 400 | 만료된 매직 링크 토큰 |

### OAuth / 소셜 로그인

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `auth/unsupported-provider` | 400 | 지원하지 않는 OAuth 제공자 |
| `auth/oauth-not-configured` | 400 | OAuth 제공자 미설정 |
| `auth/missing-credentials` | 400 | code, idToken 누락 |
| `auth/invalid-oauth-code` | 400 | 유효하지 않은 Authorization Code |
| `auth/account-exists-different-provider` | 409 | 다른 방식으로 가입된 이메일 |
| `auth/account-already-linked` | 409 | 이미 연동된 계정 |
| `auth/google-token-exchange-failed` | 400 | Google 토큰 교환 실패 |
| `auth/google-id-token-invalid` | 400 | Google ID Token 검증 실패 |
| `auth/github-token-exchange-failed` | 400 | GitHub 토큰 교환 실패 |
| `auth/github-email-not-found` | 400 | GitHub 이메일을 찾을 수 없음 |

---

## Database 에러

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `data/table-not-found` | 404 | 테이블을 찾을 수 없음 |
| `data/not-found` | 404 | 데이터를 찾을 수 없음 |
| `data/environment-not-found` | 404 | 환경을 찾을 수 없음 |
| `data/validation-error` | 400 | 데이터 유효성 검증 실패 |
| `data/duplicate-value` | 409 | 중복 값 (unique 제약 위반) |
| `data/permission-denied` | 403 | 접근 권한 없음 |
| `data/system-table-access` | 403 | 시스템 테이블 접근 금지 |
| `data/invalid-header` | 400 | 잘못된 요청 헤더 |
| `data/rate-limit-exceeded` | 429 | 요청 횟수 초과 |

---

## Storage 에러

| 에러 코드 | HTTP | 설명 |
|----------|------|------|
| `file/not-found` | 404 | 파일을 찾을 수 없음 |
| `file/access-denied` | 403 | 파일 접근 권한 없음 |
| `file/file-too-large` | 400 | 파일 크기 초과 |
| `file/invalid-format` | 400 | 지원하지 않는 파일 형식 |
| `file/invalid-name` | 400 | 유효하지 않은 파일명 |
| `file/s3-key-already-exists` | 409 | 이미 존재하는 S3 키 |
| `file/bucket-not-configured` | 400 | S3 버킷 미설정 |
| `file/upload-init-failed` | 400 | 멀티파트 업로드 초기화 실패 |
| `file/invalid-part-number-range` | 400 | 파트 번호 범위 오류 (1~10000) |
| `file/invalid-parts-array` | 400 | 파트 배열 오류 |

---

## MCP 에러 (JSON-RPC)

| 코드 | 설명 |
|------|------|
| `-32700` | JSON 파싱 에러 |
| `-32600` | 잘못된 요청 형식 |
| `-32601` | 존재하지 않는 메서드 |
| `-32602` | 잘못된 파라미터 |
| `-32603` | 내부 에러 |
| `-32001` | 인증 실패 |
| `-32002` | 리소스를 찾을 수 없음 |

---

## 공통 HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| `400` | 잘못된 요청 (파라미터 검증 실패) |
| `401` | 인증 필요 (토큰 없음 또는 만료) |
| `403` | 권한 없음 (인증되었으나 접근 불가) |
| `404` | 리소스를 찾을 수 없음 |
| `409` | 충돌 (중복 데이터) |
| `429` | 요청 횟수 초과 (Rate Limit) |
| `500` | 서버 내부 오류 |

---

## 관련 문서

- [REST API 개요](06-rest-overview.md) — 공통 규칙
- [REST Database](07-rest-database.md) — Database 엔드포인트
- [REST Auth](08-rest-auth.md) — Auth 엔드포인트
- [REST Storage](09-rest-storage.md) — Storage 엔드포인트
