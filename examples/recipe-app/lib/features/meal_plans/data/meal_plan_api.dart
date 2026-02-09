import 'dart:convert';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class MealPlanApi {
  final DioClient _client;

  MealPlanApi({required DioClient client}) : _client = client;

  Future<Map<String, dynamic>> getMealPlans({
    required String startDate,
    required String endDate,
    int limit = 50,
  }) async {
    final response = await _client.dio.get(
      ApiConstants.data('meal_plans'),
      queryParameters: {
        'andFilters': jsonEncode({
          'date': {
            '\$gte': startDate,
            '\$lte': endDate,
          },
        }),
        'sortBy': 'date',
        'sortDirection': 'asc',
        'limit': limit,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createMealPlan(
      Map<String, dynamic> data) async {
    final response = await _client.dio.post(
      ApiConstants.data('meal_plans'),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateMealPlan(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _client.dio.patch(
      ApiConstants.dataById('meal_plans', id),
      data: data,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> deleteMealPlan(String id) async {
    await _client.dio.delete(ApiConstants.dataById('meal_plans', id));
  }
}
