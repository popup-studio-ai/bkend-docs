# 03. 장바구니 구현하기

{% hint style="info" %}
💡 장바구니 테이블을 생성하고, 상품 담기/수량 변경/삭제 기능을 구현하세요.
{% endhint %}

## 개요

이 장에서는 사용자가 상품을 장바구니에 담고 관리할 수 있는 기능을 구현합니다.

- `carts` 테이블 생성
- 장바구니에 상품 추가
- 내 장바구니 목록 조회
- 수량 변경
- 장바구니 항목 삭제
- 장바구니 비우기

### 선행 조건

| 항목 | 설명 | 참조 |
|------|------|------|
| 인증 설정 | Access Token 필요 | [01-auth](01-auth.md) |
| products 테이블 | 상품이 등록되어 있어야 합니다 | [02-products](02-products.md) |

***

## 1단계: carts 테이블 생성

장바구니 데이터를 저장할 `carts` 테이블을 생성하세요.

### 테이블 스키마

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `productId` | String | ✅ | 상품 ID (products 테이블 참조) |
| `quantity` | Number | ✅ | 수량 (1 이상) |

{% hint style="info" %}
💡 `createdBy` 필드가 자동으로 현재 로그인한 사용자의 ID로 설정됩니다. 별도의 `userId` 필드 없이도 사용자별 장바구니를 관리할 수 있습니다.
{% endhint %}

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"장바구니 기능을 만들고 싶어요. 어떤 상품인지, 몇 개 담았는지를 저장할 수 있게 해주세요. 만들기 전에 어떤 구조로 만들지 먼저 보여주세요."
{% endhint %}

{% hint style="info" %}
💡 AI가 아래와 비슷한 구조를 제안하는지 확인하세요.
{% endhint %}

| 필드 | 설명 | 예시 값 |
|------|------|---------|
| productId | 어떤 상품인지 | (상품 ID) |
| quantity | 수량 | 2 |
{% endtab %}

{% tab title="콘솔" %}
1. 콘솔에서 **테이블** 메뉴로 이동하세요.
2. **새 테이블 추가**를 클릭하세요.
3. 테이블 이름에 `carts`를 입력하세요.
4. 위 스키마대로 필드를 추가하세요.
5. **저장**을 클릭하면 테이블이 생성됩니다.

<!-- 📸 IMG: 콘솔에서 carts 테이블 생성 화면 -->
{% endtab %}
{% endtabs %}

***

## 2단계: 장바구니에 상품 추가

상품을 장바구니에 추가하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"프리미엄 면 티셔츠를 장바구니에 2개 담아주세요."
{% endhint %}

AI가 해당 상품을 장바구니에 추가합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/carts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "productId": "product_abc123",
    "quantity": 2
  }'
```

**bkendFetch 예시:**

```javascript
const cartItem = await bkendFetch('/v1/data/carts', {
  method: 'POST',
  body: JSON.stringify({
    productId: 'product_abc123',
    quantity: 2,
  }),
});

console.log('장바구니에 추가:', cartItem);
```

**응답 예시:**

```json
{
  "id": "cart_item_001",
  "productId": "product_abc123",
  "quantity": 2,
  "createdBy": "user_abc123",
  "createdAt": "2025-01-15T11:00:00Z"
}
```
{% endtab %}
{% endtabs %}

***

## 3단계: 장바구니 목록 조회

내 장바구니에 담긴 상품을 확인하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"내 장바구니에 뭐가 있는지 보여주세요."
{% endhint %}

AI가 장바구니에 담긴 상품과 수량을 보여줍니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X GET "https://api-client.bkend.ai/v1/data/carts" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch 예시:**

```javascript
const cart = await bkendFetch('/v1/data/carts');

