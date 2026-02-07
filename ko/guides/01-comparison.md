# 타 서비스 비교

{% hint style="info" %}
💡 bkend와 Firebase, Supabase 등 주요 Backend 서비스를 비교합니다.
{% endhint %}

## 개요

bkend는 AI 도구 연동(MCP)과 멀티테넌트 아키텍처를 기본 제공하는 Backend 서비스입니다. 기존 BaaS(Backend as a Service)와의 주요 차이점을 비교합니다.

***

## 핵심 비교표

| 항목 | bkend | Firebase | Supabase |
|------|-------|----------|----------|
| **데이터베이스** | MongoDB | Firestore (NoSQL) | PostgreSQL (SQL) |
| **스키마** | 동적 BSON Schema | 스키마리스 | 정적 SQL Schema |
| **인증** | Email, OAuth, 매직링크 | Email, OAuth, Phone | Email, OAuth, Phone |
| **파일 저장소** | S3 기반 | Cloud Storage | S3 호환 |
| **AI 도구 연동** | MCP 기본 지원 | ❌ | ❌ |
| **멀티테넌시** | 기본 제공 | ❌ | ❌ |
| **환경 분리** | Dev / Staging / Prod | 프로젝트 분리 | 브랜칭 |
| **접근 제어** | RLS (4그룹 RBAC) | Security Rules | RLS (SQL) |
| **API 방식** | REST + MCP | SDK 중심 | REST + GraphQL |
| **오픈소스** | — | ❌ | ✅ |

***

## 데이터베이스 비교

### bkend (MongoDB)

- **동적 스키마** — 콘솔이나 MCP 도구에서 테이블과 컬럼을 자유롭게 추가/수정
- **BSON Schema 검증** — 유연한 스키마에 타입 검증 적용
- **7가지 컬럼 타입** — String, Number, Boolean, Date, Array, Object, Mixed

### Firebase (Firestore)

- **문서 기반 NoSQL** — 컬렉션과 문서 구조
- **스키마 검증 없음** — 별도 검증 도구 필요
- **실시간 동기화** — 클라이언트에서 실시간 데이터 변경 감지

### Supabase (PostgreSQL)

- **관계형 데이터베이스** — SQL 기반 정적 스키마
- **마이그레이션** — SQL 마이그레이션으로 스키마 관리
- **강력한 조인** — SQL JOIN으로 복잡한 관계 쿼리 처리

***

## 인증 비교

| 기능 | bkend | Firebase | Supabase |
|------|-------|----------|----------|
| 이메일/비밀번호 | ✅ | ✅ | ✅ |
| Google OAuth | ✅ | ✅ | ✅ |
| GitHub OAuth | ✅ | ✅ | ✅ |
| 매직 링크 | ✅ | ❌ | ✅ |
| JWT 토큰 | ✅ | ✅ | ✅ |
| 세션 관리 | ✅ (디바이스별) | ✅ | ✅ |
| 계정 연결 | ✅ (다중 프로바이더) | ✅ | ❌ |
| MFA (다중 인증) | ✅ | ✅ | ✅ |

***

## AI 도구 연동

bkend의 가장 큰 차별점은 **MCP (Model Context Protocol)** 기본 지원입니다.

| 항목 | bkend | Firebase | Supabase |
|------|-------|----------|----------|
| MCP 서버 내장 | ✅ | ❌ | ❌ |
| AI 도구에서 직접 관리 | ✅ | ❌ | ❌ |
| Claude Code 연동 | ✅ | ❌ | ❌ |
| Cursor 연동 | ✅ | ❌ | ❌ |
| 자연어로 데이터 조작 | ✅ | ❌ | ❌ |

MCP를 통해 Claude Code, Cursor 등 AI 도구에서 직접 테이블 생성, 데이터 조회, 스키마 관리 등을 자연어로 수행할 수 있습니다.

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

***

## 선택 가이드

| 요구사항 | 추천 서비스 |
|---------|-----------|
| AI 도구로 백엔드 관리 | **bkend** |
| 유연한 스키마가 필요 | **bkend**, Firebase |
| SQL과 강력한 조인이 필요 | Supabase |
| 실시간 데이터 동기화가 핵심 | Firebase |
| 멀티테넌트 SaaS 구축 | **bkend** |
| 오픈소스 선호 | Supabase |

***

## 다음 단계

- [bkend 소개](../getting-started/01-what-is-bkend.md) — bkend 개요
- [Firebase에서 이전하기](02-migration-firebase.md) — Firebase 마이그레이션
- [Supabase에서 이전하기](03-migration-supabase.md) — Supabase 마이그레이션
