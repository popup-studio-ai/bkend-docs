import 'dart:convert';
import 'dart:math';

import 'package:dio/dio.dart';

import 'mock_data.dart';

/// Mock mode Dio interceptor.
///
/// Intercepts all HTTP requests and responds with in-memory mock data.
/// Activated with `--dart-define=MOCK_MODE=true` (default).
class MockInterceptor extends Interceptor {
  // In-memory data store for CRUD operations (copied from initial mock data)
  final List<Map<String, dynamic>> _profiles = List.from(mockProfiles);
  final List<Map<String, dynamic>> _posts = List.from(mockPosts);
  final List<Map<String, dynamic>> _comments = List.from(mockComments);
  final List<Map<String, dynamic>> _likes = List.from(mockLikes);
  final List<Map<String, dynamic>> _follows = List.from(mockFollows);

  int _idCounter = 1000;
  String _nextId(String prefix) => '$prefix-${_idCounter++}';

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Simulate network delay (200~500ms)
    await Future.delayed(
      Duration(milliseconds: 200 + Random().nextInt(300)),
    );

    try {
      final result = _route(options);
      handler.resolve(
        Response(
          requestOptions: options,
          statusCode: result.statusCode,
          data: result.data,
        ),
      );
    } catch (e) {
      handler.resolve(
        Response(
          requestOptions: options,
          statusCode: 500,
          data: {'message': 'Mock internal error: $e'},
        ),
      );
    }
  }

  // -------------------------------------------------------------------------
  // Routing
  // -------------------------------------------------------------------------

  _MockResponse _route(RequestOptions options) {
    final path = options.path;
    final method = options.method.toUpperCase();

    // --- Auth ---
    if (path == '/v1/auth/email/signup' && method == 'POST') {
      return _handleSignUp(options);
    }
    if (path == '/v1/auth/email/signin' && method == 'POST') {
      return _handleSignIn(options);
    }
    if (path == '/v1/auth/refresh' && method == 'POST') {
      return _handleRefresh();
    }
    if (path == '/v1/auth/me' && method == 'GET') {
      return _handleMe();
    }

    // --- Presigned URL ---
    if (path == '/v1/files/presigned-url' && method == 'POST') {
      return _handlePresignedUrl(options);
    }

    // --- Data CRUD ---
    final dataMatch = RegExp(r'^/v1/data/(\w+)(?:/(.+))?$').firstMatch(path);
    if (dataMatch != null) {
      final tableName = dataMatch.group(1)!;
      final recordId = dataMatch.group(2);
      return _handleData(method, tableName, recordId, options);
    }

    return _MockResponse(404, {'message': 'Mock: Route not found — $path'});
  }

  // -------------------------------------------------------------------------
  // Auth handlers
  // -------------------------------------------------------------------------

  _MockResponse _handleSignUp(RequestOptions options) {
    final data = _bodyAsMap(options);
    final email = data['email'] as String?;
    if (email == null || email.isEmpty) {
      return _MockResponse(400, {'message': 'Please enter your email.'});
    }
    return _MockResponse(200, {
      ...mockAuthTokens,
      'user': {
        'id': 'user-1',
        'email': email,
        'name': data['name'] ?? 'Demo User',
      },
    });
  }

  _MockResponse _handleSignIn(RequestOptions options) {
    final data = _bodyAsMap(options);
    final email = data['email'] as String?;
    if (email == null || email.isEmpty) {
      return _MockResponse(400, {'message': 'Please enter your email.'});
    }
    return _MockResponse(200, {
      ...mockAuthTokens,
      'user': {
        'id': 'user-1',
        'email': email,
        'name': 'Demo User',
      },
    });
  }

  _MockResponse _handleRefresh() {
    return _MockResponse(200, mockAuthTokens);
  }

  _MockResponse _handleMe() {
    return _MockResponse(200, mockCurrentUser);
  }

  // -------------------------------------------------------------------------
  // Presigned URL handler
  // -------------------------------------------------------------------------

  _MockResponse _handlePresignedUrl(RequestOptions options) {
    final data = _bodyAsMap(options);
    final filename = data['filename'] ?? 'file.png';
    final key = 'uploads/${DateTime.now().millisecondsSinceEpoch}_$filename';
    return _MockResponse(200, {
      'url': 'https://picsum.photos/seed/$filename/600/600',
      'key': key,
    });
  }

  // -------------------------------------------------------------------------
  // Data CRUD handlers
  // -------------------------------------------------------------------------

  _MockResponse _handleData(
    String method,
    String tableName,
    String? recordId,
    RequestOptions options,
  ) {
    final store = _storeFor(tableName);
    if (store == null) {
      return _MockResponse(404, {'message': 'Mock: Table not found — $tableName'});
    }

    switch (method) {
      case 'GET':
        if (recordId != null) {
          return _handleGetOne(store, recordId);
        }
        return _handleGetList(store, options);
      case 'POST':
        return _handleCreate(store, tableName, options);
      case 'PATCH':
        if (recordId == null) {
          return _MockResponse(400, {'message': 'ID is required.'});
        }
        return _handleUpdate(store, recordId, options);
      case 'DELETE':
        if (recordId == null) {
          return _MockResponse(400, {'message': 'ID is required.'});
        }
        return _handleDelete(store, recordId);
      default:
        return _MockResponse(405, {'message': 'Mock: Unsupported method — $method'});
    }
  }

  List<Map<String, dynamic>>? _storeFor(String tableName) {
    switch (tableName) {
      case 'profiles':
        return _profiles;
      case 'posts':
        return _posts;
      case 'comments':
        return _comments;
      case 'likes':
        return _likes;
      case 'follows':
        return _follows;
      default:
        return null;
    }
  }

  // --- GET (single) ---
  _MockResponse _handleGetOne(
    List<Map<String, dynamic>> store,
    String id,
  ) {
    final item = store.where((e) => e['id'] == id).firstOrNull;
    if (item == null) {
      return _MockResponse(404, {'message': 'Record not found.'});
    }
    return _MockResponse(200, Map<String, dynamic>.from(item));
  }

  // --- GET (list + filter/sort/pagination) ---
  _MockResponse _handleGetList(
    List<Map<String, dynamic>> store,
    RequestOptions options,
  ) {
    var items = List<Map<String, dynamic>>.from(store);

    // Parse andFilters
    final filtersParam = options.queryParameters['andFilters'];
    if (filtersParam != null) {
      final filters = filtersParam is String
          ? jsonDecode(filtersParam) as Map<String, dynamic>
          : filtersParam as Map<String, dynamic>;

      items = items.where((item) {
        for (final entry in filters.entries) {
          final value = entry.value;

          // Support $in operator (used in feed)
          if (value is Map && value.containsKey('\$in')) {
            final inList = value['\$in'] as List;
            if (!inList.contains(item[entry.key])) return false;
          } else {
            if (item[entry.key]?.toString() != value?.toString()) return false;
          }
        }
        return true;
      }).toList();
    }

    // Sort
    final sortBy = options.queryParameters['sortBy'] as String?;
    final sortDir = options.queryParameters['sortDirection'] as String?;
    if (sortBy != null) {
      items.sort((a, b) {
        final aVal = a[sortBy]?.toString() ?? '';
        final bVal = b[sortBy]?.toString() ?? '';
        return sortDir == 'desc' ? bVal.compareTo(aVal) : aVal.compareTo(bVal);
      });
    }

    // Pagination
    final page = _parseInt(options.queryParameters['page'], 1);
    final limit = _parseInt(options.queryParameters['limit'], 20);
    final total = items.length;
    final totalPages = (total / limit).ceil();
    final start = (page - 1) * limit;
    final end = start + limit > total ? total : start + limit;
    final paged = start < total ? items.sublist(start, end) : <Map<String, dynamic>>[];

    return _MockResponse(200, {
      'items': paged,
      'pagination': {
        'total': total,
        'page': page,
        'limit': limit,
        'totalPages': totalPages,
        'hasNext': page < totalPages,
        'hasPrev': page > 1,
      },
    });
  }

  // --- POST (create) ---
  _MockResponse _handleCreate(
    List<Map<String, dynamic>> store,
    String tableName,
    RequestOptions options,
  ) {
    final data = _bodyAsMap(options);
    final now = DateTime.now().toUtc().toIso8601String();
    final newItem = <String, dynamic>{
      'id': _nextId(tableName.substring(0, tableName.length - 1)),
      ...data,
      'createdBy': 'user-1', // Always demo user in mock mode
      'createdAt': now,
    };
    store.insert(0, newItem);

    // Increment post comment count
    if (tableName == 'comments') {
      final postId = data['postId'] as String?;
      if (postId != null) {
        final post = _posts.where((p) => p['id'] == postId).firstOrNull;
        if (post != null) {
          post['commentsCount'] = (post['commentsCount'] as int? ?? 0) + 1;
        }
      }
    }

    // Increment like count
    if (tableName == 'likes') {
      final postId = data['postId'] as String?;
      if (postId != null) {
        final post = _posts.where((p) => p['id'] == postId).firstOrNull;
        if (post != null) {
          post['likesCount'] = (post['likesCount'] as int? ?? 0) + 1;
        }
      }
    }

    return _MockResponse(201, Map<String, dynamic>.from(newItem));
  }

  // --- PATCH (update) ---
  _MockResponse _handleUpdate(
    List<Map<String, dynamic>> store,
    String id,
    RequestOptions options,
  ) {
    final idx = store.indexWhere((e) => e['id'] == id);
    if (idx == -1) {
      return _MockResponse(404, {'message': 'Record not found.'});
    }
    final data = _bodyAsMap(options);
    store[idx] = {...store[idx], ...data};
    return _MockResponse(200, Map<String, dynamic>.from(store[idx]));
  }

  // --- DELETE (delete) ---
  _MockResponse _handleDelete(
    List<Map<String, dynamic>> store,
    String id,
  ) {
    final idx = store.indexWhere((e) => e['id'] == id);
    if (idx == -1) {
      return _MockResponse(404, {'message': 'Record not found.'});
    }
    final removed = store.removeAt(idx);

    // Decrement post comment/like count on delete
    if (removed.containsKey('postId') && !removed.containsKey('followerId')) {
      final postId = removed['postId'] as String?;
      if (postId != null) {
        final post = _posts.where((p) => p['id'] == postId).firstOrNull;
        if (post != null) {
          // Determine if this is a comment or like deletion
          if (removed.containsKey('content')) {
            // comment
            post['commentsCount'] =
                ((post['commentsCount'] as int? ?? 1) - 1).clamp(0, 999999);
          } else {
            // like
            post['likesCount'] =
                ((post['likesCount'] as int? ?? 1) - 1).clamp(0, 999999);
          }
        }
      }
    }

    return _MockResponse(200, {'message': 'Deleted successfully.'});
  }

  // -------------------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------------------

  Map<String, dynamic> _bodyAsMap(RequestOptions options) {
    final data = options.data;
    if (data is Map<String, dynamic>) return data;
    if (data is String) {
      try {
        return jsonDecode(data) as Map<String, dynamic>;
      } catch (_) {
        return {};
      }
    }
    return {};
  }

  int _parseInt(dynamic value, int defaultValue) {
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? defaultValue;
    return defaultValue;
  }
}

// ---------------------------------------------------------------------------
// Internal response model
// ---------------------------------------------------------------------------

class _MockResponse {
  final int statusCode;
  final dynamic data;

  const _MockResponse(this.statusCode, this.data);
}
