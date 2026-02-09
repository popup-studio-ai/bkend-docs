class MealPlan {
  final String id;
  final String date;
  final String mealType;
  final String recipeId;
  final int servings;
  final String notes;
  final String createdBy;
  final String createdAt;

  // Joined recipe info (optional)
  final String? recipeTitle;
  final String? recipeImageUrl;
  final int? recipeCookingTime;

  const MealPlan({
    required this.id,
    required this.date,
    required this.mealType,
    required this.recipeId,
    required this.servings,
    required this.notes,
    required this.createdBy,
    required this.createdAt,
    this.recipeTitle,
    this.recipeImageUrl,
    this.recipeCookingTime,
  });

  factory MealPlan.fromJson(Map<String, dynamic> json) {
    return MealPlan(
      id: json['id'] as String,
      date: json['date'] as String? ?? '',
      mealType: json['mealType'] as String? ?? '',
      recipeId: json['recipeId'] as String? ?? '',
      servings: json['servings'] as int? ?? 1,
      notes: json['notes'] as String? ?? '',
      createdBy: json['createdBy'] as String? ?? '',
      createdAt: json['createdAt'] as String? ?? '',
      recipeTitle: json['recipeTitle'] as String?,
      recipeImageUrl: json['recipeImageUrl'] as String?,
      recipeCookingTime: json['recipeCookingTime'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'mealType': mealType,
      'recipeId': recipeId,
      'servings': servings,
      'notes': notes,
    };
  }

  static const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
}
