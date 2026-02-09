import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../shared/utils/format_utils.dart';
import '../../../recipes/models/recipe.dart';
import '../../../recipes/providers/recipe_provider.dart';
import '../../models/meal_plan.dart';
import '../../providers/meal_plan_provider.dart';

class MealPlanForm extends StatefulWidget {
  final String date;
  final String? initialMealType;

  const MealPlanForm({
    super.key,
    required this.date,
    this.initialMealType,
  });

  @override
  State<MealPlanForm> createState() => _MealPlanFormState();
}

class _MealPlanFormState extends State<MealPlanForm> {
  late String _selectedMealType;
  String? _selectedRecipeId;
  int _servings = 2;
  final _notesController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _selectedMealType = widget.initialMealType ?? 'lunch';
    // Load recipe list
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final recipeProvider = context.read<RecipeProvider>();
      if (recipeProvider.recipes.isEmpty) {
        recipeProvider.loadRecipes();
      }
    });
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _onSubmit() async {
    if (_selectedRecipeId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a recipe.')),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    final provider = context.read<MealPlanProvider>();
    final success = await provider.addMealPlan(
      date: widget.date,
      mealType: _selectedMealType,
      recipeId: _selectedRecipeId!,
      servings: _servings,
      notes: _notesController.text,
    );

    if (mounted) {
      setState(() {
        _isSubmitting = false;
      });

      if (success) {
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'An error occurred.'),
          ),
        );
        provider.clearError();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Add Meal for ${FormatUtils.formatDate(widget.date)}',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 20),

          // Meal type selection
          Text(
            'Meal',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: MealPlan.mealTypes.map((type) {
              final isSelected = _selectedMealType == type;
              return ChoiceChip(
                label: Text(FormatUtils.mealTypeLabel(type)),
                selected: isSelected,
                onSelected: (selected) {
                  if (selected) {
                    setState(() {
                      _selectedMealType = type;
                    });
                  }
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Recipe selection
          Text(
            'Recipe',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Consumer<RecipeProvider>(
            builder: (context, recipeProvider, _) {
              if (recipeProvider.isLoading) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                );
              }

              if (recipeProvider.recipes.isEmpty) {
                return Text(
                  'Please add a recipe first.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                );
              }

              return Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: theme.colorScheme.outline.withOpacity(0.3),
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: DropdownButtonFormField<String>(
                  value: _selectedRecipeId,
                  decoration: const InputDecoration(
                    hintText: 'Select a recipe',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 16),
                  ),
                  isExpanded: true,
                  items: recipeProvider.recipes.map((recipe) {
                    return DropdownMenuItem(
                      value: recipe.id,
                      child: Text(
                        recipe.title,
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedRecipeId = value;
                    });
                  },
                ),
              );
            },
          ),
          const SizedBox(height: 16),

          // Servings
          Row(
            children: [
              Text(
                'Servings',
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.remove_circle_outline),
                onPressed: _servings > 1
                    ? () => setState(() => _servings--)
                    : null,
                iconSize: 28,
              ),
              Text(
                '$_servings',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add_circle_outline),
                onPressed: _servings < 20
                    ? () => setState(() => _servings++)
                    : null,
                iconSize: 28,
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Notes
          TextField(
            controller: _notesController,
            decoration: InputDecoration(
              labelText: 'Notes (optional)',
              hintText: 'e.g. Half portion',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            maxLines: 2,
          ),
          const SizedBox(height: 24),

          // Add button
          FilledButton(
            onPressed: _isSubmitting ? null : _onSubmit,
            child: _isSubmitting
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Text('Add to Meal Plan'),
          ),
        ],
      ),
    );
  }
}
