# 06. AI Prompt Collection

{% hint style="info" %}
💡 A prompt reference for requesting each feature of the recipe app from the AI in natural language. Use these prompts as-is in an AI client connected to MCP tools (Claude Code, Cursor, etc.).
{% endhint %}

## What This Chapter Covers

- AI prompts for recipes, ingredients, meal plans, shopping lists, and cooking logs
- Prompts from initial table setup to daily use
- Combined scenario prompts that chain multiple features

```mermaid
flowchart LR
    A["Natural Language Request"] --> B["AI Auto-Processes"]
    B --> C["Saved to bkend"]
    C --> D["Response Returned"]
```

***

## Initial Table Setup

When starting a new project, ask the AI to create all the required data structures at once.

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to build a recipe app. Let me manage recipes, ingredients, meal plans, grocery lists, and cooking logs. Before creating them, show me the structure first."
{% endhint %}

{% hint style="info" %}
💡 Verify that the AI suggests structures similar to the ones below.
{% endhint %}

**recipes**

| Field | Description | Example Value |
|-------|-------------|---------------|
| title | Recipe name | "Kimchi Stew" |
| description | Brief description | "Spicy kimchi stew" |
| cookingTime | Cooking time (min) | 30 |
| difficulty | Difficulty level | "easy" / "medium" / "hard" |
| servings | Servings | 2 |
| category | Category | "Korean" |
| imageUrl | Recipe photo URL | (linked after upload) |

**ingredients**

| Field | Description | Example Value |
|-------|-------------|---------------|
| recipeId | Which recipe this belongs to | (recipe ID) |
| name | Ingredient name | "Kimchi" |
| amount | Amount | "200" |
| unit | Unit | "g" |
| orderIndex | Order | 1 |
| isOptional | Whether optional | false |

**meal_plans**

| Field | Description | Example Value |
|-------|-------------|---------------|
| date | Date | "2026-02-10" |
| mealType | Meal type | "breakfast" / "lunch" / "dinner" / "snack" |
| recipeId | Which recipe | (recipe ID) |
| servings | Servings | 2 |
| notes | Notes | "Less spicy" |

**shopping_lists**

| Field | Description | Example Value |
|-------|-------------|---------------|
| name | List name | "This week's groceries" |
| date | Date | "2026-02-10" |
| items | Shopping items | [{name, amount, unit, checked}] |

**cooking_logs**

| Field | Description | Example Value |
|-------|-------------|---------------|
| recipeId | Which recipe was cooked | (recipe ID) |
| date | Cooking date | "2026-02-10" |
| rating | Rating (1~5) | 4 |
| notes | Notes | "A bit less salt next time" |

{% hint style="success" %}
✅ **After confirming the structure**

"Looks good, create them with this structure."
{% endhint %}

{% hint style="success" %}
✅ **Check current structure**

"Show me what data structures exist in the current project."
{% endhint %}

***

## Recipe Management

### Register a Recipe

{% hint style="success" %}
✅ **Try saying this to the AI**

"Register a new recipe. Kimchi stew, 30 minutes cooking time, easy difficulty, 2 servings, Korean cuisine. Set the description to 'A spicy stew made with pork and well-fermented kimchi'."
{% endhint %}

{% hint style="success" %}
✅ **Register multiple recipes at once**

"Register 3 pasta recipes. Carbonara (20 min, medium difficulty), Aglio e Olio (15 min, easy), and Vongole (25 min, medium)."
{% endhint %}

### Update a Recipe

{% hint style="success" %}
✅ **Try saying this to the AI**

"Update the Kimchi Stew recipe. Change it to 4 servings and 40 minutes cooking time."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change the Bibimbap recipe difficulty to easy."
{% endhint %}

### Delete a Recipe

{% hint style="success" %}
✅ **Try saying this to the AI**

"Delete the Kimchi Stew recipe."
{% endhint %}

### Image Upload

{% hint style="success" %}
✅ **Try saying this to the AI**

"I want to add a photo to the Kimchi Stew recipe. Upload the image file and link it to the recipe."
{% endhint %}

{% hint style="info" %}
💡 The AI automatically handles image upload and recipe linking. For the detailed flow, refer to [02. Recipes](02-recipes.md).
{% endhint %}

