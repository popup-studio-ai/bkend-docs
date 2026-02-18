# 단일 파일 업로드

{% hint style="info" %}
💡 Presigned URL을 발급받아 스토리지에 직접 파일을 업로드하세요.
{% endhint %}

{% hint style="info" %}
💡 **시작하기 전에** — 이 작업을 진행하려면 다음이 필요합니다:
- [프로젝트 생성](../getting-started/02-quickstart.md) 완료
- 사용자 인증 완료 (JWT 토큰 필요 — 모든 파일 API는 인증 필수)
{% endhint %}

**이 문서에서 사용하는 API:**

| 엔드포인트 | 메서드 | 인증 | 설명 |
|-----------|:------:|:----:|------|
| `/v1/files/presigned-url` | POST | JWT | Presigned URL 발급 |

## 개요

단일 파일 업로드는 2단계로 진행됩니다:

1. bkend API에서 **Presigned URL**을 발급받습니다.
2. 발급받은 URL로 스토리지에 **파일을 직접 업로드**합니다.

```mermaid
sequenceDiagram
    participant C as 클라이언트
    participant B as bkend API
    participant S as 스토리지

    C->>B: 1. POST /v1/files/presigned-url
    B-->>C: { url, key, filename }
    C->>S: 2. PUT url (파일 데이터)
    S-->>C: 200 OK
    C->>B: 3. POST /v1/files (메타데이터 등록)
    B-->>C: { id, s3Key, ... }
```

***

## 1단계: Presigned URL 발급

### POST /v1/files/presigned-url

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/files/presigned-url \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "filename": "profile.jpg",
    "contentType": "image/jpeg",
    "fileSize": 1048576,
    "visibility": "private",
    "category": "images"
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/files/presigned-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    filename: 'profile.jpg',
    contentType: 'image/jpeg',
    fileSize: 1048576,
    visibility: 'private',
    category: 'images',
  }),
});

const { url, key, filename } = await response.json();
```
{% endtab %}
{% endtabs %}

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `filename` | `string` | ✅ | 원본 파일명 |
| `contentType` | `string` | ✅ | MIME 타입 (예: `image/jpeg`, `application/pdf`) |
| `fileSize` | `number` | - | 파일 크기 (바이트) |
| `visibility` | `string` | - | `public`, `private`(기본값), `protected`, `shared` |
| `category` | `string` | - | `images`, `documents`, `media`, `attachments`, `exports`, `backups`, `temp` |

### 응답 (200 OK)

```json
{
  "url": "https://s3.amazonaws.com/bucket/...",
  "key": "{서버가_생성한_키}",
  "filename": "profile.jpg",
  "contentType": "image/jpeg"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `url` | `string` | Presigned URL (15분 유효) |
| `key` | `string` | 파일 식별 키 (메타데이터 등록 시 사용) |
| `filename` | `string` | 원본 파일명 |
| `contentType` | `string` | MIME 타입 |

{% hint style="warning" %}
⚠️ Presigned URL은 **15분** 동안만 유효합니다. 만료 전에 업로드를 완료하세요.
{% endhint %}

***

## 2단계: 파일 업로드

발급받은 `url`로 파일을 직접 업로드합니다.

```javascript
// Presigned URL로 파일 업로드
const uploadResponse = await fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': contentType,
  },
  body: file, // File 또는 Blob 객체
});

if (uploadResponse.ok) {
  console.log('업로드 완료');
}
```

### HTML 파일 입력과 함께 사용

```javascript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

// 1. Presigned URL 발급
const presigned = await fetch('https://api-client.bkend.ai/v1/files/presigned-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    filename: file.name,
    contentType: file.type,
    fileSize: file.size,
    visibility: 'private',
    category: 'images',
  }),
}).then(res => res.json());

// 2. 스토리지에 파일 업로드
await fetch(presigned.url, {
  method: 'PUT',
  headers: { 'Content-Type': file.type },
  body: file,
});

// 3. 메타데이터 등록
const metadata = await fetch('https://api-client.bkend.ai/v1/files', {
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
}).then(res => res.json());

console.log('파일 ID:', metadata.id);
```

***

## 파일 키(key)

API 응답의 `key` 필드가 파일의 고유 키입니다. 이 값을 그대로 사용하세요.

{% hint style="warning" %}
⚠️ 파일 키는 서버가 자동 생성합니다. 직접 조합하지 마세요.
{% endhint %}

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `file/invalid-name` | 400 | 유효하지 않은 파일명 |
| `file/file-too-large` | 400 | 파일 크기 초과 |
| `file/invalid-format` | 400 | 지원하지 않는 파일 형식 |
| `file/bucket-not-configured` | 500 | 스토리지 버킷 미설정 |
| `common/authentication-required` | 401 | 인증 필요 |

***

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

async function uploadFile(file) {
  // 1. Presigned URL 발급
  const presigned = await bkendFetch('/v1/files/presigned-url', {
    method: 'POST',
    body: {
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
      visibility: 'private',
      category: 'images',
    },
  });

  // 2. 스토리지에 파일 업로드 (bkendFetch 사용 금지 — Authorization 헤더 불필요)
  await fetch(presigned.url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  // 3. 메타데이터 등록
  const metadata = await bkendFetch('/v1/files', {
    method: 'POST',
    body: {
      s3Key: presigned.key,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      visibility: 'private',
    },
  });

  return metadata; // { id, s3Key, ... }
}

// HTML 파일 입력과 함께 사용
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await uploadFile(file);
  console.log('업로드 완료:', result.id);
});
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/03-app-integration.md)를 참고하세요.
{% endhint %}

***

## 다음 단계

- [대용량 파일 업로드](03-upload-multipart.md) — 멀티파트 업로드
- [파일 메타데이터](04-file-metadata.md) — 메타데이터 등록/관리
- [파일 접근 권한](08-permissions.md) — Visibility 설정
