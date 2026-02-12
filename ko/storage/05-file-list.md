# 파일 목록 조회

{% hint style="info" %}
💡 등록된 파일을 필터링, 정렬, 검색하여 목록으로 조회하세요.
{% endhint %}

## 개요

`GET /v1/files` 엔드포인트로 파일 메타데이터 목록을 조회합니다. Visibility, MIME 타입, 소유자 등으로 필터링할 수 있습니다.

***

## 파일 목록 조회

### GET /v1/files

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET "https://api-client.bkend.ai/v1/files?page=1&limit=20&visibility=private&sortBy=createdAt&sortDirection=desc" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const params = new URLSearchParams({
  page: '1',
  limit: '20',
  visibility: 'private',
  sortBy: 'createdAt',
  sortDirection: 'desc',
});

const response = await fetch(`https://api-client.bkend.ai/v1/files?${params}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});

const { items, pagination } = await response.json();
```
{% endtab %}
{% endtabs %}

### 쿼리 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|:------:|------|
| `page` | `number` | `1` | 페이지 번호 |
| `limit` | `number` | `20` | 페이지당 항목 수 (1~100) |
| `sortBy` | `string` | - | 정렬 필드 |
| `sortDirection` | `string` | `desc` | `asc` / `desc` |
| `visibility` | `string` | - | `public`, `private`, `protected`, `shared` |
| `ownerType` | `string` | - | `user`, `session`, `service`, `public` |
| `ownerId` | `string` | - | 소유자 ID |
| `bucket` | `string` | - | 버킷 이름 |
| `mimeType` | `string` | - | MIME 타입 필터 |
| `search` | `string` | - | 파일명 검색 |

### 응답 (200 OK)

```json
{
  "items": [
    {
      "id": "file-uuid-1234",
      "s3Key": "files/a1b2c3d4/profile.jpg",
      "originalName": "profile.jpg",
      "mimeType": "image/jpeg",
      "size": 1048576,
      "visibility": "private",
      "ownerId": "user-uuid-1234",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

***

## 필터 활용 예시

### 이미지 파일만 조회

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?mimeType=image/jpeg" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### 공개 파일만 조회

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?visibility=public" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### 파일명으로 검색

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?search=profile" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## 접근 제어

파일 목록 조회 시 RLS(Row Level Security)가 적용됩니다.

| 사용자 | 조회 범위 |
|--------|----------|
| `admin` | 모든 파일 |
| 소유자 | 본인 파일 전체 필드 |
| 비소유자 | 공개 필드만 |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `common/authentication-required` | 401 | 인증 필요 |
| `file/access-denied` | 403 | 접근 권한 없음 |

***

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

// 파일 목록 조회
async function getFileList(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || '1',
    limit: filters.limit || '20',
    sortBy: filters.sortBy || 'createdAt',
    sortDirection: filters.sortDirection || 'desc',
    ...(filters.visibility && { visibility: filters.visibility }),
    ...(filters.mimeType && { mimeType: filters.mimeType }),
    ...(filters.search && { search: filters.search }),
  });

  const result = await bkendFetch(`/v1/files?${params}`);

  return result; // { items: [...], pagination: { ... } }
}

// 이미지 파일만 조회
async function getImageFiles() {
  const result = await getFileList({
    mimeType: 'image/jpeg',
    page: 1,
    limit: 10,
  });

  console.log(`총 ${result.pagination.total}개 이미지 파일`);
  result.items.forEach(file => {
    console.log(file.originalName, file.size);
  });

  return result;
}

// 파일명으로 검색
async function searchFiles(query) {
  const result = await getFileList({
    search: query,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  return result.items;
}

// 사용 예시
const files = await getFileList({
  visibility: 'private',
  page: 1,
  limit: 20,
});

console.log('파일 목록:', files.items);
console.log('전체 페이지:', files.pagination.totalPages);
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/03-app-integration.md)를 참고하세요.
{% endhint %}

***

## 다음 단계

- [파일 메타데이터](04-file-metadata.md) — 파일 상세 조회
- [파일 다운로드](06-download.md) — 다운로드 URL 발급
- [파일 삭제](07-file-delete.md) — 파일 삭제