// 장바구니 항목 출력
cart.items.forEach(item => {
  console.log(`상품: ${item.productId}, 수량: ${item.quantity}`);
});
```

**응답 예시:**

```json
{
  "items": [
    {
      "id": "cart_item_001",
      "productId": "product_abc123",
      "quantity": 2,
      "createdBy": "user_abc123",
      "createdAt": "2025-01-15T11:00:00Z"
    },
    {
      "id": "cart_item_002",
      "productId": "product_def456",
      "quantity": 1,
      "createdBy": "user_abc123",
      "createdAt": "2025-01-15T11:05:00Z"
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

{% hint style="info" %}
💡 인증된 사용자의 장바구니만 조회됩니다. Access Token에 포함된 사용자 정보를 기반으로 자동 필터링됩니다.
{% endhint %}
{% endtab %}
{% endtabs %}

***

## 4단계: 수량 변경

장바구니에 담긴 상품의 수량을 변경하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"장바구니에 있는 프리미엄 면 티셔츠 수량을 3개로 바꿔주세요."
{% endhint %}

AI가 장바구니 수량을 변경합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/data/carts/{cart_item_id} \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "quantity": 3
  }'
```

**bkendFetch 예시:**

```javascript
const updated = await bkendFetch(`/v1/data/carts/${cartItemId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    quantity: 3,
  }),
});

console.log('수량 변경 완료:', updated);
```
{% endtab %}
{% endtabs %}

***

## 5단계: 장바구니 항목 삭제

특정 상품을 장바구니에서 제거하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"장바구니에서 프리미엄 면 티셔츠를 빼주세요."
{% endhint %}

AI가 장바구니에서 해당 상품을 제거합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/data/carts/{cart_item_id} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch 예시:**

```javascript
await bkendFetch(`/v1/data/carts/${cartItemId}`, {
  method: 'DELETE',
});

console.log('장바구니에서 제거 완료');
```
{% endtab %}
{% endtabs %}

***

## 6단계: 장바구니 비우기

장바구니의 모든 항목을 한 번에 삭제하려면, 목록을 조회한 후 각 항목을 개별 삭제합니다.

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"내 장바구니를 전부 비워주세요."
{% endhint %}

AI가 장바구니에 담긴 모든 상품을 제거합니다.
{% endtab %}

{% tab title="콘솔 + REST API" %}
**bkendFetch 예시:**

```javascript
// 1. 장바구니 전체 조회
const cart = await bkendFetch('/v1/data/carts');

// 2. 각 항목 삭제
const deletePromises = cart.items.map(item =>
  bkendFetch(`/v1/data/carts/${item.id}`, { method: 'DELETE' })
);

await Promise.all(deletePromises);
console.log('장바구니 비우기 완료');
```

{% hint style="info" %}
💡 bkend의 데이터 API는 개별 삭제 방식입니다. 여러 항목을 삭제하려면 반복 호출하세요.
{% endhint %}
{% endtab %}
{% endtabs %}

***

## 장바구니 → 주문 변환 흐름

장바구니에 담긴 상품은 다음 장에서 주문으로 변환됩니다.

```mermaid
flowchart LR
    A[상품 탐색] --> B[장바구니 담기]
    B --> C[수량 조정]
    C --> D[주문 생성]
    D --> E[장바구니 비우기]

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#fff3e0
    style D fill:#e8f5e9
    style E fill:#fce4ec
```

***

## 에러 처리

| HTTP 상태 | 에러 코드 | 설명 | 해결 방법 |
|:---------:|----------|------|----------|
| 400 | `INVALID_INPUT` | 필수 필드 누락 | productId, quantity 확인 |
| 401 | `UNAUTHORIZED` | 인증 실패 | Access Token 확인 |
| 404 | `NOT_FOUND` | 장바구니 항목 없음 | 장바구니 항목 ID 확인 |

***

## 참고 문서

- [데이터 삽입 (Insert)](../../../ko/database/03-insert.md) — 동적 테이블에 데이터 생성하기
- [데이터 목록 조회 (List)](../../../ko/database/05-list.md) — 필터, 정렬, 페이징
- [데이터 삭제 (Delete)](../../../ko/database/07-delete.md) — 데이터 삭제 방법

***

## 다음 단계

[04. 주문 관리](04-orders.md)에서 장바구니의 상품을 주문으로 변환하고 주문 상태를 관리합니다.
