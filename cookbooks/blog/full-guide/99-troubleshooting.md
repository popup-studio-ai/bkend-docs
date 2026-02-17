# 문제 해결

{% hint style="info" %}
💡 블로그 쿡북 진행 중 자주 발생하는 문제와 해결 방법입니다.
{% endhint %}

## 인증 관련

### 401 Unauthorized 에러

```json
{
  "statusCode": 401,
  "error": "AUTHENTICATION_REQUIRED",
  "message": "유효하지 않은 토큰입니다"
}
```

**원인:** Access Token이 만료되었거나 유효하지 않습니다.

**해결:**

1. Access Token을 갱신하세요.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "refreshToken": "{refresh_token}"
  }'
```

2. Refresh Token도 만료되었다면 다시 로그인하세요.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/signin \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "method": "password",
    "email": "blogger@example.com",
    "password": "abc123"
  }'
```

{% hint style="info" %}
💡 `bkendFetch` 헬퍼를 사용하면 401 응답 시 자동으로 토큰을 갱신합니다. 자세한 내용은 [토큰 관리](../../../ko/authentication/20-token-management.md)를 참고하세요.
{% endhint %}

***

### 토큰 만료

**증상:** API 호출이 갑자기 실패하기 시작합니다.

**원인:** Access Token의 유효 시간은 1시간(3600초)입니다.

**해결:**

| 토큰 | 만료 시 | 대응 |
|------|---------|------|
| Access Token | 1시간 | Refresh Token으로 갱신 |
| Refresh Token | 장기 | 재로그인 필요 |

{% hint style="warning" %}
⚠️ 토큰을 갱신하면 이전 Access Token은 더 이상 사용할 수 없습니다. 갱신된 토큰을 반드시 저장하세요.
{% endhint %}

***

### 필수 헤더 누락

```json
{
  "statusCode": 400,
  "error": "MISSING_HEADER",
  "message": "X-API-Key 헤더가 필요합니다"
}
```

**원인:** 필수 헤더가 누락되었습니다.

**해결:** 모든 API 요청에 다음 헤더를 포함하세요.

| 헤더 | 필수 | 설명 |
|------|:----:|------|
| `X-API-Key` | ✅ | Publishable Key (`pk_` 접두사) |
| `Authorization` | ✅ | `Bearer {accessToken}` |
| `Content-Type` | POST/PATCH | `application/json` |

***

## 테이블 관련

### 테이블이 보이지 않음

```json
{
  "statusCode": 404,
  "error": "TABLE_NOT_FOUND",
  "message": "테이블 'articles'를 찾을 수 없습니다"
}
```

**원인:** 테이블이 아직 생성되지 않았거나, 다른 환경(Environment)에서 생성되었습니다.

**해결:**

1. 콘솔에서 **테이블 관리** 메뉴를 확인하세요.
2. `X-API-Key` 헤더 값이 올바른지 확인하세요. 테이블은 환경별로 독립적입니다.
3. 테이블이 없다면 [02-articles.md](02-articles.md)의 1단계를 참고하여 생성하세요.

{% hint style="warning" %}
⚠️ `dev` 환경에서 만든 테이블은 `staging`이나 `prod` 환경에서 자동으로 생성되지 않습니다. 각 환경에서 별도로 생성해야 합니다.
{% endhint %}

***

### 필드 타입 오류

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "isPublished 필드의 타입이 올바르지 않습니다. Boolean 타입이 필요합니다."
}
```

**원인:** 요청 데이터의 필드 타입이 테이블 스키마와 일치하지 않습니다.

**해결:** 각 필드의 타입을 확인하세요.

| 필드 | 올바른 타입 | 잘못된 예 | 올바른 예 |
|------|-----------|----------|----------|
| `isPublished` | Boolean | `"true"` | `true` |
| `tags` | Array(String) | `"tag1,tag2"` | `["tag1", "tag2"]` |
| `title` | String | `123` | `"제목"` |

***

## 게시글 관련

### 게시글 생성 실패 (400)

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "필수 파라미터가 누락되었습니다"
}
```

