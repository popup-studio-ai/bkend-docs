# Storage REST API 레퍼런스

{% hint style="info" %}
💡 스토리지 관련 모든 REST API 엔드포인트를 한눈에 확인하세요.
{% endhint %}

## 공통 사항

### Base URL

```text
https://api-client.bkend.ai
```

### 필수 헤더

| 헤더 | 필수 | 설명 |
|------|:----:|------|
| `X-Project-Id` | ✅ | 프로젝트 ID |
| `X-Environment` | ✅ | `dev` / `staging` / `prod` |
| `Authorization` | ✅ | `Bearer {accessToken}` |
| `Content-Type` | 조건부 | `application/json` — POST, PATCH 요청 시 |

***

## Presigned URL 업로드

```http
POST /v1/files/presigned-url
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `filename` | `string` | ✅ | 원본 파일명 |
| `contentType` | `string` | ✅ | MIME 타입 |
| `fileSize` | `number` | - | 파일 크기 (바이트) |
| `visibility` | `string` | - | `public`, `private`(기본값), `protected`, `shared` |
| `category` | `string` | - | `images`, `documents`, `media`, `attachments`, `exports`, `backups`, `temp` |

**응답:** `200 OK` — `{ url, key, filename, contentType }`

→ [단일 파일 업로드](02-upload-single.md)

***

## 멀티파트 업로드

### 초기화

```http
POST /v1/files/multipart/init
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `filename` | `string` | ✅ | 원본 파일명 |
| `contentType` | `string` | ✅ | MIME 타입 |
| `fileSize` | `number` | ✅ | 파일 크기 (바이트) |
| `visibility` | `string` | - | 접근 범위 |
| `category` | `string` | - | 파일 카테고리 |

**응답:** `200 OK` — `{ uploadId, key, filename }`

### 파트 URL 발급

```http
POST /v1/files/multipart/presigned-url
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `key` | `string` | ✅ | init 응답의 S3 키 |
| `uploadId` | `string` | ✅ | init 응답의 업로드 ID |
| `partNumber` | `number` | ✅ | 파트 번호 (1~10000) |

**응답:** `200 OK` — `{ url, partNumber }`

### 완료

```http
POST /v1/files/multipart/complete
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `key` | `string` | ✅ | S3 키 |
| `uploadId` | `string` | ✅ | 업로드 ID |
| `parts` | `array` | ✅ | `[{ partNumber, etag }]` |

**응답:** `200 OK` — `{ key, location }`

### 취소

```http
POST /v1/files/multipart/abort
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `key` | `string` | ✅ | S3 키 |
| `uploadId` | `string` | ✅ | 업로드 ID |

**응답:** `200 OK` — `{ success, key }`

→ [대용량 파일 업로드](03-upload-multipart.md)

***

## 파일 메타데이터 생성

```http
POST /v1/files
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `s3Key` | `string` | ✅ | Presigned URL 응답의 `key` |
| `originalName` | `string` | ✅ | 원본 파일명 |
| `mimeType` | `string` | ✅ | MIME 타입 |
| `size` | `number` | ✅ | 파일 크기 (바이트) |
| `width` | `number` | - | 이미지 너비 (픽셀) |
| `height` | `number` | - | 이미지 높이 (픽셀) |
| `visibility` | `string` | - | 접근 범위 |
| `bucket` | `string` | - | 버킷 (`avatars`, `documents`, `media`, `files`, `images`, `temp`) |
| `metadata` | `object` | - | `{ category, tags, description, alt, relatedEntityId, custom }` |

**응답:** `201 Created` — 파일 메타데이터 객체

→ [파일 메타데이터](04-file-metadata.md)

***

## 파일 조회

