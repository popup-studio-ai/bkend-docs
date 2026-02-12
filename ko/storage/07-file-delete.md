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

## 앱에서 사용하기

`bkendFetch` 헬퍼를 사용하면 필수 헤더가 자동으로 포함됩니다.

```javascript
import { bkendFetch } from './bkend.js';

// 파일 삭제
async function deleteFile(fileId) {
  const result = await bkendFetch(`/v1/files/${fileId}`, {
    method: 'DELETE',
  });

  return result; // { success: true }
}

// 삭제 확인 후 실행
async function deleteFileWithConfirm(fileId, filename) {
  const confirmed = confirm(`"${filename}" 파일을 삭제하시겠습니까? 삭제된 파일은 복구할 수 없습니다.`);

  if (!confirmed) {
    return { cancelled: true };
  }

  try {
    await deleteFile(fileId);
    console.log('파일 삭제 완료');
    return { success: true };
  } catch (error) {
    console.error('삭제 실패:', error.message);
    return { success: false, error };
  }
}

// 사용 예시
const fileId = 'file-uuid-1234';
const result = await deleteFileWithConfirm(fileId, 'profile.jpg');

if (result.success) {
  // UI에서 파일 항목 제거
  document.querySelector(`#file-${fileId}`).remove();
}
```

{% hint style="info" %}
💡 `bkendFetch` 설정은 [앱에서 bkend 연동하기](../getting-started/03-app-integration.md)를 참고하세요.
{% endhint %}

***

## 다음 단계

- [파일 목록 조회](05-file-list.md) — 삭제 후 목록 확인
- [파일 메타데이터](04-file-metadata.md) — 파일 정보 관리
- [스토리지 개요](01-overview.md) — 스토리지 전체 구조
