import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../../../shared/utils/format_utils.dart';
import '../data/cooking_log_api.dart';
import '../models/cooking_log.dart';

class CookingLogProvider extends ChangeNotifier {
  final CookingLogApi _api;

  List<CookingLog> _cookingLogs = [];
  Pagination? _pagination;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _errorMessage;

  CookingLogProvider({required CookingLogApi api}) : _api = api;

  List<CookingLog> get cookingLogs => _cookingLogs;
  Pagination? get pagination => _pagination;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get errorMessage => _errorMessage;
  bool get hasNextPage => _pagination?.hasNextPage ?? false;

  /// Calculate average rating
  double get averageRating {
    if (_cookingLogs.isEmpty) return 0;
    final total = _cookingLogs.fold<int>(0, (sum, log) => sum + log.rating);
    return total / _cookingLogs.length;
  }

  /// Load cooking logs by recipe
  Future<void> loadCookingLogs(String recipeId, {bool refresh = false}) async {
    if (_isLoading) return;

    _isLoading = true;
    _errorMessage = null;
    if (refresh) {
      _cookingLogs = [];
      _pagination = null;
    }
    notifyListeners();

    try {
      final data = await _api.getByRecipeId(recipeId);
      final response =
          PaginatedResponse.fromJson(data, CookingLog.fromJson);
      _cookingLogs = response.items;
      _pagination = response.pagination;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Load more (pagination)
  Future<void> loadMore(String recipeId) async {
    if (_isLoadingMore || !hasNextPage) return;

    _isLoadingMore = true;
    notifyListeners();

    try {
      final nextPage = (_pagination?.page ?? 0) + 1;
      final data = await _api.getByRecipeId(recipeId, page: nextPage);
      final response =
          PaginatedResponse.fromJson(data, CookingLog.fromJson);
      _cookingLogs = [..._cookingLogs, ...response.items];
      _pagination = response.pagination;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  /// Add cooking log
  Future<bool> addCookingLog({
    required String recipeId,
    required int rating,
    String notes = '',
    DateTime? cookedAt,
  }) async {
    try {
      final data = await _api.create({
        'recipeId': recipeId,
        'rating': rating,
        'notes': notes,
        'cookedAt': FormatUtils.toDateString(cookedAt ?? DateTime.now()),
      });
      _cookingLogs = [CookingLog.fromJson(data), ..._cookingLogs];
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Delete cooking log
  Future<bool> deleteCookingLog(String id) async {
    try {
      await _api.delete(id);
      _cookingLogs.removeWhere((log) => log.id == id);
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  String _extractError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic>) {
      return data['message'] as String? ?? 'An error occurred.';
    }
    return 'A network error occurred.';
  }
}
