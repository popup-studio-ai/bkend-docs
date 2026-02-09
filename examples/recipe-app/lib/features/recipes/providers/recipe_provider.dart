import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../data/recipe_repository.dart';
import '../models/recipe.dart';

class RecipeProvider extends ChangeNotifier {
  final RecipeRepository _repository;

  List<Recipe> _recipes = [];
  Pagination? _pagination;
  Recipe? _selectedRecipe;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _errorMessage;

  // Filters
  String? _difficultyFilter;
  String? _categoryFilter;
  int? _maxCookingTimeFilter;

  RecipeProvider({required RecipeRepository repository})
      : _repository = repository;

  List<Recipe> get recipes => _recipes;
  Pagination? get pagination => _pagination;
  Recipe? get selectedRecipe => _selectedRecipe;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get errorMessage => _errorMessage;
  String? get difficultyFilter => _difficultyFilter;
  String? get categoryFilter => _categoryFilter;
  int? get maxCookingTimeFilter => _maxCookingTimeFilter;
  bool get hasNextPage => _pagination?.hasNextPage ?? false;

  Future<void> loadRecipes({bool refresh = false}) async {
    if (_isLoading) return;

    _isLoading = true;
    _errorMessage = null;
    if (refresh) {
      _recipes = [];
      _pagination = null;
    }
    notifyListeners();

    try {
      final result = await _repository.getRecipes(
        page: 1,
        difficulty: _difficultyFilter,
        category: _categoryFilter,
        maxCookingTime: _maxCookingTimeFilter,
      );
      _recipes = result.items;
      _pagination = result.pagination;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMore() async {
    if (_isLoadingMore || !hasNextPage) return;

    _isLoadingMore = true;
    notifyListeners();

    try {
      final nextPage = (_pagination?.page ?? 0) + 1;
      final result = await _repository.getRecipes(
        page: nextPage,
        difficulty: _difficultyFilter,
        category: _categoryFilter,
        maxCookingTime: _maxCookingTimeFilter,
      );
      _recipes = [..._recipes, ...result.items];
      _pagination = result.pagination;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  Future<void> loadRecipe(String id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _selectedRecipe = await _repository.getRecipe(id);
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Recipe?> createRecipe(Recipe recipe) async {
    try {
      final created = await _repository.createRecipe(recipe);
      _recipes = [created, ..._recipes];
      notifyListeners();
      return created;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return null;
    }
  }

  Future<Recipe?> updateRecipe(
      String id, Map<String, dynamic> updates) async {
    try {
      final updated = await _repository.updateRecipe(id, updates);
      final index = _recipes.indexWhere((r) => r.id == id);
      if (index >= 0) {
        _recipes[index] = updated;
      }
      if (_selectedRecipe?.id == id) {
        _selectedRecipe = updated;
      }
      notifyListeners();
      return updated;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return null;
    }
  }

  Future<bool> deleteRecipe(String id) async {
    try {
      await _repository.deleteRecipe(id);
      _recipes.removeWhere((r) => r.id == id);
      if (_selectedRecipe?.id == id) {
        _selectedRecipe = null;
      }
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  Future<String?> uploadImage({
    required String filename,
    required String contentType,
    required List<int> imageBytes,
  }) async {
    try {
      return await _repository.uploadImage(
        filename: filename,
        contentType: contentType,
        imageBytes: imageBytes,
      );
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return null;
    }
  }

  void setFilters({
    String? difficulty,
    String? category,
    int? maxCookingTime,
  }) {
    _difficultyFilter = difficulty;
    _categoryFilter = category;
    _maxCookingTimeFilter = maxCookingTime;
    loadRecipes(refresh: true);
  }

  void clearFilters() {
    _difficultyFilter = null;
    _categoryFilter = null;
    _maxCookingTimeFilter = null;
    loadRecipes(refresh: true);
  }

  String _extractError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic>) {
      return data['message'] as String? ?? 'An error occurred.';
    }
    return 'A network error occurred.';
  }
}