**원인:** 필수 필드가 누락되었습니다.

**해결:** `articles` 테이블의 필수 필드를 확인하세요.

| 필수 필드 | 타입 | 체크 항목 |
|----------|------|----------|
| `title` | String | 빈 문자열 `""` 불가 |
| `content` | String | 빈 문자열 `""` 불가 |

올바른 요청 예시:

```bash
curl -X POST https://api-client.bkend.ai/v1/data/articles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "게시글 제목",
    "content": "본문 내용"
  }'
```

***

### 게시글 조회 시 빈 결과

**증상:** `GET /v1/data/articles`를 호출했는데 `items`가 빈 배열로 반환됩니다.

**가능한 원인:**

1. 해당 환경에 데이터가 없음
2. 필터 조건이 너무 좁음
3. 다른 사용자의 데이터를 조회하려고 함

**해결:**

```bash
# 1. 필터 없이 전체 조회 시도
curl -X GET "https://api-client.bkend.ai/v1/data/articles?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"

# 2. X-API-Key 값 확인 (올바른 Publishable Key인지 확인)
```

***

### 게시글 수정 시 404

```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "데이터를 찾을 수 없습니다"
}
```

**원인:** 존재하지 않는 게시글 ID이거나, 이미 삭제된 게시글입니다.

**해결:**

1. 게시글 ID가 정확한지 확인하세요.
2. 목록을 조회하여 게시글이 존재하는지 확인하세요.
3. URL 경로에 ID가 올바르게 포함되었는지 확인하세요.

```bash
# 올바른 형식
curl -X PATCH https://api-client.bkend.ai/v1/data/articles/507f1f77bcf86cd799439011

# 잘못된 형식 (ID 누락)
curl -X PATCH https://api-client.bkend.ai/v1/data/articles/
```

***

## 이미지 관련

### Presigned URL 만료

**증상:** S3에 파일 업로드 시 `403 Forbidden` 또는 `Access Denied` 에러가 발생합니다.

**원인:** Presigned URL의 유효 시간은 **15분**입니다. 발급 후 15분이 지나면 만료됩니다.

**해결:**

1. Presigned URL을 다시 발급받으세요.
2. 발급 후 즉시 업로드를 수행하세요.

```javascript
// 1. Presigned URL 재발급
const presigned = await bkendFetch('/v1/files/presigned-url', {
  method: 'POST',
  body: {
    filename: 'cover-jeju.jpg',
    contentType: 'image/jpeg',
    fileSize: 2048000,
    visibility: 'public',
    category: 'images',
  },
});

// 2. 즉시 업로드
await fetch(presigned.url, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/jpeg' },
  body: file,
});
```

***

### 이미지가 표시되지 않음

**증상:** 게시글의 `coverImage` URL에 접근하면 이미지가 로드되지 않습니다.

**가능한 원인:**

| 원인 | 확인 방법 | 해결 |
|------|----------|------|
| 파일이 삭제됨 | `GET /v1/files/{fileId}` → 404 | 이미지를 다시 업로드하세요 |
| visibility가 `private` | 파일 메타데이터의 `visibility` 확인 | `public`으로 변경하세요 |
| URL이 잘못됨 | 게시글의 `coverImage` 값 확인 | 올바른 URL로 업데이트하세요 |

***

### 파일 크기 초과

```json
{
  "statusCode": 400,
  "error": "FILE_TOO_LARGE",
  "message": "파일 크기가 제한을 초과합니다"
}
```

**해결:**

1. 이미지를 압축한 후 다시 업로드하세요.
2. 더 낮은 해상도를 사용하세요.
3. 지원 형식을 확인하세요: JPEG, PNG, GIF, WebP.

***

### S3 업로드 시 Authorization 에러

