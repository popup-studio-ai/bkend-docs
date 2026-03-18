# 05. Implementing Reviews + Ratings

{% hint style="info" %}
💡 Create the reviews table, then implement review writing and star rating features for delivered products.
{% endhint %}

## Overview

In this chapter, you will implement the ability to leave reviews and ratings for purchased products.

- Create the `reviews` table
- Write reviews (1~5 star rating, review content)
- List reviews by product
- Calculate average rating
- Edit/delete reviews

### Prerequisites

| Item | Description | Reference |
|------|-------------|-----------|
| Auth setup | Access Token required | [01-auth](01-auth.md) |
| products table | Products to review must exist | [02-products](02-products.md) |
| orders table | There must be delivered orders | [04-orders](04-orders.md) |

***

## Step 1: Create the reviews Table

Create the `reviews` table to store review data.

### Table Schema

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `productId` | String | ✅ | Product ID (references products table) |
| `orderId` | String | ✅ | Order ID (references orders table) |
| `rating` | Number | ✅ | Star rating (1~5) |
| `content` | String | ✅ | Review content |

{% hint style="info" %}
💡 `createdBy` is automatically set to the review author's user ID.
{% endhint %}

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"I want to create a product review feature. I need to store which product the review is for, which order it was purchased from, a star rating (1~5), and the review content. Show me the structure before creating it."
{% endhint %}

{% hint style="info" %}
💡 Check that the AI suggests a structure similar to the one below.
{% endhint %}

| Field | Description | Example Value |
|-------|-------------|---------------|
| productId | Product being reviewed | (product ID) |
| orderId | Order it was purchased from | (order ID) |
| rating | Star rating (1~5) | 5 |
| content | Review content | "Great sound quality" |
{% endtab %}

{% tab title="Console" %}
1. Go to the **Tables** menu in the console.
2. Click **Add New Table**.
3. Enter `reviews` as the table name.
4. Add the fields as described in the schema above.
5. Click **Save** to create the table.

<!-- 📸 IMG: Reviews table creation screen in the console -->
{% endtab %}
{% endtabs %}

***

## Step 2: Write a Review

Write a review for a product from a delivered order.

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"Leave a 5-star review for the Premium Cotton T-Shirt. The content is 'The quality is really great! The cotton material is soft and the fit is comfortable.'"
{% endhint %}

The AI finds the most recent delivered order for that product and writes the review.
{% endtab %}

{% tab title="Console + REST API" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/reviews \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "productId": "product_abc123",
    "orderId": "order_xyz789",
    "rating": 5,
    "content": "The quality is really great! The cotton material is soft and the fit is comfortable."
  }'
```

**bkendFetch example:**

```javascript
const review = await bkendFetch('/v1/data/reviews', {
  method: 'POST',
  body: {
    productId: 'product_abc123',
    orderId: 'order_xyz789',
    rating: 5,
    content: 'The quality is really great! The cotton material is soft and the fit is comfortable.',
  },
});

console.log('Review created:', review);
```

**Response example:**

```json
{
  "id": "review_001",
  "productId": "product_abc123",
  "orderId": "order_xyz789",
  "rating": 5,
  "content": "The quality is really great! The cotton material is soft and the fit is comfortable.",
  "createdBy": "user_abc123",
  "createdAt": "2025-01-20T10:00:00Z"
}
```

{% hint style="warning" %}
⚠️ It is recommended to only allow reviews for orders with `delivered` status. Show the review button in the app only after checking the order status.
{% endhint %}
{% endtab %}
{% endtabs %}

***

## Step 3: List Reviews by Product

View reviews for a specific product.

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"Show me the reviews for the Premium Cotton T-Shirt."
{% endhint %}

The AI shows the reviews for that product sorted by newest first.

{% hint style="success" %}
✅ **You can also filter by rating:**

"Show me only the 5-star reviews for the Premium Cotton T-Shirt."
{% endhint %}
{% endtab %}

{% tab title="Console + REST API" %}

### All Reviews (Newest First)

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/reviews?andFilters=%7B%22productId%22%3A%22{product_id}%22%7D&sortBy=createdAt&sortDirection=desc" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### Filter by Rating (5-star only)

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/reviews?andFilters=%7B%22productId%22%3A%22{product_id}%22%2C%22rating%22%3A5%7D" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### Sort by Highest Rating

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/reviews?andFilters=%7B%22productId%22%3A%22{product_id}%22%7D&sortBy=rating&sortDirection=desc" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch example:**

```javascript
// Reviews by product (newest first)
const reviews = await bkendFetch(
  `/v1/data/reviews?andFilters=${encodeURIComponent(JSON.stringify({ productId }))}&sortBy=createdAt&sortDirection=desc`
);

