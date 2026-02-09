import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../data/like_api.dart';
import '../models/like.dart';

class LikeProvider extends ChangeNotifier {
  final LikeApi _api;

  LikeProvider({required LikeApi api}) : _api = api;

  // Map<postId, Like?> - cached like status per post
  final Map<String, Like?> _likeCache = {};
  final Set<String> _processingPosts = {};

  bool isLiked(String postId) => _likeCache[postId] != null;
  bool isProcessing(String postId) => _processingPosts.contains(postId);

  Future<void> checkLikeStatus({
    required String postId,
    required String userId,
  }) async {
    try {
      final response = await _api.getLike(postId: postId, userId: userId);
      final data = response.data as Map<String, dynamic>;
      final items = data['items'] as List;
      if (items.isNotEmpty) {
        _likeCache[postId] =
            Like.fromJson(items.first as Map<String, dynamic>);
      } else {
        _likeCache[postId] = null;
      }
      notifyListeners();
    } on DioException {
      // silently fail - default to not liked
    }
  }

  Future<bool> toggleLike({
    required String postId,
    required String userId,
    required int currentLikesCount,
    required Function(int newCount) onCountChanged,
  }) async {
    if (_processingPosts.contains(postId)) return false;

    _processingPosts.add(postId);
    notifyListeners();

    try {
      final existingLike = _likeCache[postId];

      if (existingLike != null) {
        // Unlike
        await _api.deleteLike(existingLike.id);
        _likeCache[postId] = null;
        final newCount =
            currentLikesCount > 0 ? currentLikesCount - 1 : 0;
        onCountChanged(newCount);
      } else {
        // Like
        final response = await _api.createLike(postId: postId);
        _likeCache[postId] =
            Like.fromJson(response.data as Map<String, dynamic>);
        onCountChanged(currentLikesCount + 1);
      }

      notifyListeners();
      return true;
    } on DioException {
      notifyListeners();
      return false;
    } finally {
      _processingPosts.remove(postId);
      notifyListeners();
    }
  }

  void clearCache() {
    _likeCache.clear();
    notifyListeners();
  }
}
