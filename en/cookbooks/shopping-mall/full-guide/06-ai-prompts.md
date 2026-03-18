# 06. AI Prompt Collection

{% hint style="info" %}
💡 A prompt reference for requesting each feature of the shopping mall project from AI in natural language. Use these prompts as-is in an AI client with MCP connected.
{% endhint %}

## What You'll Learn in This Chapter

- Table creation prompts (including structure confirmation)
- Product registration/edit/delete/inventory management prompts
- Shopping cart management prompts
- Order creation and status change prompts
- Review writing and rating management prompts
- Complex scenarios combining multiple features

***

## Design Reference

AI may suggest different structures each time. Use the tables below to verify that the structure the AI proposes is appropriate.

### products

| Field | Description | Example Value |
|-------|-------------|---------------|
| name | Product name | "Wireless Earbuds" |
| description | Product description | "Bluetooth 5.0..." |
| price | Price | 29900 |
| category | Category | "Electronics" |
| stock | Stock quantity | 50 |
| imageUrl | Product image URL | (linked after upload) |
| isActive | On sale or not | true / false |

### carts

| Field | Description | Example Value |
|-------|-------------|---------------|
| productId | Which product | (product ID) |
| quantity | Quantity | 2 |

### orders

| Field | Description | Example Value |
|-------|-------------|---------------|
| items | List of ordered products | [{product name, price, quantity}] |
| totalPrice | Total amount | 59800 |
| status | Order status | "pending" / "confirmed" / "shipped" / "delivered" |
| shippingAddress | Shipping address | "123 Gangnam-daero, Seoul" |
| recipientName | Recipient name | "Kim Customer" |
| recipientPhone | Recipient phone | "010-1234-5678" |

### reviews

| Field | Description | Example Value |
|-------|-------------|---------------|
| productId | Product being reviewed | (product ID) |
| orderId | Order it was purchased from | (order ID) |
| rating | Star rating (1~5) | 5 |
| content | Review content | "Great sound quality" |

### Order Status Mapping

| Expression | Stored Value |
|------------|-------------|
| Order pending | pending |
| Order confirmed | confirmed |
| Shipping | shipped |
| Delivered | delivered |

***

## Creating Tables

{% hint style="success" %}
✅ **Try saying this to AI**

"I want to manage products for a shopping mall. I need to store product name, description, price, category, stock quantity, product image, and whether it's on sale. Show me the structure before creating it."
{% endhint %}

