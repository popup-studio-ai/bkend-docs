import '../../../shared/models/pagination.dart';
import '../models/post.dart';
import 'post_api.dart';

class PostRepository {
  final PostApi _api;

  PostRepository({required PostApi api}) : _api = api;

  Future<PaginatedResponse<Post>> getPosts({
    int page = 1,
    int limit = 20,
    Map<String, dynamic>? filters,
  }) async {
    final response = await _api.getPosts(
      page: page,
      limit: limit,
      filters: filters,
    );
    final data = response.data as Map<String, dynamic>;
    final items = (data['items'] as List)
        .map((e) => Post.fromJson(e as Map<String, dynamic>))
        .toList();
    final pagination =
        Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    return PaginatedResponse(items: items, pagination: pagination);
  }

  Future<Post> getPost(String postId) async {
    final response = await _api.getPost(postId);
    return Post.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Post> createPost({
    required String content,
    String? imageUrl,
  }) async {
    final response = await _api.createPost({
      'content': content,
      if (imageUrl != null) 'imageUrl': imageUrl,
    });
    return Post.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Post> updatePost(
    String postId, {
    int? likesCount,
    int? commentsCount,
  }) async {
    final updateData = <String, dynamic>{};
    if (likesCount != null) updateData['likesCount'] = likesCount;
    if (commentsCount != null) updateData['commentsCount'] = commentsCount;

    final response = await _api.updatePost(postId, updateData);
    return Post.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deletePost(String postId) async {
    await _api.deletePost(postId);
  }

  Future<String> uploadImage({
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
