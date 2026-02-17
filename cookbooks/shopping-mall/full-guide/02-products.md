# 02. 상품 카탈로그 구현하기

{% hint style="info" %}
💡 상품 테이블을 생성하고, 상품 등록/조회/수정/삭제와 이미지 업로드까지 구현하세요.
{% endhint %}

## 개요

이 장에서는 쇼핑몰의 핵심인 상품 카탈로그를 구현합니다.

- `products` 테이블 생성
- 상품 등록 (이름, 설명, 가격, 카테고리, 재고)
- 상품 이미지 업로드 (Presigned URL)
- 상품 목록 조회 (카테고리 필터, 가격 범위, 정렬)
- 상품 상세 조회
- 상품 수정/삭제
- 재고 관리

### 선행 조건

| 항목 | 설명 | 참조 |
|------|------|------|
| 인증 설정 | Access Token 필요 | [01-auth](01-auth.md) |
| bkendFetch 헬퍼 | API 호출 설정 완료 | [01-auth](01-auth.md) |

***

## 1단계: products 테이블 생성

상품 데이터를 저장할 `products` 테이블을 생성하세요.

### 테이블 스키마

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `name` | String | ✅ | 상품명 |
| `description` | String | ✅ | 상품 설명 |
| `price` | Number | ✅ | 가격 (원) |
| `category` | String | ✅ | 카테고리 (예: 의류, 전자기기, 식품) |
| `stock` | Number | ✅ | 재고 수량 |
| `imageUrl` | String | - | 상품 대표 이미지 URL |
| `isActive` | Boolean | - | 판매 활성 여부 (기본: true) |

{% hint style="info" %}
💡 `id`, `createdBy`, `createdAt`, `updatedAt`은 bkend가 자동 생성하는 시스템 필드입니다. 직접 입력할 필요가 없습니다.
{% endhint %}

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"쇼핑몰에서 상품을 관리하고 싶어요. 상품 이름, 설명, 가격, 카테고리, 재고 수량, 상품 사진, 판매 여부를 저장할 수 있게 해주세요. 만들기 전에 어떤 구조로 만들지 먼저 보여주세요."
{% endhint %}

{% hint style="info" %}
💡 AI가 아래와 비슷한 구조를 제안하는지 확인하세요.
{% endhint %}

| 필드 | 설명 | 예시 값 |
|------|------|---------|
| name | 상품 이름 | "프리미엄 면 티셔츠" |
| description | 상품 설명 | "부드러운 100% 면 소재..." |
| price | 가격 | 29000 |
| category | 카테고리 | "의류" |
| stock | 재고 수량 | 100 |
| imageUrl | 상품 사진 URL | (업로드 후 연결) |
| isActive | 판매 중 여부 | true / false |
{% endtab %}

{% tab title="콘솔" %}
1. 콘솔에 로그인하세요.
2. **테이블** 메뉴로 이동하세요.
3. **새 테이블 추가**를 클릭하세요.
4. 테이블 이름에 `products`를 입력하세요.
5. 위 스키마대로 필드를 추가하세요.
6. **저장**을 클릭하면 테이블이 생성됩니다.

<!-- 📸 IMG: 콘솔에서 products 테이블 생성 화면 -->
{% endtab %}
{% endtabs %}

***

## 2단계: 상품 등록

테이블이 생성되었으면 첫 번째 상품을 등록하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"새 상품을 등록해주세요. 프리미엄 면 티셔츠, 부드러운 100% 면 소재 기본 티셔츠예요. 가격 29,000원, 카테고리는 의류, 재고 100개입니다."
{% endhint %}

AI가 상품을 등록하고 결과를 알려줍니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "name": "프리미엄 면 티셔츠",
    "description": "부드러운 100% 면 소재의 기본 티셔츠입니다.",
    "price": 29000,
    "category": "의류",
    "stock": 100,
    "isActive": true
  }'
```

**bkendFetch 예시:**

```javascript
const product = await bkendFetch('/v1/data/products', {
  method: 'POST',
  body: JSON.stringify({
    name: '프리미엄 면 티셔츠',
    description: '부드러운 100% 면 소재의 기본 티셔츠입니다.',
    price: 29000,
    category: '의류',
    stock: 100,
    isActive: true,
  }),
});

