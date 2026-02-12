# 05. 리뷰 + 별점 구현하기

{% hint style="info" %}
💡 리뷰 테이블을 생성하고, 배달 완료된 상품에 대한 리뷰 작성 및 별점 평가 기능을 구현하세요.
{% endhint %}

## 개요

이 장에서는 구매 완료된 상품에 대해 리뷰와 별점을 남기는 기능을 구현합니다.

- `reviews` 테이블 생성
- 리뷰 작성 (별점 1~5, 리뷰 내용)
- 상품별 리뷰 목록 조회
- 평균 별점 계산
- 리뷰 수정/삭제

### 선행 조건

| 항목 | 설명 | 참조 |
|------|------|------|
| 인증 설정 | Access Token 필요 | [01-auth](01-auth.md) |
| products 테이블 | 리뷰 대상 상품이 있어야 합니다 | [02-products](02-products.md) |
| orders 테이블 | 배달 완료(delivered) 주문이 있어야 합니다 | [04-orders](04-orders.md) |

***

## 1단계: reviews 테이블 생성

리뷰 데이터를 저장할 `reviews` 테이블을 생성하세요.

### 테이블 스키마

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `productId` | String | ✅ | 상품 ID (products 테이블 참조) |
| `orderId` | String | ✅ | 주문 ID (orders 테이블 참조) |
| `rating` | Number | ✅ | 별점 (1~5) |
| `content` | String | ✅ | 리뷰 내용 |

{% hint style="info" %}
💡 `createdBy`가 자동으로 리뷰 작성자의 사용자 ID로 설정됩니다.
{% endhint %}

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"상품 리뷰 기능을 만들고 싶어요. 어떤 상품의 리뷰인지, 어떤 주문에서 산 건지, 별점(1~5), 리뷰 내용을 저장할 수 있게 해주세요. 만들기 전에 어떤 구조로 만들지 먼저 보여주세요."
{% endhint %}

{% hint style="info" %}
💡 AI가 아래와 비슷한 구조를 제안하는지 확인하세요.
{% endhint %}

| 필드 | 설명 | 예시 값 |
|------|------|---------|
| productId | 리뷰 대상 상품 | (상품 ID) |
| orderId | 구매한 주문 | (주문 ID) |
| rating | 별점 (1~5) | 5 |
| content | 리뷰 내용 | "음질이 좋아요" |
{% endtab %}

{% tab title="콘솔" %}
1. 콘솔에서 **테이블** 메뉴로 이동하세요.
2. **새 테이블 추가**를 클릭하세요.
3. 테이블 이름에 `reviews`를 입력하세요.
4. 위 스키마대로 필드를 추가하세요.
5. **저장**을 클릭하면 테이블이 생성됩니다.

<!-- 📸 IMG: 콘솔에서 reviews 테이블 생성 화면 -->
{% endtab %}
{% endtabs %}

***

## 2단계: 리뷰 작성

배달 완료(delivered)된 주문의 상품에 리뷰를 작성하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠에 별점 5점으로 리뷰를 남겨주세요. 내용은 '품질이 정말 좋아요! 면 소재가 부드럽고 핏도 편합니다.'로 해주세요."
{% endhint %}

AI가 해당 상품의 최근 배달 완료 주문을 찾아 리뷰를 작성합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "productId": "product_abc123",
    "orderId": "order_xyz789",
    "rating": 5,
    "content": "품질이 정말 좋아요! 면 소재가 부드럽고 핏도 편합니다."
  }'
```

**bkendFetch 예시:**

```javascript
const review = await bkendFetch('/v1/data/reviews', {
  method: 'POST',
  body: JSON.stringify({
    productId: 'product_abc123',
    orderId: 'order_xyz789',
    rating: 5,
    content: '품질이 정말 좋아요! 면 소재가 부드럽고 핏도 편합니다.',
  }),
});

