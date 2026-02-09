import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../../shared/utils/format_utils.dart';
import '../../models/ingredient.dart';
import '../../providers/ingredient_provider.dart';
import 'ingredient_form.dart';

class IngredientList extends StatelessWidget {
  final List<Ingredient> ingredients;
  final bool isLoading;
  final int originalServings;
  final int adjustedServings;
  final String recipeId;

  const IngredientList({
    super.key,
    required this.ingredients,
    required this.isLoading,
    required this.originalServings,
    required this.adjustedServings,
    required this.recipeId,
  });

  void _showAddForm(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => IngredientForm(recipeId: recipeId),
    );
  }

  void _showEditForm(BuildContext context, Ingredient ingredient) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => IngredientForm(
        recipeId: recipeId,
        ingredient: ingredient,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (isLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      );
    }

    return Column(
      children: [
        ...ingredients.asMap().entries.map((entry) {
          final index = entry.key;
          final ingredient = entry.value;
          final convertedAmount = FormatUtils.convertAmount(
            ingredient.amount,
            originalServings,
            adjustedServings,
          );

          return Dismissible(
            key: Key(ingredient.id),
            direction: DismissDirection.endToStart,
            background: Container(
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(Icons.delete_outline, color: Colors.red.shade700),
            ),
            confirmDismiss: (direction) async {
              return await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Delete Ingredient'),
                  content: Text('Are you sure you want to delete ${ingredient.name}?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx, false),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(ctx, true),
                      style:
                          TextButton.styleFrom(foregroundColor: Colors.red),
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              );
            },
            onDismissed: (_) {
              context
                  .read<IngredientProvider>()
                  .deleteIngredient(ingredient.id);
            },
            child: GestureDetector(
              onTap: () => _showEditForm(context, ingredient),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: theme.colorScheme.outline.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: ingredient.isOptional
                            ? theme.colorScheme.onSurfaceVariant
                                .withOpacity(0.3)
                            : theme.colorScheme.primary,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        ingredient.name,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w500,
                          fontStyle: ingredient.isOptional
                              ? FontStyle.italic
                              : null,
                        ),
                      ),
                    ),
                    Text(
                      '$convertedAmount ${ingredient.unit}',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          )
              .animate()
              .fadeIn(
                delay: Duration(milliseconds: 50 * index),
                duration: 250.ms,
              )
              .slideX(begin: 0.05);
        }),
        const SizedBox(height: 8),
        // Add button
        OutlinedButton.icon(
          onPressed: () => _showAddForm(context),
          icon: const Icon(Icons.add, size: 18),
          label: const Text('Add Ingredient'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 44),
          ),
        ),
      ],
    );
  }
}
