class Ingredient {
  final String id;
  final String recipeId;
  final String name;
  final String amount;
  final String unit;
  final int orderIndex;
  final bool isOptional;
  final String createdBy;
  final String createdAt;

  const Ingredient({
    required this.id,
    required this.recipeId,
    required this.name,
    required this.amount,
    required this.unit,
    required this.orderIndex,
    required this.isOptional,
    required this.createdBy,
    required this.createdAt,
  });

  factory Ingredient.fromJson(Map<String, dynamic> json) {
    return Ingredient(
      id: json['id'] as String,
      recipeId: json['recipeId'] as String? ?? '',
      name: json['name'] as String? ?? '',
      amount: json['amount'] as String? ?? '',
      unit: json['unit'] as String? ?? '',
      orderIndex: json['orderIndex'] as int? ?? 0,
      isOptional: json['isOptional'] as bool? ?? false,
      createdBy: json['createdBy'] as String? ?? '',
      createdAt: json['createdAt'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'recipeId': recipeId,
      'name': name,
      'amount': amount,
      'unit': unit,
      'orderIndex': orderIndex,
      'isOptional': isOptional,
    };
  }

  Ingredient copyWith({
    String? id,
    String? recipeId,
    String? name,
    String? amount,
    String? unit,
    int? orderIndex,
    bool? isOptional,
    String? createdBy,
    String? createdAt,
  }) {
    return Ingredient(
      id: id ?? this.id,
      recipeId: recipeId ?? this.recipeId,
      name: name ?? this.name,
      amount: amount ?? this.amount,
      unit: unit ?? this.unit,
      orderIndex: orderIndex ?? this.orderIndex,
      isOptional: isOptional ?? this.isOptional,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  static const units = [
    'g',
    'kg',
    'ml',
    'L',
    'pc',
    'tbsp',
    'tsp',
    'cup',
    'pinch',
    'handful',
    'sheet',
    'clove',
    'piece',
    'slice',
    'bag',
    'can',
  ];
}