**증상:** Presigned URL로 업로드할 때 인증 에러가 발생합니다.

**원인:** S3 업로드 시 `Authorization` 헤더를 포함했습니다.

**해결:** Presigned URL로 업로드할 때는 `Authorization` 헤더를 제거하세요. Presigned URL 자체에 인증 정보가 포함되어 있습니다.

```javascript
// ❌ 잘못된 예 — Authorization 헤더 포함
await fetch(presigned.url, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type,
    'Authorization': `Bearer ${token}`, // 제거하세요
  },
  body: file,
});

// ✅ 올바른 예 — Content-Type만 포함
await fetch(presigned.url, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type,
  },
  body: file,
});
```

***

## 태그 관련

### 태그명 중복

```json
{
  "statusCode": 409,
  "error": "DUPLICATE_VALUE",
  "message": "동일한 값이 이미 존재합니다"
}
```

**원인:** 같은 이름의 태그가 이미 존재합니다.

**해결:** 기존 태그를 먼저 조회하세요.

```bash
# 기존 태그 확인
curl -X GET "https://api-client.bkend.ai/v1/data/tags?andFilters=%7B%22name%22%3A%22%EC%97%AC%ED%96%89%22%7D" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

```javascript
// bkendFetch로 확인
const filters = JSON.stringify({ name: '여행' });
const existing = await bkendFetch(
  `/v1/data/tags?andFilters=${encodeURIComponent(filters)}`
);

if (existing.items.length > 0) {
  console.log('이미 존재하는 태그:', existing.items[0].id);
} else {
  // 새 태그 생성
}
```

***

### 태그 삭제 후 게시글에 잔여 ID

**증상:** 태그를 삭제했는데 게시글의 `tags` 배열에 삭제된 태그 ID가 남아있습니다.

**원인:** 태그 삭제 시 게시글의 `tags` 필드가 자동으로 정리되지 않습니다.

**해결:** 삭제된 태그를 참조하는 게시글을 찾아서 업데이트하세요.

```javascript
// 1. 삭제할 태그 ID 확인
const tagId = 'tag-uuid-life';

// 2. 해당 태그를 사용하는 게시글 조회
const filters = JSON.stringify({ tags: tagId });
const articles = await bkendFetch(
  `/v1/data/articles?andFilters=${encodeURIComponent(filters)}`
);

// 3. 각 게시글에서 태그 제거
for (const article of articles.items) {
  const updatedTags = article.tags.filter(t => t !== tagId);
  await bkendFetch(`/v1/data/articles/${article.id}`, {
    method: 'PATCH',
    body: { tags: updatedTags },
  });
}

// 4. 태그 삭제
await bkendFetch(`/v1/data/tags/${tagId}`, { method: 'DELETE' });
```

***

## 북마크 관련

### 중복 북마크 (409)

```json
{
  "statusCode": 409,
  "error": "DUPLICATE_VALUE",
  "message": "동일한 값이 이미 존재합니다"
}
```

**원인:** 이미 북마크한 게시글을 다시 북마크하려고 했습니다.

**해결:** 북마크 토글 패턴을 사용하세요.

```javascript
async function toggleBookmark(articleId) {
  const filters = JSON.stringify({ articleId });
  const result = await bkendFetch(
    `/v1/data/bookmarks?andFilters=${encodeURIComponent(filters)}`
  );

  if (result.items.length > 0) {
    // 이미 북마크됨 → 삭제
    await bkendFetch(`/v1/data/bookmarks/${result.items[0].id}`, {
      method: 'DELETE',
    });
    return { bookmarked: false };
  } else {
    // 북마크 없음 → 추가
    const bookmark = await bkendFetch('/v1/data/bookmarks', {
      method: 'POST',
      body: { articleId },
    });
    return { bookmarked: true, bookmarkId: bookmark.id };
  }
}
```

***

## MCP 도구 관련

### AI가 테이블을 찾지 못함

**증상:** AI에게 "게시글 작성해줘"라고 요청했는데 테이블을 찾을 수 없다는 응답을 받습니다.

**가능한 원인:**

1. MCP 세션에서 프로젝트가 선택되지 않았습니다.
2. 테이블이 아직 생성되지 않았습니다.
3. 환경(Environment) 설정이 다릅니다.

**해결:**

1. AI에게 "현재 연결된 프로젝트 확인해줘"라고 요청하세요.
2. 프로젝트가 올바르다면 "articles 테이블 목록 보여줘"라고 요청하여 존재 여부를 확인하세요.
3. 테이블이 없다면 [02-articles.md](02-articles.md)의 1단계를 참고하여 생성을 요청하세요.

***

### MCP 연결 실패

**증상:** AI 도구에서 bkend MCP 서버에 연결할 수 없다는 에러가 발생합니다.

**확인 사항:**

| 항목 | 확인 방법 |
|------|----------|
| MCP 서버 URL | `https://api.bkend.ai/mcp` 으로 설정되어 있는지 확인 |
| OAuth 인증 | 인증이 만료되었다면 재인증 수행 |
| 네트워크 | 인터넷 연결 상태 확인 |

