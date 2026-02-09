# 레시피 앱 Quick Start

{% hint style="info" %}
💡 10분 만에 bkend로 레시피를 등록하고 조회하는 방법을 체험하세요.
{% endhint %}

## 사전 준비

| 항목 | 확인 |
|------|------|
| bkend 프로젝트 생성 | [프로젝트 관리](../../ko/console/04-project-management.md) |
| API Key 발급 | [API 키 관리](../../ko/console/11-api-keys.md) |
| AI 도구 연결 (MCP 트랙) | [AI 도구 연동](../../ko/ai-tools/01-overview.md) |

***

## 1단계: recipes 테이블 만들기

레시피 데이터를 저장할 동적 테이블을 생성하세요.

{% tabs %}
{% tab title="콘솔 + REST API" %}

1. 콘솔 → **테이블 관리** → **테이블 추가**를 클릭하세요.
2. 테이블 이름에 `recipes`를 입력하세요.
3. 다음 컬럼을 추가하세요:

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `title` | String | 레시피 이름 |
| `description` | String | 레시피 설명 |
| `cookingTime` | Number | 조리 시간 (분) |
| `servings` | Number | 인분 수 |
| `difficulty` | String | 난이도 (`easy` / `medium` / `hard`) |
| `category` | String | 카테고리 (한식, 양식 등) |

4. **저장**을 클릭하세요.

{% endtab %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"레시피를 저장하고 싶어요. 레시피 이름, 설명, 조리 시간, 난이도, 몇 인분인지, 카테고리를 관리할 수 있게 해주세요. 만들기 전에 어떤 구조로 만들지 먼저 보여주세요."
{% endhint %}

{% hint style="info" %}
💡 AI가 아래와 비슷한 구조를 제안하는지 확인하세요.
{% endhint %}

| 필드 | 설명 | 예시 값 |
|------|------|---------|
| title | 레시피 이름 | "김치찌개" |
| description | 간단 설명 | "매콤한 김치찌개" |
| cookingTime | 조리 시간(분) | 30 |
| difficulty | 난이도 | "easy" / "medium" / "hard" |
| servings | 인분 | 2 |
| category | 카테고리 | "한식" |

{% endtab %}
{% endtabs %}

***

## 2단계: 레시피 등록

recipes 테이블에 김치찌개 레시피를 등록하세요.

{% tabs %}
{% tab title="콘솔 + REST API" %}

```bash
curl -X POST https://api-client.bkend.ai/v1/data/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev" \
  -d '{
    "title": "김치찌개",
    "description": "돼지고기와 잘 익은 김치로 만드는 얼큰한 찌개",
    "cookingTime": 30,
    "servings": 2,
    "difficulty": "easy",
    "category": "한식"
  }'
```

**응답 예시:**

```json
{
  "id": "rec_abc123",
  "title": "김치찌개",
  "description": "돼지고기와 잘 익은 김치로 만드는 얼큰한 찌개",
  "cookingTime": 30,
  "servings": 2,
  "difficulty": "easy",
  "category": "한식",
  "createdBy": "user_123",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

{% endtab %}
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"새 레시피를 등록해주세요. 김치찌개, 조리시간 30분, 난이도 쉬움, 2인분, 한식이에요. 설명은 '돼지고기와 잘 익은 김치로 만드는 얼큰한 찌개'로 해주세요."
{% endhint %}

AI가 레시피를 저장합니다.

{% endtab %}
{% endtabs %}

***

## 3단계: 레시피 조회

등록한 레시피 목록을 조회하세요.

{% tabs %}
{% tab title="콘솔 + REST API" %}

```bash
curl -X GET "https://api-client.bkend.ai/v1/data/recipes?limit=10" \
  -H "Authorization: Bearer {accessToken}" \
  -H "X-Project-Id: {project_id}" \
  -H "X-Environment: dev"
```

**응답 예시:**

```json
{
  "items": [
    {
      "id": "rec_abc123",
      "title": "김치찌개",
      "cookingTime": 30,
      "servings": 2,
      "difficulty": "easy",
      "category": "한식",
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
{% tab title="MCP (AI 도구)" %}

{% hint style="success" %}
✅ **AI에게 이렇게 말해보세요**

"등록된 레시피 목록을 보여주세요."
{% endhint %}

AI가 저장된 레시피 목록을 조회하여 보여줍니다.

{% endtab %}
{% endtabs %}

***

## 완료

축하합니다! bkend로 레시피 앱의 기본 흐름을 체험했습니다.

### 배운 내용

| 작업 | REST API 엔드포인트 | MCP 도구 |
|------|---------------------|----------|
| 테이블 생성 | 콘솔 UI | `create_table` |
| 레시피 등록 | `POST /v1/data/recipes` | `create_recipes` |
| 레시피 조회 | `GET /v1/data/recipes` | `list_recipes` |

***

## 참고 문서

- [recipe-web 예제 프로젝트](../../examples/recipe-web/) — 이 쿡북의 웹 구현 코드
- [recipe-app 예제 프로젝트](../../examples/recipe-app/) — 이 쿡북의 앱 구현 코드

***

## 다음 단계

- [Full Guide](./full-guide/)에서 인증, 재료 관리, 식단 계획까지 상세하게 구현하세요.
- [레시피 관리](full-guide/02-recipes.md)에서 이미지 첨부, 수정, 삭제를 학습하세요.
- [AI 시나리오](full-guide/06-ai-prompts.md)에서 AI 레시피 추천을 체험하세요.
