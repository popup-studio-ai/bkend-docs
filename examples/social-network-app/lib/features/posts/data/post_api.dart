import 'dart:convert';

import 'package:dio/dio.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class PostApi {
  final DioClient _client;

  PostApi({required DioClient client}) : _client = client;

  Future<Response> getPosts({
    int page = 1,
    int limit = 20,
    String sortBy = 'createdAt',
    String sortDirection = 'desc',
    Map<String, dynamic>? filters,
  }) {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      'sortBy': sortBy,
      'sortDirection': sortDirection,
    };
    if (filters != null) {
      queryParams['andFilters'] = jsonEncode(filters);
    }
    return _client.dio.get(
      ApiConstants.dataTable('posts'),
      queryParameters: queryParams,
    );
  }

  Future<Response> getPost(String postId) {
    return _client.dio.get(
      ApiConstants.dataRecord('posts', postId),
    );
  }

  Future<Response> createPost(Map<String, dynamic> data) {
    return _client.dio.post(
      ApiConstants.dataTable('posts'),
      data: data,
    );
  }

  Future<Response> updatePost(String postId, Map<String, dynamic> data) {
    return _client.dio.patch(
      ApiConstants.dataRecord('posts', postId),
      data: data,
    );
  }

  Future<Response> deletePost(String postId) {
    return _client.dio.delete(
      ApiConstants.dataRecord('posts', postId),
    );
  }

  Future<Response> getPresignedUrl({
    required String filename,
    required String contentType,
  }) {
    return _client.dio.post(
      ApiConstants.presignedUrl,
      data: {
        'filename': filename,
        'contentType': contentType,
      },
    );
  }

  Future<Response> uploadToPresignedUrl({
    required String url,
    required List<int> bytes,
    required String contentType,
  }) {
    return Dio().put(
      url,
      data: bytes,
      options: Options(
        headers: {
          'Content-Type': contentType,
        },
      ),
    );
  }
}
