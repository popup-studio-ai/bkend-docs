import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:http/http.dart' as http;
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class RecipeApi {
  final DioClient _client;

  RecipeApi({required DioClient client}) : _client = client;

  Future<Map<String, dynamic>> getRecipes({
    int page = 1,
    int limit = 10,
    String? difficulty,
    String? category,
    int? maxCookingTime,
    String sortBy = 'createdAt',
    String sortDirection = 'desc',
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sortBy': sortBy,
      'sortDirection': sortDirection,
    };

    final filters = <String, dynamic>{};
    if (difficulty != null) filters['difficulty'] = difficulty;
    if (category != null) filters['category'] = category;
    if (maxCookingTime != null) {
      filters['cookingTime'] = {'\$lte': maxCookingTime};
    }

    if (filters.isNotEmpty) {
      queryParams['andFilters'] = jsonEncode(filters);
    }

    final response = await _client.dio.get(
      ApiConstants.data('recipes'),
      queryParameters: queryParams,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getRecipe(String id) async {
    final response = await _client.dio.get(
      ApiConstants.dataById('recipes', id),
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createRecipe(
      Map<String, dynamic> data) async {
    final response = await _client.dio.post(
      ApiConstants.data('recipes'),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateRecipe(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _client.dio.patch(
      ApiConstants.dataById('recipes', id),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> deleteRecipe(String id) async {
    await _client.dio.delete(ApiConstants.dataById('recipes', id));
  }

  Future<Map<String, dynamic>> getPresignedUrl({
    required String filename,
    required String contentType,
  }) async {
    final response = await _client.dio.post(
      ApiConstants.presignedUrl,
      data: {
        'filename': filename,
        'contentType': contentType,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<String> uploadImage({
    required String presignedUrl,
    required List<int> imageBytes,
    required String contentType,
  }) async {
    await http.put(
      Uri.parse(presignedUrl),
      headers: {'Content-Type': contentType},
      body: imageBytes,
    );
    // Strip query parameters from URL to generate a public URL
    final uri = Uri.parse(presignedUrl);
    return '${uri.scheme}://${uri.host}${uri.path}';
  }
}
