# How to Export Your bkend Data

{% hint style="danger" %}
⚠️ **bkend service ends on May 15, 2026.** Export your data before that date. After service shutdown, data recovery is not possible.
{% endhint %}

This guide explains how to export all your data from bkend — table records and uploaded files — using your AI tool or the REST API directly.

---

## Before You Start

### What data can you export?

| Data Type | Description |
|-----------|-------------|
| **Table records** | Rows stored in your custom tables |
| **File storage** | Files you uploaded via the bkend Storage API |

{% hint style="info" %}
💡 System tables (`accounts`, `sessions`, `users`, `files`) are managed by bkend internally. Focus on the custom tables you created.
{% endhint %}

### Which method is right for you?

| | Method A: REST API | Method B: AI Tools |
|---|---|---|
| **Table discovery** | Manual (check Console) | Automatic via MCP |
| **Requirements** | `curl` | AI tool with MCP support |
| **Compatible tools** | Any terminal | Claude Code, Cursor, VS Code, etc. |
| **Best for** | Developers comfortable with curl | Anyone using an AI coding tool |

{% hint style="info" %}
💡 **Using Claude Code, Cursor, or another MCP-compatible AI tool? → Start with Method B.**
Your table names are discovered automatically — no need to check the Console manually.
{% endhint %}

### What you'll need

- **Publishable Key** (`pk_...`) — Console → your project → **API Keys**
- **Your bkend account email and password**

### Find your table names

{% hint style="info" %}
💡 **If you're using Method B (AI Tools), skip this step.** Your AI tool discovers table names automatically via MCP.
{% endhint %}

There is no REST API for listing tables. Check the Console directly:

1. Open [console.bkend.ai](https://console.bkend.ai)
2. Go to your project → **Database**
3. Note down all your custom table names

---

## Method B: AI Tools + bkend MCP

If you use an MCP-compatible AI tool (Claude Code, Cursor, VS Code, etc.), this is the fastest option. The AI tool will discover your tables automatically and generate export scripts for you.

### Step 1: Connect bkend MCP

Setup instructions vary by tool. Follow the guide for yours:

→ [MCP Setup Guide](../mcp/02-setup.md) — Claude Code, Cursor, VS Code, and more

For Claude Code:

```bash
claude mcp add --scope user bkend --transport http https://api.bkend.ai/mcp
```

### Step 2: Authenticate

Follow your tool's authentication flow as described in the [MCP Setup Guide](../mcp/02-setup.md).

For Claude Code:

```bash
claude /mcp
```

Select **bkend** → **Authenticate**. Your browser will open — log in and approve the connection.

### Step 3: Ask your AI tool to export your data

```text
Export all my bkend data to local files.
Back up all table records as JSON and download all files from storage.
My Publishable Key is pk_... and my email is your@email.com
```

The AI tool will retrieve your table names via MCP, generate an export script, and run it.

{% hint style="warning" %}
⚠️ If your project has many tables, the AI tool may not discover all of them automatically. If any tables seem to be missing from the export, check your table list in Console → **Database** and include the names explicitly in your prompt.
{% endhint %}

### Step 4: Verify the output

```text
How many tables were exported and how many files were downloaded?
Show me a summary of what was saved.
```

---

## Method A: REST API Export

### Step 1: Get an Access Token

```bash
curl -X POST https://api-client.bkend.ai/v1/auth/email/signin \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_PK_KEY" \
  -d '{
    "method": "password",
    "email": "your@email.com",
    "password": "yourpassword"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600
  }
}
```

Copy the `data.accessToken` value — you'll use it in all subsequent requests. The token expires in 1 hour; re-run this step if you get a `401` error.

For more detail, see [Email Sign-in](../authentication/03-email-signin.md).

---

### Step 2: Export Table Data

Run this for each custom table. Replace the placeholders with your values.

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/YOUR_TABLE_NAME?page=1&limit=100" \
  -H "X-API-Key: YOUR_PK_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 250,
      "page": 1,
      "limit": 100,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

Repeat with `page=2`, `page=3`, ... until `data.pagination.hasNext` is `false`. See [Sorting & Pagination](../database/09-sorting-pagination.md) for details.

#### Script: export all pages automatically

Save as `export-table.sh` and run `bash export-table.sh`:

```bash
#!/bin/bash
PK_KEY="YOUR_PK_KEY"
ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
TABLE="YOUR_TABLE_NAME"

page=1
while true; do
  echo "Fetching page $page..."
  response=$(curl -s "https://api-client.bkend.ai/v1/data/$TABLE?page=$page&limit=100" \
    -H "X-API-Key: $PK_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  echo "$response" > "${TABLE}_page${page}.json"

  has_next=$(echo "$response" | grep -o '"hasNext":true')
  if [ -z "$has_next" ]; then
    echo "Done. All pages saved."
    break
  fi
  page=$((page + 1))
done
```

Run once per table, changing the `TABLE` value each time.

---

### Step 3: Export File Storage

#### List all your files

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?page=1&limit=100" \
  -H "X-API-Key: YOUR_PK_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Each item in `data.items` includes a file `id` and `originalName`.

#### Get a download URL for each file

```bash
curl -X POST "https://api-client.bkend.ai/v1/files/FILE_ID/download-url" \
  -H "X-API-Key: YOUR_PK_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Response:

```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "filename": "photo.jpg",
    "contentType": "image/jpeg",
    "size": 204800,
    "expiresAt": "2026-05-15T12:00:00Z"
  }
}
```

Download using `data.url`:

```bash
curl -L "DOWNLOAD_URL" -o photo.jpg
```

For more detail, see [File Download](../storage/06-download.md).

#### Script: download all files automatically

Save as `export-files.sh` and run `bash export-files.sh`:

```bash
#!/bin/bash
PK_KEY="YOUR_PK_KEY"
ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
OUTPUT_DIR="bkend_files"

