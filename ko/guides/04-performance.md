# 성능 최적화

{% hint style="info" %}
💡 bkend 프로젝트의 성능을 최적화하는 방법을 안내합니다.
{% endhint %}

## 개요

bkend 프로젝트의 성능을 최적화하려면 인덱스 관리, 쿼리 최적화, 파일 저장소 활용, API 호출 효율화 등을 고려해야 합니다.

***

## 인덱스 관리

### 기본 인덱스

bkend는 테이블 생성 시 다음 인덱스를 자동 생성합니다.

| 인덱스 이름 | 필드 | 정렬 | 설명 |
|-----------|------|------|------|
| `_id_` | `_id` | 오름차순 | 기본 키 인덱스 (시스템) |
| `idx_createdAt_desc` | `createdAt` | 내림차순 | 생성일 정렬 |
| `idx_updatedAt_desc` | `updatedAt` | 내림차순 | 수정일 정렬 |
| `idx_createdBy` | `createdBy` | 오름차순 | 작성자 필터링 |

{% hint style="warning" %}
⚠️ 기본 인덱스와 시스템 인덱스(`_id_`)는 수정하거나 삭제할 수 없습니다.
{% endhint %}

### 커스텀 인덱스 추가하기

자주 조회하는 필드에 인덱스를 추가하면 쿼리 성능이 크게 향상됩니다.

```json
{
  "name": "idx_status_createdAt",
  "fields": {
    "status": 1,
    "createdAt": -1
  }
}
```

### 인덱스 유형

| 유형 | 설명 | 사용 예시 |
|------|------|----------|
| **단일 필드** | 하나의 필드에 대한 인덱스 | `{ "email": 1 }` |
| **복합 인덱스** | 여러 필드를 조합한 인덱스 | `{ "status": 1, "createdAt": -1 }` |
| **Unique** | 중복 값 방지 | 이메일, 슬러그 등 |
| **Sparse** | null 값을 제외한 인덱스 | 선택적 필드 |

인덱스 관리는 **콘솔** 또는 **MCP 도구**에서 설정하세요.

→ [인덱스 관리 (콘솔)](../console/09-index-management.md), [테이블 도구](../mcp/08-table-tools.md)

***

## 쿼리 최적화

### 인덱스된 필드로 필터링하기

인덱스가 있는 필드를 우선적으로 필터 조건에 사용하세요.

```bash
# ✅ 좋은 예 — 인덱스된 필드로 필터링
curl -X GET "https://api-client.bkend.ai/v1/data/posts?andFilters=%7B%22status%22%3A%22published%22%7D&sortBy=createdAt&sortDirection=desc&limit=20" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### 페이지네이션 활용하기

대량 데이터를 조회할 때는 반드시 `page`와 `limit`을 사용하세요.

| 파라미터 | 설명 | 권장값 |
|---------|------|:-----:|
| `page` | 페이지 번호 (1부터 시작) | 1, 2, 3, ... |
| `limit` | 한 번에 조회할 레코드 수 | 10~50 |

```javascript
// 페이지네이션
const page = 1;
const limit = 20;

const response = await fetch(
  `https://api-client.bkend.ai/v1/data/posts?page=${page}&limit=${limit}`,
  {
    headers: {
      'X-API-Key': '{pk_publishable_key}',
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);
```

### 필드 선택하기

필요한 필드만 선택하여 응답 크기를 줄이세요.

```bash
# 필요한 필드만 조회
curl -X GET "https://api-client.bkend.ai/v1/data/posts?select=title,status,createdAt" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

***

## 파일 저장소 최적화

### 파일 크기 최적화

| 파일 유형 | 권장사항 |
|----------|---------|
| **이미지** | 업로드 전 압축, WebP 형식 사용 |
| **문서** | 필요한 형식만 저장, PDF 압축 |
| **대용량 파일** | 멀티파트 업로드 활용 |

### CDN 활용

| 접근 방식 | 응답 속도 | 만료 | 적합 |
|----------|:--------:|:----:|------|
| **CDN** (public) | 빠름 | 없음 | 프로필 이미지, 정적 파일 |
| **Presigned URL** (private) | 보통 | 유효 기간 | 민감한 파일 |

{% hint style="info" %}
💡 자주 접근하는 비민감 파일은 `public`으로 설정하여 CDN의 이점을 활용하세요.
{% endhint %}

***

## API 호출 최적화

### 배치 처리

여러 레코드를 한 번에 처리하면 API 호출 횟수를 줄일 수 있습니다.

```javascript
// ❌ 나쁜 예 — 개별 삽입 (N번 호출)
for (const item of items) {
  await fetch('https://api-client.bkend.ai/v1/data/posts', {
    method: 'POST',
    headers: { /* ... */ },
    body: JSON.stringify(item),
  });
}

// ✅ 좋은 예 — 배치 삽입 (1번 호출)
await fetch('https://api-client.bkend.ai/v1/data/posts', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify(items), // 배열로 전달
});
```

### 클라이언트 캐싱

자주 변경되지 않는 데이터는 클라이언트에서 캐싱하세요.

```javascript
const cache = new Map();

async function fetchWithCache(url, options, ttl = 60000) {
  const cached = cache.get(url);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const response = await fetch(url, options);
  const data = await response.json();
  cache.set(url, { data, expiry: Date.now() + ttl });
  return data;
}
```

***

## 성능 체크리스트

- [ ] 자주 필터링하는 필드에 인덱스를 추가했는지 확인
- [ ] 페이지네이션을 적용했는지 확인
- [ ] 불필요한 필드를 제외하고 조회하는지 확인
- [ ] public 파일에 CDN을 활용하는지 확인
- [ ] 배치 처리로 API 호출을 최소화했는지 확인
- [ ] 클라이언트 캐싱을 적용했는지 확인

***

## 다음 단계

- [필터링](../database/08-filtering.md) — 효율적인 쿼리 작성
- [정렬 & 페이지네이션](../database/09-sorting-pagination.md) — 페이지네이션 활용
- [파일 업로드](../storage/02-upload-single.md) — 파일 업로드 최적화
