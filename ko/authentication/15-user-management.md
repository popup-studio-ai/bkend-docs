# 사용자 관리

{% hint style="info" %}
💡 프로젝트에 등록된 User를 조회하고, 역할 · 설정 · 알림을 관리하세요.
{% endhint %}

## 개요

사용자 관리 API를 통해 프로젝트에 등록된 User의 목록 조회, 상세 조회, 역할 변경, 선호도 설정, 알림 설정 등을 수행할 수 있습니다.

***

## 사용자 목록 조회

### GET /v1/users

{% tabs %}
{% tab title="cURL" %}
```bash
curl -X GET "https://api-client.bkend.ai/v1/users?page=1&limit=20&sortBy=createdAt&sortDirection=desc" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```
{% endtab %}
{% tab title="JavaScript" %}
```javascript
const params = new URLSearchParams({
  page: '1',
  limit: '20',
  sortBy: 'createdAt',
  sortDirection: 'desc',
});

const response = await fetch(`https://api-client.bkend.ai/v1/users?${params}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Project-Id': '{project_id}',
    'X-Environment': 'dev',
  },
});
```
{% endtab %}
{% endtabs %}

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| `page` | `number` | - | 페이지 번호 (기본값: 1) |
| `limit` | `number` | - | 페이지당 항목 수 (1~100, 기본값: 20) |
| `search` | `string` | - | 이름/닉네임/이메일 검색 |
| `searchType` | `string` | - | `name`, `nickname`, `email` |
| `sortBy` | `string` | - | `createdAt`, `updatedAt`, `name`, `email`, `role` |
| `sortDirection` | `string` | - | `asc` 또는 `desc` (기본값: `desc`) |
| `includeAccounts` | `boolean` | - | 연동 계정 정보 포함 여부 |

### 응답

```json
{
  "items": [
    {
      "id": "user-uuid",
      "role": "user",
      "name": "홍길동",
      "nickname": "gildong",
      "email": "user@example.com",
      "image": "https://...",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

{% hint style="info" %}
💡 응답 필드는 요청자의 역할에 따라 필터링됩니다. Admin은 모든 필드를 조회할 수 있고, 일반 User는 공개 필드만 조회할 수 있습니다.
{% endhint %}

***

## 사용자 상세 조회

### GET /v1/users/:userId

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

***

## 사용자 생성

### POST /v1/users

서버에서 직접 User를 생성할 때 사용합니다.

```bash
curl -X POST https://api-client.bkend.ai/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "name": "새 사용자",
    "email": "newuser@example.com",
    "role": "user"
  }'
```

***

## 사용자 수정

### PATCH /v1/users/:userId

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "name": "수정된 이름"
  }'
```

***

## 사용자 삭제

### DELETE /v1/users/:userId

```bash
curl -X DELETE https://api-client.bkend.ai/v1/users/{userId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

{% hint style="danger" %}
🚨 **위험** — 사용자 삭제는 소프트 삭제(soft delete)로 처리됩니다. 삭제된 사용자의 데이터는 일정 기간 보존됩니다.
{% endhint %}

***

## 역할 변경

### PATCH /v1/users/:userId/role

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "role": "admin"
  }'
```

| 역할 | 설명 |
|------|------|
| `admin` | 관리자 |
| `user` | 일반 사용자 |
| `guest` | 게스트 |

***

## 선호도 설정

### GET /v1/users/:userId/preferences

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId}/preferences \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### PATCH /v1/users/:userId/preferences

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "locale": "ko",
    "timezone": "Asia/Seoul",
    "theme": "dark"
  }'
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `locale` | `string` \| `null` | 언어 설정 (예: `ko`, `en`, `ja`) |
| `timezone` | `string` \| `null` | 시간대 (IANA 형식, 예: `Asia/Seoul`) |
| `theme` | `string` \| `null` | 테마 (`light`, `dark`, `system`) |

***

## 알림 설정

### GET /v1/users/:userId/notifications

```bash
curl -X GET https://api-client.bkend.ai/v1/users/{userId}/notifications \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

### PATCH /v1/users/:userId/notifications

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "marketing": false,
    "push": true,
    "email": true,
    "sms": false,
    "nightTime": false
  }'
```

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|:------:|------|
| `service` | `boolean` | `true` | 서비스 알림 |
| `marketing` | `boolean` | `false` | 마케팅 알림 |
| `push` | `boolean` | `true` | 푸시 알림 |
| `email` | `boolean` | `true` | 이메일 알림 |
| `sms` | `boolean` | `false` | SMS 알림 |
| `nightTime` | `boolean` | `false` | 야간 알림 (22:00~08:00) |
| `securityAlerts` | `boolean` | `true` | 보안 알림 |

***

## 공개 프로필 설정

### PATCH /v1/users/:userId/public-settings

프로필의 공개 범위를 설정합니다.

```bash
curl -X PATCH https://api-client.bkend.ai/v1/users/{userId}/public-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "slug": "gildong",
    "isPublic": true
  }'
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `slug` | `string` \| `null` | 공개 프로필 URL 슬러그 |
| `isPublic` | `boolean` | 프로필 공개 여부 (기본값: `false`) |

***

## 에러 응답

| 에러 코드 | HTTP | 설명 |
|----------|:----:|------|
| `user/not-found` | 404 | 사용자를 찾을 수 없음 |
| `user/unauthorized` | 401 | 인증이 필요함 |
| `user/forbidden` | 403 | 권한 없음 |
| `user/invalid-role` | 400 | 유효하지 않은 역할 |

***

## 다음 단계

- [사용자 프로필](14-user-profile.md) — 프로필 및 아바타 관리
- [초대 시스템](13-invitation.md) — 새 사용자 초대
- [RLS 정책](../security/05-rls-policies.md) — 역할 기반 데이터 접근