mkdir -p "$OUTPUT_DIR"

page=1
while true; do
  echo "Listing files, page $page..."
  response=$(curl -s "https://api-client.bkend.ai/v1/files?page=$page&limit=100" \
    -H "X-API-Key: $PK_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  echo "$response" | jq -c '.data.items[]' | while read -r file; do
    file_id=$(echo "$file" | jq -r '.id')
    file_name=$(echo "$file" | jq -r '.originalName')

    echo "Downloading: $file_name"
    download_url=$(curl -s -X POST "https://api-client.bkend.ai/v1/files/$file_id/download-url" \
      -H "X-API-Key: $PK_KEY" \
      -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.data.url')

    curl -sL "$download_url" -o "$OUTPUT_DIR/$file_name"
  done

  has_next=$(echo "$response" | grep -o '"hasNextPage":true')
  if [ -z "$has_next" ]; then
    echo "Done. All files saved to $OUTPUT_DIR/"
    break
  fi
  page=$((page + 1))
done
```

{% hint style="info" %}
💡 This script requires [`jq`](https://jqlang.github.io/jq/). Install with `brew install jq` (macOS) or `apt install jq` (Ubuntu/Debian).
{% endhint %}

---

## FAQ

**How do I check how much data I have?**

Console → your project → **Database**. Each table shows a row count. For files, check **Storage**.

**I have multiple projects or environments. Do I need to export each one separately?**

Yes. Each project and environment (Production/Staging) has its own Publishable Key. Repeat the export steps for each environment using the corresponding PK Key. Switch between projects in the Console to find each environment's key.

**My access token expired in the middle of the export.**

Access tokens are valid for 1 hour. If the token expires while the script is running, re-run Step 1 to get a new token, update the `ACCESS_TOKEN` value in the script, and restart from the last page that was saved successfully.

**Will files with the same name overwrite each other?**

Yes. `export-files.sh` saves files using `originalName`, so duplicate names will overwrite each other. If you're concerned about this, modify the save line in the script to include the file ID:

```bash
curl -sL "$download_url" -o "$OUTPUT_DIR/${file_id}_${file_name}"
```

**I'm getting a `401` or `403` error.**

- Make sure your `X-API-Key` starts with `pk_` (not `sk_`)
- Access tokens expire after 1 hour — re-run Step 1 to get a new one
- `403 data/permission-denied` means the table has RLS restrictions; ensure you're passing the `Authorization` header

**Can I access my data after May 15, 2026?**

No. All data will be permanently deleted when the service shuts down. Export your data before the deadline.

**I need help.**

Email us at [support@bkend.ai](mailto:support@bkend.ai).
