# 사용자 프로필 & 아바타

{% hint style="info" %}
💡 User의 프로필 정보를 조회하고 수정하세요. 아바타 이미지도 관리할 수 있습니다.
{% endhint %}

## 개요

사용자 프로필 API를 사용하여 이름, 닉네임, 소개, 소셜 링크 등의 프로필 정보와 아바타 이미지를 관리할 수 있습니다.

***

## 프로필 조회

### GET /v1/users/:userId/profile

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId}/profile \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

**응답:**

```json
{
  "name": "홍길동",
  "nickname": "gildong",
  "email": "user@example.com",
  "mobile": "+821012345678",
  "gender": "male",
  "bio": "풀스택 개발자입니다.",
  "socialLinks": {
    "github": "https://github.com/gildong",
    "twitter": "https://twitter.com/gildong"
  }
}
```

***

## 프로필 수정

### PATCH /v1/users/:userId/profile

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/profile \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "nickname": "newgildong",
    "bio": "백엔드 개발자입니다.",
    "socialLinks": {
      "github": "https://github.com/newgildong"
    }
  }'
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const response = await fetch(`https://api-client.bkend.ai/v1/users/${userId}/profile`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '{pk_publishable_key}',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    nickname: 'newgildong',
    bio: '백엔드 개발자입니다.',
  }),
});
```
{% endtab %}
{% endtabs %}

### 요청 파라미터

모든 필드는 선택 사항입니다. 변경할 필드만 전달하세요.

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `name` | `string` | 이름 (1~100자) |
| `nickname` | `string` \| `null` | 닉네임 (1~50자) |
| `mobile` | `string` \| `null` | 연락처 (E.164 형식, 최대 20자) |
| `gender` | `string` \| `null` | `none`, `male`, `female`, `etc` |
| `bio` | `string` \| `null` | 한 줄 소개 (최대 500자) |
| `socialLinks` | `object` \| `null` | 소셜 링크 |

### socialLinks 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `github` | `string` \| `null` | GitHub 프로필 URL |
| `twitter` | `string` \| `null` | Twitter 프로필 URL |
| `linkedin` | `string` \| `null` | LinkedIn 프로필 URL |

{% hint style="info" %}
💡 필드에 `null`을 전달하면 해당 값이 제거됩니다.
{% endhint %}

***

## 아바타 관리

### 아바타 업로드 URL 생성

S3 Presigned URL을 발급받아 직접 업로드합니다.

#### POST /v1/users/:userId/avatar/upload-url

```bash
curl -X POST https://api-client.bkend.ai/v1/users/{userId}/avatar/upload-url \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "filename": "avatar.jpg",
    "contentType": "image/jpeg"
  }'
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `filename` | `string` | ✅ | 파일명 |
| `contentType` | `string` | ✅ | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |

**응답:**

```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "key": "avatars/user-uuid/avatar.jpg",
  "expiresAt": "2025-01-21T01:00:00.000Z"
}
```

### 아바타 업로드 후 저장

S3에 파일을 업로드한 후, S3 key를 등록하세요.

#### PATCH /v1/users/:userId/avatar

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/avatar \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "s3Key": "avatars/user-uuid/avatar.jpg"
  }'
```

### 아바타 삭제

#### DELETE /v1/users/:userId/avatar

```bash
curl -X DELETE https://api-client.bkend.ai/v1/users/{userId}/avatar \
  -H "X-API-Key: {pk_publishable_key}" \
  -H "Authorization: Bearer {accessToken}"
```

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `user/not-found` | 404 | 사용자를 찾을 수 없음 |
| `user/invalid-name` | 400 | 이름이 유효하지 않음 |
| `user/invalid-nickname` | 400 | 닉네임이 유효하지 않음 |
| `user/unauthorized` | 401 | 인증이 필요함 |
| `user/forbidden` | 403 | 다른 사용자의 프로필 수정 불가 |

***

## 다음 단계

- [사용자 관리](15-user-management.md) — 사용자 목록 및 역할 관리
- [공개 프로필](15-user-management.md#공개-프로필-설정) — 프로필 공개 설정
- [세션 관리](10-session-management.md) — 내 정보 조회
