# Social Network Quick Start

{% hint style="info" %}
💡 Create a profile and publish your first post in just 10 minutes.
{% endhint %}

## Prerequisites

- bkend project created
- API key issued
- `profiles` and `posts` tables created

***

## Step 1: Create Tables

Create the `profiles` and `posts` tables needed for the social network.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to build a social network. I need a place to store user profiles that can manage nicknames, bios, and profile pictures. Show me what the structure will look like before creating it."
{% endhint %}

{% hint style="info" %}
💡 Verify that the AI suggests a structure similar to the one below.

| Field | Description | Example Value |
|-------|-------------|---------------|
| nickname | Nickname | "John" |
| bio | Bio | "Building a social network with bkend" |
| avatarUrl | Profile picture URL | (linked after upload) |
{% endhint %}

Once the profile storage is created, request the post storage as well.

{% hint style="success" %}
✅ **Try saying this to the AI**

"I also need a place to store posts. Set it up so I can manage text content, images, like counts, and comment counts."
{% endhint %}

{% endtab %}
{% tab title="Console + REST API" %}

**Create tables in the console:**

1. Navigate to the **Database** menu.
2. Click the **Add Table** button.
3. Enter the table name: `profiles`.
4. Add the following fields.

| Field Name | Type | Description |
|------------|------|-------------|
| `userId` | String | User ID |
| `nickname` | String | Nickname |
| `bio` | String | Bio |
| `avatarUrl` | String | Profile picture URL |

5. Create the `posts` table in the same way.

| Field Name | Type | Description |
|------------|------|-------------|
| `content` | String | Body |
| `imageUrl` | String | Image URL |
| `likesCount` | Number | Likes count |
| `commentsCount` | Number | Comments count |

{% endtab %}
{% endtabs %}

***

## Step 2: Create a Profile

Create your profile.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Create my profile. Set the nickname to 'John' and the bio to 'Building a social network with bkend'."
{% endhint %}

{% endtab %}
{% tab title="Console + REST API" %}

```bash
curl -X POST https://api-client.bkend.ai/v1/data/profiles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "userId": "my-user-id",
    "nickname": "John",
    "bio": "Building a social network with bkend."
  }'
```

**Response (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "userId": "my-user-id",
  "nickname": "John",
  "bio": "Building a social network with bkend.",
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

{% endtab %}
{% endtabs %}

***

## Step 3: Create a Post

Publish your first post.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Create a post. The content should be 'Hello! This is my first post on a social network built with bkend.'"
{% endhint %}

{% endtab %}
{% tab title="Console + REST API" %}

```bash
curl -X POST https://api-client.bkend.ai/v1/data/posts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "content": "Hello! This is my first post on a social network built with bkend.",
    "likesCount": 0,
    "commentsCount": 0
  }'
```

**Response (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439022",
  "content": "Hello! This is my first post on a social network built with bkend.",
  "likesCount": 0,
  "commentsCount": 0,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:05:00.000Z"
}
```

{% endtab %}
{% endtabs %}

***

## Step 4: View Posts

Check the list of posts you have created.

{% tabs %}
{% tab title="MCP (AI Tools)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the 10 most recent posts."
{% endhint %}

{% endtab %}
{% tab title="Console + REST API" %}

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/posts?sortBy=createdAt&sortDirection=desc&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439022",
      "content": "Hello! This is my first post on a social network built with bkend.",
      "likesCount": 0,
      "commentsCount": 0,
      "createdBy": "user-uuid-1234",
      "createdAt": "2025-01-15T10:05:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

{% endtab %}
{% endtabs %}

***

## Done!

{% hint style="success" %}
✅ Congratulations! You have experienced the basic features of a social network.
{% endhint %}

### What You Learned

| Step | API Endpoint | Description |
|:----:|--------------|-------------|
| 2 | `POST /v1/data/profiles` | Create a profile |
| 3 | `POST /v1/data/posts` | Create a post |
| 4 | `GET /v1/data/posts` | List posts |

***

## Next Steps

- Learn all features step by step in the [Full Guide](full-guide/00-overview.md).
- Implement comments and likes in [Posts](full-guide/03-posts.md).
- Manage follow relationships in [Follows](full-guide/04-follows.md).
- Explore AI use cases in [AI Scenarios](full-guide/06-ai-prompts.md).

***

## Reference

- [Insert Data](../../database/03-insert.md) — Data creation API details
- [Select Data](../../database/04-select.md) — Data query API details
- [social-network-app example project](../../../examples/social-network-app/) — Full code implementing this cookbook in Flutter
