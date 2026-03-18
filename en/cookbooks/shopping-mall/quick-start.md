# Shopping Mall Quick Start

{% hint style="info" %}
💡 Register and browse products in just 10 minutes. Choose between Console + REST API or MCP (AI Tools) — whichever you prefer.
{% endhint %}

## Prerequisites

| Item | Where to Check | Description |
|------|---------------|-------------|
| bkend Project | Console → **Project Settings** | Check Project ID |
| Email Auth Enabled | Console → **Auth** → **Email** | Email sign in enabled |
| API Key | Console → **MCP** → **Create New Token** | For REST API access |

***

## Step 1: Create the products Table

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"I want to manage products for a shopping mall. I need to store product name, description, price, category, stock quantity, product image, and whether it's on sale. Show me the structure before creating it."
{% endhint %}

{% hint style="info" %}
💡 Check that the AI suggests a structure similar to the one below.
{% endhint %}

| Field | Description | Example Value |
|-------|-------------|---------------|
| name | Product name | "Premium Cotton T-Shirt" |
| description | Product description | "Soft 100% cotton..." |
| price | Price | 29000 |
| category | Category | "Clothing" |
| stock | Stock quantity | 100 |
| imageUrl | Product image URL | (linked after upload) |
| isActive | On sale or not | true / false |
{% endtab %}

{% tab title="Console + REST API" %}
1. Go to the **Tables** menu in the console.
2. Click the **New Table** button.
3. Enter `products` as the table name.
4. Add the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `name` | String | Product name |
| `description` | String | Product description |
| `price` | Number | Price |
| `imageUrl` | String | Product image URL |
| `category` | String | Category |
| `stock` | Number | Stock quantity |
| `isActive` | Boolean | Whether on sale |

5. Click **Save** to create the table.
{% endtab %}
{% endtabs %}

***

## Step 2: Register a Product

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"Register a new product. Premium Cotton T-Shirt, price 29,000 won, category is Clothing, stock 100."
{% endhint %}

The AI registers the product and shows you the result.

```text
Registration complete:
- Premium Cotton T-Shirt — 29,000 won, Clothing, stock 100
```
{% endtab %}

{% tab title="Console + REST API" %}
```bash
curl -X POST https://api-client.bkend.ai/v1/data/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "name": "Premium Cotton T-Shirt",
    "description": "Comfortable t-shirt made of 100% pure cotton",
    "price": 29000,
    "imageUrl": "https://example.com/tshirt.jpg",
    "category": "Clothing",
    "stock": 100,
    "isActive": true
  }'
```

**Response example:**

```json
{
  "id": "product_001",
  "name": "Premium Cotton T-Shirt",
  "price": 29000,
  "category": "Clothing",
  "stock": 100,
  "isActive": true,
  "createdBy": "user_123",
  "createdAt": "2025-01-15T10:00:00Z"
}
```
{% endtab %}
{% endtabs %}

***

## Step 3: Browse Products

{% tabs %}
{% tab title="MCP (AI Tools)" %}
{% hint style="success" %}
✅ **Try saying this to AI**

"Show me the list of registered products."
{% endhint %}

The AI queries the products table and shows you the results.

```text
Registered products:
1. Premium Cotton T-Shirt — 29,000 won (stock: 100)
```
{% endtab %}

{% tab title="Console + REST API" %}
**List all products:**

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Filter by category:**

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/products?andFilters=%7B%22category%22%3A%22Clothing%22%7D" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response example:**

```json
{
  "items": [
    {
      "id": "product_001",
      "name": "Premium Cotton T-Shirt",
      "price": 29000,
      "category": "Clothing",
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

## Done

Congratulations! You've completed product registration and browsing for your shopping mall in just 10 minutes.

### What You Learned

| Feature | REST API Endpoint | Description |
|---------|-------------------|-------------|
| Register product | `POST /v1/data/products` | Create new product data |
| Browse products | `GET /v1/data/products` | List and filter products |

***

## Reference Docs

- [shopping-mall-web Example Project](../../../examples/shopping-mall-web/) — Full code implementing this cookbook in Next.js

***

## Next Steps

- Implement the full shopping mall features step by step in the [Full Guide](full-guide/00-overview.md).
- [Order Management](full-guide/04-orders.md) — Cart → Order → Status tracking
- [Review System](full-guide/05-reviews.md) — Ratings + reviews
- [AI Scenarios](full-guide/06-ai-prompts.md) — Automate shopping mall operations with AI
