# Troubleshooting

{% hint style="info" %}
💡 Common issues and solutions encountered while working through the blog cookbook.
{% endhint %}

## Authentication

### 401 Unauthorized Error

```json
{
  "statusCode": 401,
  "error": "AUTHENTICATION_REQUIRED",
  "message": "Invalid token"
}
```

**Cause:** The Access Token has expired or is invalid.

**Solution:**

1. Refresh the Access Token.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "refreshToken": "{refresh_token}"
  }'
```

2. If the Refresh Token has also expired, sign in again.

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/signin \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -d '{
    "method": "password",
    "email": "blogger@example.com",
    "password": "abc123"
  }'
```

{% hint style="info" %}
💡 The `bkendFetch` helper automatically refreshes tokens on 401 responses. See [Token Management](../../../authentication/20-token-management.md) for details.
{% endhint %}

***

### Token Expiration

**Symptom:** API calls suddenly start failing.

**Cause:** The Access Token validity is 1 hour (3600 seconds).

**Solution:**

| Token | On Expiration | Action |
|-------|---------------|--------|
| Access Token | 1 hour | Refresh with Refresh Token |
| Refresh Token | Long-lived | Re-sign-in required |

{% hint style="warning" %}
⚠️ Once you refresh a token, the previous Access Token can no longer be used. Always save the refreshed token.
{% endhint %}

***

### Missing Required Headers

```json
{
  "statusCode": 400,
  "error": "MISSING_HEADER",
  "message": "X-API-Key header is required"
}
```

**Cause:** A required header is missing.

**Solution:** Include the following headers in all API requests.

| Header | Required | Description |
|--------|:--------:|-------------|
| `X-API-Key` | ✅ | Publishable Key (`pk_` prefix) |
| `Authorization` | ✅ | `Bearer {accessToken}` |
| `Content-Type` | POST/PATCH | `application/json` |

***

## Table Issues

### Table Not Found

```json
{
  "statusCode": 404,
  "error": "TABLE_NOT_FOUND",
  "message": "Table 'articles' not found"
}
```

**Cause:** The table has not been created yet, or was created in a different Environment.

**Solution:**

1. Check the **Table Management** menu in the console.
2. Verify the `X-API-Key` header value is correct. Tables are independent per environment.
3. If the table does not exist, create it following Step 1 in [02-articles.md](02-articles.md).

{% hint style="warning" %}
⚠️ Tables created in the `dev` environment are not automatically created in `staging` or `prod`. Create them separately in each environment.
{% endhint %}

***

### Field Type Error

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid type for isPublished field. Boolean type is required."
}
```

**Cause:** The field type in the request data does not match the table schema.

**Solution:** Verify the type for each field.

| Field | Correct Type | Wrong Example | Correct Example |
|-------|-------------|---------------|-----------------|
| `isPublished` | Boolean | `"true"` | `true` |
| `tags` | Array(String) | `"tag1,tag2"` | `["tag1", "tag2"]` |
| `title` | String | `123` | `"Title"` |

***

## Article Issues

### Article Creation Failed (400)

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Required parameter is missing"
}
```

**Cause:** A required field is missing.

**Solution:** Check the required fields for the `articles` table.

| Required Field | Type | Check Item |
|----------------|------|------------|
| `title` | String | Empty string `""` not allowed |
| `content` | String | Empty string `""` not allowed |

Correct request example:

```bash
curl -X POST https://api-client.bkend.ai/v1/data/articles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "title": "Article Title",
    "content": "Body content"
  }'
```

***

### Empty Results When Listing Articles

**Symptom:** `GET /v1/data/articles` returns an empty `items` array.

**Possible causes:**

1. No data in the current environment
2. Filter conditions are too narrow
3. Trying to access another user's data

**Solution:**

```bash
# 1. Try fetching without filters
curl -X GET "https://api-client.bkend.ai/v1/data/articles?page=1&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"

# 2. Verify X-API-Key value (confirm it's the correct Publishable Key)
```

***

### 404 When Updating an Article

```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "Data not found"
}
```

**Cause:** The article ID does not exist or the article has already been deleted.

**Solution:**

