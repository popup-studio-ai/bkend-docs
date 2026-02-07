# 단일 파일 업로드

{% hint style="info" %}
💡 Presigned URL을 발급받아 S3에 직접 파일을 업로드하세요.
{% endhint %}

## 개요

단일 파일 업로드는 2단계로 진행됩니다:

1. bkend API에서 **Presigned URL**을 발급받습니다.
2. 발급받은 URL로 S3에 **파일을 직접 업로드**합니다.

```mermaid
sequenceDiagram
    participant C as 클라이언트
    participant B as bkend API
    participant S as S3

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
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod" \
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
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'prod',
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
  "key": "org-123/private/images/2025/01/15/uuid-abc.jpg",
  "filename": "profile.jpg",
  "contentType": "image/jpeg"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `url` | `string` | S3 Presigned URL (15분 유효) |
| `key` | `string` | S3 오브젝트 키 |
| `filename` | `string` | 원본 파일명 |
| `contentType` | `string` | MIME 타입 |

{% hint style="warning" %}
⚠️ Presigned URL은 **15분** 동안만 유효합니다. 만료 전에 업로드를 완료하세요.
{% endhint %}

***

## 2단계: S3 업로드

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
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'prod',
  },
  body: JSON.stringify({
    filename: file.name,
    contentType: file.type,
    fileSize: file.size,
    visibility: 'private',
    category: 'images',
  }),
}).then(res => res.json());

// 2. S3에 파일 업로드
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
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'prod',
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

## S3 키 구조

업로드된 파일의 S3 키는 다음 구조를 따릅니다.

```
{namespace}/{visibility}/{category}/{YYYY}/{MM}/{DD}/{uuid}.{ext}
```

**예시:** `org-123/private/images/2025/01/15/a1b2c3d4.jpg`

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `file/invalid-name` | 400 | 유효하지 않은 파일명 |
| `file/file-too-large` | 400 | 파일 크기 초과 |
| `file/invalid-format` | 400 | 지원하지 않는 파일 형식 |
| `file/bucket-not-configured` | 500 | S3 버킷 미설정 |
| `common/authentication-required` | 401 | 인증 필요 |

***

## 다음 단계

- [대용량 파일 업로드](03-upload-multipart.md) — 멀티파트 업로드
- [파일 메타데이터](04-file-metadata.md) — 메타데이터 등록/관리
- [파일 접근 권한](08-permissions.md) — Visibility 설정
