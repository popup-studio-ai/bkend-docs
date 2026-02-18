# 타 서비스 비교

{% hint style="info" %}
💡 bkend와 Firebase, Supabase, Appwrite 등 주요 BaaS를 비교합니다.
{% endhint %}

## 개요

bkend는 MCP 네이티브 통합을 제공하는 Backend 서비스입니다. 이 문서에서는 주요 BaaS(Backend as a Service) 플랫폼과의 차이점을 항목별로 비교합니다.

***

## 핵심 비교표

| 항목 | bkend | Firebase | Supabase | Appwrite |
|------|-------|----------|----------|----------|
| **데이터베이스** | MongoDB | Firestore (Document DB) | PostgreSQL 15/17 | MariaDB (Document API) |
| **데이터 모델** | 동적 BSON Schema | 스키마리스 Document | 정적 SQL Schema | Document (내부 관계형) |
| **인증 프로바이더** | Email, Google, GitHub | Email, Google, GitHub 등 9+ (SAML/OIDC) | Email, Google, GitHub 등 20+ | Email, Google, GitHub 등 40+ |
| **파일 저장소** | 오브젝트 스토리지 | Cloud Storage | 오브젝트 스토리지 | 자체 스토리지 |
| **실시간** | — | Firestore onSnapshot | Realtime Channels | Realtime Events (WebSocket) |
| **MCP 연동** | 서비스 내장 (URL 등록) | 별도 서버 (Firebase CLI) | 별도 서버 (npm 패키지) | 별도 서버 (npm 패키지) |
| **멀티테넌시** | 프로젝트 분리로 구현 | 프로젝트 분리로 구현 | RLS 기반 직접 구현 | 프로젝트 분리로 구현 |
| **환경 분리** | Dev / Staging / Prod | 프로젝트 분리 | 브랜칭 (Pro 이상) | 프로젝트 분리 |
| **접근 제어** | RLS (admin/user/self/guest) | Security Rules | RLS (PostgreSQL 네이티브) | Collection-level 권한 |
| **오프라인 지원** | — | Firestore/RTDB 네이티브 | — | — |
| **오픈소스** | — | SDK만 공개 | Apache 2.0 | BSD 3-Clause |
| **셀프호스팅** | — | 불가 | Docker Compose | Docker |

***

## 무료 플랜 비교

각 서비스의 무료 플랜 제공 범위입니다.

| 항목 | bkend | Firebase (Spark) | Supabase (Free) | Appwrite (Starter) |
|------|-------|------------------|-----------------|-------------------|
| **프로젝트** | — | 무제한 | 2개 (7일 비활성 시 일시정지) | 2개 |
| **인증 MAU** | — | 무제한 (Email/OAuth) | 50,000 | 75,000 |
| **DB 용량** | — | 1 GiB (Firestore) | 500 MB | — |
| **DB 읽기** | — | 50,000/일 | — | 500,000/월 |
| **DB 쓰기** | — | 20,000/일 | — | 250,000/월 |
| **파일 저장** | — | Blaze 필수 (2026.02~) | 1 GB | 2 GB |
| **대역폭** | — | 10 GB/월 (Hosting) | 2 GB/월 | 5 GB/월 |
| **Edge/Cloud Functions** | — | Blaze 필수 | 500,000 호출/월 | 750,000 실행/월 |
| **실시간 동시 접속** | — | 100 (RTDB) | 200 | 250 |

{% hint style="warning" %}
⚠️ Firebase는 2026년 2월부터 Spark(무료) 플랜에서 Cloud Storage 사용이 불가합니다. Blaze(종량제)로 업그레이드해야 합니다.
{% endhint %}

***

## 유료 플랜 비교