**해결:**

1. AI 도구를 재시작하세요.
2. MCP 서버 설정을 확인하세요.
3. OAuth 재인증을 수행하세요.

{% hint style="info" %}
💡 MCP 설정에 대한 자세한 내용은 [AI 도구 연동](../../../ko/ai-tools/01-overview.md)을 참고하세요.
{% endhint %}

***

## 쿼리 관련

### 필터 구문 오류

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "잘못된 필터 형식입니다"
}
```

**해결:** `andFilters` 파라미터에 올바른 JSON 문자열을 전달하세요.

```javascript
// ❌ 잘못된 예 — 문자열이 아닌 객체 전달
fetch('/v1/data/articles?andFilters={category:travel}');

// ✅ 올바른 예 — JSON 문자열을 URL 인코딩
const filters = JSON.stringify({ category: 'travel' });
fetch(`/v1/data/articles?andFilters=${encodeURIComponent(filters)}`);
```

***

### 정렬이 적용되지 않음

**원인:** `sortBy` 파라미터만 지정하고 `sortDirection`을 누락했거나, 존재하지 않는 필드명을 사용했습니다.

**해결:**

```bash
# ❌ 잘못된 예 — sortDirection 누락
curl "https://api-client.bkend.ai/v1/data/articles?sortBy=createdAt"

# ✅ 올바른 예
curl "https://api-client.bkend.ai/v1/data/articles?sortBy=createdAt&sortDirection=desc"
```

| 파라미터 | 허용 값 | 기본값 |
|---------|---------|:------:|
| `sortBy` | 테이블에 존재하는 필드명 | - |
| `sortDirection` | `asc`, `desc` | `desc` |

***

## 네트워크 관련

### 요청 타임아웃

**증상:** API 호출이 오랜 시간 응답하지 않습니다.

**해결:**

1. 네트워크 연결 상태를 확인하세요.
2. `limit` 파라미터를 줄여 응답 데이터 양을 줄이세요.
3. 요청을 재시도하세요.

```javascript
// 적절한 limit 설정
const result = await bkendFetch('/v1/data/articles?page=1&limit=10');
```

***

## 참고 문서

- [에러 처리 가이드](../../../ko/guides/11-error-handling.md) — 에러 코드 및 처리 패턴 상세
- [토큰 관리](../../../ko/authentication/20-token-management.md) — 토큰 저장 및 자동 갱신 패턴
- [앱에서 bkend 연동하기](../../../ko/getting-started/06-app-integration.md) — bkendFetch 헬퍼 설정

## 이전 단계

[AI 프롬프트 모음](06-ai-prompts.md)에서 MCP AI를 활용한 블로그 운영 프롬프트를 확인합니다.
