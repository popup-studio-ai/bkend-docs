# 프레임워크별 빠른 시작

{% hint style="info" %}
💡 사용하는 프레임워크에 맞춰 bkend를 연동하세요. 이 가이드는 [빠른 시작](02-quickstart.md)을 완료한 상태를 전제합니다.
{% endhint %}

## 개요

bkend REST API는 프레임워크에 관계없이 동일하게 동작합니다. 여기서는 가장 많이 사용되는 **Next.js**와 **Flutter** 설정 방법을 안내합니다.

***

## 사전 준비

| 항목 | 확인 위치 |
|------|----------|
| API Key | 콘솔 → **API Keys** |

***

## Next.js

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하세요.

```bash
NEXT_PUBLIC_BKEND_API_URL=https://api-client.bkend.ai
NEXT_PUBLIC_BKEND_API_KEY={pk_publishable_key}
```

{% hint style="warning" %}
⚠️ `NEXT_PUBLIC_` 접두사가 붙은 환경 변수는 클라이언트에 노출됩니다. Secret Key(`sk_`)는 절대 `NEXT_PUBLIC_`에 넣지 마세요. Publishable Key(`pk_`)만 사용하세요.
{% endhint %}

### 2. fetch 헬퍼 생성

```typescript
// lib/bkend.ts
const API_BASE = process.env.NEXT_PUBLIC_BKEND_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_BKEND_API_KEY!;

export async function bkendFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `요청 실패 (${response.status})`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}
```

### 3. 데이터 조회 예시

```typescript
// app/posts/page.tsx
import { bkendFetch } from '@/lib/bkend';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface ListResponse {
  items: Post[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export default async function PostsPage() {
  const data = await bkendFetch<ListResponse>('/v1/data/posts?page=1&limit=10');

  return (
    <ul>
      {data.items.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

***

## Flutter

### 1. 환경 설정

`lib/config/` 디렉토리에 설정 파일을 생성하세요.

```dart
// lib/config/bkend_config.dart
class BkendConfig {
  static const String apiUrl = 'https://api-client.bkend.ai';
  static const String apiKey = '{pk_publishable_key}';
}
```

### 2. HTTP 클라이언트 설정

`dio` 패키지를 사용합니다.

```yaml
# pubspec.yaml
dependencies:
  dio: ^5.0.0
  shared_preferences: ^2.0.0
```

```dart
// lib/services/bkend_client.dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/bkend_config.dart';

class BkendClient {
  late final Dio _dio;

  BkendClient() {
    _dio = Dio(BaseOptions(
      baseUrl: BkendConfig.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BkendConfig.apiKey,
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('accessToken');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
    ));
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) =>
      _dio.get(path, queryParameters: queryParameters);

  Future<Response> post(String path, {dynamic data}) =>
      _dio.post(path, data: data);

  Future<Response> patch(String path, {dynamic data}) =>
      _dio.patch(path, data: data);

  Future<Response> delete(String path) => _dio.delete(path);
}
```

### 3. 데이터 조회 예시

```dart
// lib/screens/posts_screen.dart
import 'package:flutter/material.dart';
import '../services/bkend_client.dart';

class PostsScreen extends StatefulWidget {
  @override
  State<PostsScreen> createState() => _PostsScreenState();
}

class _PostsScreenState extends State<PostsScreen> {
  final _client = BkendClient();
  List<dynamic> _posts = [];

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    final response = await _client.get('/v1/data/posts', queryParameters: {
      'page': 1,
      'limit': 10,
    });
    setState(() {
      _posts = response.data['items'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('게시글')),
      body: ListView.builder(
        itemCount: _posts.length,
        itemBuilder: (context, index) => ListTile(
          title: Text(_posts[index]['title']),
        ),
      ),
    );
  }
}
```

{% hint style="success" %}
✅ 프레임워크 설정이 완료되었습니다. 더 자세한 연동 패턴은 [앱에서 bkend 연동하기](03-app-integration.md)를 참고하세요.
{% endhint %}

***

## 다음 단계

- [앱에서 bkend 연동하기](03-app-integration.md) — fetch 헬퍼, 토큰 갱신, 에러 처리
- [토큰 저장 및 갱신](../authentication/20-token-management.md) — Access Token 자동 갱신 전략
- [인증 폼 구현 패턴](../authentication/21-auth-form-patterns.md) — 회원가입/로그인 폼 구현
- [실전 프로젝트 쿡북](../../cookbooks/README.md) — 프레임워크별 실전 앱 구축
