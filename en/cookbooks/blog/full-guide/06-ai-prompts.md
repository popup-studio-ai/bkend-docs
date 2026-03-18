# AI Prompt Collection

{% hint style="info" %}
💡 A collection of prompts you can use to interact with AI for the blog project, organized by scenario.
{% endhint %}

## Overview

This document is a prompt reference for requesting each blog feature from the AI using natural language. Use the prompts below as-is or modify them for your situation while MCP tools are connected.

### Prerequisites

| Required Item | Description | Reference |
|---------------|-------------|-----------|
| MCP tools connected | bkend MCP server connected in AI tool | [MCP Overview](../../../mcp/01-overview.md) |
| Project selected | Blog project selected in MCP session | [MCP Overview](../../../mcp/01-overview.md) |

***

## Table Management

Prompts for creating project tables and managing schemas.

{% hint style="success" %}
✅ **Try saying this to the AI**
"I want to store blog posts. Let me manage titles, body content, cover images, categories, and published status. Show me the structure before creating it."
{% endhint %}

{% hint style="info" %}
💡 Verify that the AI suggests a structure similar to the one below.

| Field | Description | Example Value |
|-------|-------------|---------------|
| title | Article title | "My First Blog Post" |
| content | Body content | "Hello..." |
| coverImage | Cover image URL | (set after upload) |
| category | Category | "travel" |
| isPublished | Published status | `true` / `false` |
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Check how the article storage structure is set up"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"I want to add tags to blog posts. Let me manage tag names and URL identifiers. Tags with the same name should not be duplicated. Also, let me assign multiple tags to each article. Show me the structure before creating it."
{% endhint %}

{% hint style="info" %}
💡 Verify that the AI suggests a structure similar to the one below.

| Field | Description | Example Value |
|-------|-------------|---------------|
| name | Tag name | "travel" |
| slug | URL identifier | "travel" |
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"I want users to be able to bookmark articles they're interested in. Let me save which articles were bookmarked. Show me the structure before creating it."
{% endhint %}

{% hint style="info" %}
💡 Verify that the AI suggests a structure similar to the one below.

| Field | Description | Example Value |
|-------|-------------|---------------|
| articleId | Bookmarked article | (article ID) |
{% endhint %}

{% hint style="info" %}
💡 Table creation can only be performed with MCP tools. You cannot create tables via the REST API.
{% endhint %}

***

## Article Management

Prompts for requesting article creation, retrieval, update, and deletion from the AI.

### Create Article

{% hint style="success" %}
✅ **Try saying this to the AI**
"Write a new blog post. Title is '3-Night Jeju Island Trip', category is 'travel'. Don't publish it yet — save it as a draft."
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Write an article in the tech category and publish it right away. Title is 'React 19 New Features Overview', content is 'Introducing the key new features added in React 19'."
{% endhint %}

### Retrieve Articles

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me the content of the article I just wrote"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me the 5 most recent articles in the travel category"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me only published articles, sorted by newest first"
{% endhint %}

### Update Article

{% hint style="success" %}
✅ **Try saying this to the AI**
"Change the title of the travel article I just wrote to '3-Night Jeju Island Trip — Complete Guide'"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Publish this article"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Change this article's category from 'lifestyle' to 'travel'"
{% endhint %}

### Delete Article

{% hint style="success" %}
✅ **Try saying this to the AI**
"Delete the 'Test Post' article"
{% endhint %}

{% hint style="warning" %}
⚠️ Deleted articles cannot be recovered. If the AI asks for confirmation before deleting, verify the content before proceeding.
{% endhint %}

***

## Image Management

{% hint style="warning" %}
⚠️ File uploads are performed directly on the client via the REST API. You cannot upload files with MCP tools. After uploading, you can use MCP to request linking the image URL to an article.
{% endhint %}

### Attach Image

{% hint style="success" %}
✅ **Try saying this to the AI**
"Set the cover image for the Jeju trip article to this URL: https://cdn.example.com/cover-jeju.jpg"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Remove the cover image from this article"
{% endhint %}

### Get File Info

