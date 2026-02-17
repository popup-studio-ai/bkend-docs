# 파일 메타데이터 관리

{% hint style="info" %}
💡 파일의 메타데이터를 등록하고 관리하세요. 업로드 후 반드시 메타데이터를 등록해야 합니다.
{% endhint %}

{% hint style="info" %}
💡 **시작하기 전에** — 이 작업을 진행하려면 다음이 필요합니다:
- [프로젝트 생성](../getting-started/02-quickstart.md) 완료
- 사용자 인증 완료 (JWT 토큰 필요 — 모든 파일 API는 인증 필수)
{% endhint %}

**이 문서에서 사용하는 API:**

| 엔드포인트 | 메서드 | 인증 | 설명 |
|-----------|:------:|:----:|------|
| `/v1/files` | POST | JWT | 메타데이터 생성 |
| `/v1/files/:fileId` | GET | JWT | 파일 조회 |
| `/v1/files/:fileId` | PATCH | JWT | 메타데이터 수정 |

## 개요

S3에 파일을 업로드한 후, bkend API에 파일 메타데이터를 등록해야 합니다. 메타데이터에는 파일명, 크기, MIME 타입, 카테고리, 태그 등의 정보가 포함됩니다.

***

## 메타데이터 등록

### POST /v1/files

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/files \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "s3Key": "{presigned 응답의 key}",
    "originalName": "profile.jpg",
    "mimeType": "image/jpeg",
    "size": 1048576,
    "visibility": "private",
    "metadata": {
      "category": "profile",
      "tags": ["avatar", "user"],
      "alt": "사용자 프로필 이미지"
    }
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/files', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    s3Key: presigned.key,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    visibility: 'private',
  }),
});

const fileData = await response.json();
console.log(fileData.id); // 파일 ID
```
{% endtab %}
{% endtabs %}

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `s3Key` | `string` | ✅ | Presigned URL 응답의 `key` |
| `originalName` | `string` | ✅ | 원본 파일명 |
| `mimeType` | `string` | ✅ | MIME 타입 |
| `size` | `number` | ✅ | 파일 크기 (바이트) |
| `width` | `number` | - | 이미지 너비 (픽셀) |
| `height` | `number` | - | 이미지 높이 (픽셀) |
| `visibility` | `string` | - | `public`, `private`(기본값), `protected`, `shared` |
| `bucket` | `string` | - | `avatars`, `documents`, `media`, `files`, `images`, `temp` |
| `metadata` | `object` | - | 확장 메타데이터 |

### metadata 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `category` | `string` | 파일 분류 |
| `tags` | `string[]` | 태그 목록 |
| `description` | `string` | 파일 설명 |
| `alt` | `string` | 이미지 대체 텍스트 |
| `relatedEntityId` | `string` | 관련 엔티티 ID |
| `custom` | `object` | 커스텀 데이터 |

### 응답 (201 Created)

```json
{
  "id": "file-uuid-1234",
  "s3Key": "files/a1b2c3d4/profile.jpg",
  "originalName": "profile.jpg",
  "mimeType": "image/jpeg",
  "size": 1048576,
  "visibility": "private",
  "ownerId": "user-uuid-1234",
  "ownerType": "user",
  "metadata": {
    "category": "profile",
    "tags": ["avatar", "user"],
    "alt": "사용자 프로필 이미지"
  },
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

***

## 파일 조회

### GET /v1/files/:fileId

```bash
curl -X GET https://api-client.bkend.ai/v1/files/{fileId} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### 응답 (200 OK)

```json
{
  "id": "file-uuid-1234",
  "s3Key": "files/a1b2c3d4/profile.jpg",
  "originalName": "profile.jpg",
  "mimeType": "image/jpeg",
  "size": 1048576,
  "visibility": "private",
  "ownerId": "user-uuid-1234",
  "ownerType": "user",
  "metadata": {
    "category": "profile",
    "tags": ["avatar", "user"]
  },
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

{% hint style="info" %}
💡 소유자가 아닌 사용자가 조회하면 공개 필드만 반환됩니다. 관리자(`admin`)는 모든 필드를 조회할 수 있습니다.
{% endhint %}

***

## 메타데이터 수정

### PATCH /v1/files/:fileId

```bash
curl -X PATCH https://api-client.bkend.ai/v1/files/{fileId} \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "originalName": "new-profile.jpg",
    "visibility": "public",
    "metadata": {
      "description": "업데이트된 프로필 이미지"
    }
  }'
```

### 수정 가능 필드

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `originalName` | `string` | 파일명 변경 |
| `visibility` | `string` | 접근 범위 변경 |
| `metadata` | `object` | 메타데이터 부분 업데이트 |

### 응답 (200 OK)

```json
{
  "id": "file-uuid-1234",
  "updatedAt": "2025-01-15T14:20:00.000Z"
}
```

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `file/not-found` | 404 | 파일을 찾을 수 없음 |
| `file/s3-key-already-exists` | 409 | 이미 등록된 S3 키 |
| `file/invalid-name` | 400 | 유효하지 않은 파일명 |
| `file/access-denied` | 403 | 접근 권한 없음 |
| `common/authentication-required` | 401 | 인증 필요 |

***

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

// 메타데이터 등록
async function registerFileMetadata(s3Key, file) {
  const metadata = await bkendFetch('/v1/files', {
    method: 'POST',
    body: {
      s3Key,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      visibility: 'private',
      metadata: {
        category: 'profile',
        tags: ['avatar', 'user'],
        alt: '사용자 프로필 이미지',
      },
    },
  });

  return metadata; // { id, s3Key, originalName, ... }
}

// 파일 조회
async function getFileMetadata(fileId) {
  const file = await bkendFetch(`/v1/files/${fileId}`);
  console.log(file.originalName, file.size);
  return file;
}

// 메타데이터 수정
async function updateFileMetadata(fileId, updates) {
  const result = await bkendFetch(`/v1/files/${fileId}`, {
    method: 'PATCH',
    body: {
      originalName: 'new-profile.jpg',
      visibility: 'public',
      metadata: {
        description: '업데이트된 프로필 이미지',
      },
    },
  });

  return result; // { id, updatedAt }
}
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/03-app-integration.md)를 참고하세요.
{% endhint %}

***

## 다음 단계

- [파일 목록 조회](05-file-list.md) — 파일 검색/필터링
- [파일 다운로드](06-download.md) — 파일 다운로드 URL 발급
- [파일 접근 권한](08-permissions.md) — Visibility와 소유자 제어
