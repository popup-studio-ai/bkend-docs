import 'dart:convert';

import 'package:dio/dio.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class CommentApi {
  final DioClient _client;

  CommentApi({required DioClient client}) : _client = client;

  Future<Response> getComments({
    required String postId,
    int page = 1,
    int limit = 20,
    String sortBy = 'createdAt',
    String sortDirection = 'asc',
  }) {
    final filters = jsonEncode({'postId': postId});
    return _client.dio.get(
      ApiConstants.dataTable('comments'),
      queryParameters: {
        'andFilters': filters,
        'page': page,
        'limit': limit,
        'sortBy': sortBy,
        'sortDirection': sortDirection,
      },
    );
  }

  Future<Response> createComment(Map<String, dynamic> data) {
    return _client.dio.post(
      ApiConstants.dataTable('comments'),
      data: data,
    );
  }

  Future<Response> deleteComment(String commentId) {
    return _client.dio.delete(
      ApiConstants.dataRecord('comments', commentId),
    );
  }
}