### Recipe Search/Filter

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me only easy difficulty recipes sorted by shortest cooking time."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me Korean recipes that can be made in 30 minutes or less."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the list of recipes I registered."
{% endhint %}

***

## Ingredient Management

### Add Ingredients

{% hint style="success" %}
✅ **Try saying this to the AI**

"Add ingredients to the Kimchi Stew recipe. Kimchi 300g, pork 200g, tofu half a block, green onion 1 stalk, and chili powder 1 tbsp is optional."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Register ingredients for Carbonara. Spaghetti 200g, bacon 100g, eggs 2, parmesan cheese 50g, heavy cream 100ml."
{% endhint %}

### Update Ingredients

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change the kimchi amount to 500g in the Kimchi Stew ingredients."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change the chili powder to a required ingredient in the Kimchi Stew."
{% endhint %}

### Delete Ingredients

{% hint style="success" %}
✅ **Try saying this to the AI**

"Remove chili powder from the Kimchi Stew ingredients."
{% endhint %}

### View Ingredients / Serving Conversion

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me the ingredient list for Kimchi Stew. Separate required and optional ingredients."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"How much of each ingredient do I need to make Kimchi Stew for 4 servings? Calculate from the 2-serving base."
{% endhint %}

***

## Meal Planning

### Register Daily Meals

{% hint style="success" %}
✅ **Try saying this to the AI**

"Register Kimchi Stew for 2 servings as dinner on January 20th."
{% endhint %}

{% hint style="success" %}
✅ **Register a full day's meals at once**

"Plan the meals for January 20th. Toast for breakfast, Bibimbap for lunch, and Kimchi Stew for dinner."
{% endhint %}

{% hint style="success" %}
✅ **Conditional meal registration**

"Register something quick for tomorrow's lunch. Under 15 minutes cooking time."
{% endhint %}

### View Meal Plans

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me this week's meal plan organized by date."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me what I planned to eat on January 20th."
{% endhint %}

### Update Meal Plans

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change the dinner menu on January 20th to Doenjang Stew."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change the January 22nd lunch to 4 servings."
{% endhint %}

***

## Grocery Lists

### Create Manually

{% hint style="success" %}
✅ **Try saying this to the AI**

"Create a grocery list for this week. I need 1 whole kimchi, pork 500g, 2 blocks of tofu, and 1 bunch of green onions."
{% endhint %}

### Auto-Generate from Recipe Ingredients

{% hint style="success" %}
✅ **Try saying this to the AI**

"Combine the ingredients from Kimchi Stew and Bibimbap into a grocery list. Merge quantities for the same ingredients."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Gather all ingredients from this week's meal plan and create a grocery list."
{% endhint %}

{% hint style="info" %}
💡 The AI finds recipes from the meal plan, retrieves each recipe's ingredients, merges duplicates, and automatically creates the grocery list.
{% endhint %}

### Purchase Check

{% hint style="success" %}
✅ **Try saying this to the AI**

"I bought the kimchi and tofu. Check them off on the grocery list."
{% endhint %}

{% hint style="success" %}
✅ **Check progress**

"How is my grocery shopping going? Show me what I haven't bought yet."
{% endhint %}

### Add/Remove Items

{% hint style="success" %}
✅ **Try saying this to the AI**

"Add 1 bag of chili powder to the grocery list."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Remove green onion from the grocery list."
{% endhint %}

***

## Cooking Log

Record your cooking completions with notes and ratings.

### Record Cooking Completion

{% hint style="success" %}
✅ **Try saying this to the AI**

"I made Kimchi Stew for lunch today. Rating 4 out of 5, and note 'The spice level was just right'."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"I made Carbonara for dinner yesterday. Rating 3, note that the noodles were a bit overcooked."
{% endhint %}

{% hint style="info" %}
💡 The AI stores information similar to the following.
{% endhint %}

| Field | Description | Example Value |
|-------|-------------|---------------|
| recipeId | Which recipe was cooked | (recipe ID) |
| date | Cooking date | "2026-02-10" |
| rating | Rating (1~5) | 4 |
| notes | Notes | "The spice level was just right" |