1. Verify the article ID is correct.
2. List articles to confirm the article exists.
3. Verify the ID is correctly included in the URL path.

```bash
# Correct format
curl -X PATCH https://api-client.bkend.ai/v1/data/articles/507f1f77bcf86cd799439011

# Wrong format (ID missing)
curl -X PATCH https://api-client.bkend.ai/v1/data/articles/
```

***

## Image Issues

### Presigned URL Expired

**Symptom:** `403 Forbidden` or `Access Denied` error when uploading file to storage.

**Cause:** The Presigned URL validity is **15 minutes**. It expires 15 minutes after issuance.

**Solution:**

1. Request a new Presigned URL.
2. Upload immediately after issuance.

```javascript
// 1. Re-issue Presigned URL
const presigned = await bkendFetch('/v1/files/presigned-url', {
  method: 'POST',
  body: {
    filename: 'cover-jeju.jpg',
    contentType: 'image/jpeg',
    fileSize: 2048000,
    visibility: 'public',
    category: 'images',
  },
});

// 2. Upload immediately
await fetch(presigned.url, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/jpeg' },
  body: file,
});
```

***

### Image Not Displaying

**Symptom:** The image does not load when accessing the `coverImage` URL in an article.

**Possible causes:**

| Cause | How to Check | Solution |
|-------|-------------|----------|
| File was deleted | `GET /v1/files/{fileId}` → 404 | Re-upload the image |
| visibility is `private` | Check `visibility` in file metadata | Change to `public` |
| Wrong URL | Check the article's `coverImage` value | Update with the correct URL |

***

### File Size Exceeded

```json
{
  "statusCode": 400,
  "error": "FILE_TOO_LARGE",
  "message": "File size exceeds the limit"
}
```

**Solution:**

1. Compress the image and re-upload.
2. Use a lower resolution.
3. Check supported formats: JPEG, PNG, GIF, WebP.

***

### Authorization Error During File Upload

**Symptom:** Authentication error when uploading to the Presigned URL.

**Cause:** The `Authorization` header was included when uploading.

**Solution:** Remove the `Authorization` header when uploading to the Presigned URL. The Presigned URL itself contains authentication information.

```javascript
// ❌ Wrong — Authorization header included
await fetch(presigned.url, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type,
    'Authorization': `Bearer ${token}`, // Remove this
  },
  body: file,
});

// ✅ Correct — Only Content-Type included
await fetch(presigned.url, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type,
  },
  body: file,
});
```

***

## Tag Issues

### Duplicate Tag Name

```json
{
  "statusCode": 409,
  "error": "DUPLICATE_VALUE",
  "message": "A record with the same value already exists"
}
```

**Cause:** A tag with the same name already exists.

**Solution:** Query existing tags first.

```bash
# Check existing tags
curl -X GET "https://api-client.bkend.ai/v1/data/tags?andFilters=%7B%22name%22%3A%22travel%22%7D" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

```javascript
// Check with bkendFetch
const filters = JSON.stringify({ name: 'travel' });
const existing = await bkendFetch(
  `/v1/data/tags?andFilters=${encodeURIComponent(filters)}`
);

if (existing.items.length > 0) {
  console.log('Tag already exists:', existing.items[0].id);
} else {
  // Create new tag
}
```

***

### Residual Tag IDs After Tag Deletion

**Symptom:** After deleting a tag, the deleted tag ID still remains in article `tags` arrays.

**Cause:** Deleting a tag does not automatically clean up article `tags` fields.

**Solution:** Find articles referencing the deleted tag and update them.

```javascript
// 1. Identify the tag ID to delete
const tagId = 'tag-uuid-life';

// 2. Find articles using this tag
const filters = JSON.stringify({ tags: tagId });
const articles = await bkendFetch(
  `/v1/data/articles?andFilters=${encodeURIComponent(filters)}`
);

// 3. Remove tag from each article
for (const article of articles.items) {
  const updatedTags = article.tags.filter(t => t !== tagId);
  await bkendFetch(`/v1/data/articles/${article.id}`, {
    method: 'PATCH',
    body: { tags: updatedTags },
  });
}

