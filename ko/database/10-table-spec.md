# 테이블 스키마 조회

{% hint style="info" %}
💡 REST API로 테이블의 스키마, 인덱스, 권한 설정을 확인하세요.
{% endhint %}

## 개요

`GET /v1/data/:tableName/spec` 엔드포인트로 테이블의 스키마 정의, 인덱스 설정, 권한 설정을 조회할 수 있습니다. 클라이언트 앱에서 동적으로 폼을 생성하거나 데이터 검증에 활용하세요.

***

## 스키마 조회

### GET /v1/data/:tableName/spec

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET https://api-client.bkend.ai/v1/data/posts/spec \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch('https://api-client.bkend.ai/v1/data/posts/spec', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});

const spec = await response.json();
console.log(spec.schema);      // 필드 정의
console.log(spec.permissions);  // 권한 설정
```
{% endtab %}
{% endtabs %}

### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `tableName` | `string` | ✅ | 테이블 이름 |

### 응답 (200 OK)

```json
{
  "tableName": "posts",
  "schema": {
    "bsonType": "object",
    "required": ["title", "content"],
    "properties": {
      "title": {
        "bsonType": "string",
        "maxLength": 200
      },
      "content": {
        "bsonType": "string"
      },
      "category": {
        "bsonType": "string",
        "enum": ["notice", "general", "event"]
      },
      "published": {
        "bsonType": "bool"
      },
      "viewCount": {
        "bsonType": "int",
        "minimum": 0
      }
    }
  },
  "indexes": [
    {
      "key": { "category": 1 }
    },
    {
      "key": { "createdAt": -1 }
    }
  ],
  "permissions": {
    "admin": {
      "create": true,
      "read": true,
      "list": true,
      "update": true,
      "delete": true
    },
    "user": {
      "create": true,
      "read": true,
      "list": true
    },
    "guest": {
      "read": true,
      "list": true
    },
    "self": {
      "update": true,
      "delete": true
    }
  }
}
```

### 응답 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `tableName` | `string` | 테이블 이름 |
| `schema` | `object` | 스키마 정의 (필드, 타입, 제약 조건) |
| `indexes` | `array` | 인덱스 목록 |
| `permissions` | `object` | 역할별 CRUD 권한 |

***

## 활용 예시

### 동적 폼 생성

스키마 정보를 활용하여 클라이언트에서 동적으로 입력 폼을 생성할 수 있습니다.

```javascript
const spec = await fetchTableSpec('posts');
const { properties, required } = spec.schema;

Object.entries(properties).forEach(([field, def]) => {
  const isRequired = required?.includes(field);
  const type = def.bsonType;

  // 필드 타입에 따라 적절한 입력 컴포넌트 렌더링
  if (type === 'string' && def.enum) {
    // Select 컴포넌트 (드롭다운)
  } else if (type === 'string') {
    // Text Input
  } else if (type === 'bool') {
    // Checkbox
  } else if (type === 'int' || type === 'double') {
    // Number Input (min/max 적용)
  }
});
```

### 권한 확인

현재 사용자의 역할에 따라 UI 요소를 표시하거나 숨길 수 있습니다.

```javascript
const spec = await fetchTableSpec('posts');
const userRole = 'user'; // 현재 사용자 역할

const canCreate = spec.permissions[userRole]?.create ?? false;
const canUpdate = spec.permissions[userRole]?.update ?? false;
const canDelete = spec.permissions[userRole]?.delete ?? false;

// 권한에 따라 버튼 표시/숨김
```

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `data/table-not-found` | 404 | 테이블이 존재하지 않음 |
| `data/permission-denied` | 403 | 접근 권한 없음 |
| `data/invalid-header` | 400 | 필수 헤더 누락 |

***

## 다음 단계

- [데이터 모델](02-data-model.md) — 스키마와 권한 구조 이해
- [데이터 생성](03-insert.md) — 스키마에 맞는 데이터 생성
- [테이블 관리](../console/07-table-management.md) — 콘솔에서 스키마 편집
