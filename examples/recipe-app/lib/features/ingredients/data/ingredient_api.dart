import 'dart:convert';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class IngredientApi {
  final DioClient _client;

  IngredientApi({required DioClient client}) : _client = client;

  Future<Map<String, dynamic>> getIngredients(String recipeId) async {
    final response = await _client.dio.get(
      ApiConstants.data('ingredients'),
      queryParameters: {
        'andFilters': jsonEncode({'recipeId': recipeId}),
        'sortBy': 'orderIndex',
        'sortDirection': 'asc',
        'limit': 100,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createIngredient(
      Map<String, dynamic> data) async {
    final response = await _client.dio.post(
      ApiConstants.data('ingredients'),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateIngredient(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _client.dio.patch(
      ApiConstants.dataById('ingredients', id),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> deleteIngredient(String id) async {
    await _client.dio.delete(ApiConstants.dataById('ingredients', id));
  }
}
