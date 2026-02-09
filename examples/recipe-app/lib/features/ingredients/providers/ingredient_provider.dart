import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../data/ingredient_api.dart';
import '../models/ingredient.dart';

class IngredientProvider extends ChangeNotifier {
  final IngredientApi _api;

  List<Ingredient> _ingredients = [];
  bool _isLoading = false;
  String? _errorMessage;

  IngredientProvider({required IngredientApi api}) : _api = api;

  List<Ingredient> get ingredients => _ingredients;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> loadIngredients(String recipeId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.getIngredients(recipeId);
      final response =
          PaginatedResponse.fromJson(data, Ingredient.fromJson);
      _ingredients = response.items;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addIngredient({
    required String recipeId,
    required String name,
    required String amount,
    required String unit,
    bool isOptional = false,
  }) async {
    // Prevent duplicates
    final exists = _ingredients.any(
      (i) => i.name.toLowerCase() == name.toLowerCase() && i.unit == unit,
    );
    if (exists) {
      _errorMessage = 'An ingredient with the same name and unit already exists.';
      notifyListeners();
      return false;
    }

    try {
      final data = await _api.createIngredient({
        'recipeId': recipeId,
        'name': name,
        'amount': amount,
        'unit': unit,
        'orderIndex': _ingredients.length,
        'isOptional': isOptional,
      });
      _ingredients = [..._ingredients, Ingredient.fromJson(data)];
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateIngredient(
    String id,
    Map<String, dynamic> updates,
  ) async {
    try {
      final data = await _api.updateIngredient(id, updates);
      final updated = Ingredient.fromJson(data);
      final index = _ingredients.indexWhere((i) => i.id == id);
      if (index >= 0) {
        _ingredients[index] = updated;
        notifyListeners();
      }
      return true;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteIngredient(String id) async {
    try {
      await _api.deleteIngredient(id);
      _ingredients.removeWhere((i) => i.id == id);
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
