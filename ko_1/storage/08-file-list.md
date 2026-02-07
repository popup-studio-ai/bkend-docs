# 파일 목록 조회

> 업로드된 파일 목록을 조회하고 검색하는 방법을 안내합니다.

## 개요

Storage에 업로드된 파일 목록을 조회할 수 있습니다. 파일명 검색, 가시성/MIME 타입/버킷 필터, 정렬, 페이지네이션을 지원합니다.

---

## 파일 목록 조회하기

### 요청

```bash
curl -X GET "https://api.bkend.ai/v1/files?page=1&limit=20" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `page` | number | - | 페이지 번호 (기본값: 1) |
| `limit` | number | - | 페이지당 항목 수 (기본값: 20) |
| `search` | string | - | 파일명 검색 (대소문자 무시) |
| `visibility` | string | - | 가시성 필터 (`public`, `private`, `protected`, `shared`) |
| `mimeType` | string | - | MIME 타입 필터 (예: `image/jpeg`) |
| `bucket` | string | - | 버킷 필터 (예: `images`) |
| `ownerId` | string | - | 소유자 ID 필터 |
| `ownerType` | string | - | 소유자 타입 필터 (`user`, `session`, `service`, `public`) |
| `sortBy` | string | - | 정렬 기준 필드 |
| `sortDirection` | string | - | 정렬 방향 (`asc`, `desc`) |

### 응답 (200 OK)

```json
{
  "items": [
    {
      "id": "file_abc123",
      "s3Key": "my-project/public/images/a1b2c3d4/photo.jpg",
      "originalName": "photo.jpg",
      "mimeType": "image/jpeg",
      "size": 1048576,
      "width": 1920,
      "height": 1080,
      "visibility": "public",
      "bucket": "images",
      "ownerId": "user_xyz789",
      "ownerType": "user",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 검색하기

파일명으로 검색할 수 있습니다. 대소문자를 구분하지 않습니다.

```bash
curl -X GET "https://api.bkend.ai/v1/files?search=profile" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

---

## 필터링 예시

### 이미지 파일만 조회

```bash
curl -X GET "https://api.bkend.ai/v1/files?bucket=images&visibility=public" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

### PDF 문서만 조회

```bash
curl -X GET "https://api.bkend.ai/v1/files?mimeType=application/pdf" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

---

## 단일 파일 조회하기

파일 ID로 특정 파일의 상세 정보를 조회합니다.

### 요청

```bash
curl -X GET "https://api.bkend.ai/v1/files/{fileId}" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

### 응답 (200 OK)

```json
{
  "id": "file_abc123",
  "s3Key": "my-project/public/images/a1b2c3d4/photo.jpg",
  "originalName": "photo.jpg",
  "mimeType": "image/jpeg",
  "size": 1048576,
  "width": 1920,
  "height": 1080,
  "visibility": "public",
  "bucket": "images",
  "ownerId": "user_xyz789",
  "ownerType": "user",
  "metadata": {},
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## 접근 제어

> ⚠️ **주의** - 일반 User는 자신이 업로드한 파일만 조회할 수 있습니다. 관리자는 모든 파일을 조회할 수 있습니다.

---

## 에러 응답

| 에러 코드 | HTTP 상태 | 설명 |
|----------|----------|------|
| `file/not-found` | 404 | 파일을 찾을 수 없음 |
| `file/access-denied` | 403 | 접근 권한 없음 |

---

## 관련 문서

- [파일 다운로드](07-download.md) — 다운로드 URL 생성
- [파일 삭제](09-file-delete.md) — 파일 삭제
- [파일 접근 권한](10-permissions.md) — 가시성과 접근 제어
