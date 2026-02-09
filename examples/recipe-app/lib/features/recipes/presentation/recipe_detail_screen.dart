import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../shared/utils/format_utils.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../../cooking_logs/presentation/cooking_log_list.dart';
import '../../cooking_logs/providers/cooking_log_provider.dart';
import '../../ingredients/presentation/widgets/ingredient_list.dart';
import '../../ingredients/presentation/widgets/serving_converter.dart';
import '../../ingredients/providers/ingredient_provider.dart';
import '../providers/recipe_provider.dart';

class RecipeDetailScreen extends StatefulWidget {
  final String recipeId;

  const RecipeDetailScreen({super.key, required this.recipeId});

  @override
  State<RecipeDetailScreen> createState() => _RecipeDetailScreenState();
}

class _RecipeDetailScreenState extends State<RecipeDetailScreen> {
  int _adjustedServings = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RecipeProvider>().loadRecipe(widget.recipeId);
      context.read<IngredientProvider>().loadIngredients(widget.recipeId);
      context.read<CookingLogProvider>().loadCookingLogs(widget.recipeId);
    });
  }

  void _confirmDelete() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Recipe'),
        content: const Text('Are you sure you want to delete this recipe?\nDeleted recipes cannot be recovered.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              final success = await context
                  .read<RecipeProvider>()
                  .deleteRecipe(widget.recipeId);
              if (success && mounted) {
                context.pop();
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Consumer<RecipeProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const ShimmerLoading(type: ShimmerType.detail);
          }

          final recipe = provider.selectedRecipe;
          if (recipe == null) {
            return const Center(child: Text('Recipe not found.'));
          }

          if (_adjustedServings == 0) {
            _adjustedServings = recipe.servings;
          }

          final difficultyColors = [
            theme.colorScheme.secondary,
            theme.colorScheme.primary,
            Colors.red,
          ];

          return CustomScrollView(
            slivers: [
              // Image AppBar
              SliverAppBar(
                expandedHeight: 280,
                pinned: true,
                actions: [
                  PopupMenuButton<String>(
                    onSelected: (value) {
                      if (value == 'edit') {
                        context.push('/recipes/${recipe.id}/edit');
                      } else if (value == 'delete') {
                        _confirmDelete();
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit_outlined, size: 20),
                            SizedBox(width: 8),
                            Text('Edit'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete_outlined,
                                size: 20, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete',
                                style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: recipe.imageUrl != null &&
                          recipe.imageUrl!.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: recipe.imageUrl!,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color:
                                theme.colorScheme.outline.withOpacity(0.1),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color:
                                theme.colorScheme.primary.withOpacity(0.08),
                            child: Center(
                              child: Icon(
                                Icons.restaurant,
                                size: 64,
                                color: theme.colorScheme.primary
                                    .withOpacity(0.3),
                              ),
                            ),
                          ),
                        )
                      : Container(
                          color:
                              theme.colorScheme.primary.withOpacity(0.08),
                          child: Center(
                            child: Icon(
                              Icons.restaurant,
                              size: 64,
                              color: theme.colorScheme.primary
                                  .withOpacity(0.3),
                            ),
                          ),
                        ),
                ),
              ),

              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Tags
                      Row(
                        children: [
                          _buildTag(
                            recipe.category,
                            theme.colorScheme.primary,
                            theme,
                          ),
                          const SizedBox(width: 8),
                          _buildTag(
                            FormatUtils.difficultyLabel(recipe.difficulty),
                            difficultyColors[FormatUtils.difficultyIndex(
                                recipe.difficulty)],
                            theme,
                          ),
                        ],
                      )
                          .animate()
                          .fadeIn(duration: 300.ms)
                          .slideX(begin: -0.05),
                      const SizedBox(height: 12),

                      // Title
                      Text(
                        recipe.title,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      )
                          .animate()
                          .fadeIn(delay: 100.ms, duration: 300.ms)
                          .slideX(begin: -0.05),
                      const SizedBox(height: 16),

                      // Meta info
                      Row(
                        children: [
                          _buildMeta(
                            Icons.schedule,
                            FormatUtils.formatCookingTime(
                                recipe.cookingTime),
                            theme,
                          ),
                          const SizedBox(width: 24),
                          _buildMeta(
                            Icons.people_outline,
                            '${recipe.servings} servings',
                            theme,
                          ),
                        ],
                      )
                          .animate()
                          .fadeIn(delay: 200.ms, duration: 300.ms)
                          .slideX(begin: -0.05),
                      const SizedBox(height: 20),

                      // Description
                      if (recipe.description.isNotEmpty) ...[
                        Text(
                          recipe.description,
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                            height: 1.6,
                          ),
                        ).animate().fadeIn(delay: 300.ms, duration: 300.ms),
                        const SizedBox(height: 24),
                      ],

                      const Divider(),
                      const SizedBox(height: 16),

                      // Serving converter
                      ServingConverter(
                        originalServings: recipe.servings,
                        currentServings: _adjustedServings,
                        onChanged: (value) {
                          setState(() {
                            _adjustedServings = value;
                          });
                        },
                      ).animate().fadeIn(delay: 400.ms, duration: 300.ms),

                      const SizedBox(height: 16),

                      // Ingredients list
                      Text(
                        'Ingredients',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ).animate().fadeIn(delay: 500.ms, duration: 300.ms),
                      const SizedBox(height: 12),

                      Consumer<IngredientProvider>(
                        builder: (context, ingredientProvider, _) {
                          return IngredientList(
                            ingredients: ingredientProvider.ingredients,
                            isLoading: ingredientProvider.isLoading,
                            originalServings: recipe.servings,
                            adjustedServings: _adjustedServings,
                            recipeId: recipe.id,
                          );
                        },
                      ),

                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 16),

                      // Cooking log section
                      CookingLogList(recipeId: recipe.id)
                          .animate()
                          .fadeIn(delay: 600.ms, duration: 300.ms),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildTag(String text, Color color, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  Widget _buildMeta(IconData icon, String text, ThemeData theme) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 18, color: theme.colorScheme.onSurfaceVariant),
        const SizedBox(width: 6),
        Text(
          text,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}
