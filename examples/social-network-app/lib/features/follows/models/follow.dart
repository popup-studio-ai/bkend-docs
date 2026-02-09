class Follow {
  final String id;
  final String followerId;
  final String followingId;
  final String createdBy;
  final DateTime createdAt;

  const Follow({
    required this.id,
    required this.followerId,
    required this.followingId,
    required this.createdBy,
    required this.createdAt,
  });

  factory Follow.fromJson(Map<String, dynamic> json) {
    return Follow(
      id: json['id'] as String,
      followerId: json['followerId'] as String,
      followingId: json['followingId'] as String,
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}
