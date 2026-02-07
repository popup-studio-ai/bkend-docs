# 컬럼 타입

> bkend Database에서 지원하는 컬럼 타입과 각 타입별 옵션을 안내합니다.

## 개요

테이블의 각 필드는 데이터 타입을 지정할 수 있습니다. bkend는 MongoDB BSON Schema를 기반으로 7가지 컬럼 타입을 지원합니다.

---

## 지원 타입 목록

| 타입 | 설명 | JavaScript 타입 | 예시 값 |
|------|------|-----------------|---------|
| `String` | 문자열 | `string` | `"hello"` |
| `Number` | 숫자 (정수/실수) | `number` | `42`, `3.14` |
| `Boolean` | 참/거짓 | `boolean` | `true`, `false` |
| `Date` | 날짜/시간 | `Date` (ISO 8601 문자열) | `"2026-01-15T09:00:00Z"` |
| `Array` | 배열 | `array` | `[1, 2, 3]` |
| `Object` | 중첩 객체 | `object` | `{"key": "value"}` |
| `Mixed` | 혼합 타입 (제약 없음) | `any` | 모든 값 |

---

## String

문자열 데이터를 저장합니다.

### 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `minLength` | number | 최소 문자 길이 |
| `maxLength` | number | 최대 문자 길이 |
| `pattern` | string | 정규식 패턴 |
| `enum` | string[] | 허용 값 목록 |

### 예시

```json
{
  "email": {
    "bsonType": "string",
    "minLength": 5,
    "maxLength": 255,
    "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  },
  "status": {
    "bsonType": "string",
    "enum": ["active", "inactive", "suspended"]
  }
}
```

---

## Number

정수와 실수를 저장합니다. BSON 타입으로 `int`, `long`, `double`도 사용할 수 있습니다.

### 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `minimum` | number | 최솟값 |
| `maximum` | number | 최댓값 |

### 예시

```json
{
  "age": {
    "bsonType": "number",
    "minimum": 0,
    "maximum": 150
  },
  "price": {
    "bsonType": "double",
    "minimum": 0
  }
}
```

### 자동 타입 변환

문자열로 전달된 숫자는 자동으로 변환됩니다:

| 입력 | 변환 결과 |
|------|----------|
| `"123"` | `123` |
| `"-45.67"` | `-45.67` |
| `"abc"` | 변환 실패 (원본 유지) |

---

## Boolean

참/거짓 값을 저장합니다.

### 예시

```json
{
  "active": {
    "bsonType": "bool"
  }
}
```

### 자동 타입 변환

| 입력 | 변환 결과 |
|------|----------|
| `"true"` | `true` |
| `"false"` | `false` |

---

## Date

날짜와 시간을 저장합니다. ISO 8601 형식의 문자열을 전달하면 자동으로 Date 객체로 변환됩니다.

### 예시

```json
{
  "publishedAt": {
    "bsonType": "date"
  }
}
```

### 자동 타입 변환

| 입력 | 변환 결과 |
|------|----------|
| `"2026-01-15T09:00:00Z"` | `Date(2026-01-15T09:00:00Z)` |
| `"2026-01-15"` | `Date(2026-01-15T00:00:00Z)` |

---

## Array

배열 데이터를 저장합니다. `items` 속성으로 배열 항목의 스키마를 정의할 수 있습니다.

### 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `items` | object | 배열 항목의 스키마 정의 |

### 예시

```json
{
  "tags": {
    "bsonType": "array",
    "items": {
      "bsonType": "string"
    }
  },
  "scores": {
    "bsonType": "array",
    "items": {
      "bsonType": "number",
      "minimum": 0,
      "maximum": 100
    }
  }
}
```

---

## Object

중첩 객체를 저장합니다. `properties` 속성으로 객체 내부 필드의 스키마를 정의할 수 있습니다.

### 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `properties` | object | 객체 속성의 스키마 정의 |

### 예시

```json
{
  "address": {
    "bsonType": "object",
    "properties": {
      "street": { "bsonType": "string" },
      "city": { "bsonType": "string" },
      "zipCode": { "bsonType": "string", "pattern": "^[0-9]{5}$" }
    }
  }
}
```

---

## Mixed

타입 제약 없이 모든 종류의 데이터를 저장합니다. 스키마 검증이 적용되지 않으므로 유연한 구조가 필요할 때 사용하세요.

### 예시

```json
{
  "metadata": {
    "bsonType": "object",
    "description": "자유 형식 메타데이터"
  }
}
```

> ⚠️ **주의** - Mixed 타입은 스키마 검증이 적용되지 않으므로 데이터 일관성을 보장하기 어렵습니다. 가능하면 구체적인 타입을 사용하세요.

---

## 시스템 필드

모든 테이블에 자동으로 생성되는 시스템 필드입니다. 사용자가 직접 수정하거나 삭제할 수 없습니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| `_id` | String | 고유 식별자 (`data_` 접두사 + UUID) |
| `createdBy` | String | 데이터를 생성한 User ID |
| `createdAt` | Date | 생성 일시 (자동) |
| `updatedAt` | Date | 최종 수정 일시 (자동) |

> ⚠️ **주의** - 데이터 생성/수정 시 시스템 필드를 요청 본문에 포함하면 자동으로 제거됩니다.

---

## 콘솔에서 타입 선택하기

테이블 생성 또는 스키마 편집 시, 콘솔의 필드 정의 영역에서 드롭다운으로 타입을 선택할 수 있습니다:

1. **Schema** 탭으로 이동하세요.
2. **필드 추가** 버튼을 클릭하세요.
3. 필드 이름을 입력하세요.
4. **타입** 드롭다운에서 원하는 타입(String, Number, Boolean, Date, Array, Object, Mixed)을 선택하세요.
5. 필요한 옵션(필수, 유니크)을 설정하세요.

---

## MCP 도구로 타입 지정하기

AI 도구에서 자연어로 필드 타입을 지정할 수 있습니다:

```
"products 테이블에 다음 필드를 추가해줘:
- name: 문자열 (필수, 최대 100자)
- price: 숫자 (최소 0)
- tags: 문자열 배열
- details: 객체 (color, size 속성)"
```

---

## 관련 문서

- [테이블 생성](03-create-table.md) — 테이블 생성 가이드
- [제약 조건](05-constraints.md) — 필드 제약 조건 설정
- [콘솔에서 DB 관리](02-console-ui.md) — 콘솔 UI 가이드
