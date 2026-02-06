# 버킷 관리

> 파일을 용도별로 분류하는 버킷의 개념과 사용법을 안내합니다.

## 개요

버킷은 파일을 용도별로 분류하는 카테고리입니다. 업로드 시 버킷을 지정하면 S3 저장소에서 자동으로 경로가 분리되어 파일이 체계적으로 관리됩니다.

---

## 기본 제공 버킷

| 버킷 | 설명 | 사용 예시 |
|------|------|----------|
| `images` | 이미지 파일 | 프로필 사진, 썸네일 |
| `documents` | 문서 파일 | PDF, Word, Excel |
| `media` | 미디어 파일 | 비디오, 오디오 |
| `attachments` | 첨부 파일 (기본값) | 게시글 첨부 파일 |
| `exports` | 내보내기 파일 | 데이터 내보내기 결과 |
| `backups` | 백업 파일 | 데이터 백업 |
| `temp` | 임시 파일 | 임시 업로드 |

---

## 버킷 지정하기

파일 업로드 시 `category` 파라미터로 버킷을 지정합니다.

```bash
curl -X POST "https://api.bkend.ai/v1/files/presigned-url" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "profile.jpg",
    "contentType": "image/jpeg",
    "category": "images",
    "visibility": "public"
  }'
```

> 💡 **Tip** - 버킷을 지정하지 않으면 기본값 `attachments`가 적용됩니다.

---

## S3 저장 경로 구조

파일은 다음 구조로 S3에 저장됩니다:

```
{namespace}/{visibility}/{bucket}/{fileId}/{filename}
```

예시:

| 파일 | S3 경로 |
|------|---------|
| public 이미지 | `my-project/public/images/{fileId}/profile.jpg` |
| private 문서 | `my-project/private/documents/{fileId}/contract.pdf` |
| 기본 첨부 | `my-project/private/attachments/{fileId}/data.csv` |

---

## 버킷별 파일 조회하기

파일 목록 조회 시 `bucket` 파라미터로 특정 버킷의 파일만 필터링할 수 있습니다.

```bash
curl -X GET "https://api.bkend.ai/v1/files?bucket=images&page=1&limit=20" \
  -H "x-project-id: {project_id}" \
  -H "x-environment: dev" \
  -H "Authorization: Bearer {accessToken}"
```

---

## 관련 문서

- [Storage 개요](01-overview.md) — Storage 기능 소개
- [단일 파일 업로드](04-upload-single.md) — Presigned URL 업로드
- [파일 목록 조회](08-file-list.md) — 파일 목록 조회 API
- [파일 접근 권한](10-permissions.md) — 파일 가시성 설정
