class Like {
  final String id;
  final String postId;
  final String createdBy;
  final DateTime createdAt;

  const Like({
    required this.id,
    required this.postId,
    required this.createdBy,
    required this.createdAt,
  });

  factory Like.fromJson(Map<String, dynamic> json) {
    return Like(
      id: json['id'] as String,
      postId: json['postId'] as String,
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}
