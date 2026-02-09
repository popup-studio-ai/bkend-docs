import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../shared/models/pagination.dart';
import '../data/comment_api.dart';
import '../models/comment.dart';

class CommentProvider extends ChangeNotifier {
  final CommentApi _api;

  CommentProvider({required CommentApi api}) : _api = api;

  List<Comment> _comments = [];
  Pagination _pagination = Pagination.empty;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _isSending = false;
  String? _error;

  List<Comment> get comments => _comments;
  Pagination get pagination => _pagination;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get isSending => _isSending;
  String? get error => _error;
  bool get hasMore => _pagination.hasNext;

  Future<void> loadComments(String postId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.getComments(postId: postId);
      final data = response.data as Map<String, dynamic>;
      _comments = (data['items'] as List)
          .map((e) => Comment.fromJson(e as Map<String, dynamic>))
          .toList();
      _pagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMoreComments(String postId) async {
    if (_isLoadingMore || !_pagination.hasNext) return;

    _isLoadingMore = true;
    notifyListeners();

    try {
      final response = await _api.getComments(
        postId: postId,
        page: _pagination.page + 1,
      );
      final data = response.data as Map<String, dynamic>;
      final newComments = (data['items'] as List)
          .map((e) => Comment.fromJson(e as Map<String, dynamic>))
          .toList();
      _comments.addAll(newComments);
      _pagination =
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  Future<Comment?> addComment({
    required String postId,
    required String content,
  }) async {
    _isSending = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.createComment({
        'postId': postId,
        'content': content,
      });
      final comment = Comment.fromJson(response.data as Map<String, dynamic>);
      _comments.add(comment);
      notifyListeners();
      return comment;
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
      return null;
    } finally {
      _isSending = false;
      notifyListeners();
    }
  }

  Future<bool> deleteComment(String commentId) async {
    try {
      await _api.deleteComment(commentId);
      _comments.removeWhere((c) => c.id == commentId);
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
      return false;
    }
  }

  void clearComments() {
    _comments = [];
    _pagination = Pagination.empty;
    _error = null;
    notifyListeners();
  }

  String _parseError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic> && data.containsKey('message')) {
      return data['message'] as String;
    }
    return 'An error occurred while processing comment.';
  }
}