console.log('등록된 상품:', product);
```

**응답 예시:**

```json
{
  "id": "product_abc123",
  "name": "프리미엄 면 티셔츠",
  "description": "부드러운 100% 면 소재의 기본 티셔츠입니다.",
  "price": 29000,
  "category": "의류",
  "stock": 100,
  "isActive": true,
  "createdBy": "user_abc123",
  "createdAt": "2025-01-15T10:00:00Z"
}
```
{% endtab %}
{% endtabs %}

***

## 3단계: 상품 이미지 업로드

상품에 이미지를 추가하려면 Presigned URL을 발급받아 파일을 업로드한 후, 반환된 URL을 상품에 연결하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠에 상품 사진을 추가하고 싶어요. 이미지 파일을 업로드해주세요."
{% endhint %}

AI가 이미지를 업로드하고, 상품 사진을 자동으로 연결합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}

### 3-1. Presigned URL 발급

```bash
curl -X POST https://api-client.bkend.ai/v1/files/presigned-url \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "filename": "premium-tshirt.jpg",
    "contentType": "image/jpeg"
  }'
```

**응답 예시:**

```json
{
  "url": "https://storage.bkend.ai/..."
}
```

### 3-2. 파일 업로드

```bash
curl -X PUT "{url}" \
  -H "Content-Type: image/jpeg" \
  --data-binary @premium-tshirt.jpg
```

**bkendFetch 예시:**

```javascript
// 1. Presigned URL 발급
const presigned = await bkendFetch('/v1/files/presigned-url', {
  method: 'POST',
  body: JSON.stringify({
    filename: 'premium-tshirt.jpg',
    contentType: 'image/jpeg',
  }),
});

// 2. 파일 업로드
await fetch(presigned.url, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/jpeg' },
  body: imageFile, // File 객체
});
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
💡 Presigned URL은 발급 후 1시간 동안 유효합니다. 만료되면 다시 발급받으세요.
{% endhint %}

***

## 4단계: 상품 목록 조회

등록된 상품을 다양한 조건으로 조회할 수 있습니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"의류 카테고리 상품 중에서 5만원 이하인 것만 가격이 낮은 순서로 보여주세요."
{% endhint %}

AI가 조건에 맞는 상품 목록을 조회하여 보여줍니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}

### 전체 상품 목록

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### 카테고리 필터

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products?andFilters=%7B%22category%22%3A%22%EC%9D%98%EB%A5%98%22%7D" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### 정렬 (가격 낮은순)

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products?sortBy=price&sortDirection=asc" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch 예시:**

```javascript
// 카테고리별 상품 목록
const products = await bkendFetch(
  `/v1/data/products?andFilters=${encodeURIComponent(JSON.stringify({ category: "의류" }))}&sortBy=price&sortDirection=asc`
);

console.log('상품 목록:', products.items);
console.log('총 개수:', products.pagination.total);
```

**응답 예시:**

```json
{
  "items": [
    {
      "id": "product_abc123",
      "name": "프리미엄 면 티셔츠",
      "price": 29000,
      "category": "의류",
      "stock": 100,
      "imageUrl": "https://cdn.bkend.ai/files/premium-tshirt.jpg",
      "isActive": true
    },
    {
      "id": "product_def456",
      "name": "슬림핏 청바지",
      "price": 49000,
      "category": "의류",
      "stock": 50,
      "isActive": true
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

## 5단계: 상품 상세 조회

특정 상품의 상세 정보를 조회하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠 상세 정보를 보여주세요."
{% endhint %}

AI가 해당 상품의 가격, 재고, 카테고리 등 전체 정보를 보여줍니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X GET https://api-client.bkend.ai/v1/data/products/{product_id} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch 예시:**

```javascript
const product = await bkendFetch(`/v1/data/products/${productId}`);
console.log('상품 상세:', product);
```

**응답 예시:**

```json
{
  "id": "product_abc123",
  "name": "프리미엄 면 티셔츠",
  "description": "부드러운 100% 면 소재의 기본 티셔츠입니다.",
  "price": 29000,
  "category": "의류",
  "stock": 100,
  "imageUrl": "https://cdn.bkend.ai/files/premium-tshirt.jpg",
  "isActive": true,
  "createdBy": "user_abc123",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```
{% endtab %}
{% endtabs %}

***

## 6단계: 상품 수정

가격, 설명, 재고 등을 부분 수정할 수 있습니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠 가격을 25,000원으로 내려주세요. 설명도 '시즌 할인! 부드러운 100% 면 소재 티셔츠.'로 바꿔주세요."
{% endhint %}

AI가 해당 상품의 가격과 설명을 수정합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/data/products/{product_id} \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "price": 25000,
    "description": "시즌 할인! 부드러운 100% 면 소재 티셔츠."
  }'
```

**bkendFetch 예시:**

```javascript
const updated = await bkendFetch(`/v1/data/products/${productId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    price: 25000,
    description: '시즌 할인! 부드러운 100% 면 소재 티셔츠.',
  }),
});

