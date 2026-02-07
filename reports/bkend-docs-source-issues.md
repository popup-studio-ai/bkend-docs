# bkend/docs 원본 문서 오류 리포트

> **작성일**: 2026-02-07
> **관련 Jira**: BK-840 (v2 문서 검수 피드백)
> **대상**: `bkend/docs/03-domains/content/entities/file.md`

---

## 1. S3 키 구조 미기술

**현상**: 엔티티 문서에 `s3Key`의 max length(500자)만 기술되어 있고, 실제 키 생성 구조가 명시되지 않음.

**실제 코드 (source of truth)**:

```
{namespace}/{visibility}/{category}/{fileId}/{filename}
```

- `namespace`: Organization ID (필수)
- `visibility`: `public` | `private` | `protected` | `shared` (기본값: `private`)
- `category`: `images` | `documents` | `media` | `attachments` | `exports` | `backups` | `temp` (기본값: `attachments`)
- `fileId`: UUID v4 (자동 생성)
- `filename`: sanitized 원본 파일명 (소문자, 특수문자 제거, 공백→언더스코어)

**소스 경로**:
- `backend/modules/content/src/application/use-cases/file/create-presigned-url.use-case.ts:60-93`
- `backend/modules/content/src/application/dto/file/create-file.schema.ts:44-46`

---

## 2. namespace 필수 여부 불명확

**현상**: 엔티티 스키마에 `namespace` 필드는 있지만 (선택, 최대 200자), presigned-url 요청 시 필수 파라미터인지 명시되지 않음.

**실제 코드**: `namespace`는 presigned-url 요청 시 **필수** (`z.string().min(1)`).

```typescript
// create-file.schema.ts:61
namespace: z.string().min(1).describe('Namespace for multi-tenancy isolation (Organization ID)')
```

런타임에서도 이중 검증:

```typescript
// create-presigned-url.use-case.ts:40-42
if (namespace === undefined || namespace === '') {
  throw new CustomError(FileError.NAMESPACE_REQUIRED.code, FileError.NAMESPACE_REQUIRED.message)
}
```

**소스 경로**:
- `backend/modules/content/src/application/dto/file/create-file.schema.ts:48-62`
- `backend/modules/content/src/application/use-cases/file/create-presigned-url.use-case.ts:36-42`

---

## 3. Presigned URL 요청/응답 파라미터 미기술

**현상**: 원본 문서에 presigned-url 엔드포인트의 요청/응답 파라미터 목록이 없음.

**실제 파라미터**:

### 요청 (CreateFilePresignedUrlRequest)

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `filename` | string | ✅ | 원본 파일명 |
| `contentType` | string | ✅ | MIME 타입 |
| `fileSize` | number | - | 파일 크기 (바이트) |
| `visibility` | enum | - | `public` \| `private` \| `protected` \| `shared` (기본: `private`) |
| `category` | enum | - | `images` \| `documents` \| `media` \| `attachments` \| `exports` \| `backups` \| `temp` (기본: `attachments`) |
| `namespace` | string | ✅ | 조직 식별자 (Organization ID) |

### 응답 (CreateFilePresignedUrlResponse)

| 필드 | 타입 | 설명 |
|------|------|------|
| `url` | string (URL) | Presigned URL (15분 유효) |
| `key` | string | S3 오브젝트 키 |
| `filename` | string | 원본 파일명 |
| `contentType` | string | MIME 타입 |

**소스 경로**:
- `backend/modules/content/src/application/dto/file/create-file.schema.ts:48-83`

---

## 4. Multipart Upload Init도 동일

**현상**: multipart upload init 요청 파라미터도 동일하게 미기술.

**실제 코드**: presigned-url과 동일한 필수 파라미터 구조 (`namespace` 필수, `fileSize` 필수).

**소스 경로**:
- `backend/modules/content/src/application/dto/file/multipart-upload.schema.ts:22-31`

---

## 권장 조치

1. `file.md` 엔티티 문서에 S3 키 생성 구조 명시
2. presigned-url / multipart-init 요청 파라미터 표 추가
3. `namespace` 필수 여부 명확화
