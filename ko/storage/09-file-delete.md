# 파일 삭제

> 업로드된 파일을 삭제하는 방법을 안내합니다.

## 개요

Storage에 업로드된 파일을 삭제할 수 있습니다. 삭제 시 파일 메타데이터가 DB에서 제거됩니다.

> ❌ **위험** - 파일 삭제는 되돌릴 수 없습니다. 삭제 전에 필요한 파일인지 확인하세요.

---

## 파일 삭제하기

### 요청

```bash
curl -X DELETE "https://api.bkend.ai/v1/files/{fileId}" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

### 응답 (200 OK)

```json
{
  "success": true
}
```

---

## 파일 메타데이터 수정하기

파일 삭제 대신 메타데이터를 수정할 수도 있습니다.

### 요청

```bash
curl -X PATCH "https://api.bkend.ai/v1/files/{fileId}" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "originalName": "new-name.jpg",
    "visibility": "private"
  }'
```

### 수정 가능 필드

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `originalName` | string | 파일명 변경 |
| `visibility` | string | 가시성 변경 (`public`, `private`, `protected`, `shared`) |
| `metadata` | object | 사용자 정의 메타데이터 변경 |

### 응답 (200 OK)

```json
{
  "id": "file_abc123",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

## 에러 응답

| 에러 코드 | HTTP 상태 | 설명 |
|----------|----------|------|
| `file/not-found` | 404 | 파일을 찾을 수 없음 |
| `file/access-denied` | 403 | 삭제 권한 없음 |

---

## 관련 문서

- [파일 목록 조회](08-file-list.md) — 파일 목록 API
- [파일 다운로드](07-download.md) — 다운로드 URL 생성
- [Storage 개요](01-overview.md) — Storage 기능 소개
