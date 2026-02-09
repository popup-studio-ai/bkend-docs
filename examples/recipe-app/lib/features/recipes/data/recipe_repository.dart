import '../../../shared/models/pagination.dart';
import '../models/recipe.dart';
import 'recipe_api.dart';

class RecipeRepository {
  final RecipeApi _api;

  RecipeRepository({required RecipeApi api}) : _api = api;

  Future<PaginatedResponse<Recipe>> getRecipes({
    int page = 1,
    int limit = 10,
    String? difficulty,
    String? category,
    int? maxCookingTime,
    String sortBy = 'createdAt',
    String sortDirection = 'desc',
  }) async {
    final data = await _api.getRecipes(
      page: page,
      limit: limit,
      difficulty: difficulty,
      category: category,
      maxCookingTime: maxCookingTime,
      sortBy: sortBy,
      sortDirection: sortDirection,
    );
    return PaginatedResponse.fromJson(data, Recipe.fromJson);
  }

  Future<Recipe> getRecipe(String id) async {
    final data = await _api.getRecipe(id);
    return Recipe.fromJson(data);
  }

  Future<Recipe> createRecipe(Recipe recipe) async {
    final data = await _api.createRecipe(recipe.toJson());
    return Recipe.fromJson(data);
  }

  Future<Recipe> updateRecipe(String id, Map<String, dynamic> updates) async {
    final data = await _api.updateRecipe(id, updates);
    return Recipe.fromJson(data);
  }

  Future<void> deleteRecipe(String id) async {
    await _api.deleteRecipe(id);
  }

  Future<String> uploadImage({
    required String filename,
    required String contentType,
    required List<int> imageBytes,
  }) async {
    final presignedData = await _api.getPresignedUrl(
      filename: filename,
      contentType: contentType,
    );
    final presignedUrl = presignedData['url'] as String;
    final publicUrl = await _api.uploadImage(
      presignedUrl: presignedUrl,
      imageBytes: imageBytes,
      contentType: contentType,
    );
    return publicUrl;
  }
}
