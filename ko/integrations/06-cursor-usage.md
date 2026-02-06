# Cursor 사용법

> Cursor에서 bkend MCP를 활용하여 백엔드를 관리하는 방법을 안내합니다.

## 개요

Cursor와 bkend MCP가 연결되면 AI Chat에서 자연어로 백엔드를 관리할 수 있습니다. 코드를 작성하면서 동시에 Database, Auth, Storage를 조작할 수 있습니다.

> 💡 **Tip** - 설정이 완료되지 않았다면 [Cursor 설정](05-cursor-setup.md)을 먼저 참고하세요.

---

## AI Chat에서 사용하기

Cursor의 AI Chat (Cmd+L / Ctrl+L)에서 자연어로 요청하세요.

### 프로젝트 관리하기

```
"bkend에 연결된 프로젝트 목록을 보여줘"

"my-app 프로젝트의 dev 환경 상태를 확인해줘"
```

### 테이블 관리하기

```
"dev 환경에 users 테이블을 만들어줘.
name(문자열, 필수), email(문자열, 필수), role(문자열) 필드가 필요해"

"users 테이블의 스키마를 보여줘"
```

### 데이터 CRUD 수행하기

```
"users 테이블에 테스트 데이터 5개를 추가해줘"

"users 테이블에서 role이 admin인 사용자를 보여줘"
```

---

## 코드와 함께 사용하기

Cursor에서는 코드 작성과 bkend 관리를 동시에 수행할 수 있습니다.

### Frontend 코드와 함께

```
"users 테이블의 스키마를 확인하고,
이 테이블에 맞는 TypeScript 인터페이스를 만들어줘"
```

### API 코드 생성하기

```
"bkend의 users 테이블 CRUD를 위한
서비스 API 호출 코드를 TypeScript로 작성해줘"
```

---

## Composer 모드에서 사용하기

Cursor의 Composer (Cmd+I / Ctrl+I)에서도 bkend MCP를 활용할 수 있습니다:

```
"bkend에 products 테이블을 생성하고,
이 테이블의 CRUD API를 호출하는 React 컴포넌트를 작성해줘"
```

---

## 문제 해결

### 도구 호출 실패 시

1. Cursor의 **Settings** > **MCP** 탭에서 bkend 서버 상태를 확인하세요
2. 서버가 비활성 상태이면 Cursor를 재시작하세요
3. 인증이 만료되었다면 재인증이 자동으로 진행됩니다

### 응답이 느릴 때

1. 네트워크 연결을 확인하세요
2. 큰 데이터를 조회할 때는 필터 조건을 추가하세요

---

## 관련 문서

- [Cursor 설정](05-cursor-setup.md) — 초기 설정 가이드
- [Database 개요](../database/01-overview.md) — Database 기능 상세
- [AI 도구 연동 개요](01-overview.md) — 지원 도구 목록
