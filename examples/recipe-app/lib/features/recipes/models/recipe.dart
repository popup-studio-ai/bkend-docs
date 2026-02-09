class Recipe {
  final String id;
  final String title;
  final String description;
  final int cookingTime;
  final String difficulty;
  final int servings;
  final String category;
  final String? imageUrl;
  final String createdBy;
  final String createdAt;
  final String updatedAt;

  const Recipe({
    required this.id,
    required this.title,
    required this.description,
    required this.cookingTime,
    required this.difficulty,
    required this.servings,
    required this.category,
    this.imageUrl,
    required this.createdBy,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'] as String,
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      cookingTime: json['cookingTime'] as int? ?? 0,
      difficulty: json['difficulty'] as String? ?? 'easy',
      servings: json['servings'] as int? ?? 1,
      category: json['category'] as String? ?? '',
      imageUrl: json['imageUrl'] as String?,
      createdBy: json['createdBy'] as String? ?? '',
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'cookingTime': cookingTime,
      'difficulty': difficulty,
      'servings': servings,
      'category': category,
      if (imageUrl != null) 'imageUrl': imageUrl,
    };
  }

  Recipe copyWith({
    String? id,
    String? title,
    String? description,
    int? cookingTime,
    String? difficulty,
    int? servings,
    String? category,
    String? imageUrl,
    String? createdBy,
    String? createdAt,
    String? updatedAt,
  }) {
    return Recipe(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      cookingTime: cookingTime ?? this.cookingTime,
      difficulty: difficulty ?? this.difficulty,
      servings: servings ?? this.servings,
      category: category ?? this.category,
      imageUrl: imageUrl ?? this.imageUrl,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  static const categories = [
    'Korean',
    'Chinese',
    'Japanese',
    'Western',
    'Dessert',
    'Beverage',
    'Salad',
    'Snack',
  ];

  static const difficulties = ['easy', 'medium', 'hard'];
}
