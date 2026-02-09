import 'dart:convert';

import 'package:dio/dio.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class ProfileApi {
  final DioClient _client;

  ProfileApi({required DioClient client}) : _client = client;

  Future<Response> getProfileByUserId(String userId) {
    final filters = jsonEncode({'userId': userId});
    return _client.dio.get(
      ApiConstants.dataTable('profiles'),
      queryParameters: {'andFilters': filters},
    );
  }

  Future<Response> getProfileById(String profileId) {
    return _client.dio.get(
      ApiConstants.dataRecord('profiles', profileId),
    );
  }

  Future<Response> createProfile(Map<String, dynamic> data) {
    return _client.dio.post(
      ApiConstants.dataTable('profiles'),
      data: data,
    );
  }

  Future<Response> updateProfile(String profileId, Map<String, dynamic> data) {
    return _client.dio.patch(
      ApiConstants.dataRecord('profiles', profileId),
      data: data,
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
