# 첫 번째 프로젝트 만들기

> 처음부터 끝까지 프로젝트를 생성하고 AI 도구로 데이터를 관리해봅니다.

## 개요

이 가이드에서는 bkend에서 프로젝트를 생성하고, AI 도구를 연결하여 테이블을 만들고, 데이터를 CRUD하는 전체 과정을 안내합니다.

---

## 사전 준비

- bkend 계정 및 Organization ([빠른 시작](02-quickstart.md)에서 생성)
- AI 도구 설치 (Claude Code, Cursor 등)

---

## 전체 과정

```mermaid
flowchart LR
    A[프로젝트 생성] --> B[AI 도구 연결]
    B --> C[테이블 설계]
    C --> D[데이터 CRUD]
    D --> E[콘솔에서 확인]
```

---

## 1단계: 프로젝트 생성하기

### 콘솔에서 생성하기

1. bkend 콘솔에서 Organization 페이지로 이동하세요.
2. **Projects** 메뉴를 클릭하세요.
3. **Create Project** 버튼을 클릭하세요.
4. 다음 정보를 입력하세요:

| 필드 | 예시 | 설명 |
|------|------|------|
| **Project Name** | My Blog | 프로젝트 표시 이름 |
| **Project Slug** | my-blog | URL 식별자 (자동 생성 가능) |
| **Region** | Seoul (ap-northeast-2) | 데이터 저장 리전 |
| **Cloud** | AWS | 클라우드 제공자 |

5. **Create** 버튼을 클릭하세요.

프로젝트가 생성되면 dev 환경이 자동으로 프로비저닝됩니다. **Active** 상태가 될 때까지 약 30초를 기다리세요.

### AI 도구에서 생성하기

AI 도구가 연결되어 있다면 자연어로도 생성할 수 있습니다:

```
"Seoul 리전에 'my-blog'이라는 프로젝트를 만들어줘"
```

---

## 2단계: AI 도구 연결하기

프로젝트가 준비되면 AI 도구를 연결하세요. 아직 MCP 설정을 하지 않았다면 [빠른 시작의 4단계](02-quickstart.md#4단계-ai-도구-연결하기)를 참고하세요.

AI 도구에서 연결을 확인하려면 다음과 같이 요청하세요:

```
"bkend에 연결된 프로젝트 목록을 보여줘"
```

---

## 3단계: 테이블 설계하기

블로그 백엔드를 위한 테이블을 생성하세요.

### posts 테이블 생성하기

```
"posts 테이블을 만들어줘.
- title: 문자열 (필수)
- content: 문자열 (필수)
- author_name: 문자열
- published: 불리언 (기본값: false)
- created_at: 날짜"
```

### comments 테이블 생성하기

```
"comments 테이블을 만들어줘.
- post_id: 문자열 (필수)
- content: 문자열 (필수)
- author_name: 문자열
- created_at: 날짜"
```

### 콘솔에서 확인하기

1. 콘솔의 **Database** 메뉴로 이동하세요.
2. Environment 선택기에서 **dev**를 선택하세요.
3. 생성된 `posts`, `comments` 테이블을 확인하세요.

---

## 4단계: 데이터 CRUD 수행하기

### 데이터 삽입하기 (Create)

```
"posts 테이블에 다음 글을 추가해줘:
- title: 첫 번째 블로그 글
- content: bkend를 사용한 첫 번째 글입니다.
- author_name: 홍길동
- published: true"
```

### 데이터 조회하기 (Read)

```
"posts 테이블의 모든 글을 보여줘"
```

특정 조건으로 조회하기:

```
"posts 테이블에서 published가 true인 글만 보여줘"
```

### 데이터 수정하기 (Update)

```
"posts 테이블에서 '첫 번째 블로그 글'의 제목을 'bkend 시작하기'로 변경해줘"
```

### 데이터 삭제하기 (Delete)

```
"posts 테이블에서 '첫 번째 블로그 글'을 삭제해줘"
```

> ❌ **위험** - 삭제된 데이터는 복구할 수 없습니다. 중요한 데이터를 삭제하기 전에 반드시 확인하세요.

---

## 5단계: 콘솔에서 데이터 확인하기

AI 도구에서 수행한 모든 작업을 콘솔에서 시각적으로 확인할 수 있습니다:

1. **Database** 메뉴에서 테이블을 선택하세요.
2. 데이터 뷰어에서 삽입된 레코드를 확인하세요.
3. **Activities** 메뉴에서 수행된 작업 로그를 확인하세요.

---

## 완성된 프로젝트 구조

```
Organization: My Startup
└── Project: My Blog
    └── Environment: dev
        ├── Table: posts
        │   ├── title (string)
        │   ├── content (string)
        │   ├── author_name (string)
        │   ├── published (boolean)
        │   └── created_at (datetime)
        └── Table: comments
            ├── post_id (string)
            ├── content (string)
            ├── author_name (string)
            └── created_at (datetime)
```

---

## 다음 단계

프로젝트를 더 발전시키려면 다음 문서를 참고하세요:

- [테이블 생성](../database/03-create-table.md) — 테이블 설계 심화
- [관계 설정](../database/12-relations.md) — 테이블 간 관계 설정
- [Auth 개요](../authentication/01-overview.md) — User 인증 추가
- [Storage 개요](../storage/01-overview.md) — 파일 업로드 기능 추가
- [Todo 앱 만들기](../cookbook/01-todo-app.md) — 실전 튜토리얼
