# 데이터 수정

{% hint style="info" %}
💡 기존 데이터의 필드를 부분 수정하세요.
{% endhint %}

{% hint style="info" %}
💡 **시작하기 전에** — 이 작업을 진행하려면 다음이 필요합니다:
- [프로젝트 생성](../getting-started/02-quickstart.md) 완료
- [테이블 생성](../console/07-table-management.md) 완료
- 인증 설정 — 공개 테이블은 인증 없이, RLS 적용 테이블은 JWT 필요
{% endhint %}

{% hint style="info" %}
💡 **이 문서에서 사용하는 API**

| 엔드포인트 | 메서드 | 인증 | 설명 |
|-----------|:------:|:----:|------|
| `/v1/data/:tableName/:id` | PATCH | 조건부 | 데이터 수정 |
{% endhint %}

## 개요

`PATCH /v1/data/:tableName/:id` 엔드포인트로 기존 데이터를 수정합니다. 변경할 필드만 요청에 포함하면 됩니다 (Partial Update).

***

## 데이터 수정

### PATCH /v1/data/:tableName/:id

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/data/posts/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "수정된 제목",
    "published": true
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const postId = '507f1f77bcf86cd799439011';

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts/${postId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: '수정된 제목',
    published: true,
  }),
});

const updated = await response.json();
```
{% endtab %}
{% endtabs %}

### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `tableName` | `string` | ✅ | 테이블 이름 |
| `id` | `string` | ✅ | 데이터 ID |

### 요청 본문

변경할 필드만 포함하세요. 포함되지 않은 필드는 기존 값이 유지됩니다.

```json
{
  "title": "수정된 제목",
  "published": true
}
```

{% hint style="warning" %}
⚠️ 시스템 필드(`id`, `createdBy`, `createdAt`)는 수정할 수 없습니다. `updatedAt`은 자동으로 갱신됩니다.
{% endhint %}

### 응답 (200 OK)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "수정된 제목",
  "content": "안녕하세요, bkend입니다.",
  "category": "notice",
  "published": true,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T14:20:00.000Z"
}
```

***

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

const updated = await bkendFetch('/v1/data/posts/{id}', {
  method: 'PATCH',
  body: {
    title: '수정된 제목',
  },
});
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/03-app-integration.md)를 참고하세요.
{% endhint %}

***

## 권한

데이터 수정에는 해당 테이블의 `update` 권한이 필요합니다.

| 역할 | 조건 |
|------|------|
| `admin` | 항상 허용 |
| `user` | `permissions.user.update`가 `true` |
| `guest` | `permissions.guest.update`가 `true` |
| `self` | `createdBy`가 본인인 데이터만 수정 가능 |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `data/table-not-found` | 404 | 테이블이 존재하지 않음 |
| `data/not-found` | 404 | 데이터를 찾을 수 없음 |
| `data/validation-error` | 400 | 스키마 검증 실패 |
| `data/permission-denied` | 403 | update 권한 없음 |
| `data/scope-insufficient` | 403 | API 키 scope에 필요한 권한이 포함되지 않음 |

***

## 다음 단계

- [데이터 삭제](07-delete.md) — 데이터 삭제
- [단건 조회](04-select.md) — 수정된 데이터 확인
- [데이터 모델](02-data-model.md) — 스키마와 권한 이해
