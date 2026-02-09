import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../../../shared/utils/format_utils.dart';
import '../data/meal_plan_api.dart';
import '../models/meal_plan.dart';

class MealPlanProvider extends ChangeNotifier {
  final MealPlanApi _api;

  List<MealPlan> _mealPlans = [];
  bool _isLoading = false;
  String? _errorMessage;
  DateTime _selectedWeekStart = _getWeekStart(DateTime.now());

  MealPlanProvider({required MealPlanApi api}) : _api = api;

  List<MealPlan> get mealPlans => _mealPlans;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  DateTime get selectedWeekStart => _selectedWeekStart;

  /// Meal plans for the given date
  List<MealPlan> getMealPlansForDate(String date) {
    return _mealPlans.where((mp) => mp.date == date).toList();
  }

  /// Weekly date list (Mon-Sun)
  List<DateTime> get weekDates {
    return List.generate(
      7,
      (i) => _selectedWeekStart.add(Duration(days: i)),
    );
  }

  /// Go to previous week
  void previousWeek() {
    _selectedWeekStart =
        _selectedWeekStart.subtract(const Duration(days: 7));
    loadWeeklyMealPlans();
  }

  /// Go to next week
  void nextWeek() {
    _selectedWeekStart = _selectedWeekStart.add(const Duration(days: 7));
    loadWeeklyMealPlans();
  }

  /// Go to current week
  void goToCurrentWeek() {
    _selectedWeekStart = _getWeekStart(DateTime.now());
    loadWeeklyMealPlans();
  }

  /// Load weekly meal plans
  Future<void> loadWeeklyMealPlans() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final startDate = FormatUtils.toDateString(_selectedWeekStart);
      final endDate = FormatUtils.toDateString(
        _selectedWeekStart.add(const Duration(days: 6)),
      );

      final data = await _api.getMealPlans(
        startDate: startDate,
        endDate: endDate,
      );
      final response =
          PaginatedResponse.fromJson(data, MealPlan.fromJson);
      _mealPlans = response.items;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Add meal plan
  Future<bool> addMealPlan({
    required String date,
    required String mealType,
    required String recipeId,
    int servings = 1,
    String notes = '',
  }) async {
    // Prevent duplicates: same date + meal type + recipe
    final exists = _mealPlans.any(
      (mp) =>
          mp.date == date &&
          mp.mealType == mealType &&
          mp.recipeId == recipeId,
    );
    if (exists) {
      _errorMessage = 'This recipe is already added to the same meal.';
      notifyListeners();
      return false;
    }

    try {
      final data = await _api.createMealPlan({
        'date': date,
        'mealType': mealType,
        'recipeId': recipeId,
        'servings': servings,
        'notes': notes,
      });
      _mealPlans = [..._mealPlans, MealPlan.fromJson(data)];
      _mealPlans.sort((a, b) => a.date.compareTo(b.date));
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Delete meal plan
  Future<bool> deleteMealPlan(String id) async {
    try {
      await _api.deleteMealPlan(id);
      _mealPlans.removeWhere((mp) => mp.id == id);
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _errorMessage = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// All recipe IDs registered for the week
  List<String> get weeklyRecipeIds {
    return _mealPlans.map((mp) => mp.recipeId).toSet().toList();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  static DateTime _getWeekStart(DateTime date) {
    final weekday = date.weekday; // 1=Mon, 7=Sun
    return DateTime(date.year, date.month, date.day - (weekday - 1));
  }

  String _extractError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic>) {
      return data['message'] as String? ?? 'An error occurred.';
    }
    return 'A network error occurred.';
  }
}