| 항목 | Firebase (Blaze) | Supabase (Pro) | Appwrite (Pro) |
|------|------------------|----------------|----------------|
| **월 기본료** | $0 (종량제) | $25 | $25 |
| **DB 용량** | $0.26/GB | 8 GB 포함 → $0.125/GB | — |
| **DB 읽기 초과** | $0.18/100K | — | $0.06/100K |
| **DB 쓰기 초과** | $0.18/100K | — | $0.10/100K |
| **인증 MAU 초과** | 무료 (Email/OAuth) | $0.00325/user | $3/1,000 user |
| **Phone SMS** | $0.01~$0.06/건 | — | — |
| **SAML/OIDC** | $0.015/MAU | Team ($599/월) | — |
| **파일 저장** | $0.026/GB | 100 GB 포함 | 150 GB 포함 |
| **대역폭** | $0.15/GB (Hosting) | 250 GB 포함 → $0.09/GB | 2 TB 포함 → $15/100GB |
| **Cloud Functions** | $0.40/M 호출 | 2M 호출 포함 | 3.5M 실행 포함 |

{% hint style="info" %}
💡 bkend 가격 정책은 [bkend 공식 사이트](https://bkend.ai)를 참고하세요.
{% endhint %}

***

## 데이터베이스 비교

### bkend (MongoDB)

- **동적 스키마** — 콘솔이나 MCP 도구에서 테이블과 컬럼을 자유롭게 추가/수정
- **BSON Schema 검증** — 유연한 스키마에 타입 검증 적용
- **7가지 컬럼 타입** — String, Number, Boolean, Date, Array, Object, Mixed

### Firebase (Firestore)

- **문서 기반 NoSQL** — 컬렉션/문서 구조, 서브컬렉션 지원
- **네이티브 오프라인** — Android, iOS에서 오프라인 캐시 기본 활성
- **실시간 동기화** — `onSnapshot`으로 실시간 데이터 변경 감지
- **조인 미지원** — 서브컬렉션/참조로 관계 표현 (서버 조인 없음)

### Supabase (PostgreSQL)

- **관계형 데이터베이스** — SQL 기반 정적 스키마, Foreign Key
- **네이티브 RLS** — PostgreSQL Row Level Security로 세밀한 접근 제어
- **강력한 조인** — SQL JOIN으로 복잡한 관계 쿼리 처리
- **pgvector** — 벡터 검색 확장으로 AI/임베딩 워크로드 지원

### Appwrite (MariaDB)

- **Document API** — NoSQL 스타일 인터페이스, 내부는 MariaDB
- **관계 지원** — one-to-one, one-to-many, many-to-many, cascade delete
- **다수 런타임** — Functions에서 Node.js, Python, Dart, PHP 등 지원

***

## 인증 비교

| 기능 | bkend | Firebase | Supabase | Appwrite |
|------|-------|----------|----------|----------|
| 이메일/비밀번호 | ✅ | ✅ | ✅ | ✅ |
| 매직 링크 | ✅ | ✅ (Email Link) | ✅ | ✅ (Magic URL) |
| Google OAuth | ✅ | ✅ | ✅ | ✅ |
| GitHub OAuth | ✅ | ✅ | ✅ | ✅ |
| Phone (SMS) | — | ✅ (유료) | ✅ | ✅ (OTP) |
| 익명 인증 | — | ✅ | ✅ | ✅ |
| MFA | ✅ (TOTP) | ✅ (SMS + TOTP) | ✅ (TOTP + Phone) | ✅ (Email + Phone + TOTP) |
| SSO (SAML) | — | ✅ (Identity Platform) | ✅ (Team 이상) | — |
| 계정 연결 | ✅ | ✅ | ✅ (linkIdentity) | ✅ |
| 세션 관리 | ✅ (디바이스별) | ✅ | ✅ | ✅ |
| Teams/그룹 | RLS 기반 RBAC | Custom Claims | RLS 기반 구현 | 네이티브 Teams |
| OAuth 프로바이더 수 | 2 (Google, GitHub) | 9+ 네이티브 | 20+ | 40+ |

***

## AI 도구 연동

| 항목 | bkend | Firebase | Supabase | Appwrite |
|------|-------|----------|----------|----------|
| **MCP 서버** | 서비스 내장 | Firebase CLI 내장 (2025.10 GA) | Community 패키지 | 공식 패키지 (2025.03) |
| **설치 방식** | URL만 등록 | `npx firebase-tools@latest` | `npx supabase-mcp-server` | `npx @appwrite/mcp-server` |
| **인증** | OAuth 2.1 (브라우저 로그인) | Google Cloud 인증 | Access Token / API Key | API Key |
| **지원 도구** | Claude Code, Cursor 등 | Firebase Studio, Gemini CLI, Cursor | Cursor, Claude, VS Code Copilot | Cursor, Claude, Gemini CLI |
| **프로젝트 관리** | ✅ | ✅ | ✅ | ✅ |
| **테이블/스키마** | ✅ (동적 스키마) | ⚠️ (Firestore 컬렉션) | ✅ (SQL DDL) | ✅ |
| **데이터 CRUD** | ✅ | ✅ | ✅ (SQL 쿼리) | ✅ |
| **AI 네이티브** | pgvector 등 — | Vertex AI, Gemini API 통합 | pgvector 벡터 검색 | — |

{% hint style="info" %}
💡 bkend MCP는 서비스에 내장되어 있으므로 URL 등록만으로 바로 사용할 수 있습니다. 다른 서비스는 MCP 서버를 별도로 설치하고 로컬에서 실행해야 합니다.
{% endhint %}

***

## 접근 제어 비교

### bkend

```json
{
  "permissions": {
    "user": { "create": true, "read": true },
    "self": { "update": true, "delete": true },
    "guest": { "read": true }
  }
}
```

- 테이블별 JSON 기반 선언적 설정
- admin / user / guest / self 4그룹

### Firebase

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- Security Rules 기반 커스텀 로직

### Supabase

```sql
CREATE POLICY "Users can view own data"
ON posts FOR SELECT
USING (auth.uid() = user_id);
```

- SQL 기반 RLS 정책, PostgreSQL 네이티브

### Appwrite

- 콘솔에서 Collection별 권한 설정
- `Any`, `Users`, `Guests`, `Teams` 단위 접근 제어
- Document-level 권한 (`$permissions` 필드)

***

## 오픈소스 & 셀프호스팅

| 항목 | bkend | Firebase | Supabase | Appwrite |
|------|-------|----------|----------|----------|
| **오픈소스** | — | SDK만 공개 | ✅ | ✅ |
| **라이선스** | — | Proprietary | Apache 2.0 | BSD 3-Clause |
| **GitHub Stars** | — | — | ~75,000+ | ~46,000+ |
| **셀프호스팅** | — | 불가 | Docker Compose | Docker |
| **상업적 사용** | — | N/A | ✅ | ✅ |

***

## 선택 가이드

| 요구사항 | 추천 서비스 |
|---------|-----------|
| MCP 설치 없이 AI 도구로 바로 시작 | **bkend** |
| 유연한 스키마 + 동적 데이터 모델 | **bkend** |
| Dev/Staging/Prod 환경 분리가 필수 | **bkend** |
| SQL 조인과 pgvector가 필요 | Supabase |
| 모바일 오프라인 동기화가 핵심 | Firebase |
| Google Cloud 생태계 활용 (Vertex AI 등) | Firebase |
| 셀프호스팅 + 오픈소스 선호 | Supabase, Appwrite |
| OAuth 프로바이더를 최대한 많이 지원 | Appwrite (40+) |
| 종량제 (쓴 만큼만 과금) | Firebase (Blaze) |

***

## 다음 단계

- [bkend 소개](../getting-started/01-what-is-bkend.md) — bkend 개요
- [Firebase에서 이전하기](02-migration-firebase.md) — Firebase 마이그레이션
- [Supabase에서 이전하기](03-migration-supabase.md) — Supabase 마이그레이션

## 참조

- [Supabase Pricing](https://supabase.com/pricing)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Appwrite Pricing](https://appwrite.io/pricing)
- [Supabase MCP Docs](https://supabase.com/docs/guides/getting-started/mcp)
- [Firebase MCP Server](https://firebase.blog/posts/2025/10/firebase-mcp-server-ga/)
- [Appwrite MCP Docs](https://appwrite.io/docs/tooling/mcp)