```http
GET /v1/files/:fileId
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `fileId` | path | `string` | ✅ | 파일 ID |

**응답:** `200 OK` — 파일 메타데이터 객체 (RLS 필터 적용)

→ [파일 메타데이터](04-file-metadata.md)

***

## 파일 목록 조회

```http
GET /v1/files
```

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|:------:|------|
| `page` | `number` | `1` | 페이지 번호 |
| `limit` | `number` | `20` | 페이지당 항목 수 |
| `sortBy` | `string` | - | 정렬 필드 |
| `sortDirection` | `string` | `desc` | `asc` / `desc` |
| `visibility` | `string` | - | 접근 범위 필터 |
| `ownerType` | `string` | - | 소유자 타입 필터 |
| `ownerId` | `string` | - | 소유자 ID 필터 |
| `bucket` | `string` | - | 버킷 필터 |
| `mimeType` | `string` | - | MIME 타입 필터 |
| `search` | `string` | - | 파일명 검색 |

**응답:** `200 OK` — `{ items: [...], pagination: { total, page, limit, totalPages, hasNextPage, hasPrevPage } }`

→ [파일 목록 조회](05-file-list.md)

***

## 파일 메타데이터 수정

```http
PATCH /v1/files/:fileId
```

| 파라미터 | 위치 | 타입 | 설명 |
|---------|------|------|------|
| `fileId` | path | `string` | 파일 ID |
| `originalName` | body | `string` | 파일명 변경 |
| `visibility` | body | `string` | 접근 범위 변경 |
| `metadata` | body | `object` | 메타데이터 부분 업데이트 |

**응답:** `200 OK` — `{ id, updatedAt }`

→ [파일 메타데이터](04-file-metadata.md)

***

## 파일 삭제

```http
DELETE /v1/files/:fileId
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `fileId` | path | `string` | ✅ | 파일 ID |

**응답:** `200 OK` — `{ success: true }`

→ [파일 삭제](07-file-delete.md)

***

## 파일 다운로드

```http
POST /v1/files/:fileId/download-url
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|:----:|------|
| `fileId` | path | `string` | ✅ | 파일 ID |

**응답:** `200 OK` — `{ url, filename, contentType, size, expiresAt }`

→ [파일 다운로드](06-download.md)

***

## 엔드포인트 요약

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| `POST` | `/v1/files/presigned-url` | ✅ | Presigned URL 발급 |
| `POST` | `/v1/files/multipart/init` | ✅ | 멀티파트 초기화 |
| `POST` | `/v1/files/multipart/presigned-url` | ✅ | 파트 URL 발급 |
| `POST` | `/v1/files/multipart/complete` | ✅ | 멀티파트 완료 |
| `POST` | `/v1/files/multipart/abort` | ✅ | 멀티파트 취소 |
| `POST` | `/v1/files` | ✅ | 메타데이터 등록 |
| `GET` | `/v1/files/:fileId` | ✅ | 파일 조회 |
| `GET` | `/v1/files` | ✅ | 목록 조회 |
| `PATCH` | `/v1/files/:fileId` | ✅ | 메타데이터 수정 |
| `DELETE` | `/v1/files/:fileId` | ✅ | 파일 삭제 |
| `POST` | `/v1/files/:fileId/download-url` | ✅ | 다운로드 URL 발급 |

***

{% hint style="warning" %}
⚠️ 모든 스토리지 API는 인증이 필요합니다. `Authorization: Bearer {accessToken}` 헤더가 없으면 `401 common/authentication-required` 에러가 반환됩니다.
{% endhint %}

## 에러 코드

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `file/not-found` | 404 | 파일을 찾을 수 없음 |
| `file/invalid-name` | 400 | 유효하지 않은 파일명 |
| `file/file-too-large` | 400 | 파일 크기 초과 |
| `file/file-too-small` | 400 | 파일 크기 미달 |
| `file/invalid-format` | 400 | 지원하지 않는 형식 |
| `file/invalid-path` | 400 | 유효하지 않은 경로 |
| `file/bucket-not-configured` | 500 | S3 버킷 미설정 |
| `file/invalid-part-number-range` | 400 | 파트 번호 범위 초과 |
| `file/upload-init-failed` | 500 | 멀티파트 초기화 실패 |
| `file/invalid-parts-array` | 400 | 파트 배열 오류 |
| `file/access-denied` | 403 | 접근 권한 없음 |
| `file/s3-key-already-exists` | 409 | 중복 S3 키 |
| `file/s3-key-too-long` | 400 | S3 키 길이 초과 |
| `file/original-name-too-long` | 400 | 파일명 길이 초과 |
| `file/mime-type-too-long` | 400 | MIME 타입 길이 초과 |
| `file/size-negative` | 400 | 파일 크기 음수 |
| `common/authentication-required` | 401 | 인증 필요 |
