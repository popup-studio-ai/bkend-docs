import 'package:flutter/material.dart';
import '../../../../shared/utils/format_utils.dart';
import '../../models/meal_plan.dart';

class MealSlot extends StatelessWidget {
  final String mealType;
  final List<MealPlan> mealPlans;
  final VoidCallback onAdd;
  final ValueChanged<String> onDelete;
  final ValueChanged<String> onTapRecipe;

  const MealSlot({
    super.key,
    required this.mealType,
    required this.mealPlans,
    required this.onAdd,
    required this.onDelete,
    required this.onTapRecipe,
  });

  Color _getMealTypeColor(ThemeData theme) {
    switch (mealType) {
      case 'breakfast':
        return const Color(0xFFFBBF24); // amber
      case 'lunch':
        return theme.colorScheme.primary;
      case 'dinner':
        return const Color(0xFF8B5CF6); // purple
      case 'snack':
        return theme.colorScheme.secondary;
      default:
        return theme.colorScheme.primary;
    }
  }

  IconData _getMealTypeIcon() {
    switch (mealType) {
      case 'breakfast':
        return Icons.wb_sunny_outlined;
      case 'lunch':
        return Icons.restaurant_outlined;
      case 'dinner':
        return Icons.nightlight_outlined;
      case 'snack':
        return Icons.cookie_outlined;
      default:
        return Icons.restaurant;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = _getMealTypeColor(theme);

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Meal type header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(_getMealTypeIcon(), size: 16, color: color),
              ),
              const SizedBox(width: 8),
              Text(
                FormatUtils.mealTypeLabel(mealType),
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
              const Spacer(),
              GestureDetector(
                onTap: onAdd,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.add, size: 14, color: color),
                      const SizedBox(width: 2),
                      Text(
                        'Add',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: color,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Registered recipe list
          if (mealPlans.isNotEmpty) ...[
            const SizedBox(height: 8),
            ...mealPlans.map((mp) {
              return GestureDetector(
                onTap: () => onTapRecipe(mp.recipeId),
                child: Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              mp.recipeTitle ?? 'Recipe',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            if (mp.notes.isNotEmpty)
                              Text(
                                mp.notes,
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color:
                                      theme.colorScheme.onSurfaceVariant,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                          ],
                        ),
                      ),
                      Text(
                        '${mp.servings} servings',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(width: 8),
                      GestureDetector(
                        onTap: () => onDelete(mp.id),
                        child: Icon(
                          Icons.close,
                          size: 16,
                          color: theme.colorScheme.onSurfaceVariant
                              .withOpacity(0.5),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ] else ...[
            const SizedBox(height: 8),
            Center(
              child: Text(
                'Empty',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant.withOpacity(0.5),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