### View Cooking Log

{% hint style="success" %}
✅ **Try saying this to the AI**

"Show me what I cooked this month."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"How many times have I made Kimchi Stew, and what's the average rating?"
{% endhint %}

### Update/Delete Cooking Log

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change the rating of my last cooking log to 5."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**

"Delete the cooking log I registered yesterday."
{% endhint %}

***

## Combined Scenarios

Prompts that request multiple features at once. The AI processes the required tasks sequentially.

### Auto-Generate Weekly Meal Plan

{% hint style="success" %}
✅ **Try saying this to the AI**

"Plan my lunch meals from Monday to Friday this week. Choose recipes that can be made in 30 minutes or less, with no duplicates."
{% endhint %}

AI processing flow:

```mermaid
flowchart TD
    A["1. Retrieve recipes under 30 min"] --> B["2. Select 5 without duplicates"]
    B --> C["3. Register Mon-Fri lunch plans"]
    C --> D["4. Display summary"]
```

### Fridge Cleanup + Meal Registration

{% hint style="success" %}
✅ **Try saying this to the AI**

"I have chicken breast, onion, and garlic in the fridge. Find recipes I can make with these ingredients and register one as tonight's dinner."
{% endhint %}

AI processing flow:

1. Search for recipes containing chicken breast, onion, and garlic
2. Recommend matching recipes
3. Register the selected recipe as tonight's dinner

### Auto-Generate Grocery List from Meal Plan

{% hint style="success" %}
✅ **Try saying this to the AI**

"Gather all ingredients needed for this week's meal plan into a grocery list. Merge the same ingredients, and exclude rice, soy sauce, and salt since I already have them."
{% endhint %}

AI processing flow:

```mermaid
flowchart TD
    A["1. Check this week's meal plan"] --> B["2. Retrieve ingredients for each recipe"]
    B --> C["3. Merge duplicates + remove excluded items"]
    C --> D["4. Create grocery list"]
```

### Monthly Cooking Report

{% hint style="success" %}
✅ **Try saying this to the AI**

"Create a cooking report for this month. Include how many times I cooked, top 5 most-cooked recipes, average rating, and category distribution."
{% endhint %}

AI processing flow:

1. Retrieve all cooking logs for the month
2. Fetch detailed info for each recipe
3. Analyze stats and generate report

### Register Recipe + Ingredients at Once

{% hint style="success" %}
✅ **Try saying this to the AI**

"Register a Doenjang Stew recipe and add the ingredients too. Doenjang 2 tbsp, tofu 1 block, potato 1, zucchini half, onion half, green onion 1 stalk, chili pepper 1."
{% endhint %}

AI processing flow:

1. Create the Doenjang Stew recipe
2. Add each ingredient sequentially

### Change Meal Plan + Update Grocery List

{% hint style="success" %}
✅ **Try saying this to the AI**

"Change Wednesday's dinner from Kimchi Stew to Doenjang Stew. Also remove kimchi from the grocery list and add doenjang."
{% endhint %}

AI processing flow:

1. Check Wednesday's dinner plan
2. Change the recipe
3. Update grocery list items

***

## Prompt Writing Tips

Tips for writing effective AI prompts.

| Principle | Good Example | Bad Example |
|-----------|--------------|-------------|
| Be specific | "Kimchi stew, 30 min, 2 servings, easy" | "Register a recipe" |
| State conditions | "Under 30 minutes, Korean only" | "Something quick to make" |
| Specify result format | "Show organized by date" | "Show meal plan" |
| Batch multiple tasks | "Register the recipe and add ingredients too" | (Requesting each separately) |
| Confirm first | "Show me the structure before creating" | (Just asking to create) |

{% hint style="warning" %}
⚠️ To prevent the AI from modifying or deleting the wrong data, specify recipe names or dates precisely. Using specific values instead of vague expressions is safer.
{% endhint %}

***

## Reference

- [MCP Overview](../../../mcp/01-overview.md) — MCP tool setup and integration guide
- [List Data](../../../database/05-list.md) — Filtering, sorting, pagination details

***

## Next Step

Check common errors and solutions during recipe app development in [99. Troubleshooting](99-troubleshooting.md).
