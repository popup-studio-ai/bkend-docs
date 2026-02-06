# 자주 발생하는 에러

> bkend 사용 중 자주 발생하는 에러와 해결 방법을 안내합니다.

## 개요

이 문서에서는 HTTP 상태 코드별 에러 원인과 해결 방법을 정리합니다. 에러 코드의 전체 목록은 [에러 코드 레퍼런스](../api-reference/10-error-codes.md)를 참고하세요.

---

## 400 Bad Request

요청 형식이 올바르지 않을 때 발생합니다.

| 에러 코드 | 원인 | 해결 방법 |
|----------|------|---------|
| `VALIDATION_ERROR` | 필수 파라미터 누락 또는 잘못된 타입 | 요청 body의 필수 필드와 타입을 확인하세요 |
| `INVALID_COLUMN_TYPE` | 지원하지 않는 컬럼 타입 | String, Number, Boolean, Date, Array, Object, Mixed 중 선택하세요 |
| `INVALID_FILTER` | 잘못된 필터 형식 | 필터 연산자(`$eq`, `$gt`, `$contains` 등)를 확인하세요 |
| `DUPLICATE_COLUMN_NAME` | 중복된 컬럼 이름 | 테이블 내 컬럼 이름이 고유한지 확인하세요 |

### 확인 방법

```typescript
const response = await fetch('https://api.bkend.io/data/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // Content-Type 확인
    'X-API-Key': '{your_api_key}'
  },
  body: JSON.stringify({
    title: '제목' // 필수 필드 포함 확인
  })
});

if (!response.ok) {
  const error = await response.json();
  console.error('에러 코드:', error.code);
  console.error('에러 메시지:', error.message);
}
```

---

## 401 Unauthorized

인증 정보가 없거나 유효하지 않을 때 발생합니다.

| 에러 코드 | 원인 | 해결 방법 |
|----------|------|---------|
| `UNAUTHORIZED` | API Key 또는 JWT 토큰 누락 | 요청 헤더에 인증 정보를 포함하세요 |
| `TOKEN_EXPIRED` | Access Token 만료 | Refresh Token으로 새 Access Token을 발급받으세요 |
| `INVALID_TOKEN` | 잘못된 토큰 형식 | 토큰 값을 확인하세요 |
| `INVALID_API_KEY` | 유효하지 않은 API Key | API Key가 올바른지, 폐기되지 않았는지 확인하세요 |

### Access Token 만료 시 갱신

```typescript
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch('https://api.bkend.io/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    // Refresh Token도 만료된 경우 → 재로그인 필요
    throw new Error('재로그인이 필요합니다');
  }

  const { accessToken } = await response.json();
  return accessToken;
}
```

---

## 403 Forbidden

인증은 되었지만 권한이 없을 때 발생합니다.

| 에러 코드 | 원인 | 해결 방법 |
|----------|------|---------|
| `PERMISSION_DENIED` | RBAC 권한 부족 | 테이블의 `permissions` 설정을 확인하세요 |
| `SCOPE_INSUFFICIENT` | API Key 스코프 부족 | API Key의 스코프를 확인하고 필요한 권한을 추가하세요 |
| `SELF_ONLY` | 본인 데이터만 접근 가능 | self 권한으로 본인이 생성한 데이터만 접근할 수 있습니다 |

### 권한 확인 방법

```mermaid
flowchart TD
    A[403 에러 발생] --> B{API Key 사용?}
    B -->|예| C[API Key 스코프 확인]
    B -->|아니오| D{JWT 토큰 사용?}
    D -->|예| E[사용자 그룹 확인<br/>admin/user/guest]
    C --> F[필요한 스코프가<br/>포함되어 있는지 확인]
    E --> G[테이블 permissions<br/>설정 확인]
```

---

## 404 Not Found

요청한 리소스가 존재하지 않을 때 발생합니다.

| 에러 코드 | 원인 | 해결 방법 |
|----------|------|---------|
| `TABLE_NOT_FOUND` | 테이블이 존재하지 않음 | 테이블 이름의 대소문자와 철자를 확인하세요 |
| `RECORD_NOT_FOUND` | 레코드가 존재하지 않음 | 레코드 ID가 올바른지 확인하세요 |
| `USER_NOT_FOUND` | User가 존재하지 않음 | User ID 또는 이메일을 확인하세요 |
| `FILE_NOT_FOUND` | 파일이 존재하지 않음 | 파일 ID가 올바른지 확인하세요 |

> 💡 **Tip** - 테이블 이름은 대소문자를 구분합니다. `Posts`와 `posts`는 다른 테이블입니다.

---

## 409 Conflict

리소스 충돌이 발생했을 때 나타납니다.

| 에러 코드 | 원인 | 해결 방법 |
|----------|------|---------|
| `DUPLICATE_TABLE` | 같은 이름의 테이블이 존재 | 다른 이름을 사용하거나 기존 테이블을 삭제하세요 |
| `EMAIL_ALREADY_EXISTS` | 이미 등록된 이메일 | 다른 이메일을 사용하거나 로그인을 시도하세요 |
| `UNIQUE_CONSTRAINT` | Unique 인덱스 위반 | 중복되지 않는 값을 사용하세요 |

---

## 429 Too Many Requests

API 호출 한도를 초과했을 때 발생합니다.

| 에러 코드 | 원인 | 해결 방법 |
|----------|------|---------|
| `RATE_LIMIT_EXCEEDED` | API 호출 한도 초과 | 호출 빈도를 줄이거나 플랜을 업그레이드하세요 |
| `EMAIL_RATE_LIMIT` | 이메일 발송 한도 초과 | 시간당 3회 제한, 잠시 후 재시도하세요 |

### 대응 방법

```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : (i + 1) * 2000;
      console.log(`Rate limit 초과. ${delay / 1000}초 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }

    return response;
  }

  throw new Error('최대 재시도 횟수 초과');
}
```

---

## 500 Internal Server Error

서버 내부 오류입니다.

| 대응 | 설명 |
|------|------|
| **재시도** | 일시적 오류일 수 있으므로 잠시 후 재시도하세요 |
| **지속 발생 시** | 동일한 요청에서 반복 발생하면 요청 내용을 점검하세요 |
| **문의** | 문제가 지속되면 지원팀에 문의하세요 |

---

## 에러 디버깅 팁

1. **응답 body 확인** — 에러 코드와 메시지를 확인하세요.
2. **요청 헤더 확인** — `Content-Type`, `X-API-Key`, `Authorization` 헤더를 확인하세요.
3. **환경 확인** — 올바른 환경(dev/staging/prod)에 요청하고 있는지 확인하세요.
4. **활동 로그 확인** — 콘솔의 Activities 페이지에서 관련 이벤트를 확인하세요.

---

## 관련 문서

- [에러 코드 레퍼런스](../api-reference/10-error-codes.md) — 전체 에러 코드 목록
- [연결 문제](02-connection-issues.md) — 연결 관련 문제
- [인증 관련 문제](03-auth-issues.md) — 인증 에러 해결
- [FAQ](05-faq.md) — 자주 묻는 질문
