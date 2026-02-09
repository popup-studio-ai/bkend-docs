import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../../../shared/utils/format_utils.dart';
import '../../ingredients/models/ingredient.dart';
import '../data/shopping_list_api.dart';
import '../models/shopping_list.dart';

class ShoppingListProvider extends ChangeNotifier {
  final ShoppingListApi _api;

  List<ShoppingList> _shoppingLists = [];
  ShoppingList? _selectedList;
  bool _isLoading = false;
  bool _isGenerating = false;
  String? _errorMessage;

  ShoppingListProvider({required ShoppingListApi api}) : _api = api;

  List<ShoppingList> get shoppingLists => _shoppingLists;
  ShoppingList? get selectedList => _selectedList;
  bool get isLoading => _isLoading;
  bool get isGenerating => _isGenerating;
  String? get errorMessage => _errorMessage;

  Future<void> loadShoppingLists() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.getShoppingLists();
      final response =
          PaginatedResponse.fromJson(data, ShoppingList.fromJson);
      _shoppingLists = response.items;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadShoppingList(String id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.getShoppingList(id);
      _selectedList = ShoppingList.fromJson(data);
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Auto-generate shopping list from recipe IDs
  /// Ingredients with the same name + unit are merged by summing amounts
  Future<ShoppingList?> generateFromRecipes({
    required String name,
    required List<String> recipeIds,
  }) async {
    if (recipeIds.isEmpty) {
      _errorMessage = 'Please select a recipe.';
      notifyListeners();
      return null;
    }

    _isGenerating = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Fetch ingredient list
      final data = await _api.getIngredientsForRecipes(recipeIds);
      final response =
          PaginatedResponse.fromJson(data, Ingredient.fromJson);

      // Merge same name + unit
      final merged = <String, ShoppingItem>{};
      for (final ingredient in response.items) {
        final key =
            '${ingredient.name.toLowerCase()}_${ingredient.unit}';
        if (merged.containsKey(key)) {
          final existing = merged[key]!;
          final existingAmount =
              double.tryParse(existing.amount) ?? 0;
          final newAmount =
              double.tryParse(ingredient.amount) ?? 0;
          final totalAmount = existingAmount + newAmount;
          merged[key] = existing.copyWith(
            amount: totalAmount == totalAmount.roundToDouble()
                ? totalAmount.toInt().toString()
                : totalAmount.toStringAsFixed(1),
          );
        } else {
          merged[key] = ShoppingItem(
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            checked: false,
            recipeId: ingredient.recipeId,
          );
        }
      }

      final items = merged.values.toList();

      // Create shopping list
      final createData = await _api.createShoppingList({
        'name': name,
        'date': FormatUtils.toDateString(DateTime.now()),
        'items': items.map((i) => i.toJson()).toList(),
        'totalItems': items.length,
        'checkedItems': 0,
      });

      final created = ShoppingList.fromJson(createData);
      _shoppingLists = [created, ..._shoppingLists];
      notifyListeners();
      return created;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return null;
    } finally {
      _isGenerating = false;
      notifyListeners();
    }
  }

  /// Toggle check
  Future<void> toggleItemCheck(
    String listId,
    int itemIndex,
  ) async {
    // Find in local list
    final listIndex =
        _shoppingLists.indexWhere((sl) => sl.id == listId);
    if (listIndex < 0) return;

    final shoppingList = _shoppingLists[listIndex];
    if (itemIndex < 0 || itemIndex >= shoppingList.items.length) return;

    // Optimistic local state update
    final updatedItems = List<ShoppingItem>.from(shoppingList.items);
    updatedItems[itemIndex] = updatedItems[itemIndex].copyWith(
      checked: !updatedItems[itemIndex].checked,
    );
    final newCheckedCount = updatedItems.where((i) => i.checked).length;

    final updatedList = ShoppingList(
      id: shoppingList.id,
      name: shoppingList.name,
      date: shoppingList.date,
      items: updatedItems,
      totalItems: updatedItems.length,
      checkedItems: newCheckedCount,
      createdBy: shoppingList.createdBy,
      createdAt: shoppingList.createdAt,
    );

    _shoppingLists[listIndex] = updatedList;
    if (_selectedList?.id == listId) {
      _selectedList = updatedList;
    }
    notifyListeners();

    // Server update
    try {
      await _api.updateShoppingList(listId, {
        'items': updatedItems.map((i) => i.toJson()).toList(),
        'checkedItems': newCheckedCount,
      });
    } on DioException catch (e) {
      // Rollback on failure
      _shoppingLists[listIndex] = shoppingList;
      if (_selectedList?.id == listId) {
        _selectedList = shoppingList;
      }
      _errorMessage = _extractError(e);
      notifyListeners();
    }
  }

  Future<bool> deleteShoppingList(String id) async {
    try {
      await _api.deleteShoppingList(id);
      _shoppingLists.removeWhere((sl) => sl.id == id);
      if (_selectedList?.id == id) {
        _selectedList = null;
      }
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