console.log('리뷰 작성 완료:', review);
```

**응답 예시:**

```json
{
  "id": "review_001",
  "productId": "product_abc123",
  "orderId": "order_xyz789",
  "rating": 5,
  "content": "품질이 정말 좋아요! 면 소재가 부드럽고 핏도 편합니다.",
  "createdBy": "user_abc123",
  "createdAt": "2025-01-20T10:00:00Z"
}
```

{% hint style="warning" %}
⚠️ 리뷰는 배달 완료(`delivered`) 상태의 주문에 대해서만 작성하는 것을 권장합니다. 앱에서 주문 상태를 확인한 후 리뷰 작성 버튼을 노출하세요.
{% endhint %}
{% endtab %}
{% endtabs %}

***

## 3단계: 상품별 리뷰 목록 조회

특정 상품에 달린 리뷰를 조회하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠에 달린 리뷰를 보여주세요."
{% endhint %}

AI가 해당 상품의 리뷰를 최신순으로 보여줍니다.

{% hint style="success" %}
✅ **별점별 조회도 가능합니다:**

"프리미엄 면 티셔츠의 별점 5점 리뷰만 보여주세요."
{% endhint %}
{% endtab %}

{% tab title="콘솔 + REST API" %}

### 전체 리뷰 (최신순)

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/reviews?andFilters=%7B%22productId%22%3A%22{product_id}%22%7D&sortBy=createdAt&sortDirection=desc" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### 별점별 필터 (5점 리뷰만)

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/reviews?andFilters=%7B%22productId%22%3A%22{product_id}%22%2C%22rating%22%3A5%7D" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### 높은 별점순 정렬

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/reviews?andFilters=%7B%22productId%22%3A%22{product_id}%22%7D&sortBy=rating&sortDirection=desc" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

**bkendFetch 예시:**

```javascript
// 상품별 리뷰 조회 (최신순)
const reviews = await bkendFetch(
  `/v1/data/reviews?andFilters=${encodeURIComponent(JSON.stringify({ productId }))}&sortBy=createdAt&sortDirection=desc`
);

reviews.items.forEach(review => {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  console.log(`${stars} ${review.content}`);
});
```

**응답 예시:**

```json
{
  "items": [
    {
      "id": "review_001",
      "productId": "product_abc123",
      "rating": 5,
      "content": "품질이 정말 좋아요!",
      "createdBy": "user_abc123",
      "createdAt": "2025-01-20T10:00:00Z"
    },
    {
      "id": "review_002",
      "productId": "product_abc123",
      "rating": 4,
      "content": "전체적으로 만족합니다. 사이즈가 약간 크네요.",
      "createdBy": "user_def456",
      "createdAt": "2025-01-19T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```
{% endtab %}
{% endtabs %}

***

## 4단계: 평균 별점 계산

상품의 평균 별점을 계산하여 표시하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠의 리뷰를 요약해주세요. 평균 별점이 몇 점인지, 별점별로 몇 개씩인지 알려주세요."
{% endhint %}

AI가 리뷰를 조회하고, 평균 별점과 분포를 자동으로 계산하여 보여줍니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}

bkend의 데이터 API에는 집계(aggregation) 기능이 없으므로, 리뷰 목록을 조회한 후 클라이언트에서 평균을 계산합니다.

```javascript
// 상품 리뷰 전체 조회
const reviews = await bkendFetch(
  `/v1/data/reviews?andFilters=${encodeURIComponent(JSON.stringify({ productId }))}&limit=50`
);

const items = reviews.items;

if (items.length === 0) {
  console.log('리뷰가 없습니다.');
} else {
  // 평균 별점 계산
  const totalRating = items.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = (totalRating / items.length).toFixed(1);

  // 별점 분포 계산
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  items.forEach(review => {
    distribution[review.rating]++;
  });

  console.log(`평균 별점: ${averageRating} (${items.length}개 리뷰)`);
  console.log('별점 분포:');
  for (let i = 5; i >= 1; i--) {
    const count = distribution[i];
    const percent = ((count / items.length) * 100).toFixed(0);
    console.log(`  ${'★'.repeat(i)}${'☆'.repeat(5 - i)}: ${count}개 (${percent}%)`);
  }
}
```

**출력 예시:**

```text
평균 별점: 4.5 (10개 리뷰)
별점 분포:
  ★★★★★: 6개 (60%)
  ★★★★☆: 3개 (30%)
  ★★★☆☆: 1개 (10%)
  ★★☆☆☆: 0개 (0%)
  ★☆☆☆☆: 0개 (0%)
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
💡 리뷰 수가 많은 경우 `limit` 파라미터를 조정하여 전체 리뷰를 가져오세요. 페이지네이션을 활용하면 모든 리뷰를 순회할 수 있습니다.
{% endhint %}

***

## 5단계: 리뷰 수정

작성한 리뷰의 별점이나 내용을 수정하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"내가 쓴 티셔츠 리뷰 별점을 4점으로 바꾸고, 내용도 '전체적으로 만족합니다. 다만 사이즈가 약간 크네요.'로 수정해주세요."
{% endhint %}

AI가 리뷰의 별점과 내용을 수정합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/data/reviews/{review_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "rating": 4,
    "content": "전체적으로 만족합니다. 다만 사이즈가 약간 크네요."
  }'
```

**bkendFetch 예시:**

```javascript
const updated = await bkendFetch(`/v1/data/reviews/${reviewId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    rating: 4,
    content: '전체적으로 만족합니다. 다만 사이즈가 약간 크네요.',
  }),
});

