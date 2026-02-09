import 'package:dio/dio.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class AuthApi {
  final DioClient _client;

  AuthApi({required DioClient client}) : _client = client;

  Future<Response> signUp({
    required String email,
    required String password,
    required String name,
  }) {
    return _client.dio.post(
      ApiConstants.signUp,
      data: {
        'method': 'password',
        'email': email,
        'password': password,
        'name': name,
      },
    );
  }

  Future<Response> signIn({
    required String email,
    required String password,
  }) {
    return _client.dio.post(
      ApiConstants.signIn,
      data: {
        'email': email,
        'password': password,
      },
    );
  }

  Future<Response> refreshToken({required String refreshToken}) {
    return _client.dio.post(
      ApiConstants.refresh,
      data: {'refreshToken': refreshToken},
    );
  }

  Future<Response> getMe() {
    return _client.dio.get(ApiConstants.me);
  }
}
