# Claude Code 사용법

> Claude Code에서 bkend MCP를 활용하여 백엔드를 관리하는 방법을 안내합니다.

## 개요

Claude Code와 bkend MCP가 연결되면 자연어로 Database, Auth, Storage를 관리할 수 있습니다. 이 문서에서는 주요 사용 패턴과 예시를 안내합니다.

> 💡 **Tip** - 설정이 완료되지 않았다면 [Claude Code 설정](03-claude-code-setup.md)을 먼저 참고하세요.

---

## 기본 사용 패턴

### 프로젝트 관리하기

```
"bkend에 연결된 프로젝트 목록을 보여줘"

"Seoul 리전에 'my-app'이라는 프로젝트를 만들어줘"

"my-app 프로젝트의 환경 목록을 보여줘"
```

### 테이블 관리하기

```
"dev 환경의 테이블 목록을 보여줘"

"users 테이블을 만들어줘. name, email, age 필드가 필요해"

"users 테이블에 phone 필드를 추가해줘"
```

### 데이터 CRUD 수행하기

```
"users 테이블에 데이터를 추가해줘: name=홍길동, email=hong@example.com"

"users 테이블의 모든 데이터를 보여줘"

"홍길동의 이메일을 newhong@example.com으로 변경해줘"

"홍길동 데이터를 삭제해줘"
```

---

## 고급 사용 패턴

### 여러 테이블 한 번에 생성하기

```
"블로그 백엔드를 위한 테이블을 만들어줘:
1. posts: title(문자열), content(문자열), published(불리언), created_at(날짜)
2. comments: post_id(문자열), content(문자열), author(문자열), created_at(날짜)
3. categories: name(문자열), description(문자열)"
```

### 조건부 데이터 조회하기

```
"posts 테이블에서 published가 true인 글만 최신순으로 보여줘"

"users 테이블에서 age가 20 이상인 사용자를 이름순으로 보여줘"
```

### 스키마 확인 및 수정하기

```
"users 테이블의 스키마를 보여줘"

"users 테이블의 email 필드를 필수로 변경해줘"

"users 테이블에 인덱스를 추가해줘: email 필드에 유니크 인덱스"
```

---

## 세션 컨텍스트

Claude Code가 bkend에 처음 연결할 때 `0_get_context` 도구를 자동으로 호출합니다. 이 도구가 반환하는 정보:

| 항목 | 설명 |
|------|------|
| Organization ID | 현재 연결된 Organization |
| 프로젝트 목록 | 접근 가능한 프로젝트 목록 |
| API 엔드포인트 | 사용 가능한 API 정보 |
| 주의사항 | 제한 사항 및 경고 |

---

## 효과적인 요청 작성하기

### 명확하게 요청하기

```
# 좋은 예시
"my-app 프로젝트의 dev 환경에 users 테이블을 만들어줘"

# 모호한 예시
"테이블 만들어줘"
```

### 필드 타입 명시하기

```
# 좋은 예시
"products 테이블을 만들어줘:
- name: 문자열 (필수)
- price: 숫자
- in_stock: 불리언 (기본값: true)
- created_at: 날짜"

# 모호한 예시
"products 테이블을 만들어줘. name, price가 필요해"
```

---

## 문제 해결

### "도구를 찾을 수 없습니다" 오류

MCP 연결이 끊어졌을 수 있습니다. 다음을 확인하세요:

1. `claude mcp list`로 bkend 서버가 등록되어 있는지 확인하세요
2. 등록되어 있지 않다면 다시 추가하세요
3. Claude Code를 재시작하세요

### 응답이 느릴 때

1. 네트워크 연결을 확인하세요
2. bkend 콘솔에서 해당 환경의 상태가 **Active**인지 확인하세요

---

## 관련 문서

- [Claude Code 설정](03-claude-code-setup.md) — 초기 설정 가이드
- [Database 개요](../database/01-overview.md) — Database 기능 상세
- [AI 도구 연동 개요](01-overview.md) — 지원 도구 목록
