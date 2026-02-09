import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../data/follow_api.dart';
import '../models/follow.dart';

class FollowProvider extends ChangeNotifier {
  final FollowApi _api;

  FollowProvider({required FollowApi api}) : _api = api;

  // Map<targetUserId, Follow?> - cached follow status
  final Map<String, Follow?> _followCache = {};
  final Set<String> _processingUsers = {};

  List<Follow> _followers = [];
  List<Follow> _following = [];
  Pagination _followersPagination = Pagination.empty;
  Pagination _followingPagination = Pagination.empty;
  bool _isLoading = false;
  String? _error;

  List<Follow> get followers => _followers;
  List<Follow> get following => _following;
  Pagination get followersPagination => _followersPagination;
  Pagination get followingPagination => _followingPagination;
  bool get isLoading => _isLoading;
  String? get error => _error;

  bool isFollowing(String targetUserId) =>
      _followCache[targetUserId] != null;
  bool isProcessing(String targetUserId) =>
      _processingUsers.contains(targetUserId);

  Future<void> checkFollowStatus({
    required String myUserId,
    required String targetUserId,
  }) async {
    try {
      final response = await _api.getFollow(
        followerId: myUserId,
        followingId: targetUserId,
      );
      final data = response.data as Map<String, dynamic>;
      final items = data['items'] as List;
      if (items.isNotEmpty) {
        _followCache[targetUserId] =
            Follow.fromJson(items.first as Map<String, dynamic>);
      } else {
        _followCache[targetUserId] = null;
      }
      notifyListeners();
    } on DioException {
      // silently fail
    }
  }

  Future<bool> toggleFollow({
    required String myUserId,
    required String targetUserId,
  }) async {
    if (_processingUsers.contains(targetUserId)) return false;

    _processingUsers.add(targetUserId);
    notifyListeners();

    try {
      final existingFollow = _followCache[targetUserId];

      if (existingFollow != null) {
        // Unfollow
        await _api.deleteFollow(existingFollow.id);
        _followCache[targetUserId] = null;
      } else {
        // Follow
        final response = await _api.createFollow(
          followerId: myUserId,
          followingId: targetUserId,
        );
        _followCache[targetUserId] =
            Follow.fromJson(response.data as Map<String, dynamic>);
      }

      notifyListeners();
      return true;
    } on DioException {
      notifyListeners();
      return false;
    } finally {
      _processingUsers.remove(targetUserId);
      notifyListeners();
    }
  }

  Future<void> loadFollowers(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.getFollowers(userId: userId);
      final data = response.data as Map<String, dynamic>;
      _followers = (data['items'] as List)
          .map((e) => Follow.fromJson(e as Map<String, dynamic>))
          .toList();
      _followersPagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadFollowing(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.getFollowing(userId: userId);
      final data = response.data as Map<String, dynamic>;
      _following = (data['items'] as List)
          .map((e) => Follow.fromJson(e as Map<String, dynamic>))
          .toList();
      _followingPagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Returns list of user IDs that this user is following
  Future<List<String>> getFollowingIds(String userId) async {
    final response = await _api.getFollowing(
      userId: userId,
      limit: 50,
    );
    final data = response.data as Map<String, dynamic>;
    final items = data['items'] as List;
    return items
        .map((e) => (e as Map<String, dynamic>)['followingId'] as String)
        .toList();
  }

  void clearCache() {
    _followCache.clear();
    _followers = [];
    _following = [];
    notifyListeners();
  }

  String _parseError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic> && data.containsKey('message')) {
      return data['message'] as String;
    }
    return 'An error occurred while processing follow.';
  }
}
