import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../../../shared/utils/format_utils.dart';
import '../models/recipe.dart';
import '../providers/recipe_provider.dart';
import 'widgets/recipe_card.dart';

class RecipeListScreen extends StatefulWidget {
  const RecipeListScreen({super.key});

  @override
  State<RecipeListScreen> createState() => _RecipeListScreenState();
}

class _RecipeListScreenState extends State<RecipeListScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RecipeProvider>().loadRecipes();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<RecipeProvider>().loadMore();
    }
  }

  void _showFilterSheet() {
    final provider = context.read<RecipeProvider>();
    String? selectedDifficulty = provider.difficultyFilter;
    String? selectedCategory = provider.categoryFilter;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final theme = Theme.of(context);
            return Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Filter',
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          setModalState(() {
                            selectedDifficulty = null;
                            selectedCategory = null;
                          });
                        },
                        child: const Text('Reset'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Difficulty',
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: Recipe.difficulties.map((d) {
                      final isSelected = selectedDifficulty == d;
                      return FilterChip(
                        label: Text(FormatUtils.difficultyLabel(d)),
                        selected: isSelected,
                        onSelected: (selected) {
                          setModalState(() {
                            selectedDifficulty = selected ? d : null;
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Category',
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: Recipe.categories.map((c) {
                      final isSelected = selectedCategory == c;
                      return FilterChip(
                        label: Text(c),
                        selected: isSelected,
                        onSelected: (selected) {
                          setModalState(() {
                            selectedCategory = selected ? c : null;
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),
                  FilledButton(
                    onPressed: () {
                      provider.setFilters(
                        difficulty: selectedDifficulty,
                        category: selectedCategory,
                      );
                      Navigator.pop(context);
                    },
                    child: const Text('Apply'),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Recipes'),
        actions: [
          Consumer<RecipeProvider>(
            builder: (context, provider, _) {
              final hasFilter = provider.difficultyFilter != null ||
                  provider.categoryFilter != null;
              return IconButton(
                icon: Badge(
                  isLabelVisible: hasFilter,
                  child: const Icon(Icons.filter_list),
                ),
                onPressed: _showFilterSheet,
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/recipes/new'),
        child: const Icon(Icons.add),
      ),
      body: Consumer<RecipeProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.recipes.isEmpty) {
            return const ShimmerLoading(
              itemCount: 4,
              type: ShimmerType.card,
            );
          }

          if (provider.errorMessage != null && provider.recipes.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.error_outline,
                      size: 48, color: theme.colorScheme.error),
                  const SizedBox(height: 16),
                  Text(provider.errorMessage!),
                  const SizedBox(height: 16),
                  OutlinedButton(
                    onPressed: () => provider.loadRecipes(refresh: true),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (provider.recipes.isEmpty) {
            return EmptyState(
              icon: Icons.restaurant_menu,
              title: 'No recipes yet',
              subtitle: 'Add your first recipe!',
              actionLabel: 'Add Recipe',
              onAction: () => context.push('/recipes/new'),
            );
          }

          return RefreshIndicator(
            onRefresh: () => provider.loadRecipes(refresh: true),
            child: GridView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              gridDelegate:
                  const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.72,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: provider.recipes.length +
                  (provider.isLoadingMore ? 2 : 0),
              itemBuilder: (context, index) {
                if (index >= provider.recipes.length) {
                  return const Card(
                    child: Center(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    ),
                  );
                }

                final recipe = provider.recipes[index];
                return RecipeCard(
                  recipe: recipe,
                  onTap: () => context.push('/recipes/${recipe.id}'),
                )
                    .animate()
                    .fadeIn(
                      delay: Duration(milliseconds: 50 * (index % 6)),
                      duration: 300.ms,
                    )
                    .slideY(begin: 0.1);
              },
            ),
          );
        },
      ),
    );
  }
}
