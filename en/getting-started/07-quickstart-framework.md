# Framework Quick Start

{% hint style="info" %}
Integrate bkend with your preferred framework. This guide assumes you have completed the [Quick Start](02-quickstart.md).
{% endhint %}

## Overview

The bkend REST API works the same regardless of framework. Here we cover setup for the two most popular options: **Next.js** and **Flutter**.

***

## Prerequisites

| Item | Where to Find |
|------|---------------|
| Publishable Key | Console > **API Keys** |

***

## Next.js

### 1. Set Environment Variables

Create a `.env.local` file in your project root.

```bash
NEXT_PUBLIC_BKEND_API_URL=https://api-client.bkend.ai
NEXT_PUBLIC_BKEND_PUBLISHABLE_KEY={pk_publishable_key}
```

{% hint style="warning" %}
Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the client. Never put a Secret Key in a `NEXT_PUBLIC_` variable.
{% endhint %}

### 2. Create a Fetch Helper

```typescript
// lib/bkend.ts
const API_BASE = process.env.NEXT_PUBLIC_BKEND_API_URL!;
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_BKEND_PUBLISHABLE_KEY!;

export async function bkendFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': PUBLISHABLE_KEY,
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}
```

### 3. Fetch Data Example

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

### 1. Environment Setup

Create a config file in the `lib/config/` directory.

```dart
// lib/config/bkend_config.dart
class BkendConfig {
  static const String apiUrl = 'https://api-client.bkend.ai';
  static const String publishableKey = '{pk_publishable_key}';
}
```

### 2. HTTP Client Setup

Use the `dio` package.

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
        'X-API-Key': BkendConfig.publishableKey,
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

### 3. Fetch Data Example

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
      appBar: AppBar(title: const Text('Posts')),
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
Your framework setup is complete. For more detailed integration patterns, see [Integrating bkend in Your App](03-app-integration.md).
{% endhint %}

***

## Next Steps

- [Integrating bkend in Your App](03-app-integration.md) — Fetch helper, token refresh, error handling
- [Token Storage and Refresh](../authentication/20-token-management.md) — Access Token auto-refresh strategies
- [Auth Form Patterns](../authentication/21-auth-form-patterns.md) — Signup and login form implementation
- [Hands-on Project Cookbook](../../cookbooks/README.md) — Build real apps for each framework