// 4. Delete the tag
await bkendFetch(`/v1/data/tags/${tagId}`, { method: 'DELETE' });
```

***

## Bookmark Issues

### Duplicate Bookmark (409)

```json
{
  "statusCode": 409,
  "error": "DUPLICATE_VALUE",
  "message": "A record with the same value already exists"
}
```

**Cause:** Attempted to bookmark an already bookmarked article.

**Solution:** Use the bookmark toggle pattern.

```javascript
async function toggleBookmark(articleId) {
  const filters = JSON.stringify({ articleId });
  const result = await bkendFetch(
    `/v1/data/bookmarks?andFilters=${encodeURIComponent(filters)}`
  );

  if (result.items.length > 0) {
    // Already bookmarked → delete
    await bkendFetch(`/v1/data/bookmarks/${result.items[0].id}`, {
      method: 'DELETE',
    });
    return { bookmarked: false };
  } else {
    // Not bookmarked → add
    const bookmark = await bkendFetch('/v1/data/bookmarks', {
      method: 'POST',
      body: { articleId },
    });
    return { bookmarked: true, bookmarkId: bookmark.id };
  }
}
```

***

## MCP Tool Issues

### AI Cannot Find the Table

**Symptom:** You ask the AI to "write an article" but it responds that it cannot find the table.

**Possible causes:**

1. No project is selected in the MCP session.
2. The table has not been created yet.
3. The Environment setting is different.

**Solution:**

1. Ask the AI: "Check which project is currently connected."
2. If the project is correct, ask: "Show me the articles table list" to verify existence.
3. If the table does not exist, ask the AI to create it following Step 1 in [02-articles.md](02-articles.md).

***

### MCP Connection Failed

**Symptom:** The AI tool shows an error that it cannot connect to the bkend MCP server.

**Checklist:**

| Item | How to Check |
|------|-------------|
| MCP Server URL | Verify it is set to `https://api.bkend.ai/mcp` |
| OAuth Authentication | Re-authenticate if expired |
| Network | Check internet connection |

**Solution:**

1. Restart the AI tool.
2. Check the MCP server settings.
3. Perform OAuth re-authentication.

{% hint style="info" %}
💡 See [MCP Overview](../../../mcp/01-overview.md) for detailed MCP setup instructions.
{% endhint %}

***

## Query Issues

### Filter Syntax Error

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid filter format"
}
```

**Solution:** Pass a valid JSON string to the `andFilters` parameter.

```javascript
// ❌ Wrong — passing object instead of string
fetch('/v1/data/articles?andFilters={category:travel}');

// ✅ Correct — URL-encoded JSON string
const filters = JSON.stringify({ category: 'travel' });
fetch(`/v1/data/articles?andFilters=${encodeURIComponent(filters)}`);
```

***

### Sorting Not Applied

**Cause:** Only `sortBy` was specified without `sortDirection`, or a non-existent field name was used.

**Solution:**

```bash
# ❌ Wrong — sortDirection missing
curl "https://api-client.bkend.ai/v1/data/articles?sortBy=createdAt"

# ✅ Correct
curl "https://api-client.bkend.ai/v1/data/articles?sortBy=createdAt&sortDirection=desc"
```

| Parameter | Allowed Values | Default |
|-----------|----------------|:-------:|
| `sortBy` | Field name existing in the table | - |
| `sortDirection` | `asc`, `desc` | `desc` |

***

## Network Issues

### Request Timeout

**Symptom:** API calls take a long time without response.

**Solution:**

1. Check your network connection.
2. Reduce the `limit` parameter to decrease response data volume.
3. Retry the request.

```javascript
// Set an appropriate limit
const result = await bkendFetch('/v1/data/articles?page=1&limit=10');
```

***

## Reference Docs

- [Error Handling Guide](../../../guides/11-error-handling.md) — Error codes and handling patterns in detail
- [Token Management](../../../authentication/20-token-management.md) — Token storage and auto-refresh patterns
- [Integrate bkend in Your App](../../../getting-started/06-app-integration.md) — bkendFetch helper setup

## Previous Step

Check MCP AI prompts for blog management in [AI Prompt Collection](06-ai-prompts.md).
