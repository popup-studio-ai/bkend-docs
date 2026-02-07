# 데이터 삭제

{% hint style="info" %}
💡 테이블에서 데이터를 삭제하세요.
{% endhint %}

## 개요

`DELETE /v1/data/:tableName/:id` 엔드포인트로 특정 데이터를 삭제합니다.

***

## 데이터 삭제

### DELETE /v1/data/:tableName/:id

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/data/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: prod"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const postId = '507f1f77bcf86cd799439011';

const response = await fetch(`https://api-client.bkend.ai/v1/data/posts/${postId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'prod',
  },
});

const result = await response.json();
console.log(result.success); // true
```
{% endtab %}
{% endtabs %}

### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `tableName` | `string` | ✅ | 테이블 이름 |
| `id` | `string` | ✅ | 데이터 ID |

### 응답 (200 OK)

```json
{
  "success": true
}
```

{% hint style="danger" %}
🚨 **위험** — 삭제된 데이터는 복구할 수 없습니다. 삭제 전 사용자에게 확인을 요청하세요.
{% endhint %}

***

## 권한

데이터 삭제에는 해당 테이블의 `delete` 권한이 필요합니다.

| 역할 | 조건 |
|------|------|
| `admin` | 항상 허용 |
| `user` | `permissions.user.delete`가 `true` |
| `guest` | `permissions.guest.delete`가 `true` |
| `self` | `createdBy`가 본인인 데이터만 삭제 가능 |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `data/table-not-found` | 404 | 테이블이 존재하지 않음 |
| `data/not-found` | 404 | 데이터를 찾을 수 없음 |
| `data/permission-denied` | 403 | delete 권한 없음 |

***

## 다음 단계

- [데이터 생성](03-insert.md) — 새 데이터 추가
- [목록 조회](05-list.md) — 삭제 후 목록 확인
- [데이터 모델](02-data-model.md) — 권한 설정 이해
