# bkend 데이터 내보내기

{% hint style="danger" %}
⚠️ **bkend 서비스는 2026년 5월 15일에 종료됩니다.** 그 전에 데이터를 내보내세요. 서비스 종료 후에는 데이터 복구가 불가능합니다.
{% endhint %}

이 가이드는 bkend에 저장된 테이블 데이터와 파일 스토리지를 AI 도구 또는 REST API로 내보내는 방법을 안내합니다.

---

## 시작하기 전에

### 내보낼 수 있는 데이터

| 데이터 종류 | 설명 |
|------------|------|
| **테이블 레코드** | 직접 생성한 커스텀 테이블의 row 데이터 |
| **파일 스토리지** | bkend Storage API로 업로드한 파일 |

{% hint style="info" %}
💡 시스템 테이블(`accounts`, `sessions`, `users`, `files`)은 bkend가 내부적으로 관리합니다. 직접 생성한 커스텀 테이블을 중심으로 내보내세요.
{% endhint %}

### 어떤 방법을 사용할까요?

| | 방법 A: REST API | 방법 B: AI 도구 |
|---|---|---|
| **테이블 목록 파악** | 직접 확인 (콘솔) | MCP로 자동 조회 |
| **필요한 것** | `curl` | MCP 지원 AI 도구 |
| **호환 도구** | 터미널 | Claude Code, Cursor, VS Code 등 |
| **추천 대상** | curl에 익숙한 개발자 | AI 코딩 도구 사용자 |

{% hint style="info" %}
💡 **Claude Code, Cursor 등 MCP 지원 AI 도구를 사용하고 있다면 → 방법 B로 바로 이동하세요.**
테이블 이름이 자동으로 조회되어 콘솔을 직접 확인할 필요가 없습니다.
{% endhint %}

### 필요한 것

- **Publishable Key** (`pk_...`) — 콘솔 → 프로젝트 → **API Keys**에서 확인
- **bkend 계정 이메일과 비밀번호**

### 테이블 이름 확인하기

{% hint style="info" %}
💡 **방법 B(AI 도구)를 사용한다면 이 단계를 건너뛰세요.** AI 도구가 MCP를 통해 테이블 이름을 자동으로 조회합니다.
{% endhint %}

테이블 목록을 조회하는 REST API는 없습니다. 콘솔에서 직접 확인하세요:

