import 'dart:convert';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class ShoppingListApi {
  final DioClient _client;

  ShoppingListApi({required DioClient client}) : _client = client;

  Future<Map<String, dynamic>> getShoppingLists({
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.dio.get(
      ApiConstants.data('shopping_lists'),
      queryParameters: {
        'page': page,
        'limit': limit,
        'sortBy': 'createdAt',
        'sortDirection': 'desc',
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getShoppingList(String id) async {
    final response = await _client.dio.get(
      ApiConstants.dataById('shopping_lists', id),
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createShoppingList(
      Map<String, dynamic> data) async {
    final response = await _client.dio.post(
      ApiConstants.data('shopping_lists'),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateShoppingList(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _client.dio.patch(
      ApiConstants.dataById('shopping_lists', id),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> deleteShoppingList(String id) async {
    await _client.dio.delete(
      ApiConstants.dataById('shopping_lists', id),
    );
  }

  /// Fetch ingredients for a list of recipe IDs
  Future<Map<String, dynamic>> getIngredientsForRecipes(
      List<String> recipeIds) async {
    final response = await _client.dio.get(
      ApiConstants.data('ingredients'),
      queryParameters: {
        'andFilters': jsonEncode({
          'recipeId': {'\$in': recipeIds},
        }),
        'limit': 200,
        'sortBy': 'name',
        'sortDirection': 'asc',
      },
    );
    return response.data as Map<String, dynamic>;
  }
}
