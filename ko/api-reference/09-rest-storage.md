# REST Storage 엔드포인트

> 서비스 API의 Storage 엔드포인트 레퍼런스입니다.

## 단일 파일 업로드

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| POST | `/v1/files/presigned-url` | ✅ | Presigned URL 생성 |
| POST | `/v1/files` | ✅ | 파일 메타데이터 등록 |

### Presigned URL 생성

```bash
curl -X POST "https://api.bkend.ai/v1/files/presigned-url" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "photo.jpg",
    "contentType": "image/jpeg",
    "fileSize": 1048576,
    "visibility": "public",
    "category": "images"
  }'
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `filename` | string | ✅ | 원본 파일명 (최대 255자) |
| `contentType` | string | ✅ | MIME 타입 |
| `fileSize` | number | - | 파일 크기 (바이트) |
| `visibility` | string | - | `public`, `private` (기본값), `protected`, `shared` |
| `category` | string | - | 버킷: `images`, `documents`, `media`, `attachments` (기본값) |

**응답**: `200 OK`

```json
{
  "url": "https://s3.amazonaws.com/...",
  "key": "{namespace}/{visibility}/{category}/{fileId}/{filename}",
  "filename": "photo.jpg",
  "contentType": "image/jpeg"
}
```

> 💡 **Tip** - Presigned URL은 15분 동안 유효합니다.

### 메타데이터 등록

```bash
curl -X POST "https://api.bkend.ai/v1/files" \
  -H "x-project-id: {project_id}" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "s3Key": "{key}",
    "originalName": "photo.jpg",
    "mimeType": "image/jpeg",
    "size": 1048576,
    "visibility": "public"
  }'
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `s3Key` | string | ✅ | Presigned URL 응답의 `key` (최대 500자) |
| `originalName` | string | ✅ | 원본 파일명 (최대 255자) |
| `mimeType` | string | ✅ | MIME 타입 (최대 100자) |
| `size` | number | ✅ | 파일 크기 (바이트, 0 이상) |
| `width` | number | - | 이미지 너비 (픽셀) |
| `height` | number | - | 이미지 높이 (픽셀) |
| `visibility` | string | - | 파일 가시성 (기본값: `private`) |
| `bucket` | string | - | 버킷 카테고리 |
| `metadata` | object | - | 사용자 정의 메타데이터 |

---

## 멀티파트 업로드

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| POST | `/v1/files/multipart/init` | ✅ | 업로드 초기화 |
| POST | `/v1/files/multipart/presigned-url` | ✅ | 파트 URL 생성 |
| POST | `/v1/files/multipart/complete` | ✅ | 업로드 완료 |
| POST | `/v1/files/multipart/abort` | ✅ | 업로드 취소 |

### 멀티파트 초기화

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `filename` | string | ✅ | 원본 파일명 |
| `contentType` | string | ✅ | MIME 타입 |
| `fileSize` | number | ✅ | 전체 파일 크기 (바이트) |

**응답**: `{ uploadId, key, filename }`

### 파트 URL 생성

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `key` | string | ✅ | S3 객체 키 |
| `uploadId` | string | ✅ | 업로드 ID |
| `partNumber` | number | ✅ | 파트 번호 (1~10000) |

**응답**: `{ url, partNumber }`

### 업로드 완료

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `key` | string | ✅ | S3 객체 키 |
| `uploadId` | string | ✅ | 업로드 ID |
| `parts` | array | ✅ | `[{ partNumber, etag }]` (최소 1개) |

**응답**: `{ key, location }`

---

## 파일 관리

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/v1/files` | ✅ | 파일 목록 조회 |
| GET | `/v1/files/{fileId}` | ✅ | 파일 상세 조회 |
| PATCH | `/v1/files/{fileId}` | ✅ | 파일 수정 |
| DELETE | `/v1/files/{fileId}` | ✅ | 파일 삭제 |
| POST | `/v1/files/{fileId}/download-url` | ✅ | 다운로드 URL 생성 |
| GET | `/v1/files/stats` | ✅ | 저장소 통계 |

### 다운로드 URL 생성

**응답**: `200 OK`

```json
{
  "url": "https://cdn.bkend.ai/...",
  "filename": "photo.jpg",
  "content_type": "image/jpeg",
  "size": 1048576,
  "expires_at": null
}
```

| 가시성 | URL 타입 | 유효 기간 |
|--------|---------|----------|
| `public` | CDN URL | 만료 없음 |
| `private` | Presigned URL | 1시간 |

### 파일 목록 조회 필터

| 파라미터 | 설명 |
|---------|------|
| `search` | 파일명 검색 (대소문자 무시) |
| `visibility` | 가시성 필터 |
| `mimeType` | MIME 타입 필터 |
| `bucket` | 버킷 필터 |
| `ownerId` | 소유자 ID 필터 |

---

## 관련 문서

- [REST API 개요](06-rest-overview.md) — 공통 규칙
- [단일 파일 업로드](../storage/04-upload-single.md) — 업로드 가이드
- [대용량 파일 업로드](../storage/06-upload-large.md) — 멀티파트 가이드
- [에러 코드](10-error-codes.md) — 에러 코드 레퍼런스
