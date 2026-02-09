import '../models/profile.dart';
import 'profile_api.dart';

class ProfileRepository {
  final ProfileApi _api;

  ProfileRepository({required ProfileApi api}) : _api = api;

  Future<Profile?> getProfileByUserId(String userId) async {
    final response = await _api.getProfileByUserId(userId);
    final data = response.data as Map<String, dynamic>;
    final items = data['items'] as List;
    if (items.isEmpty) return null;
    return Profile.fromJson(items.first as Map<String, dynamic>);
  }

  Future<Profile> getProfileById(String profileId) async {
    final response = await _api.getProfileById(profileId);
    return Profile.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Profile> createProfile({
    required String userId,
    required String nickname,
    String? bio,
    String? avatarUrl,
  }) async {
    final response = await _api.createProfile({
      'userId': userId,
      'nickname': nickname,
      if (bio != null) 'bio': bio,
      if (avatarUrl != null) 'avatarUrl': avatarUrl,
    });
    return Profile.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Profile> updateProfile(
    String profileId, {
    String? nickname,
    String? bio,
    String? avatarUrl,
  }) async {
    final updateData = <String, dynamic>{};
    if (nickname != null) updateData['nickname'] = nickname;
    if (bio != null) updateData['bio'] = bio;
    if (avatarUrl != null) updateData['avatarUrl'] = avatarUrl;

    final response = await _api.updateProfile(profileId, updateData);
    return Profile.fromJson(response.data as Map<String, dynamic>);
  }

  Future<String> uploadAvatar({
    required String filename,
    required String contentType,
    required List<int> bytes,
  }) async {
    final presignedResponse = await _api.getPresignedUrl(
      filename: filename,
      contentType: contentType,
    );
    final presignedData = presignedResponse.data as Map<String, dynamic>;
    final presignedUrl = presignedData['url'] as String;

    await _api.uploadToPresignedUrl(
      url: presignedUrl,
      bytes: bytes,
      contentType: contentType,
    );

    // Strip query params from presigned URL to get public URL
    final uri = Uri.parse(presignedUrl);
    return '${uri.scheme}://${uri.host}${uri.path}';
  }
}
