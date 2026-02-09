class CookingLog {
  final String id;
  final String recipeId;
  final int rating;
  final String notes;
  final String cookedAt;
  final String createdBy;
  final String createdAt;
  final String updatedAt;

  const CookingLog({
    required this.id,
    required this.recipeId,
    required this.rating,
    required this.notes,
    required this.cookedAt,
    required this.createdBy,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CookingLog.fromJson(Map<String, dynamic> json) {
    return CookingLog(
      id: json['id'] as String,
      recipeId: json['recipeId'] as String? ?? '',
      rating: json['rating'] as int? ?? 0,
      notes: json['notes'] as String? ?? '',
      cookedAt: json['cookedAt'] as String? ?? '',
      createdBy: json['createdBy'] as String? ?? '',
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'recipeId': recipeId,
      'rating': rating,
      'notes': notes,
      'cookedAt': cookedAt,
    };
  }

  CookingLog copyWith({
    String? id,
    String? recipeId,
    int? rating,
    String? notes,
    String? cookedAt,
    String? createdBy,
    String? createdAt,
    String? updatedAt,
  }) {
    return CookingLog(
      id: id ?? this.id,
      recipeId: recipeId ?? this.recipeId,
      rating: rating ?? this.rating,
      notes: notes ?? this.notes,
      cookedAt: cookedAt ?? this.cookedAt,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