1. [console.bkend.ai](https://console.bkend.ai) 접속
2. 프로젝트 → **데이터베이스** 클릭
3. 커스텀 테이블 이름을 모두 메모해두세요

---

## 방법 B: AI 도구 + bkend MCP

MCP를 지원하는 AI 도구(Claude Code, Cursor, VS Code 등)를 사용한다면 가장 빠른 방법입니다. AI 도구가 테이블 목록을 자동으로 파악하고 내보내기 스크립트를 생성하여 실행해줍니다.

### Step 1: bkend MCP 연결

도구별 설정 방법은 아래 가이드를 참고하세요:

→ [MCP 설정 가이드](../mcp/02-setup.md) — Claude Code, Cursor, VS Code 등

Claude Code의 경우:

```bash
claude mcp add --scope user bkend --transport http https://api.bkend.ai/mcp
```

### Step 2: 인증

도구별 인증 방법은 [MCP 설정 가이드](../mcp/02-setup.md)를 참고하세요.

Claude Code의 경우:

```bash
claude /mcp
```

**bkend** → **Authenticate** 선택. 브라우저가 열리면 로그인 후 연결을 승인하세요.

### Step 3: AI 도구에 내보내기 요청

```text
내 bkend 데이터를 모두 로컬 파일로 내보내줘.
테이블 레코드는 JSON으로 백업하고, 스토리지 파일도 전부 다운로드해줘.
Publishable Key는 pk_... 이고 이메일은 your@email.com이야.
```

AI 도구가 MCP로 테이블 목록과 스키마를 조회한 뒤, 내보내기 스크립트를 생성하고 실행합니다.

{% hint style="warning" %}
⚠️ 프로젝트에 테이블이 많은 경우, AI 도구가 모든 테이블을 자동으로 찾지 못할 수 있습니다. 내보내기 후 누락된 테이블이 있다면 콘솔 → **데이터베이스**에서 테이블 목록을 확인하고, 이름을 프롬프트에 직접 포함하여 다시 요청하세요.
{% endhint %}

### Step 4: 결과 확인

```text
테이블 몇 개가 내보내졌고 파일은 몇 개 다운로드됐어?
저장된 내용 요약해줘.
```

---

## 방법 A: REST API로 내보내기

### Step 1: Access Token 발급

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

응답:

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

`data.accessToken` 값을 복사해두세요. 이후 모든 요청에 사용합니다. 토큰은 1시간 후 만료되며, `401` 에러가 발생하면 이 단계를 다시 실행하세요.

자세한 내용은 [이메일 로그인](../authentication/03-email-signin.md)을 참고하세요.

---

### Step 2: 테이블 데이터 내보내기

커스텀 테이블마다 아래 명령을 실행하세요.

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/YOUR_TABLE_NAME?page=1&limit=100" \
  -H "X-API-Key: YOUR_PK_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

응답:

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

`data.pagination.hasNext`가 `false`가 될 때까지 `page=2`, `page=3`, ... 으로 반복합니다. 자세한 내용은 [정렬 & 페이지네이션](../database/09-sorting-pagination.md)을 참고하세요.

#### 스크립트: 전체 페이지 자동 내보내기

아래 내용을 `export-table.sh`로 저장하고 `bash export-table.sh`로 실행하세요:

```bash
#!/bin/bash
PK_KEY="YOUR_PK_KEY"
ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
TABLE="YOUR_TABLE_NAME"

page=1
while true; do
  echo "페이지 $page 가져오는 중..."
  response=$(curl -s "https://api-client.bkend.ai/v1/data/$TABLE?page=$page&limit=100" \
    -H "X-API-Key: $PK_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  echo "$response" > "${TABLE}_page${page}.json"

  has_next=$(echo "$response" | grep -o '"hasNext":true')
  if [ -z "$has_next" ]; then
    echo "완료. 전체 페이지가 저장되었습니다."
    break
  fi
  page=$((page + 1))
done
```

테이블마다 `TABLE` 값을 바꿔서 한 번씩 실행하세요.

---

### Step 3: 파일 스토리지 내보내기

#### 파일 목록 조회

```bash
curl -X GET "https://api-client.bkend.ai/v1/files?page=1&limit=100" \
  -H "X-API-Key: YOUR_PK_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

`data.items`의 각 항목에 파일 `id`와 `originalName`이 포함됩니다.

#### 파일별 다운로드 URL 발급

```bash
curl -X POST "https://api-client.bkend.ai/v1/files/FILE_ID/download-url" \
  -H "X-API-Key: YOUR_PK_KEY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

응답:

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

`data.url`로 파일을 다운로드합니다:

```bash
curl -L "DOWNLOAD_URL" -o photo.jpg
```

자세한 내용은 [파일 다운로드](../storage/06-download.md)를 참고하세요.

#### 스크립트: 전체 파일 자동 다운로드

아래 내용을 `export-files.sh`로 저장하고 `bash export-files.sh`로 실행하세요:

```bash
#!/bin/bash
PK_KEY="YOUR_PK_KEY"
ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
OUTPUT_DIR="bkend_files"

mkdir -p "$OUTPUT_DIR"

page=1
while true; do
  echo "파일 목록 조회 중, 페이지 $page..."
  response=$(curl -s "https://api-client.bkend.ai/v1/files?page=$page&limit=100" \
    -H "X-API-Key: $PK_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

  echo "$response" | jq -c '.data.items[]' | while read -r file; do
    file_id=$(echo "$file" | jq -r '.id')
    file_name=$(echo "$file" | jq -r '.originalName')

    echo "다운로드 중: $file_name"
    download_url=$(curl -s -X POST "https://api-client.bkend.ai/v1/files/$file_id/download-url" \
      -H "X-API-Key: $PK_KEY" \
      -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.data.url')

    curl -sL "$download_url" -o "$OUTPUT_DIR/$file_name"
  done

  has_next=$(echo "$response" | grep -o '"hasNextPage":true')
  if [ -z "$has_next" ]; then
    echo "완료. 모든 파일이 $OUTPUT_DIR/ 에 저장되었습니다."
    break
  fi
  page=$((page + 1))
done
```

{% hint style="info" %}
💡 이 스크립트는 [`jq`](https://jqlang.github.io/jq/)가 필요합니다. `brew install jq` (macOS) 또는 `apt install jq` (Ubuntu/Debian)로 설치하세요.
{% endhint %}

---

## FAQ

**내 데이터가 얼마나 있는지 어떻게 확인하나요?**

콘솔 → 프로젝트 → **데이터베이스**에서 테이블별 row 수를 확인할 수 있습니다. 파일은 **Storage**에서 확인하세요.

**프로젝트나 환경이 여러 개예요. 각각 따로 내보내야 하나요?**

네. Publishable Key는 프로젝트와 환경(Production/Staging)별로 다릅니다. 각 환경의 PK Key로 내보내기 단계를 반복하세요. 콘솔에서 프로젝트를 전환하면 해당 환경의 Publishable Key를 확인할 수 있습니다.

**스크립트 실행 중에 토큰이 만료됐어요.**

Access Token은 발급 후 1시간이 지나면 만료됩니다. 데이터가 많을 경우 스크립트 실행 중 만료될 수 있습니다. Step 1을 다시 실행해 새 토큰을 발급받은 뒤, 스크립트의 `ACCESS_TOKEN` 값을 교체하고 마지막으로 저장된 페이지 다음부터 재시작하세요.

**파일 이름이 중복되면 덮어써지나요?**

네. `export-files.sh`는 파일을 `originalName` 기준으로 저장하므로, 같은 이름의 파일이 여러 개라면 나중에 다운로드된 파일이 앞의 파일을 덮어씁니다. 중복이 우려된다면 스크립트의 저장 줄을 아래와 같이 수정해 파일 ID를 이름에 포함시키세요.

```bash
curl -sL "$download_url" -o "$OUTPUT_DIR/${file_id}_${file_name}"
```

**`401` 또는 `403` 에러가 나요.**

- `X-API-Key`가 `pk_`로 시작하는지 확인하세요 (`sk_` 아님)
- Access Token은 1시간 후 만료됩니다. Step 1을 다시 실행해 새 토큰을 발급받으세요
- `403 data/permission-denied`는 테이블에 RLS 제한이 있는 경우입니다. `Authorization` 헤더가 제대로 포함되어 있는지 확인하세요

**5월 15일 이후에도 데이터를 받을 수 있나요?**

아니요. 서비스 종료와 함께 모든 데이터가 영구 삭제됩니다. 반드시 종료 전에 내보내세요.

**도움이 필요해요.**

[support@bkend.ai](mailto:support@bkend.ai)로 문의해주세요.
