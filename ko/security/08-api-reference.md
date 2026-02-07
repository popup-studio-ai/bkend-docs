# Security REST API 레퍼런스

{% hint style="info" %}
💡 보안 관련 API 인증 방식, 헤더, 에러 코드를 확인합니다.
{% endhint %}

## 개요

이 문서는 bkend REST API의 보안 관련 사항을 정리합니다. 모든 API 요청에 적용되는 인증 헤더, 권한 모델, 보안 관련 에러 코드를 다룹니다.

***

## 베이스 URL

```
https://api-client.bkend.ai
```

***

## 인증 헤더

### 필수 헤더

| 헤더 | 필수 | 설명 |
|------|:----:|------|
| `X-Project-Id` | ✅ | 프로젝트 ID |
| `X-Environment` | ✅ | 환경 (`dev`, `staging`, `prod`) |

### 인증 헤더 (선택)

| 헤더 | 값 | 결과 |
|------|-----|------|
| `Authorization: Bearer {api_key}` | API 키 (`ak_` prefix) | 키 유형에 따라 권한 부여 |
| `Authorization: Bearer {jwt}` | JWT 토큰 | 사용자 인증 (user 그룹) |
| (없음) | — | 미인증 (guest 그룹) |

### API 키 인증

```bash
curl -X GET https://api-client.bkend.ai/v1/data/{tableName} \
  -H "Authorization: Bearer ak_{your_api_key}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### JWT 인증

```bash
curl -X GET https://api-client.bkend.ai/v1/data/{tableName} \
  -H "Authorization: Bearer {jwt_token}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## 인증 흐름

```mermaid
sequenceDiagram
    participant C as 클라이언트
    participant A as bkend API

    C->>A: Authorization: Bearer {token}
    alt API 키 (ak_ prefix)
        A->>A: SHA-256 해시로 키 검증
        A->>A: 프로젝트 접근 권한 확인
    else JWT 토큰
        A->>A: JWT 서명 검증
        A->>A: 사용자 역할 확인
    else 토큰 없음
        A->>A: guest 그룹 적용
    end
    A->>A: RLS 권한 검사
    A-->>C: 응답
```

***

## 사용자 그룹 결정

| 인증 | 조건 | 사용자 그룹 |
|------|------|-----------|
| Secret Key | API 키 인증 | `admin` |
| Public Key + JWT | 조직 관리자 역할 | `admin` |
| Public Key + JWT | 일반 사용자 | `user` |
| Public Key (JWT 없음) | — | `guest` |
| 인증 없음 | — | `guest` |

***

## API 키 형식

| 항목 | 값 |
|------|-----|
| **Prefix** | `ak_` |
| **형식** | `ak_` + 64자 hex (32바이트 랜덤) |
| **정규식** | `^ak_[a-fA-F0-9]{64}$` |
| **저장 방식** | SHA-256 해시 (원본 미저장) |

### 키 생성

API 키는 **콘솔**에서 생성합니다.

→ [API 키 관리 (콘솔)](../console/11-api-keys.md)

***

## RLS 권한 검사

### 기본 권한

permissions 미설정 시 적용되는 기본 권한입니다.

| 그룹 | create | read | update | delete | list |
|------|:------:|:----:|:------:|:------:|:----:|
| `admin` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user` | ✅ | ✅ | ❌ | ❌ | ✅ |
| `guest` | ❌ | ✅ | ❌ | ❌ | ✅ |

### 권한별 API 매핑

| 권한 | HTTP 메서드 | 엔드포인트 |
|------|-----------|-----------|
| `create` | `POST` | `/v1/data/{tableName}` |
| `read` | `GET` | `/v1/data/{tableName}/{id}` |
| `update` | `PATCH` | `/v1/data/{tableName}/{id}` |
| `delete` | `DELETE` | `/v1/data/{tableName}/{id}` |
| `list` | `GET` | `/v1/data/{tableName}` |

### self 권한 자동 필터

`self` 권한만 있는 사용자가 목록 조회 시, 응답에 `createdBy = {requesterId}` 필터가 자동 적용됩니다.

***

## 보안 관련 에러 코드

### 인증 에러 (401)

| 에러 코드 | 설명 | 대응 |
|----------|------|------|
| `UNAUTHORIZED` | 인증 토큰 없음 | `Authorization` 헤더 추가 |
| `INVALID_TOKEN` | 잘못된 토큰 형식 | 토큰 형식 확인 (ak_ prefix 또는 유효한 JWT) |
| `TOKEN_EXPIRED` | 토큰 만료 | 새 토큰 발급 또는 Refresh Token으로 갱신 |
| `TOKEN_REVOKED` | 폐기된 API 키 | 새 API 키 생성 |

### 인증 에러 응답 예시

```json
{
  "statusCode": 401,
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

### 인가 에러 (403)

| 에러 코드 | 설명 | 대응 |
|----------|------|------|
| `PERMISSION_DENIED` | 해당 그룹에 권한 없음 | RLS 정책 확인 또는 인증 방식 변경 |
| `SYSTEM_TABLE_ACCESS` | 시스템 테이블 접근 차단 | admin 인증(Secret Key) 사용 |

### 인가 에러 응답 예시

```json
{
  "statusCode": 403,
  "error": "PERMISSION_DENIED",
  "message": "user 그룹에 delete 권한이 없습니다"
}
```

### 프로젝트/환경 에러

| 에러 코드 | HTTP | 설명 | 대응 |
|----------|:----:|------|------|
| `PROJECT_NOT_FOUND` | 404 | 프로젝트 ID가 잘못됨 | `X-Project-Id` 확인 |
| `ENVIRONMENT_NOT_FOUND` | 404 | 환경이 잘못됨 | `X-Environment` 확인 |
| `MISSING_PROJECT_ID` | 400 | 프로젝트 ID 헤더 없음 | `X-Project-Id` 헤더 추가 |

***

## Rate Limiting

| 항목 | 값 |
|------|-----|
| **제한** | 플랜별 상이 |
| **헤더** | `X-RateLimit-Limit`, `X-RateLimit-Remaining` |
| **초과 시** | `429 Too Many Requests` |

### 재시도 처리

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '1';
      await new Promise(resolve =>
        setTimeout(resolve, parseInt(retryAfter) * 1000)
      );
      continue;
    }

    return response;
  }
  throw new Error('Rate limit exceeded after retries');
}
```

***

## 다음 단계

- [보안 개요](01-overview.md) — 전체 보안 아키텍처
- [API 키 이해](02-api-keys.md) — API 키 상세
- [RLS 정책 작성](05-rls-policies.md) — 접근 권한 설정
- [공통 에러 코드](../troubleshooting/01-common-errors.md) — 전체 에러 코드 레퍼런스