console.log('수정 완료:', updated);
```
{% endtab %}
{% endtabs %}

***

## 7단계: 상품 삭제

더 이상 판매하지 않는 상품을 삭제하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠 상품을 삭제해주세요."
{% endhint %}

AI가 해당 상품을 삭제합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/data/products/{product_id} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch 예시:**

```javascript
await bkendFetch(`/v1/data/products/${productId}`, {
  method: 'DELETE',
});

console.log('상품 삭제 완료');
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
⚠️ 삭제된 상품은 복구할 수 없습니다. 판매를 일시 중단하려면 `isActive`를 `false`로 변경하세요.
{% endhint %}

***

## 8단계: 재고 관리

주문이 들어오면 재고를 차감하고, 재입고 시 재고를 추가합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"재고가 10개 이하인 상품 목록을 보여주세요."
{% endhint %}

AI가 판매 중인 상품 중 재고가 부족한 상품을 찾아 보여줍니다.

{% hint style="success" %}
✅ **재입고 시:**

"프리미엄 면 티셔츠 재고를 150개로 늘려주세요."
{% endhint %}
{% endtab %}

{% tab title="콘솔 + REST API" %}

### 재고 업데이트

```bash
curl -X PATCH https://api-client.bkend.ai/v1/data/products/{product_id} \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "stock": 80
  }'
```

### 재고 부족 상품 조회

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products?andFilters=%7B%22isActive%22%3Atrue%7D" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch 예시:**

```javascript
// 활성 상품 조회 후 클라이언트에서 재고 필터링
const activeProducts = await bkendFetch(
  `/v1/data/products?andFilters=${encodeURIComponent(JSON.stringify({ isActive: true }))}`
);

const lowStock = activeProducts.items.filter(p => p.stock <= 10);
console.log('재고 부족 상품:', lowStock);
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
💡 재고가 0이 되면 `isActive`를 `false`로 변경하여 품절 표시를 하는 것이 좋습니다.
{% endhint %}

***

## 에러 처리

| HTTP 상태 | 에러 코드 | 설명 | 해결 방법 |
|:---------:|----------|------|----------|
| 400 | `INVALID_INPUT` | 필수 필드 누락 | name, description, price, category, stock 확인 |
| 401 | `UNAUTHORIZED` | 인증 실패 | Access Token 확인 |
| 404 | `NOT_FOUND` | 상품 없음 | 상품 ID 확인 |
| 413 | `FILE_TOO_LARGE` | 파일 크기 초과 | 이미지 크기 줄이기 |

***

## 참고 문서

- [테이블 관리](../../../ko/console/07-table-management.md) — 콘솔에서 테이블 생성/관리
- [데이터 삽입 (Insert)](../../../ko/database/03-insert.md) — 동적 테이블에 데이터 생성하기
- [데이터 조회 (List)](../../../ko/database/05-list.md) — 필터, 정렬, 페이징
- [파일 업로드](../../../ko/storage/02-upload-single.md) — Presigned URL 업로드 가이드

***

## 다음 단계

[03. 장바구니](03-cart.md)에서 장바구니 기능을 구현합니다.