console.log('리뷰 수정 완료:', updated);
```
{% endtab %}
{% endtabs %}

***

## 6단계: 리뷰 삭제

작성한 리뷰를 삭제하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"내가 쓴 티셔츠 리뷰를 삭제해주세요."
{% endhint %}

AI가 해당 리뷰를 삭제합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/data/reviews/{review_id} \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

**bkendFetch 예시:**

```javascript
await bkendFetch(`/v1/data/reviews/${reviewId}`, {
  method: 'DELETE',
});

console.log('리뷰 삭제 완료');
```
{% endtab %}
{% endtabs %}

***

## 리뷰가 있는 상품 목록 화면 구성

앱에서 상품 목록에 평균 별점을 함께 표시하는 패턴입니다.

```javascript
// 상품 목록과 리뷰를 조합하여 표시
async function getProductsWithRatings() {
  const products = await bkendFetch(
    `/v1/data/products?andFilters=${encodeURIComponent(JSON.stringify({ isActive: true }))}`
  );

  const productsWithRatings = await Promise.all(
    products.items.map(async product => {
      const reviews = await bkendFetch(
        `/v1/data/reviews?andFilters=${encodeURIComponent(JSON.stringify({ productId: product.id }))}`
      );
      const items = reviews.items;
      const avgRating = items.length > 0
        ? (items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1)
        : 0;

      return {
        ...product,
        averageRating: Number(avgRating),
        reviewCount: items.length,
      };
    })
  );

  return productsWithRatings;
}

// 사용 예시
const products = await getProductsWithRatings();
products.forEach(p => {
  console.log(`${p.name} - ${p.averageRating}점 (${p.reviewCount}개 리뷰)`);
});
```

***

## 에러 처리

| HTTP 상태 | 에러 코드 | 설명 | 해결 방법 |
|:---------:|----------|------|----------|
| 400 | `INVALID_INPUT` | 필수 필드 누락 또는 잘못된 값 | productId, orderId, rating(1~5), content 확인 |
| 401 | `UNAUTHORIZED` | 인증 실패 | Access Token 확인 |
| 404 | `NOT_FOUND` | 리뷰 없음 | 리뷰 ID 확인 |

***

## 참고 문서

- [데이터 삽입 (Insert)](../../../ko/database/03-insert.md) — 동적 테이블에 데이터 생성하기
- [데이터 목록 조회 (List)](../../../ko/database/05-list.md) — 필터, 정렬, 페이징
- [데이터 수정 (Update)](../../../ko/database/06-update.md) — 데이터 부분 수정 (PATCH)
- [앱에서 bkend 연동하기](../../../ko/getting-started/06-app-integration.md) — bkendFetch 헬퍼 상세

***

## 다음 단계

[06. AI 시나리오](06-ai-prompts.md)에서 AI를 활용한 상품 등록, 재고 분석, 리뷰 요약 등의 자동화 사례를 학습합니다.
