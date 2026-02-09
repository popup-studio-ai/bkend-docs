import 'package:dio/dio.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class AuthApi {
  final DioClient _client;

  AuthApi({required DioClient client}) : _client = client;

  Future<Map<String, dynamic>> signUp({
    required String email,
    required String password,
    required String name,
  }) async {
    final response = await _client.dio.post(
      ApiConstants.signUp,
      data: {
        'method': 'password',
        'email': email,
        'password': password,
        'name': name,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _client.dio.post(
      ApiConstants.signIn,
      data: {
        'email': email,
        'password': password,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> refreshToken({
    required String refreshToken,
  }) async {
    final response = await _client.dio.post(
      ApiConstants.refresh,
      data: {
        'refreshToken': refreshToken,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getMe() async {
    final response = await _client.dio.get(ApiConstants.me);
    return response.data as Map<String, dynamic>;
  }
}
