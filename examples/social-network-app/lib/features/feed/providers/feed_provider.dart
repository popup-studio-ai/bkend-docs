import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';
import '../../../shared/models/pagination.dart';
import '../../follows/providers/follow_provider.dart';
import '../../posts/models/post.dart';

class FeedProvider extends ChangeNotifier {
  final DioClient _client;
  final FollowProvider _followProvider;

  FeedProvider({
    required DioClient client,
    required FollowProvider followProvider,
  })  : _client = client,
        _followProvider = followProvider;

  List<Post> _feedPosts = [];
  List<Post> _explorePosts = [];
  Pagination _feedPagination = Pagination.empty;
  Pagination _explorePagination = Pagination.empty;
  bool _isFeedLoading = false;
  bool _isExploreLoading = false;
  bool _isFeedLoadingMore = false;
  bool _isExploreLoadingMore = false;
  String? _error;
  List<String> _followingIds = [];

  List<Post> get feedPosts => _feedPosts;
  List<Post> get explorePosts => _explorePosts;
  Pagination get feedPagination => _feedPagination;
  Pagination get explorePagination => _explorePagination;
  bool get isFeedLoading => _isFeedLoading;
  bool get isExploreLoading => _isExploreLoading;
  bool get isFeedLoadingMore => _isFeedLoadingMore;
  bool get isExploreLoadingMore => _isExploreLoadingMore;
  String? get error => _error;
  bool get hasFeedMore => _feedPagination.hasNext;
  bool get hasExploreMore => _explorePagination.hasNext;

  /// Load following feed: posts from users I follow
  Future<void> loadFeed(String userId) async {
    _isFeedLoading = true;
    _error = null;
    notifyListeners();

    try {
      _followingIds = await _followProvider.getFollowingIds(userId);

      // Include own posts in feed
      if (!_followingIds.contains(userId)) {
        _followingIds.add(userId);
      }

      final filters = {
        'createdBy': {'\$in': _followingIds},
      };

      final response = await _client.dio.get(
        ApiConstants.dataTable('posts'),
        queryParameters: {
          'andFilters': jsonEncode(filters),
          'sortBy': 'createdAt',
          'sortDirection': 'desc',
          'page': 1,
          'limit': 20,
        },
      );

      final data = response.data as Map<String, dynamic>;
      _feedPosts = (data['items'] as List)
          .map((e) => Post.fromJson(e as Map<String, dynamic>))
          .toList();
      _feedPagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isFeedLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMoreFeed() async {
    if (_isFeedLoadingMore || !_feedPagination.hasNext) return;
    if (_followingIds.isEmpty) return;

    _isFeedLoadingMore = true;
    notifyListeners();

    try {
      final filters = {
        'createdBy': {'\$in': _followingIds},
      };

      final response = await _client.dio.get(
        ApiConstants.dataTable('posts'),
        queryParameters: {
          'andFilters': jsonEncode(filters),
          'sortBy': 'createdAt',
          'sortDirection': 'desc',
          'page': _feedPagination.page + 1,
          'limit': 20,
        },
      );

      final data = response.data as Map<String, dynamic>;
      final newPosts = (data['items'] as List)
          .map((e) => Post.fromJson(e as Map<String, dynamic>))
          .toList();
      _feedPosts.addAll(newPosts);
      _feedPagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isFeedLoadingMore = false;
      notifyListeners();
    }
  }

  /// Load explore feed: all public posts
  Future<void> loadExplore() async {
    _isExploreLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _client.dio.get(
        ApiConstants.dataTable('posts'),
        queryParameters: {
          'sortBy': 'createdAt',
          'sortDirection': 'desc',
          'page': 1,
          'limit': 20,
        },
      );

      final data = response.data as Map<String, dynamic>;
      _explorePosts = (data['items'] as List)
          .map((e) => Post.fromJson(e as Map<String, dynamic>))
          .toList();
      _explorePagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isExploreLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMoreExplore() async {
    if (_isExploreLoadingMore || !_explorePagination.hasNext) return;

    _isExploreLoadingMore = true;
    notifyListeners();

    try {
      final response = await _client.dio.get(
        ApiConstants.dataTable('posts'),
        queryParameters: {
          'sortBy': 'createdAt',
          'sortDirection': 'desc',
          'page': _explorePagination.page + 1,
          'limit': 20,
        },
      );

      final data = response.data as Map<String, dynamic>;
      final newPosts = (data['items'] as List)
          .map((e) => Post.fromJson(e as Map<String, dynamic>))
          .toList();
      _explorePosts.addAll(newPosts);
      _explorePagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isExploreLoadingMore = false;
      notifyListeners();
    }
  }

  void updatePostInFeed(Post updatedPost) {
    final feedIndex = _feedPosts.indexWhere((p) => p.id == updatedPost.id);
    if (feedIndex != -1) {
      _feedPosts[feedIndex] = updatedPost;
    }
    final exploreIndex =
        _explorePosts.indexWhere((p) => p.id == updatedPost.id);
    if (exploreIndex != -1) {
      _explorePosts[exploreIndex] = updatedPost;
    }
    notifyListeners();
  }

  void clearFeed() {
    _feedPosts = [];
    _explorePosts = [];
    _feedPagination = Pagination.empty;
    _explorePagination = Pagination.empty;
    _followingIds = [];
    _error = null;
    notifyListeners();
  }

  String _parseError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic> && data.containsKey('message')) {
      return data['message'] as String;
    }
    return 'An error occurred while loading the feed.';
  }
}