{% hint style="success" %}
✅ **Try saying this to the AI**
"Check the uploaded image information"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Delete the image file I just checked"
{% endhint %}

***

## Tag Management

Prompts for creating tags and linking them to articles.

### Create Tags

{% hint style="success" %}
✅ **Try saying this to the AI**
"Create tags for the blog: travel, food, tech, lifestyle"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Create a 'frontend' tag. Use 'frontend' as the URL slug."
{% endhint %}

### List Tags

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me the current list of tags"
{% endhint %}

### Assign Tags to Article

{% hint style="success" %}
✅ **Try saying this to the AI**
"Add 'travel' and 'food' tags to the Jeju trip article"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Remove all tags from this article"
{% endhint %}

### Filter Articles by Tag

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me articles tagged with 'travel'"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me articles that have both 'travel' and 'food' tags"
{% endhint %}

### Update and Delete Tags

{% hint style="success" %}
✅ **Try saying this to the AI**
"Rename the 'travel' tag to 'overseas travel'"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Delete the 'lifestyle' tag"
{% endhint %}

{% hint style="warning" %}
⚠️ Deleting a tag does not automatically remove the tag links from articles. If needed, ask the AI to also clean up tags on related articles.
{% endhint %}

***

## Bookmarks

Prompts for saving and managing articles of interest.

### Add Bookmark

{% hint style="success" %}
✅ **Try saying this to the AI**
"Save the Jeju trip article to my bookmarks"
{% endhint %}

### List Bookmarks

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me the list of articles I've bookmarked"
{% endhint %}

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me my bookmark list with article titles"
{% endhint %}

### Remove Bookmark

{% hint style="success" %}
✅ **Try saying this to the AI**
"Remove the bookmark for the Jeju trip article"
{% endhint %}

### Toggle Bookmark

{% hint style="success" %}
✅ **Try saying this to the AI**
"Toggle the bookmark for this article. If it's already bookmarked, remove it; otherwise, add it."
{% endhint %}

### Check Bookmark Count

{% hint style="success" %}
✅ **Try saying this to the AI**
"Check how many bookmarks the Jeju trip article has"
{% endhint %}

***

## Combined Scenarios

Advanced prompts that combine multiple features. The AI calls multiple MCP tools sequentially to process them.

### Create Article with Image + Tags

{% hint style="success" %}
✅ **Try saying this to the AI**
"Write a new article in the travel category. Title is 'Seoul Cafe Tour', set the cover image to https://cdn.example.com/seoul-cafe.jpg. Also add 'travel', 'seoul', 'cafe' tags."
{% endhint %}

The AI processes this sequentially:

1. Create article
2. Set cover image + assign tags

### Content-based Tag Recommendation

{% hint style="success" %}
✅ **Try saying this to the AI**
"Analyze the content of the article I just wrote and recommend suitable tags. Choose from the existing tags."
{% endhint %}

The AI processes this sequentially:

1. Retrieve article content
2. Retrieve existing tag list
3. Match content with tags and recommend

### Batch Review Draft Articles

{% hint style="success" %}
✅ **Try saying this to the AI**
"Show me the list of unpublished articles. Include the title and creation date for each."
{% endhint %}

### Articles by Category Summary

{% hint style="success" %}
✅ **Try saying this to the AI**
"Summarize how many articles there are per category. Show published/unpublished counts for travel, tech, lifestyle, and food categories."
{% endhint %}

The AI queries article counts per category and compiles the results.

### Blog Status Summary

{% hint style="success" %}
✅ **Try saying this to the AI**
"Give me a blog status summary. Show total articles, published/unpublished count, tag count, and bookmark count."
{% endhint %}

The AI queries multiple data sources and compiles them.

***

## Reference Docs

- [MCP Overview](../../../mcp/01-overview.md) — AI tool setup and available tools list
- [Article CRUD](02-articles.md) — REST API details
- [Image Upload](03-files.md) — File upload details
- [Tag Management](04-tags.md) — Tag CRUD details
- [Bookmarks](05-bookmarks.md) — Bookmark CRUD details

## Next Steps

Check common errors and solutions in [Troubleshooting](99-troubleshooting.md).
