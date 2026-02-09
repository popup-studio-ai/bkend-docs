import 'dart:convert';
import 'package:dio/dio.dart';
import 'mock_data.dart';

/// Mock Interceptor: Intercepts all API requests and returns mock responses.
/// Activated with `--dart-define=MOCK_MODE=true`.
class MockInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final mockResponse = _getMockResponse(options);
    if (mockResponse != null) {
      handler.resolve(Response(
        requestOptions: options,
        statusCode: 200,
        data: mockResponse,
      ));
    } else {
      // Return 404 for unmatched requests
      handler.resolve(Response(
        requestOptions: options,
        statusCode: 404,
        data: {'message': 'Mock: No matching endpoint found.'},
      ));
    }
  }

  dynamic _getMockResponse(RequestOptions options) {
    final path = options.path;
    final method = options.method.toUpperCase();
    final queryParams = options.queryParameters;
    final data = options.data;

    // ─── Auth ───────────────────────────────────────────

    if (path == '/v1/auth/email/signup' && method == 'POST') {
      return MockData.authResponse();
    }

    if (path == '/v1/auth/email/signin' && method == 'POST') {
      return MockData.authResponse();
    }

    if (path == '/v1/auth/refresh' && method == 'POST') {
      return MockData.authResponse();
    }

    if (path == '/v1/auth/me' && method == 'GET') {
      return MockData.meResponse();
    }

    // ─── Files (Presigned URL) ──────────────────────────

    if (path == '/v1/files/presigned-url' && method == 'POST') {
      final body = _parseBody(data);
      final filename = body['filename'] as String? ?? 'image.jpg';
      return MockData.presignedUrlResponse(filename);
    }

    // ─── Data (Dynamic Tables) ──────────────────────────

    final dataMatch = RegExp(r'^/v1/data/(\w+)(?:/(.+))?$').firstMatch(path);
    if (dataMatch != null) {
      final tableName = dataMatch.group(1)!;
      final recordId = dataMatch.group(2);

      return _handleDataRequest(
        tableName: tableName,
        recordId: recordId,
        method: method,
        queryParams: queryParams,
        body: _parseBody(data),
      );
    }

    return null;
  }

  dynamic _handleDataRequest({
    required String tableName,
    String? recordId,
    required String method,
    required Map<String, dynamic> queryParams,
    required Map<String, dynamic> body,
  }) {
    switch (tableName) {
      case 'recipes':
        return _handleRecipes(recordId, method, queryParams, body);
      case 'ingredients':
        return _handleIngredients(recordId, method, queryParams, body);
      case 'meal_plans':
        return _handleMealPlans(recordId, method, queryParams, body);
      case 'shopping_lists':
        return _handleShoppingLists(recordId, method, queryParams, body);
      case 'cooking_logs':
        return _handleCookingLogs(recordId, method, queryParams, body);
      default:
        return MockData.paginatedResponse([]);
    }
  }

  // ─── Recipes ────────────────────────────────────────────

  dynamic _handleRecipes(
    String? id,
    String method,
    Map<String, dynamic> queryParams,
    Map<String, dynamic> body,
  ) {
    switch (method) {
      case 'GET':
        if (id != null) {
          return MockData.getRecipeById(id);
        }
        var items = List<Map<String, dynamic>>.from(MockData.recipes);
        items = _applyFilters(items, queryParams);
        items = _applySort(items, queryParams);
        final page = _parseInt(queryParams['page']) ?? 1;
        final limit = _parseInt(queryParams['limit']) ?? 10;
        return MockData.paginatedResponse(items, page: page, limit: limit);

      case 'POST':
        return MockData.addRecipe(body);

      case 'PATCH':
        if (id != null) return MockData.updateRecipe(id, body);
        return null;

      case 'DELETE':
        if (id != null) {
          MockData.deleteRecipe(id);
          return {'success': true};
        }
        return null;

      default:
        return null;
    }
  }

  // ─── Ingredients ────────────────────────────────────────

  dynamic _handleIngredients(
    String? id,
    String method,
    Map<String, dynamic> queryParams,
    Map<String, dynamic> body,
  ) {
    switch (method) {
      case 'GET':
        if (id != null) {
          // No single-item lookup but just in case
          return null;
        }
        final filters = _parseAndFilters(queryParams);

        // $in filter (multiple recipeIds)
        final recipeIdFilter = filters['recipeId'];
        List<Map<String, dynamic>> items;
        if (recipeIdFilter is Map && recipeIdFilter.containsKey('\$in')) {
          final recipeIds =
              List<String>.from(recipeIdFilter['\$in'] as List);
          items = MockData.getIngredientsByRecipeIds(recipeIds);
        } else if (recipeIdFilter is String) {
          items = MockData.getIngredientsByRecipeId(recipeIdFilter);
        } else {
          items = [];
        }

        items = _applySort(items, queryParams);
        final limit = _parseInt(queryParams['limit']) ?? 100;
        return MockData.paginatedResponse(items, limit: limit);

      case 'POST':
        return MockData.addIngredient(body);

      case 'PATCH':
        if (id != null) return MockData.updateIngredient(id, body);
        return null;

      case 'DELETE':
        if (id != null) {
          MockData.deleteIngredient(id);
          return {'success': true};
        }
        return null;

      default:
        return null;
    }
  }

  // ─── Meal Plans ─────────────────────────────────────────

  dynamic _handleMealPlans(
    String? id,
    String method,
    Map<String, dynamic> queryParams,
    Map<String, dynamic> body,
  ) {
    switch (method) {
      case 'GET':
        if (id != null) return null;
        final filters = _parseAndFilters(queryParams);
        final dateFilter = filters['date'];
        String? startDate;
        String? endDate;
        if (dateFilter is Map) {
          startDate = dateFilter['\$gte'] as String?;
          endDate = dateFilter['\$lte'] as String?;
        }
        final items = MockData.getMealPlans(
          startDate: startDate ?? '2020-01-01',
          endDate: endDate ?? '2099-12-31',
        );
        final limit = _parseInt(queryParams['limit']) ?? 50;
        return MockData.paginatedResponse(items, limit: limit);

      case 'POST':
        return MockData.addMealPlan(body);

      case 'PATCH':
        if (id != null) return MockData.updateMealPlan(id, body);
        return null;

      case 'DELETE':
        if (id != null) {
          MockData.deleteMealPlan(id);
          return {'success': true};
        }
        return null;

      default:
        return null;
    }
  }

  // ─── Shopping Lists ─────────────────────────────────────

  dynamic _handleShoppingLists(
    String? id,
    String method,
    Map<String, dynamic> queryParams,
    Map<String, dynamic> body,
  ) {
    switch (method) {
      case 'GET':
        if (id != null) return MockData.getShoppingListById(id);
        final items = MockData.shoppingLists;
        final page = _parseInt(queryParams['page']) ?? 1;
        final limit = _parseInt(queryParams['limit']) ?? 20;
        return MockData.paginatedResponse(
          List.from(items),
          page: page,
          limit: limit,
        );

      case 'POST':
        return MockData.addShoppingList(body);

      case 'PATCH':
        if (id != null) return MockData.updateShoppingList(id, body);
        return null;

      case 'DELETE':
        if (id != null) {
          MockData.deleteShoppingList(id);
          return {'success': true};
        }
        return null;

      default:
        return null;
    }
  }

  // ─── Cooking Logs ───────────────────────────────────────

  dynamic _handleCookingLogs(
    String? id,
    String method,
    Map<String, dynamic> queryParams,
    Map<String, dynamic> body,
  ) {
    switch (method) {
      case 'GET':
        if (id != null) return null;
        final filters = _parseAndFilters(queryParams);
        final recipeId = filters['recipeId'] as String?;
        final items = recipeId != null
            ? MockData.getCookingLogsByRecipeId(recipeId)
            : <Map<String, dynamic>>[];
        final page = _parseInt(queryParams['page']) ?? 1;
        final limit = _parseInt(queryParams['limit']) ?? 20;
        return MockData.paginatedResponse(items, page: page, limit: limit);

      case 'POST':
        return MockData.addCookingLog(body);

      case 'DELETE':
        if (id != null) {
          MockData.deleteCookingLog(id);
          return {'success': true};
        }
        return null;

      default:
        return null;
    }
  }

  // ─── Helpers ────────────────────────────────────────────

  Map<String, dynamic> _parseBody(dynamic data) {
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

  Map<String, dynamic> _parseAndFilters(Map<String, dynamic> queryParams) {
    final raw = queryParams['andFilters'];
    if (raw == null) return {};
    if (raw is String) {
      try {
        return jsonDecode(raw) as Map<String, dynamic>;
      } catch (_) {
        return {};
      }
    }
    if (raw is Map<String, dynamic>) return raw;
    return {};
  }

  List<Map<String, dynamic>> _applyFilters(
    List<Map<String, dynamic>> items,
    Map<String, dynamic> queryParams,
  ) {
    final filters = _parseAndFilters(queryParams);
    if (filters.isEmpty) return items;

    return items.where((item) {
      for (final entry in filters.entries) {
        final key = entry.key;
        final filterValue = entry.value;

        // Range filter ($lte, $gte, etc.)
        if (filterValue is Map) {
          final itemValue = item[key];
          if (filterValue.containsKey('\$lte') && itemValue is num) {
            if (itemValue > (filterValue['\$lte'] as num)) return false;
          }
          if (filterValue.containsKey('\$gte') && itemValue is num) {
            if (itemValue < (filterValue['\$gte'] as num)) return false;
          }
          continue;
        }

        // Simple equality filter
        if (item[key] != filterValue) return false;
      }
      return true;
    }).toList();
  }

  List<Map<String, dynamic>> _applySort(
    List<Map<String, dynamic>> items,
    Map<String, dynamic> queryParams,
  ) {
    final sortBy = queryParams['sortBy'] as String?;
    final sortDirection = queryParams['sortDirection'] as String? ?? 'asc';
    if (sortBy == null) return items;

    final sorted = List<Map<String, dynamic>>.from(items);
    sorted.sort((a, b) {
      final aVal = a[sortBy];
      final bVal = b[sortBy];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      int result;
      if (aVal is num && bVal is num) {
        result = aVal.compareTo(bVal);
      } else {
        result = aVal.toString().compareTo(bVal.toString());
      }

      return sortDirection == 'desc' ? -result : result;
    });

    return sorted;
  }

  int? _parseInt(dynamic value) {
    if (value is int) return value;
    if (value is String) return int.tryParse(value);
    return null;
  }
}
