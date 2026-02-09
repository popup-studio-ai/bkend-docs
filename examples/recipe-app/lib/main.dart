import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:provider/provider.dart';
import 'app/app.dart';
import 'core/network/dio_client.dart';
import 'core/storage/token_storage.dart';
import 'features/auth/data/auth_api.dart';
import 'features/auth/data/auth_repository.dart';
import 'features/auth/providers/auth_provider.dart';
import 'features/cooking_logs/data/cooking_log_api.dart';
import 'features/cooking_logs/providers/cooking_log_provider.dart';
import 'features/ingredients/data/ingredient_api.dart';
import 'features/ingredients/providers/ingredient_provider.dart';
import 'features/meal_plans/data/meal_plan_api.dart';
import 'features/meal_plans/providers/meal_plan_provider.dart';
import 'features/recipes/data/recipe_api.dart';
import 'features/recipes/data/recipe_repository.dart';
import 'features/recipes/providers/recipe_provider.dart';
import 'features/shopping/data/shopping_list_api.dart';
import 'features/shopping/providers/shopping_list_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('en_US', null);

  // Core dependencies
  final tokenStorage = TokenStorage();
  final dioClient = DioClient(tokenStorage: tokenStorage);

  // Auth
  final authApi = AuthApi(client: dioClient);
  final authRepository = AuthRepository(
    api: authApi,
    tokenStorage: tokenStorage,
  );
  final authProvider = AuthProvider(repository: authRepository);

  // Recipes
  final recipeApi = RecipeApi(client: dioClient);
  final recipeRepository = RecipeRepository(api: recipeApi);

  // Ingredients
  final ingredientApi = IngredientApi(client: dioClient);

  // Meal Plans
  final mealPlanApi = MealPlanApi(client: dioClient);

  // Cooking Logs
  final cookingLogApi = CookingLogApi(client: dioClient);

  // Shopping
  final shoppingListApi = ShoppingListApi(client: dioClient);

  // Check authentication status
  await authProvider.checkAuthStatus();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProvider(
          create: (_) => RecipeProvider(repository: recipeRepository),
        ),
        ChangeNotifierProvider(
          create: (_) => IngredientProvider(api: ingredientApi),
        ),
        ChangeNotifierProvider(
          create: (_) => CookingLogProvider(api: cookingLogApi),
        ),
        ChangeNotifierProvider(
          create: (_) => MealPlanProvider(api: mealPlanApi),
        ),
        ChangeNotifierProvider(
          create: (_) => ShoppingListProvider(api: shoppingListApi),
        ),
      ],
      child: const RecipeApp(),
    ),
  );
}
