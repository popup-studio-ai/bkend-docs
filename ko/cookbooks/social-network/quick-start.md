# 소셜 네트워크 Quick Start

{% hint style="info" %}
💡 10분 만에 프로필을 만들고 첫 게시물을 올려보세요.
{% endhint %}

## 사전 준비

- bkend 프로젝트 생성 완료
- API 키 발급 완료
- `profiles`, `posts` 테이블 생성 완료

***

## 1단계: 테이블 만들기

소셜 네트워크에 필요한 `profiles`와 `posts` 테이블을 생성하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"소셜 네트워크를 만들고 싶어요. 사용자 프로필을 저장할 곳이 필요한데, 닉네임, 자기소개, 프로필 사진을 관리할 수 있게 해주세요. 만들기 전에 어떤 구조로 만들지 먼저 보여주세요."
{% endhint %}

{% hint style="info" %}
💡 AI가 아래와 비슷한 구조를 제안하는지 확인하세요.

| 필드 | 설명 | 예시 값 |
|------|------|---------|
| nickname | 닉네임 | "홍길동" |
| bio | 자기소개 | "bkend로 소셜 네트워크를 만들고 있습니다" |
| avatarUrl | 프로필 사진 URL | (업로드 후 연결) |
{% endhint %}

프로필 저장소가 만들어지면 게시물 저장소도 요청하세요.

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"게시물도 저장할 곳이 필요해요. 글 내용, 이미지, 좋아요 수, 댓글 수를 관리할 수 있게 만들어주세요."
{% endhint %}

{% endtab %}
{% tab title="콘솔 + REST API" %}

**콘솔에서 테이블 생성:**

1. **데이터베이스** 메뉴로 이동하세요.
2. **테이블 추가** 버튼을 클릭하세요.
3. 테이블 이름: `profiles`를 입력하세요.
4. 다음 필드를 추가하세요.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `userId` | String | 사용자 ID |
| `nickname` | String | 닉네임 |
| `bio` | String | 소개 |
| `avatarUrl` | String | 프로필 사진 URL |

5. 같은 방법으로 `posts` 테이블을 생성하세요.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `content` | String | 본문 |
| `imageUrl` | String | 이미지 URL |
| `likesCount` | Number | 좋아요 수 |
| `commentsCount` | Number | 댓글 수 |

{% endtab %}
{% endtabs %}

***

## 2단계: 프로필 생성

나의 프로필을 만드세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"내 프로필을 만들어주세요. 닉네임은 '홍길동', 자기소개는 'bkend로 소셜 네트워크를 만들고 있습니다'로 해주세요."
{% endhint %}

{% endtab %}
{% tab title="콘솔 + REST API" %}

```bash
curl -X POST https://api-client.bkend.ai/v1/data/profiles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "userId": "my-user-id",
    "nickname": "홍길동",
    "bio": "bkend로 소셜 네트워크를 만들고 있습니다."
  }'
```

**응답 (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "userId": "my-user-id",
  "nickname": "홍길동",
  "bio": "bkend로 소셜 네트워크를 만들고 있습니다.",
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

{% endtab %}
{% endtabs %}

***

## 3단계: 게시물 작성

첫 번째 게시물을 올리세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"게시물을 하나 올려주세요. 내용은 '안녕하세요! bkend로 만든 소셜 네트워크에 첫 글을 올립니다.'로 해주세요."
{% endhint %}

{% endtab %}
{% tab title="콘솔 + REST API" %}

```bash
curl -X POST https://api-client.bkend.ai/v1/data/posts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "content": "안녕하세요! bkend로 만든 소셜 네트워크에 첫 글을 올립니다.",
    "likesCount": 0,
    "commentsCount": 0
  }'
```

**응답 (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439022",
  "content": "안녕하세요! bkend로 만든 소셜 네트워크에 첫 글을 올립니다.",
  "likesCount": 0,
  "commentsCount": 0,
  "createdBy": "user-uuid-1234",
  "createdAt": "2025-01-15T10:05:00.000Z"
}
```

{% endtab %}
{% endtabs %}

***

## 4단계: 게시물 조회

작성한 게시물 목록을 확인하세요.

{% tabs %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"최근에 올라온 게시물 10개만 보여주세요."
{% endhint %}

{% endtab %}
{% tab title="콘솔 + REST API" %}

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/posts?sortBy=createdAt&sortDirection=desc&limit=10" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**응답 (200 OK):**

```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439022",
      "content": "안녕하세요! bkend로 만든 소셜 네트워크에 첫 글을 올립니다.",
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

## 완료!

{% hint style="success" %}
✅ 축하합니다! 소셜 네트워크의 기본 기능을 체험했습니다.
{% endhint %}

### 배운 내용

| 단계 | API 엔드포인트 | 설명 |
|:----:|---------------|------|
| 2 | `POST /v1/data/profiles` | 프로필 생성 |
| 3 | `POST /v1/data/posts` | 게시물 작성 |
| 4 | `GET /v1/data/posts` | 게시물 목록 조회 |

***

## 다음 단계

- [Full Guide](full-guide/00-overview.md)에서 전체 기능을 단계별로 학습하세요.
- [게시물](full-guide/03-posts.md)에서 댓글과 좋아요 기능을 구현하세요.
- [팔로우](full-guide/04-follows.md)에서 팔로우 관계를 관리하세요.
- [AI 시나리오](full-guide/06-ai-prompts.md)에서 AI 활용 사례를 확인하세요.

***

## 참고 문서

- [데이터 생성](../../database/03-insert.md) — 데이터 생성 API 상세
- [데이터 조회](../../database/04-select.md) — 데이터 조회 API 상세
- [social-network-app 예제 프로젝트](../../../examples/social-network-app/) — 이 쿡북을 Flutter로 구현한 전체 코드
