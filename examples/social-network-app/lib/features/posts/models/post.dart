class Post {
  final String id;
  final String content;
  final String? imageUrl;
  final int likesCount;
  final int commentsCount;
  final String createdBy;
  final DateTime createdAt;

  const Post({
    required this.id,
    required this.content,
    this.imageUrl,
    this.likesCount = 0,
    this.commentsCount = 0,
    required this.createdBy,
    required this.createdAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as String,
      content: json['content'] as String,
      imageUrl: json['imageUrl'] as String?,
      likesCount: json['likesCount'] as int? ?? 0,
      commentsCount: json['commentsCount'] as int? ?? 0,
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toCreateJson() {
    return {
      'content': content,
      if (imageUrl != null) 'imageUrl': imageUrl,
    };
  }

  Post copyWith({
    int? likesCount,
    int? commentsCount,
  }) {
    return Post(
      id: id,
      content: content,
      imageUrl: imageUrl,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      createdBy: createdBy,
      createdAt: createdAt,
    );
  }
}
