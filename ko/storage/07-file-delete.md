# 파일 삭제

{% hint style="info" %}
💡 등록된 파일을 삭제하세요.
{% endhint %}

## 개요

`DELETE /v1/files/:fileId` 엔드포인트로 파일 메타데이터를 삭제합니다.

***

## 파일 삭제

### DELETE /v1/files/:fileId

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/files/{fileId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch(`https://api-client.bkend.ai/v1/files/${fileId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});

if (response.ok) {
  console.log('파일 삭제 완료');
}
```
{% endtab %}
{% endtabs %}

### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `fileId` | `string` | ✅ | 파일 ID |

### 응답 (200 OK)

```json
{
  "success": true
}
```

{% hint style="danger" %}
🚨 **위험** — 삭제된 파일은 복구할 수 없습니다. 삭제 전 사용자에게 확인을 요청하세요.
{% endhint %}

***

## 권한

파일 삭제는 소유자 또는 관리자만 수행할 수 있습니다.

| 사용자 | 삭제 가능 |
|--------|:--------:|
| 파일 소유자 | ✅ |
| `admin` | ✅ |
| 비소유자 | ❌ |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `file/not-found` | 404 | 파일을 찾을 수 없음 |
| `file/access-denied` | 403 | 삭제 권한 없음 |
| `common/authentication-required` | 401 | 인증 필요 |

***

## 다음 단계

- [파일 목록 조회](05-file-list.md) — 삭제 후 목록 확인
- [파일 메타데이터](04-file-metadata.md) — 파일 정보 관리
- [스토리지 개요](01-overview.md) — 스토리지 전체 구조
