# Storage MCP 도구

> Storage 관련 MCP 도구의 명세와 사용법을 안내합니다.

## 개요

Storage 기능은 현재 REST API를 통해 제공됩니다. MCP 도구에서는 코드 예시 도구를 통해 파일 업로드/다운로드 패턴을 안내합니다.

---

## 코드 예시 도구

### `7_code_examples_data`

데이터 CRUD와 함께 파일 업로드 패턴을 포함한 코드 예시를 제공합니다.

| 항목 | 값 |
|------|-----|
| **파라미터** | 없음 |
| **스코프** | 없음 |

**제공 내용**:
- CRUD 코드 예시
- CORS 설정 가이드
- Vite/Next.js 프록시 설정

---

## Storage REST API 엔드포인트 요약

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/v1/files/presigned-url` | POST | Presigned URL 생성 |
| `/v1/files` | POST | 파일 메타데이터 등록 |
| `/v1/files` | GET | 파일 목록 조회 |
| `/v1/files/{fileId}` | GET | 파일 상세 조회 |
| `/v1/files/{fileId}` | PATCH | 파일 메타데이터 수정 |
| `/v1/files/{fileId}` | DELETE | 파일 삭제 |
| `/v1/files/{fileId}/download-url` | POST | 다운로드 URL 생성 |
| `/v1/files/stats` | GET | 저장소 통계 |
| `/v1/files/multipart/init` | POST | 멀티파트 업로드 초기화 |
| `/v1/files/multipart/presigned-url` | POST | 파트 Presigned URL |
| `/v1/files/multipart/complete` | POST | 멀티파트 업로드 완료 |
| `/v1/files/multipart/abort` | POST | 멀티파트 업로드 취소 |

> 💡 **Tip** - 각 엔드포인트의 상세 파라미터와 응답은 [REST Storage](09-rest-storage.md) 문서를 참고하세요.

---

## 관련 문서

- [MCP 프로토콜](02-mcp-protocol.md) — MCP 프로토콜 상세
- [REST Storage](09-rest-storage.md) — REST API Storage 엔드포인트
- [단일 파일 업로드](../storage/04-upload-single.md) — Presigned URL 업로드 가이드
- [대용량 파일 업로드](../storage/06-upload-large.md) — 멀티파트 업로드 가이드
