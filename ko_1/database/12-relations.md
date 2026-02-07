# 관계 설정

> 테이블 간의 관계를 설정하고 연관 데이터를 관리하는 방법을 안내합니다.

## 개요

bkend Database는 외래 키(Foreign Key) 패턴을 사용하여 테이블 간 관계를 구현합니다. 관련 테이블의 ID를 필드에 저장하고, 여러 번의 API 호출로 연관 데이터를 조회하는 방식입니다.

---

## 관계 유형

### 1:1 (일대일)

한 테이블의 레코드가 다른 테이블의 레코드 하나와 연결됩니다.

**예시: 사용자와 프로필**

```
users 테이블:        profiles 테이블:
┌──────────────┐    ┌────────────────────┐
│ _id          │    │ _id                │
│ name         │    │ userId (unique)    │──→ users._id
│ email        │    │ bio                │
└──────────────┘    │ avatar             │
                    └────────────────────┘
```

**profiles 스키마:**

```json
{
  "userId": { "bsonType": "string" },
  "bio": { "bsonType": "string" },
  "avatar": { "bsonType": "string" }
}
```

**조회:**

```bash
# 1. 사용자 조회
curl "https://api.bkend.ai/v1/data/users/{userId}" \
  -H "x-project-id: {project_id}" \
  -H "Authorization: Bearer {token}"

# 2. 해당 사용자의 프로필 조회
curl "https://api.bkend.ai/v1/data/profiles?andFilters[userId]={userId}" \
  -H "x-project-id: {project_id}" \
  -H "Authorization: Bearer {token}"
```

---

### 1:N (일대다)

한 테이블의 레코드가 다른 테이블의 여러 레코드와 연결됩니다.

**예시: 게시글과 댓글**

```
posts 테이블:        comments 테이블:
┌──────────────┐    ┌──────────────────┐
│ _id          │    │ _id              │
│ title        │◄───│ postId           │──→ posts._id
│ content      │    │ content          │
└──────────────┘    │ author           │
                    └──────────────────┘
```

**comments 스키마:**

```json
{
  "postId": { "bsonType": "string" },
  "content": { "bsonType": "string" },
  "author": { "bsonType": "string" }
}
```

**조회:**

```bash
# 1. 게시글 조회
curl "https://api.bkend.ai/v1/data/posts/{postId}" \
  -H "x-project-id: {project_id}" \
  -H "Authorization: Bearer {token}"

# 2. 해당 게시글의 댓글 목록 조회
curl "https://api.bkend.ai/v1/data/comments?andFilters[postId]={postId}&sortBy=createdAt&sortDirection=asc" \
  -H "x-project-id: {project_id}" \
  -H "Authorization: Bearer {token}"
```

---

### N:M (다대다)

양쪽 테이블의 여러 레코드가 서로 연결됩니다. **중간 테이블(Junction Table)**을 사용하여 구현합니다.

**예시: 학생과 수업**

```
students 테이블:     enrollments 테이블:   courses 테이블:
┌──────────────┐    ┌──────────────────┐  ┌──────────────┐
│ _id          │◄───│ studentId        │  │ _id          │
│ name         │    │ courseId         │──►│ title        │
└──────────────┘    │ enrolledAt       │  │ instructor   │
                    └──────────────────┘  └──────────────┘
```

**enrollments 스키마:**

```json
{
  "studentId": { "bsonType": "string" },
  "courseId": { "bsonType": "string" },
  "enrolledAt": { "bsonType": "date" }
}
```

**조회:**

```bash
# 특정 학생의 수강 목록 조회
curl "https://api.bkend.ai/v1/data/enrollments?andFilters[studentId]={studentId}" \
  -H "x-project-id: {project_id}" \
  -H "Authorization: Bearer {token}"

# 특정 수업의 수강생 목록 조회
curl "https://api.bkend.ai/v1/data/enrollments?andFilters[courseId]={courseId}" \
  -H "x-project-id: {project_id}" \
  -H "Authorization: Bearer {token}"
```

---

## 관계 설계 가이드

| 관계 유형 | 구현 방법 | 추가 설정 |
|----------|----------|----------|
| 1:1 | 자식 테이블에 부모 ID 필드 + unique | `unique: true` 권장 |
| 1:N | 자식 테이블에 부모 ID 필드 | 인덱스 추가 권장 |
| N:M | 중간 테이블에 양쪽 ID 필드 | 복합 인덱스 추가 권장 |

---

## 외래 키 필드 규칙

- **필드명 컨벤션**: 참조 테이블명 + `Id` (예: `userId`, `postId`, `courseId`)
- **타입**: `String` (bkend의 `_id`는 문자열 타입)
- **인덱스**: 외래 키 필드에 인덱스를 추가하면 조회 성능이 향상됩니다

```json
{
  "postId": {
    "bsonType": "string",
    "description": "참조할 posts 테이블의 _id"
  }
}
```

---

## 배열 기반 관계 (비정규화)

간단한 관계는 Array 타입을 사용하여 한 테이블 내에서 관리할 수도 있습니다.

**예시: 게시글의 태그**

```json
{
  "title": { "bsonType": "string" },
  "tags": {
    "bsonType": "array",
    "items": { "bsonType": "string" }
  }
}
```

> 💡 **Tip** - 배열 기반 관계는 데이터가 소량이고 독립적인 조회가 필요 없을 때 적합합니다. 관계 데이터가 많거나 독립적으로 조회/수정해야 한다면 별도 테이블을 사용하세요.

---

## 관련 문서

- [조인 쿼리](13-joins.md) — 클라이언트 사이드 조인
- [인덱스 & 성능](14-indexes.md) — 외래 키 인덱스
- [필터링 & 검색](10-filtering.md) — 필터 조건으로 관계 데이터 조회
