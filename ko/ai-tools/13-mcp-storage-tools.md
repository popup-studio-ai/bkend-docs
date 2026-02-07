# Storage MCP 도구

{% hint style="info" %}
💡 스토리지 관련 MCP 도구와 REST API 활용 방법을 확인합니다.
{% endhint %}

## 개요

현재 bkend MCP는 **Database 관리** 및 **데이터 CRUD**에 초점을 맞추고 있습니다. 스토리지(파일 업로드/다운로드/관리)는 서비스 API(`https://api-client.bkend.ai`)를 통해 직접 구현합니다.

***

## AI 도구에서 스토리지 사용하기

AI 도구에서 스토리지 관련 코드를 생성하도록 요청할 수 있습니다.

### 업로드 코드 생성하기

```
"bkend 스토리지에 이미지를 업로드하는 TypeScript 코드를 작성해줘.
Presigned URL 방식으로 구현해줘."
```

### 파일 목록 조회 코드 생성하기

```
"bkend 스토리지의 파일 목록을 조회하는 React 컴포넌트를 만들어줘.
페이지네이션과 MIME 타입 필터를 지원해야 해."
```

{% hint style="info" %}
💡 AI 도구가 코드를 생성할 때 bkend 문서 도구(`1_concepts`, `4_howto_implement_data_crud` 등)를 참고하여 정확한 API 호출 코드를 작성합니다.
{% endhint %}

***

## 스토리지 REST API 요약

AI 도구가 코드를 생성할 때 참조하는 스토리지 API입니다.

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/v1/files/presigned-url` | Presigned URL 발급 |
| `POST` | `/v1/files/multipart/init` | 멀티파트 초기화 |
| `POST` | `/v1/files/multipart/presigned-url` | 파트 URL 발급 |
| `POST` | `/v1/files/multipart/complete` | 멀티파트 완료 |
| `POST` | `/v1/files/multipart/abort` | 멀티파트 취소 |
| `POST` | `/v1/files` | 메타데이터 등록 |
| `GET` | `/v1/files/:fileId` | 파일 조회 |
| `GET` | `/v1/files` | 목록 조회 |
| `PATCH` | `/v1/files/:fileId` | 메타데이터 수정 |
| `DELETE` | `/v1/files/:fileId` | 파일 삭제 |
| `POST` | `/v1/files/:fileId/download-url` | 다운로드 URL 발급 |

→ 상세는 [Storage REST API 레퍼런스](../storage/09-api-reference.md)를 참고하세요.

***

## 다음 단계

- [Auth & User MCP 도구](14-mcp-auth-tools.md) — 인증 관련 도구
- [Database MCP 도구](12-mcp-db-tools.md) — 테이블/데이터 관리 도구
- [스토리지 개요](../storage/01-overview.md) — 스토리지 전체 구조