reviews.items.forEach(review => {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  console.log(`${stars} ${review.content}`);
});
```

**Response example:**

```json
{
  "items": [
    {
      "id": "review_001",
      "productId": "product_abc123",
      "rating": 5,
      "content": "The quality is really great!",
      "createdBy": "user_abc123",
      "createdAt": "2025-01-20T10:00:00Z"
    },
    {
      "id": "review_002",
      "productId": "product_abc123",
      "rating": 4,
      "content": "Overall satisfied. The size runs a bit large though.",
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

## Step 4: Calculate Average Rating

Calculate and display the average rating for a product.

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"Summarize the reviews for the Premium Cotton T-Shirt. Tell me the average rating and how many reviews there are for each star level."
{% endhint %}

The AI queries the reviews and automatically calculates and shows the average rating and distribution.
{% endtab %}

{% tab title="Console + REST API" %}

Since bkend's data API does not have aggregation features, query the review list and calculate the average on the client side.

```javascript
// Get all reviews for the product
const reviews = await bkendFetch(
  `/v1/data/reviews?andFilters=${encodeURIComponent(JSON.stringify({ productId }))}&limit=50`
);

const items = reviews.items;

if (items.length === 0) {
  console.log('No reviews yet.');
} else {
  // Calculate average rating
  const totalRating = items.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = (totalRating / items.length).toFixed(1);

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  items.forEach(review => {
    distribution[review.rating]++;
  });

  console.log(`Average rating: ${averageRating} (${items.length} reviews)`);
  console.log('Rating distribution:');
  for (let i = 5; i >= 1; i--) {
    const count = distribution[i];
    const percent = ((count / items.length) * 100).toFixed(0);
    console.log(`  ${'★'.repeat(i)}${'☆'.repeat(5 - i)}: ${count} (${percent}%)`);
  }
}
```

**Output example:**

```text
Average rating: 4.5 (10 reviews)
Rating distribution:
  ★★★★★: 6 (60%)
  ★★★★☆: 3 (30%)
  ★★★☆☆: 1 (10%)
  ★★☆☆☆: 0 (0%)
  ★☆☆☆☆: 0 (0%)
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
💡 If there are many reviews, adjust the `limit` parameter to fetch all reviews. Use pagination to iterate through all reviews.
{% endhint %}

***

## Step 5: Edit a Review

Edit the rating or content of a review you wrote.

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"Change the rating on my t-shirt review to 4 stars, and update the content to 'Overall satisfied. The size runs a bit large though.'"
{% endhint %}

The AI updates the review's rating and content.
{% endtab %}

{% tab title="Console + REST API" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/data/reviews/{review_id} \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "rating": 4,
    "content": "Overall satisfied. The size runs a bit large though."
  }'
```

**bkendFetch example:**

```javascript
const updated = await bkendFetch(`/v1/data/reviews/${reviewId}`, {
  method: 'PATCH',
  body: {
    rating: 4,
    content: 'Overall satisfied. The size runs a bit large though.',
  },
});

console.log('Review updated:', updated);
```
{% endtab %}
{% endtabs %}

***

## Step 6: Delete a Review

Delete a review you wrote.

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"Delete my t-shirt review."
{% endhint %}

The AI deletes the review.
{% endtab %}

{% tab title="Console + REST API" %}
```bash
curl -X DELETE https://api-client.bkend.ai/v1/data/reviews/{review_id} \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**bkendFetch example:**

```javascript
await bkendFetch(`/v1/data/reviews/${reviewId}`, {
  method: 'DELETE',
});

console.log('Review deleted');
```
{% endtab %}
{% endtabs %}

***

## Product List with Ratings Pattern

A pattern for displaying average ratings alongside the product list in your app.

```javascript
// Combine product list with reviews for display
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

// Usage example
const products = await getProductsWithRatings();
products.forEach(p => {
  console.log(`${p.name} - ${p.averageRating} stars (${p.reviewCount} reviews)`);
});
```

***

## Error Handling

| HTTP Status | Error Code | Description | Solution |
|:-----------:|------------|-------------|----------|
| 400 | `data/validation-error` | Required field missing or invalid value | Check productId, orderId, rating(1~5), content |
| 401 | `common/authentication-required` | Authentication failed | Check Access Token |
| 404 | `data/not-found` | Review not found | Check review ID |

***

## Reference Docs

- [Insert Data](../../../database/03-insert.md) — Create data in dynamic tables
- [List Data](../../../database/05-list.md) — Filter, sort, paginate
- [Update Data](../../../database/06-update.md) — Partial data update (PATCH)
- [Integrating bkend in Your App](../../../getting-started/06-app-integration.md) — bkendFetch helper details

***

## Next Steps

Learn about AI-powered automation use cases including product registration, inventory analysis, and review summaries in [06. AI Scenarios](06-ai-prompts.md).
