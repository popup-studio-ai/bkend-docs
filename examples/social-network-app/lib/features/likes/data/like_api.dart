import 'dart:convert';

import 'package:dio/dio.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class LikeApi {
  final DioClient _client;

  LikeApi({required DioClient client}) : _client = client;

  Future<Response> getLike({
    required String postId,
    required String userId,
  }) {
    final filters = jsonEncode({
      'postId': postId,
      'createdBy': userId,
    });
    return _client.dio.get(
      ApiConstants.dataTable('likes'),
      queryParameters: {'andFilters': filters},
    );
  }

  Future<Response> createLike({required String postId}) {
    return _client.dio.post(
      ApiConstants.dataTable('likes'),
      data: {'postId': postId},
    );
  }

  Future<Response> deleteLike(String likeId) {
    return _client.dio.delete(
      ApiConstants.dataRecord('likes', likeId),
    );
  }
}
