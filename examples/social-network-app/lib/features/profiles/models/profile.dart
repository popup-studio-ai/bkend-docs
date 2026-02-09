class Profile {
  final String id;
  final String userId;
  final String nickname;
  final String? bio;
  final String? avatarUrl;
  final String createdBy;
  final DateTime createdAt;

  const Profile({
    required this.id,
    required this.userId,
    required this.nickname,
    this.bio,
    this.avatarUrl,
    required this.createdBy,
    required this.createdAt,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['id'] as String,
      userId: json['userId'] as String,
      nickname: json['nickname'] as String,
      bio: json['bio'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'nickname': nickname,
      if (bio != null) 'bio': bio,
      if (avatarUrl != null) 'avatarUrl': avatarUrl,
    };
  }

  Profile copyWith({
    String? nickname,
    String? bio,
    String? avatarUrl,
  }) {
    return Profile(
      id: id,
      userId: userId,
      nickname: nickname ?? this.nickname,
      bio: bio ?? this.bio,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      createdBy: createdBy,
      createdAt: createdAt,
    );
  }
}
