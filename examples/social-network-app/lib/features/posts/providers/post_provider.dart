import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../data/post_repository.dart';
import '../models/post.dart';

class PostProvider extends ChangeNotifier {
  final PostRepository _repository;

  PostProvider({required PostRepository repository})
      : _repository = repository;

  List<Post> _posts = [];
  Pagination _pagination = Pagination.empty;
  // Separate list for user profile posts (not shared with explore)
  List<Post> _userPosts = [];
  Pagination _userPagination = Pagination.empty;
  bool _isUserPostsLoading = false;
  Post? _currentPost;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _isCreating = false;
  String? _error;

  List<Post> get posts => _posts;
  Pagination get pagination => _pagination;
  List<Post> get userPosts => _userPosts;
  Pagination get userPagination => _userPagination;
  bool get isUserPostsLoading => _isUserPostsLoading;
  Post? get currentPost => _currentPost;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get isCreating => _isCreating;
  String? get error => _error;
  bool get hasMore => _pagination.hasNext;

  Future<void> loadPosts({Map<String, dynamic>? filters}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _repository.getPosts(filters: filters);
      _posts = result.items;
      _pagination = result.pagination;
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMorePosts({Map<String, dynamic>? filters}) async {
    if (_isLoadingMore || !_pagination.hasNext) return;

    _isLoadingMore = true;
    notifyListeners();

    try {
      final result = await _repository.getPosts(
        page: _pagination.page + 1,
        filters: filters,
      );
      _posts.addAll(result.items);
      _pagination = result.pagination;
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  Future<void> loadUserPosts(String userId) async {
    _isUserPostsLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _repository.getPosts(
        filters: {'createdBy': userId},
      );
      _userPosts = result.items;
      _userPagination = result.pagination;
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isUserPostsLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadPost(String postId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _currentPost = await _repository.getPost(postId);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Post?> createPost({
    required String content,
    String? imageUrl,
  }) async {
    _isCreating = true;
    _error = null;
    notifyListeners();

    try {
      final post = await _repository.createPost(
        content: content,
        imageUrl: imageUrl,
      );
      _posts.insert(0, post);
      notifyListeners();
      return post;
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
      return null;
    } finally {
      _isCreating = false;
      notifyListeners();
    }
  }

  Future<void> deletePost(String postId) async {
    try {
      await _repository.deletePost(postId);
      _posts.removeWhere((p) => p.id == postId);
      notifyListeners();
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
    }
  }

  Future<String?> uploadImage({
    required String filename,
    required String contentType,
    required List<int> bytes,
  }) async {
    try {
      return await _repository.uploadImage(
        filename: filename,
        contentType: contentType,
        bytes: bytes,
      );
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
      return null;
    }
  }

  void updatePostInList(Post updatedPost) {
    final index = _posts.indexWhere((p) => p.id == updatedPost.id);
    if (index != -1) {
      _posts[index] = updatedPost;
      notifyListeners();
    }
    if (_currentPost?.id == updatedPost.id) {
      _currentPost = updatedPost;
      notifyListeners();
    }
  }

  void clearPosts() {
    _posts = [];
    _pagination = Pagination.empty;
    _error = null;
    notifyListeners();
  }

  String _parseError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic> && data.containsKey('message')) {
      return data['message'] as String;
    }
    return 'An error occurred while processing post.';
  }
}