{% hint style="info" %}
💡 When the AI shows the structure, compare it with the [Design Reference](#design-reference) above. If it looks good, just say "Yes, create it."
{% endhint %}

{% hint style="success" %}
✅ **Request the remaining tables the same way**

- "I want to create a shopping cart feature. I need to store which product and how many were added. Show me the structure before creating it."
- "I want to create an order management feature. I need to store the list of ordered products, total amount, order status, shipping address, and recipient info. Show me the structure before creating it."
- "I want to create a product review feature. I need to store which product the review is for, star rating (1~5), and review content. Show me the structure before creating it."
{% endhint %}

### Verify Structure

{% hint style="success" %}
✅ **Try saying this to AI**

"Show me the structure of how product data is stored."
{% endhint %}

{% hint style="success" %}
✅ **Check all tables**

"Show me all the data stores that have been created."
{% endhint %}

***

## Product Management

### Register Product

{% hint style="success" %}
✅ **Try saying this to AI**

"Register a new product. Premium Cotton T-Shirt, a soft 100% cotton basic t-shirt. Price 29,000 won, category is Clothing, stock 100."
{% endhint %}

{% hint style="success" %}
✅ **Register products in various categories**

- "Register Bluetooth Earbuds in the Electronics category. Price 45,000 won, stock 200."
- "Register Organic Honey 1kg in the Food category. Price 32,000 won, stock 50."
{% endhint %}

### Edit Product

{% hint style="success" %}
✅ **Try saying this to AI**

"Lower the price of Premium Cotton T-Shirt to 25,000 won."
{% endhint %}

{% hint style="success" %}
✅ **Suspend/resume sales**

- "Suspend sales of the Premium Cotton T-Shirt."
- "Resume sales of the Premium Cotton T-Shirt."
{% endhint %}

### Delete Product

{% hint style="success" %}
✅ **Try saying this to AI**

"Delete the Premium Cotton T-Shirt product."
{% endhint %}

{% hint style="warning" %}
⚠️ Deleted products cannot be recovered. To temporarily suspend sales, say "Suspend sales" instead.
{% endhint %}

### Upload Product Image

{% hint style="success" %}
✅ **Try saying this to AI**

"I want to add a product image to the Premium Cotton T-Shirt. Upload the image file."
{% endhint %}

The AI uploads the image and automatically links it to the product.

### Inventory Management

{% hint style="success" %}
✅ **Try saying this to AI**

- "Show me products with 10 or fewer items in stock."
- "Increase the stock of Premium Cotton T-Shirt to 150."
{% endhint %}

### Browse by Category

{% hint style="success" %}
✅ **Try saying this to AI**

- "Show me only products in the Clothing category."
- "Show me Electronics products under 50,000 won, sorted by lowest price first."
- "Show me all products currently on sale."
{% endhint %}

***

## Shopping Cart

### Add to Cart

{% hint style="success" %}
✅ **Try saying this to AI**

"Add 2 Premium Cotton T-Shirts to my cart."
{% endhint %}

{% hint style="success" %}
✅ **Add multiple products**

"Add 1 Bluetooth Earbuds and 2 Organic Honey to my cart."
{% endhint %}

### Change Quantity

{% hint style="success" %}
✅ **Try saying this to AI**

"Change the quantity of Premium Cotton T-Shirt in my cart to 3."
{% endhint %}

### Remove Cart Item

{% hint style="success" %}
✅ **Try saying this to AI**

"Remove the Premium Cotton T-Shirt from my cart."
{% endhint %}

### Clear Cart

{% hint style="success" %}
✅ **Try saying this to AI**

"Clear my entire cart."
{% endhint %}

The AI removes all products from the cart.

### Check Cart

{% hint style="success" %}
✅ **Try saying this to AI**

"Show me what's in my cart."
{% endhint %}

***

## Order Management

### Place Order (Cart -> Order)

{% hint style="success" %}
✅ **Try saying this to AI**

"Place an order with the products in my cart. Shipping address is 45 Banpo-daero, Seocho-gu, Seoul, recipient Kim Customer, phone 010-1234-5678. Clear the cart after ordering."
{% endhint %}

The AI automatically handles the following:

1. Check cart
2. Verify product prices and calculate total amount
3. Create order
4. Clear cart

### Change Order Status

{% hint style="success" %}
✅ **Try saying this to AI**

- "Change the most recent order status to 'confirmed'."
- "Change the most recent order status to 'shipped'."
- "Change the most recent order status to 'delivered'."
{% endhint %}

{% hint style="warning" %}
⚠️ Order status can only be changed in sequence. You cannot skip from 'pending' directly to 'delivered'.
{% endhint %}

### View Orders

{% hint style="success" %}
✅ **Try saying this to AI**

- "Show me my order history in most recent order."
- "Show me only orders that are being shipped."
- "Show me the details of my most recent order."
{% endhint %}

***

## Reviews

### Write a Review

{% hint style="success" %}
✅ **Try saying this to AI**

"Leave a 5-star review for the Premium Cotton T-Shirt. The content is 'The quality is really great! The cotton material is soft and the fit is comfortable.'"
{% endhint %}

{% hint style="info" %}
💡 It is recommended to only write reviews for delivered orders.
{% endhint %}

### Edit Rating

{% hint style="success" %}
✅ **Try saying this to AI**

"Change the rating on my t-shirt review to 4 stars, and update the content to 'Overall satisfied. The size runs a bit large though.'"
{% endhint %}

### View Reviews by Product

{% hint style="success" %}
✅ **Try saying this to AI**

- "Show me the reviews for the Premium Cotton T-Shirt."
- "Show me only the 5-star reviews for the Premium Cotton T-Shirt."
{% endhint %}

### Check Average Rating

{% hint style="success" %}
✅ **Try saying this to AI**

"Summarize the reviews for the Premium Cotton T-Shirt. Tell me the average rating and how many reviews there are for each star level."
{% endhint %}

The AI queries the reviews and automatically calculates and shows the average rating and distribution.

***

## Complex Scenarios

Prompt examples that combine multiple features. The AI processes multiple tasks sequentially.

### Scenario 1: Register New Product + Upload Image

{% hint style="success" %}
✅ **Try saying this to AI**

"Register a new product in the Electronics category. Product name is 'Wireless Charging Pad', price 35,000 won, stock 50. Upload a product image too."
{% endhint %}

The AI registers the product, then uploads the image and links it automatically.

### Scenario 2: Cart -> Order -> Clear Cart

{% hint style="success" %}
✅ **Try saying this to AI**

"Place an order with the products in my cart. Shipping address is 100 Haeundae-ro, Haeundae-gu, Busan. Clear the cart after ordering."
{% endhint %}

The AI processes cart check, total calculation, order creation, and cart clearing in sequence.

### Scenario 3: Write Review After Order Delivery

{% hint style="success" %}
✅ **Try saying this to AI**

"Leave a 5-star review for the Premium Cotton T-Shirt from my most recently delivered order. The content is 'Better than expected. Would buy again.'"
{% endhint %}

The AI finds the delivered order and writes a review for the corresponding product.

### Scenario 4: Check Low Stock Products + Suspend Sales

{% hint style="success" %}
✅ **Try saying this to AI**

"Find products with 5 or fewer items in stock and suspend sales for all of them."
{% endhint %}

The AI queries low-stock products and then suspends sales for each one.

### Scenario 5: Daily Operations Report

{% hint style="success" %}
✅ **Try saying this to AI**

"Summarize today's order status. Tell me the count by status and total revenue."
{% endhint %}

The AI queries today's orders and presents a breakdown by status and revenue summary.

### Scenario 6: Product Review Analysis

{% hint style="success" %}
✅ **Try saying this to AI**

"Analyze the recent reviews for the Premium Cotton T-Shirt and summarize what customers like, what they find disappointing, and what could be improved."
{% endhint %}

The AI queries the reviews and presents positive/negative opinions and improvement suggestions.

***

## Prompt Writing Tips

| Tip | Description | Example |
|-----|-------------|---------|
| Be specific | Specify product name, price, quantity, etc. | "Register a t-shirt" -> "Register Premium Cotton T-Shirt at 29,000 won" |
| Include conditions | Express conditions in natural language | "stock 10 or less, clothing only" |
| Chain steps | Request multiple tasks in one sentence | "Place an order with my cart and clear the cart" |
| Request output format | Specify the desired output format | "Organize it in a table", "Summarize it" |
| Verify structure | Check before creating new things | "Show me the structure before creating it" |

{% hint style="info" %}
💡 AI remembers the conversation flow. You can refer to a previously registered product as "the product I just registered."
{% endhint %}

***

## Reference Docs

- [Table Management](../../../console/07-table-management.md) -- Create/manage tables in the console
- [Insert Data](../../../database/03-insert.md) -- Create data
- [List Data](../../../database/05-list.md) -- Filter, sort, paginate
- [File Upload](../../../storage/02-upload-single.md) -- File upload guide

***

## Next Steps

Check frequently occurring errors and solutions in [99. Troubleshooting](99-troubleshooting.md).
