import 'dart:math';

/// Mock data store
/// Supports in-memory CRUD so that additions/deletions are reflected in the app.
class MockData {
  MockData._();

  static int _idCounter = 100;
  static String _nextId() => 'mock-${_idCounter++}';

  // ─── Auth ───────────────────────────────────────────────

  static const mockUser = {
    'id': 'mock-user-001',
    'email': 'demo@bkend.ai',
    'name': 'Chef Kim',
    'createdAt': '2025-01-01T00:00:00.000Z',
    'updatedAt': '2025-01-01T00:00:00.000Z',
  };

  static Map<String, dynamic> authResponse() => {
        'accessToken': 'mock-access-token-abc123',
        'refreshToken': 'mock-refresh-token-xyz789',
        'user': mockUser,
      };

  static Map<String, dynamic> meResponse() => Map.from(mockUser);

  // ─── Recipes ────────────────────────────────────────────

  static final List<Map<String, dynamic>> _recipes = [
    {
      'id': 'recipe-001',
      'title': 'Kimchi Jjigae',
      'description': 'A rich and flavorful stew made with pork and aged kimchi. The ultimate Korean soul food that goes perfectly with a bowl of rice.',
      'cookingTime': 30,
      'difficulty': 'easy',
      'servings': 2,
      'category': 'Korean',
      'imageUrl': 'https://picsum.photos/800/600?random=1',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-01T10:00:00.000Z',
      'updatedAt': '2025-06-01T10:00:00.000Z',
    },
    {
      'id': 'recipe-002',
      'title': 'Doenjang Jjigae',
      'description': 'A hearty soybean paste stew with tofu and assorted vegetables. A classic Korean home-cooked dish.',
      'cookingTime': 25,
      'difficulty': 'easy',
      'servings': 3,
      'category': 'Korean',
      'imageUrl': 'https://picsum.photos/800/600?random=2',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-02T10:00:00.000Z',
      'updatedAt': '2025-06-02T10:00:00.000Z',
    },
    {
      'id': 'recipe-003',
      'title': 'Bulgogi',
      'description': 'Thinly sliced beef marinated in a sweet soy sauce mixture. A universally loved Korean classic.',
      'cookingTime': 40,
      'difficulty': 'medium',
      'servings': 4,
      'category': 'Korean',
      'imageUrl': 'https://picsum.photos/800/600?random=3',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-03T10:00:00.000Z',
      'updatedAt': '2025-06-03T10:00:00.000Z',
    },
    {
      'id': 'recipe-004',
      'title': 'Bibimbap',
      'description': 'A nutritious one-bowl meal with assorted vegetables, gochujang, and a fried egg mixed with rice.',
      'cookingTime': 35,
      'difficulty': 'medium',
      'servings': 1,
      'category': 'Korean',
      'imageUrl': 'https://picsum.photos/800/600?random=4',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-04T10:00:00.000Z',
      'updatedAt': '2025-06-04T10:00:00.000Z',
    },
    {
      'id': 'recipe-005',
      'title': 'Japchae',
      'description': 'Stir-fried glass noodles with assorted vegetables and meat. A staple dish at Korean holidays and celebrations.',
      'cookingTime': 45,
      'difficulty': 'medium',
      'servings': 4,
      'category': 'Korean',
      'imageUrl': 'https://picsum.photos/800/600?random=5',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-05T10:00:00.000Z',
      'updatedAt': '2025-06-05T10:00:00.000Z',
    },
    {
      'id': 'recipe-006',
      'title': 'Tteokbokki',
      'description': 'Chewy rice cakes in a sweet and spicy gochujang sauce. A beloved Korean street food snack.',
      'cookingTime': 20,
      'difficulty': 'easy',
      'servings': 2,
      'category': 'Snack',
      'imageUrl': 'https://picsum.photos/800/600?random=6',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-06T10:00:00.000Z',
      'updatedAt': '2025-06-06T10:00:00.000Z',
    },
    {
      'id': 'recipe-007',
      'title': 'Haemul Pajeon',
      'description': 'A crispy Korean seafood pancake loaded with squid, shrimp, and green onions. Perfect with makgeolli.',
      'cookingTime': 25,
      'difficulty': 'medium',
      'servings': 2,
      'category': 'Korean',
      'imageUrl': 'https://picsum.photos/800/600?random=7',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-07T10:00:00.000Z',
      'updatedAt': '2025-06-07T10:00:00.000Z',
    },
    {
      'id': 'recipe-008',
      'title': 'Curry Rice',
      'description': 'Japanese-style curry with potatoes, carrots, onions, and meat. A family-friendly comfort dish.',
      'cookingTime': 50,
      'difficulty': 'easy',
      'servings': 4,
      'category': 'Japanese',
      'imageUrl': 'https://picsum.photos/800/600?random=8',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-08T10:00:00.000Z',
      'updatedAt': '2025-06-08T10:00:00.000Z',
    },
    {
      'id': 'recipe-009',
      'title': 'Cream Pasta',
      'description': 'A smooth cream sauce pasta with bacon and mushrooms. Simple yet restaurant-quality flavor.',
      'cookingTime': 20,
      'difficulty': 'easy',
      'servings': 2,
      'category': 'Western',
      'imageUrl': 'https://picsum.photos/800/600?random=9',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-09T10:00:00.000Z',
      'updatedAt': '2025-06-09T10:00:00.000Z',
    },
    {
      'id': 'recipe-010',
      'title': 'Dak Galbi',
      'description': 'Spicy stir-fried chicken with rice cakes, sweet potato, and cabbage. A famous dish from Chuncheon.',
      'cookingTime': 35,
      'difficulty': 'medium',
      'servings': 3,
      'category': 'Korean',
      'imageUrl': 'https://picsum.photos/800/600?random=10',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-10T10:00:00.000Z',
      'updatedAt': '2025-06-10T10:00:00.000Z',
    },
  ];

