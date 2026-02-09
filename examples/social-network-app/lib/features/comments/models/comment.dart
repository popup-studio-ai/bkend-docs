class Comment {
  final String id;
  final String postId;
  final String content;
  final String createdBy;
  final DateTime createdAt;

  const Comment({
    required this.id,
    required this.postId,
    required this.content,
    required this.createdBy,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] as String,
      postId: json['postId'] as String,
      content: json['content'] as String,
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toCreateJson() {
    return {
      'postId': postId,
      'content': content,
    };
  }
}
