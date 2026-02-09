class ShoppingItem {
  final String name;
  final String amount;
  final String unit;
  final bool checked;
  final String? recipeId;

  const ShoppingItem({
    required this.name,
    required this.amount,
    required this.unit,
    required this.checked,
    this.recipeId,
  });

  factory ShoppingItem.fromJson(Map<String, dynamic> json) {
    return ShoppingItem(
      name: json['name'] as String? ?? '',
      amount: json['amount'] as String? ?? '',
      unit: json['unit'] as String? ?? '',
      checked: json['checked'] as bool? ?? false,
      recipeId: json['recipeId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'amount': amount,
      'unit': unit,
      'checked': checked,
      if (recipeId != null) 'recipeId': recipeId,
    };
  }

  ShoppingItem copyWith({
    String? name,
    String? amount,
    String? unit,
    bool? checked,
    String? recipeId,
  }) {
    return ShoppingItem(
      name: name ?? this.name,
      amount: amount ?? this.amount,
      unit: unit ?? this.unit,
      checked: checked ?? this.checked,
      recipeId: recipeId ?? this.recipeId,
    );
  }
}

class ShoppingList {
  final String id;
  final String name;
  final String date;
  final List<ShoppingItem> items;
  final int totalItems;
  final int checkedItems;
  final String createdBy;
  final String createdAt;

  const ShoppingList({
    required this.id,
    required this.name,
    required this.date,
    required this.items,
    required this.totalItems,
    required this.checkedItems,
    required this.createdBy,
    required this.createdAt,
  });

  factory ShoppingList.fromJson(Map<String, dynamic> json) {
    final itemsList = (json['items'] as List<dynamic>?)
            ?.map((e) => ShoppingItem.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];
    return ShoppingList(
      id: json['id'] as String,
      name: json['name'] as String? ?? '',
      date: json['date'] as String? ?? '',
      items: itemsList,
      totalItems: json['totalItems'] as int? ?? itemsList.length,
      checkedItems: json['checkedItems'] as int? ?? 0,
      createdBy: json['createdBy'] as String? ?? '',
      createdAt: json['createdAt'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'date': date,
      'items': items.map((i) => i.toJson()).toList(),
      'totalItems': totalItems,
      'checkedItems': checkedItems,
    };
  }

  double get progress =>
      totalItems > 0 ? checkedItems / totalItems : 0.0;
}
