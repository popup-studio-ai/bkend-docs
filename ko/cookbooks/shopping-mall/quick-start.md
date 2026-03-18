# 쇼핑몰 Quick Start

{% hint style="info" %}
💡 10분 만에 상품을 등록하고 조회하세요. 콘솔 + REST API 또는 MCP(AI 도구) 중 편한 방식을 선택하세요.
{% endhint %}

## 사전 준비

| 항목 | 확인 위치 | 설명 |
|------|----------|------|
| bkend 프로젝트 | 콘솔 → **프로젝트 설정** | Project ID 확인 |
| 이메일 인증 활성화 | 콘솔 → **인증** → **이메일** | 이메일 로그인 활성화 |
| API Key | 콘솔 → **MCP** → **새 토큰 생성** | REST API 접근용 |

***

## 1단계: products 테이블 만들기

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

{% tab title="콘솔 + REST API" %}
1. 콘솔 → **테이블** 메뉴로 이동하세요.
2. **새 테이블** 버튼을 클릭하세요.
3. 테이블 이름에 `products`를 입력하세요.
4. 다음 컬럼을 추가하세요.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `name` | String | 상품명 |
| `description` | String | 상품 설명 |
| `price` | Number | 가격 |
| `imageUrl` | String | 상품 이미지 URL |
| `category` | String | 카테고리 |
| `stock` | Number | 재고 수량 |
| `isActive` | Boolean | 판매 활성 여부 |

5. **저장**을 클릭하면 테이블이 생성됩니다.
{% endtab %}
{% endtabs %}

***

## 2단계: 상품 등록

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"새 상품을 등록해주세요. 프리미엄 면 티셔츠, 가격 29,000원, 카테고리는 의류, 재고 100개예요."
{% endhint %}

AI가 상품을 등록하고 결과를 보여줍니다.

```text
등록 완료:
- 프리미엄 면 티셔츠 — 29,000원, 의류, 재고 100개
```
{% endtab %}

{% tab title="콘솔 + REST API" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "name": "프리미엄 면 티셔츠",
    "description": "100% 순면 소재의 편안한 티셔츠",
    "price": 29000,
    "imageUrl": "https://example.com/tshirt.jpg",
    "category": "의류",
    "stock": 100,
    "isActive": true
  }'
```

**응답 예시:**

```json
{
  "id": "product_001",
  "name": "프리미엄 면 티셔츠",
  "price": 29000,
  "category": "의류",
  "stock": 100,
  "isActive": true,
  "createdBy": "user_123",
  "createdAt": "2025-01-15T10:00:00Z"
}
```
{% endtab %}
{% endtabs %}

***

## 3단계: 상품 조회

{% tabs %}
{% tab title="MCP (AI 도구)" %}
{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"등록된 상품 목록 보여줘."
{% endhint %}

AI가 products 테이블에서 데이터를 조회하여 결과를 보여줍니다.

```text
등록된 상품 목록:
1. 프리미엄 면 티셔츠 — 29,000원 (재고 100개)
```
{% endtab %}

{% tab title="콘솔 + REST API" %}
**전체 상품 목록 조회:**

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**카테고리별 필터링:**

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products?andFilters=%7B%22category%22%3A%22%EC%9D%98%EB%A5%98%22%7D" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**응답 예시:**

```json
{
  "items": [
    {
      "id": "product_001",
      "name": "프리미엄 면 티셔츠",
      "price": 29000,
      "category": "의류",
      "stock": 100,
      "isActive": true
    }
  ],
  "pagination": {
    "total": 1,
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

## 완료

축하합니다. 10분 만에 쇼핑몰의 상품 등록과 조회를 완료했습니다.

### 배운 내용

| 기능 | REST API 엔드포인트 | 설명 |
|------|---------------------|------|
| 상품 등록 | `POST /v1/data/products` | 새 상품 데이터 생성 |
| 상품 조회 | `GET /v1/data/products` | 상품 목록 조회 및 필터링 |

***

## 참고 문서

- [shopping-mall-web 예제 프로젝트](../../../examples/shopping-mall-web/) — 이 쿡북을 Next.js로 구현한 전체 코드

***

## 다음 단계

- [Full Guide](full-guide/00-overview.md)에서 전체 쇼핑몰 기능을 단계별로 구현하세요.
- [주문 관리](full-guide/04-orders.md) — 장바구니 → 주문 → 상태 추적
- [리뷰 시스템](full-guide/05-reviews.md) — 별점 + 리뷰 작성
- [AI 시나리오](full-guide/06-ai-prompts.md) — AI로 쇼핑몰 운영 자동화