  static List<Map<String, dynamic>> get recipes =>
      List.unmodifiable(_recipes);

  static Map<String, dynamic>? getRecipeById(String id) {
    try {
      return _recipes.firstWhere((r) => r['id'] == id);
    } catch (_) {
      return null;
    }
  }

  static Map<String, dynamic> addRecipe(Map<String, dynamic> data) {
    final now = DateTime.now().toIso8601String();
    final recipe = {
      'id': _nextId(),
      ...data,
      'createdBy': 'mock-user-001',
      'createdAt': now,
      'updatedAt': now,
    };
    _recipes.insert(0, recipe);
    return recipe;
  }

  static Map<String, dynamic>? updateRecipe(
      String id, Map<String, dynamic> updates) {
    final index = _recipes.indexWhere((r) => r['id'] == id);
    if (index < 0) return null;
    _recipes[index] = {
      ..._recipes[index],
      ...updates,
      'updatedAt': DateTime.now().toIso8601String(),
    };
    return _recipes[index];
  }

  static bool deleteRecipe(String id) {
    final len = _recipes.length;
    _recipes.removeWhere((r) => r['id'] == id);
    return _recipes.length < len;
  }

  // ─── Ingredients ────────────────────────────────────────

  static final List<Map<String, dynamic>> _ingredients = [
    // Kimchi Jjigae ingredients
    {'id': 'ing-001', 'recipeId': 'recipe-001', 'name': 'Aged Napa Kimchi', 'amount': '300', 'unit': 'g', 'orderIndex': 0, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-01T10:00:00.000Z'},
    {'id': 'ing-002', 'recipeId': 'recipe-001', 'name': 'Pork (shoulder)', 'amount': '200', 'unit': 'g', 'orderIndex': 1, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-01T10:00:00.000Z'},
    {'id': 'ing-003', 'recipeId': 'recipe-001', 'name': 'Tofu', 'amount': '1/2', 'unit': 'pc', 'orderIndex': 2, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-01T10:00:00.000Z'},
    {'id': 'ing-004', 'recipeId': 'recipe-001', 'name': 'Green Onion', 'amount': '1', 'unit': 'pc', 'orderIndex': 3, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-01T10:00:00.000Z'},
    {'id': 'ing-005', 'recipeId': 'recipe-001', 'name': 'Red Pepper Flakes', 'amount': '1', 'unit': 'tbsp', 'orderIndex': 4, 'isOptional': true, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-01T10:00:00.000Z'},
    // Doenjang Jjigae ingredients
    {'id': 'ing-006', 'recipeId': 'recipe-002', 'name': 'Doenjang (soybean paste)', 'amount': '2', 'unit': 'tbsp', 'orderIndex': 0, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-02T10:00:00.000Z'},
    {'id': 'ing-007', 'recipeId': 'recipe-002', 'name': 'Tofu', 'amount': '1/2', 'unit': 'pc', 'orderIndex': 1, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-02T10:00:00.000Z'},
    {'id': 'ing-008', 'recipeId': 'recipe-002', 'name': 'Zucchini', 'amount': '1/3', 'unit': 'pc', 'orderIndex': 2, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-02T10:00:00.000Z'},
    {'id': 'ing-009', 'recipeId': 'recipe-002', 'name': 'Onion', 'amount': '1/2', 'unit': 'pc', 'orderIndex': 3, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-02T10:00:00.000Z'},
    {'id': 'ing-010', 'recipeId': 'recipe-002', 'name': 'Cheongyang Chili', 'amount': '1', 'unit': 'pc', 'orderIndex': 4, 'isOptional': true, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-02T10:00:00.000Z'},
    // Bulgogi ingredients
    {'id': 'ing-011', 'recipeId': 'recipe-003', 'name': 'Beef (sirloin)', 'amount': '400', 'unit': 'g', 'orderIndex': 0, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-03T10:00:00.000Z'},
    {'id': 'ing-012', 'recipeId': 'recipe-003', 'name': 'Soy Sauce', 'amount': '4', 'unit': 'tbsp', 'orderIndex': 1, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-03T10:00:00.000Z'},
    {'id': 'ing-013', 'recipeId': 'recipe-003', 'name': 'Sugar', 'amount': '2', 'unit': 'tbsp', 'orderIndex': 2, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-03T10:00:00.000Z'},
    {'id': 'ing-014', 'recipeId': 'recipe-003', 'name': 'Asian Pear', 'amount': '1/4', 'unit': 'pc', 'orderIndex': 3, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-03T10:00:00.000Z'},
    {'id': 'ing-015', 'recipeId': 'recipe-003', 'name': 'Sesame Oil', 'amount': '1', 'unit': 'tbsp', 'orderIndex': 4, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-03T10:00:00.000Z'},
    // Bibimbap ingredients
    {'id': 'ing-016', 'recipeId': 'recipe-004', 'name': 'Rice', 'amount': '1', 'unit': 'cup', 'orderIndex': 0, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-04T10:00:00.000Z'},
    {'id': 'ing-017', 'recipeId': 'recipe-004', 'name': 'Gochujang', 'amount': '1', 'unit': 'tbsp', 'orderIndex': 1, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-04T10:00:00.000Z'},
    {'id': 'ing-018', 'recipeId': 'recipe-004', 'name': 'Spinach', 'amount': '50', 'unit': 'g', 'orderIndex': 2, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-04T10:00:00.000Z'},
    {'id': 'ing-019', 'recipeId': 'recipe-004', 'name': 'Bean Sprouts', 'amount': '50', 'unit': 'g', 'orderIndex': 3, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-04T10:00:00.000Z'},
    {'id': 'ing-020', 'recipeId': 'recipe-004', 'name': 'Egg', 'amount': '1', 'unit': 'pc', 'orderIndex': 4, 'isOptional': false, 'createdBy': 'mock-user-001', 'createdAt': '2025-06-04T10:00:00.000Z'},
  ];

  static List<Map<String, dynamic>> getIngredientsByRecipeId(String recipeId) {
    return _ingredients.where((i) => i['recipeId'] == recipeId).toList();
  }

  static List<Map<String, dynamic>> getIngredientsByRecipeIds(
      List<String> recipeIds) {
    return _ingredients
        .where((i) => recipeIds.contains(i['recipeId']))
        .toList();
  }

  static Map<String, dynamic> addIngredient(Map<String, dynamic> data) {
    final ingredient = {
      'id': _nextId(),
      ...data,
      'createdBy': 'mock-user-001',
      'createdAt': DateTime.now().toIso8601String(),
    };
    _ingredients.add(ingredient);
    return ingredient;
  }

  static Map<String, dynamic>? updateIngredient(
      String id, Map<String, dynamic> updates) {
    final index = _ingredients.indexWhere((i) => i['id'] == id);
    if (index < 0) return null;
    _ingredients[index] = {..._ingredients[index], ...updates};
    return _ingredients[index];
  }

  static bool deleteIngredient(String id) {
    final len = _ingredients.length;
    _ingredients.removeWhere((i) => i['id'] == id);
    return _ingredients.length < len;
  }

  // ─── Meal Plans ─────────────────────────────────────────

  static final List<Map<String, dynamic>> _mealPlans = [
    {
      'id': 'mp-001',
      'date': _todayString(),
      'mealType': 'breakfast',
      'recipeId': 'recipe-004',
      'servings': 1,
      'notes': '',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-01T10:00:00.000Z',
    },
    {
      'id': 'mp-002',
      'date': _todayString(),
      'mealType': 'lunch',
      'recipeId': 'recipe-001',
      'servings': 2,
      'notes': 'Best when the kimchi is well-fermented',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-01T10:00:00.000Z',
    },
    {
      'id': 'mp-003',
      'date': _todayString(),
      'mealType': 'dinner',
      'recipeId': 'recipe-003',
      'servings': 4,
      'notes': '',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-01T10:00:00.000Z',
    },
  ];

  static List<Map<String, dynamic>> getMealPlans({
    required String startDate,
    required String endDate,
  }) {
    return _mealPlans
        .where((mp) =>
            (mp['date'] as String).compareTo(startDate) >= 0 &&
            (mp['date'] as String).compareTo(endDate) <= 0)
        .toList();
  }

  static Map<String, dynamic> addMealPlan(Map<String, dynamic> data) {
    final mealPlan = {
      'id': _nextId(),
      ...data,
      'createdBy': 'mock-user-001',
      'createdAt': DateTime.now().toIso8601String(),
    };
    _mealPlans.add(mealPlan);
    return mealPlan;
  }

  static Map<String, dynamic>? updateMealPlan(
      String id, Map<String, dynamic> updates) {
    final index = _mealPlans.indexWhere((mp) => mp['id'] == id);
    if (index < 0) return null;
    _mealPlans[index] = {..._mealPlans[index], ...updates};
    return _mealPlans[index];
  }

  static bool deleteMealPlan(String id) {
    final len = _mealPlans.length;
    _mealPlans.removeWhere((mp) => mp['id'] == id);
    return _mealPlans.length < len;
  }

  // ─── Shopping Lists ─────────────────────────────────────

  static final List<Map<String, dynamic>> _shoppingLists = [
    {
      'id': 'sl-001',
      'name': 'This Week\'s Groceries',
      'date': _todayString(),
      'items': [
        {'name': 'Aged Napa Kimchi', 'amount': '300', 'unit': 'g', 'checked': false, 'recipeId': 'recipe-001'},
        {'name': 'Pork', 'amount': '200', 'unit': 'g', 'checked': true, 'recipeId': 'recipe-001'},
        {'name': 'Tofu', 'amount': '1', 'unit': 'pc', 'checked': false, 'recipeId': 'recipe-001'},
        {'name': 'Beef', 'amount': '400', 'unit': 'g', 'checked': false, 'recipeId': 'recipe-003'},
        {'name': 'Soy Sauce', 'amount': '4', 'unit': 'tbsp', 'checked': true, 'recipeId': 'recipe-003'},
      ],
      'totalItems': 5,
      'checkedItems': 2,
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-01T10:00:00.000Z',
    },
  ];

  static List<Map<String, dynamic>> get shoppingLists =>
      List.unmodifiable(_shoppingLists);

  static Map<String, dynamic>? getShoppingListById(String id) {
    try {
      return _shoppingLists.firstWhere((sl) => sl['id'] == id);
    } catch (_) {
      return null;
    }
  }

  static Map<String, dynamic> addShoppingList(Map<String, dynamic> data) {
    final shoppingList = {
      'id': _nextId(),
      ...data,
      'createdBy': 'mock-user-001',
      'createdAt': DateTime.now().toIso8601String(),
    };
    _shoppingLists.insert(0, shoppingList);
    return shoppingList;
  }

  static Map<String, dynamic>? updateShoppingList(
      String id, Map<String, dynamic> updates) {
    final index = _shoppingLists.indexWhere((sl) => sl['id'] == id);
    if (index < 0) return null;
    _shoppingLists[index] = {..._shoppingLists[index], ...updates};
    return _shoppingLists[index];
  }

  static bool deleteShoppingList(String id) {
    final len = _shoppingLists.length;
    _shoppingLists.removeWhere((sl) => sl['id'] == id);
    return _shoppingLists.length < len;
  }

  // ─── Cooking Logs ───────────────────────────────────────

  static final List<Map<String, dynamic>> _cookingLogs = [
    {
      'id': 'cl-001',
      'recipeId': 'recipe-001',
      'rating': 5,
      'notes': 'Stir-frying the aged kimchi thoroughly made the broth much richer. Will add a bit more red pepper flakes next time.',
      'cookedAt': '2025-06-15',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-15T12:00:00.000Z',
      'updatedAt': '2025-06-15T12:00:00.000Z',
    },
    {
      'id': 'cl-002',
      'recipeId': 'recipe-001',
      'rating': 4,
      'notes': 'Cutting the tofu into larger chunks gave it a nice texture.',
      'cookedAt': '2025-06-10',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-10T12:00:00.000Z',
      'updatedAt': '2025-06-10T12:00:00.000Z',
    },
    {
      'id': 'cl-003',
      'recipeId': 'recipe-003',
      'rating': 5,
      'notes': 'Adding pear juice made the meat incredibly tender. The whole family loved it!',
      'cookedAt': '2025-06-12',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-12T12:00:00.000Z',
      'updatedAt': '2025-06-12T12:00:00.000Z',
    },
    {
      'id': 'cl-004',
      'recipeId': 'recipe-004',
      'rating': 3,
      'notes': 'It would be better to prepare a wider variety of vegetable toppings.',
      'cookedAt': '2025-06-08',
      'createdBy': 'mock-user-001',
      'createdAt': '2025-06-08T12:00:00.000Z',
      'updatedAt': '2025-06-08T12:00:00.000Z',
    },
  ];

  static List<Map<String, dynamic>> getCookingLogsByRecipeId(String recipeId) {
    return _cookingLogs.where((cl) => cl['recipeId'] == recipeId).toList()
      ..sort((a, b) =>
          (b['cookedAt'] as String).compareTo(a['cookedAt'] as String));
  }

  static Map<String, dynamic> addCookingLog(Map<String, dynamic> data) {
    final now = DateTime.now().toIso8601String();
    final log = {
      'id': _nextId(),
      ...data,
      'createdBy': 'mock-user-001',
      'createdAt': now,
      'updatedAt': now,
    };
    _cookingLogs.insert(0, log);
    return log;
  }

  static bool deleteCookingLog(String id) {
    final len = _cookingLogs.length;
    _cookingLogs.removeWhere((cl) => cl['id'] == id);
    return _cookingLogs.length < len;
  }

  // ─── Files (Presigned URL) ──────────────────────────────

  static Map<String, dynamic> presignedUrlResponse(String filename) {
    final random = Random().nextInt(1000);
    return {
      'url': 'https://picsum.photos/800/600?random=$random',
      'key': 'uploads/mock/$filename',
    };
  }

  // ─── Helpers ────────────────────────────────────────────

  static String _todayString() {
    final now = DateTime.now();
    return '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
  }

  static Map<String, dynamic> paginatedResponse(
    List<Map<String, dynamic>> items, {
    int page = 1,
    int limit = 10,
  }) {
    final total = items.length;
    final totalPages = (total / limit).ceil().clamp(1, 999);
    final start = (page - 1) * limit;
    final end = (start + limit).clamp(0, total);
    final pageItems = start < total ? items.sublist(start, end) : [];

    return {
      'items': pageItems,
      'pagination': {
        'total': total,
        'page': page,
        'limit': limit,
        'totalPages': totalPages,
      },
    };
  }
}
