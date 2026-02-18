# Index Management

{% hint style="info" %}
💡 This guide explains how to create indexes to improve data query performance.
{% endhint %}

## Overview

Indexes speed up queries on specific columns. Creating indexes on columns that are frequently searched or filtered makes data retrieval faster.

***

## Viewing the Index List

1. Click **Database** → select a table → click the **Indexes** tab.
2. View currently created indexes.

***

## Creating an Index

{% tabs %}
{% tab title="Console" %}
1. Click the **Add Index** button in the Indexes tab.
2. Enter the following information.

| Field | Description |
|-------|-------------|
| **Index Name** | Index identifier |
| **Target Columns** | Columns to index (compound indexes supported) |
| **Unique** | Whether to create a UNIQUE index |

3. Click **Create**.
{% endtab %}
{% tab title="MCP" %}
Request in natural language from your AI tool.

```text
"Create an index on the author_id column of the posts table"
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
💡 Compound indexes combine multiple columns into a single index. Grouping columns that are frequently queried together into one index is effective.
{% endhint %}

***

## Deleting an Index

1. Click the **Delete** icon on the index you want to remove.
2. The index is deleted after confirmation.

{% hint style="warning" %}
⚠️ Deleting an index may degrade query performance on that column. Data is not affected.
{% endhint %}

***

## Index Recommendations

| Scenario | Recommended |
|----------|:----------:|
| Columns frequently used in WHERE clauses | ✅ |
| Columns frequently used in ORDER BY | ✅ |
| Columns that need a unique constraint | ✅ |
| Columns where nearly all values are identical | ❌ |
| Columns that are frequently updated | △ (may degrade write performance) |

***

## Next Steps

- [Dashboard](10-dashboard.md) — View project statistics
- [Filtering](../database/08-filtering.md) — Filter data via the REST API
- [Performance Optimization](../guides/04-performance.md) — General performance guide
