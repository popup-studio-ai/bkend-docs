import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../shared/utils/format_utils.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../../meal_plans/models/meal_plan.dart';
import '../providers/meal_plan_provider.dart';
import 'widgets/meal_plan_form.dart';
import 'widgets/meal_slot.dart';

class WeeklyCalendarScreen extends StatefulWidget {
  const WeeklyCalendarScreen({super.key});

  @override
  State<WeeklyCalendarScreen> createState() => _WeeklyCalendarScreenState();
}

class _WeeklyCalendarScreenState extends State<WeeklyCalendarScreen> {
  int _selectedDayIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = context.read<MealPlanProvider>();
      provider.loadWeeklyMealPlans();
      // Select the index matching today's date
      final today = DateTime.now();
      final weekDates = provider.weekDates;
      for (int i = 0; i < weekDates.length; i++) {
        if (weekDates[i].day == today.day &&
            weekDates[i].month == today.month &&
            weekDates[i].year == today.year) {
          setState(() {
            _selectedDayIndex = i;
          });
          break;
        }
      }
    });
  }

  void _showAddMealPlan(String date, {String? mealType}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => MealPlanForm(
        date: date,
        initialMealType: mealType,
      ),
    );
  }

  void _confirmDelete(String id) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Meal Plan'),
        content: const Text('Are you sure you want to delete this meal plan?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<MealPlanProvider>().deleteMealPlan(id);
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
      appBar: AppBar(
        title: const Text('Weekly Meals'),
        actions: [
          IconButton(
            icon: const Icon(Icons.today),
            tooltip: 'This Week',
            onPressed: () {
              context.read<MealPlanProvider>().goToCurrentWeek();
              setState(() {
                _selectedDayIndex = DateTime.now().weekday - 1;
                if (_selectedDayIndex < 0 || _selectedDayIndex > 6) {
                  _selectedDayIndex = 0;
                }
              });
            },
          ),
        ],
      ),
      body: Consumer<MealPlanProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const ShimmerLoading(type: ShimmerType.calendar);
          }

          final weekDates = provider.weekDates;
          final selectedDate = weekDates[_selectedDayIndex];
          final dateStr = FormatUtils.toDateString(selectedDate);
          final dayMealPlans = provider.getMealPlansForDate(dateStr);

          return Column(
            children: [
              // Week navigation
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.chevron_left),
                      onPressed: () {
                        provider.previousWeek();
                        setState(() {
                          _selectedDayIndex = 0;
                        });
                      },
                    ),
                    Text(
                      _formatWeekRange(weekDates.first, weekDates.last),
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chevron_right),
                      onPressed: () {
                        provider.nextWeek();
                        setState(() {
                          _selectedDayIndex = 0;
                        });
                      },
                    ),
                  ],
                ),
              ),

              // Day selector
              SizedBox(
                height: 72,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: 7,
                  itemBuilder: (context, index) {
                    final date = weekDates[index];
                    final isSelected = index == _selectedDayIndex;
                    final isToday = _isToday(date);
                    final hasMeals = provider
                        .getMealPlansForDate(
                            FormatUtils.toDateString(date))
                        .isNotEmpty;

                    return GestureDetector(
                      onTap: () => setState(() => _selectedDayIndex = index),
                      child: Container(
                        width: 48,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? theme.colorScheme.primary
                              : isToday
                                  ? theme.colorScheme.primary
                                      .withOpacity(0.1)
                                  : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                          border: isToday && !isSelected
                              ? Border.all(
                                  color: theme.colorScheme.primary,
                                  width: 1.5,
                                )
                              : null,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              FormatUtils.weekdayLabel(date.weekday),
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: isSelected
                                    ? Colors.white
                                    : theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${date.day}',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: isSelected
                                    ? Colors.white
                                    : theme.colorScheme.onSurface,
                              ),
                            ),
                            if (hasMeals) ...[
                              const SizedBox(height: 2),
                              Container(
                                width: 5,
                                height: 5,
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? Colors.white
                                      : theme.colorScheme.primary,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    )
                        .animate()
                        .fadeIn(
                          delay: Duration(milliseconds: 40 * index),
                          duration: 200.ms,
                        )
                        .slideY(begin: -0.2);
                  },
                ),
              ),

              const Divider(height: 24),

              // Meal plans for the selected date
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Text(
                          FormatUtils.formatDate(dateStr),
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      ...MealPlan.mealTypes.asMap().entries.map((entry) {
                        final index = entry.key;
                        final mealType = entry.value;
                        final meals = dayMealPlans
                            .where((mp) => mp.mealType == mealType)
                            .toList();

                        return MealSlot(
                          mealType: mealType,
                          mealPlans: meals,
                          onAdd: () => _showAddMealPlan(
                            dateStr,
                            mealType: mealType,
                          ),
                          onDelete: _confirmDelete,
                          onTapRecipe: (recipeId) =>
                              context.push('/recipes/$recipeId'),
                        )
                            .animate()
                            .fadeIn(
                              delay:
                                  Duration(milliseconds: 80 * index),
                              duration: 300.ms,
                            )
                            .slideX(begin: 0.05);
                      }),
                      const SizedBox(height: 24),
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

  bool _isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  String _formatWeekRange(DateTime start, DateTime end) {
    final startStr = DateFormat('M/d').format(start);
    final endStr = DateFormat('M/d').format(end);
    return '$startStr - $endStr';
  }
}
