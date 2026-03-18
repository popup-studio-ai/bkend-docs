# Recipe App Quick Start

{% hint style="info" %}
Experience how to register and retrieve recipes with bkend in just 10 minutes.
{% endhint %}

## Prerequisites

| Item | Reference |
|------|-----------|
| bkend project created | [Project Management](../../console/04-project-management.md) |
| API Key issued | [API Key Management](../../console/11-api-keys.md) |
| AI tool connected (MCP track) | [MCP](../../mcp/01-overview.md) |

***

## Step 1: Create the recipes Table

Create a dynamic table to store recipe data.

{% tabs %}
{% tab title="MCP (AI Tool)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to store recipes. Let me manage recipe name, description, cooking time, difficulty, servings, and category. Before creating it, show me the structure first."
{% endhint %}

{% hint style="info" %}
💡 Verify that the AI suggests a structure similar to the one below.
{% endhint %}

| Field | Description | Example Value |
|-------|-------------|---------------|
| title | Recipe name | "Kimchi Stew" |
| description | Brief description | "Spicy kimchi stew" |
| cookingTime | Cooking time (min) | 30 |
| difficulty | Difficulty level | "easy" / "medium" / "hard" |
| servings | Servings | 2 |
| category | Category | "Korean" |

{% endtab %}
{% tab title="Console + REST API" %}

1. Go to Console → **Table Management** → click **Add Table**.
2. Enter `recipes` as the table name.
3. Add the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `title` | String | Recipe name |
| `description` | String | Recipe description |
| `cookingTime` | Number | Cooking time (minutes) |
| `servings` | Number | Number of servings |
| `difficulty` | String | Difficulty (`easy` / `medium` / `hard`) |
| `category` | String | Category (Korean, Western, etc.) |

4. Click **Save**.

{% endtab %}
{% endtabs %}

***

## Step 2: Register a Recipe

Register a kimchi stew recipe in the recipes table.

{% tabs %}
{% tab title="MCP (AI Tool)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Register a new recipe. Kimchi stew, 30 minutes cooking time, easy difficulty, 2 servings, Korean cuisine. Set the description to 'A spicy stew made with pork and well-fermented kimchi'."
{% endhint %}

The AI saves the recipe.

{% endtab %}
{% tab title="Console + REST API" %}

```bash
curl -X POST https://api-client.bkend.ai/v1/data/recipes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "Kimchi Stew",
    "description": "A spicy stew made with pork and well-fermented kimchi",
    "cookingTime": 30,
    "servings": 2,
    "difficulty": "easy",
    "category": "Korean"
  }'
```

**Response example:**

```json
{
  "id": "rec_abc123",
  "title": "Kimchi Stew",
  "description": "A spicy stew made with pork and well-fermented kimchi",
  "cookingTime": 30,
  "servings": 2,
  "difficulty": "easy",
  "category": "Korean",
  "createdBy": "user_123",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

{% endtab %}
{% endtabs %}

***

## Step 3: Retrieve Recipes

Retrieve the list of registered recipes.

{% tabs %}
{% tab title="MCP (AI Tool)" %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the list of registered recipes."
{% endhint %}

The AI retrieves and displays the saved recipe list.

{% endtab %}
{% tab title="Console + REST API" %}

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/recipes?limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**Response example:**

```json
{
  "items": [
    {
      "id": "rec_abc123",
      "title": "Kimchi Stew",
      "cookingTime": 30,
      "servings": 2,
      "difficulty": "easy",
      "category": "Korean",
      "createdAt": "2025-01-15T10:00:00Z"
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

## Complete

Congratulations! You have experienced the basic flow of a recipe app with bkend.

### What You Learned

| Task | REST API Endpoint | MCP Tool |
|------|-------------------|----------|
| Create table | Console UI | `create_table` |
| Register recipe | `POST /v1/data/recipes` | `create_recipes` |
| Retrieve recipes | `GET /v1/data/recipes` | `list_recipes` |

***

## Reference

- [recipe-web example project](../../../examples/recipe-web/) — Web implementation code for this cookbook
- [recipe-app example project](../../../examples/recipe-app/) — App implementation code for this cookbook

***

## Next Steps

- Implement authentication, ingredient management, and meal planning in detail in the [Full Guide](./full-guide/).
- Learn about image attachments, editing, and deletion in [Recipe Management](full-guide/02-recipes.md).
- Try AI recipe recommendations in [AI Scenarios](full-guide/06-ai-prompts.md).
