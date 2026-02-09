import 'dart:convert';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class CookingLogApi {
  final DioClient _client;

  CookingLogApi({required DioClient client}) : _client = client;

  Future<Map<String, dynamic>> getByRecipeId(
    String recipeId, {
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.dio.get(
      ApiConstants.data('cooking_logs'),
      queryParameters: {
        'andFilters': jsonEncode({'recipeId': recipeId}),
        'sortBy': 'cookedAt',
        'sortDirection': 'desc',
        'page': page,
        'limit': limit,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> create(Map<String, dynamic> data) async {
    final response = await _client.dio.post(
      ApiConstants.data('cooking_logs'),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> delete(String id) async {
    await _client.dio.delete(ApiConstants.dataById('cooking_logs', id));
  }
}
