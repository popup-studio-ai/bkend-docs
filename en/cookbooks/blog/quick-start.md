# Get Started in 5 Minutes

{% hint style="info" %}
💡 Quickly experience the core features of the blog project. Create a table, write your first article, and verify it — all in 5 minutes.
{% endhint %}

## Prerequisites

| Item | Description |
|------|-------------|
| bkend project | Project created on the console |
| API Key | Issued from Console → **API Keys** |

***

## Step 1: Create the articles Table

Create a dynamic table to store articles.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to store blog posts. Let me manage titles, body content, and published status. Show me the structure before creating it."
{% endhint %}

{% hint style="info" %}
💡 Verify that the AI suggests a structure similar to the one below.

| Field | Description | Example Value |
|-------|-------------|---------------|
| title | Article title | "My First Blog Post" |
| content | Body content | "Hello..." |
| isPublished | Published status | `true` / `false` |
{% endhint %}

The AI will call the table creation tool to create the articles table.

{% endtab %}
{% tab title="Console" %}

1. Log in to the console.
2. Click **Database** in the left menu.
3. Click the **Create Table** button.
4. Enter `articles` as the table name.
5. Add the following fields:

| Field Name | Type | Required | Notes |
|------------|------|:--------:|-------|
| `title` | String | ✅ | Article title |
| `content` | String | ✅ | Body content |
| `isPublished` | Boolean | - | Default: `false` |

6. Click **Create**.

{% endtab %}
{% endtabs %}

***

## Step 2: Write Your First Article

Add data to the articles table.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Write a new blog post. Title is 'My First Blog Post', content is 'A blog built with bkend', and publish it right away."
{% endhint %}

The AI will call the data creation tool to add the article.

{% endtab %}
{% tab title="Console + REST API" %}

### curl

```bash
curl -X POST https://api-client.bkend.ai/v1/data/articles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "My First Blog Post",
    "content": "A blog built with bkend.",
    "isPublished": true
  }'
```

### bkendFetch

```javascript
import { bkendFetch } from './bkend.js';

const article = await bkendFetch('/v1/data/articles', {
  method: 'POST',
  body: {
    title: 'My First Blog Post',
    content: 'A blog built with bkend.',
    isPublished: true,
  },
});

console.log(article);
// { id: "...", title: "My First Blog Post", ... }
```

{% hint style="info" %}
💡 See [Integrate bkend in Your App](../../getting-started/06-app-integration.md) for `bkendFetch` setup.
{% endhint %}

{% endtab %}
{% endtabs %}

### Success Response

```json
{
  "id": "683a1b2c...",
  "title": "My First Blog Post",
  "content": "A blog built with bkend.",
  "isPublished": true,
  "createdBy": "user_abc123",
  "createdAt": "2026-02-08T10:00:00Z",
  "updatedAt": "2026-02-08T10:00:00Z"
}
```

***

## Step 3: Verify the Article

Retrieve the article you just wrote.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the list of blog posts"
{% endhint %}

The AI will call the data retrieval tool and return the article list.

{% endtab %}
{% tab title="Console + REST API" %}

### curl

```bash
curl -X GET https://api-client.bkend.ai/v1/data/articles \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

### bkendFetch

```javascript
const articles = await bkendFetch('/v1/data/articles');

console.log(articles);
// { items: [{ id: "...", title: "My First Blog Post", ... }], total: 1, ... }
```

{% endtab %}
{% endtabs %}

{% hint style="success" %}
✅ If the article is retrieved successfully, the basic setup is complete.
{% endhint %}

***

## Next Steps

Follow the full guide to build a complete blog:

- [Project Overview](full-guide/00-overview.md) — Understand the overall structure and table design
- [Authentication Setup](full-guide/01-auth.md) — Implement sign-up/sign-in
- [Article CRUD](full-guide/02-articles.md) — Detailed article creation, editing, and deletion

***

## Reference Docs

- [Integrate bkend in Your App](../../getting-started/06-app-integration.md) — bkendFetch helper setup
- [Insert Data](../../database/03-insert.md) — Dynamic table data creation
- [Select Data](../../database/04-select.md) — Single record retrieval
- [blog-web Example Project](../../../examples/blog-web/) — Full code implementing this cookbook in Next.js
