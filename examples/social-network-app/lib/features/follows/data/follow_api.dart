import 'dart:convert';

import 'package:dio/dio.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class FollowApi {
  final DioClient _client;

  FollowApi({required DioClient client}) : _client = client;

  Future<Response> getFollow({
    required String followerId,
    required String followingId,
  }) {
    final filters = jsonEncode({
      'followerId': followerId,
      'followingId': followingId,
    });
    return _client.dio.get(
      ApiConstants.dataTable('follows'),
      queryParameters: {'andFilters': filters},
    );
  }

  Future<Response> createFollow({
    required String followerId,
    required String followingId,
  }) {
    return _client.dio.post(
      ApiConstants.dataTable('follows'),
      data: {
        'followerId': followerId,
        'followingId': followingId,
      },
    );
  }

  Future<Response> deleteFollow(String followId) {
    return _client.dio.delete(
      ApiConstants.dataRecord('follows', followId),
    );
  }

  Future<Response> getFollowers({
    required String userId,
    int page = 1,
    int limit = 20,
  }) {
    final filters = jsonEncode({'followingId': userId});
    return _client.dio.get(
      ApiConstants.dataTable('follows'),
      queryParameters: {
        'andFilters': filters,
        'page': page,
        'limit': limit,
        'sortBy': 'createdAt',
        'sortDirection': 'desc',
      },
    );
  }

  Future<Response> getFollowing({
    required String userId,
    int page = 1,
    int limit = 20,
  }) {
    final filters = jsonEncode({'followerId': userId});
    return _client.dio.get(
      ApiConstants.dataTable('follows'),
      queryParameters: {
        'andFilters': filters,
        'page': page,
        'limit': limit,
        'sortBy': 'createdAt',
        'sortDirection': 'desc',
      },
    );
  }
}
