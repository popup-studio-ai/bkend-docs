import 'dart:async';

import 'package:dio/dio.dart';
import '../constants/api_constants.dart';
import '../mock/mock_interceptor.dart';
import '../storage/token_storage.dart';

typedef LogoutCallback = void Function();

class DioClient {
  late final Dio _dio;
  final TokenStorage _tokenStorage;
  LogoutCallback? onForceLogout;
  bool _isRefreshing = false;
  final List<Completer<String>> _refreshCompleters = [];

  DioClient({required TokenStorage tokenStorage})
      : _tokenStorage = tokenStorage {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ApiConstants.publishableKey,
        },
      ),
    );

    if (ApiConstants.mockMode) {
      _dio.interceptors.add(MockInterceptor());
    }

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onResponse: _onResponse,
        onError: _onError,
      ),
    );
  }

  Dio get dio => _dio;

  void _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) {
    final token = _tokenStorage.accessToken;
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  /// 실제 API의 { success, data } 래퍼를 자동 언래핑.
  /// Mock 모드에서는 래퍼가 없으므로 그대로 통과.
  void _onResponse(
    Response response,
    ResponseInterceptorHandler handler,
  ) {
    final d = response.data;
    if (d is Map<String, dynamic> &&
        d.containsKey('success') &&
        d.containsKey('data')) {
      response.data = d['data'];
    }
    handler.next(response);
  }

  Future<void> _onError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    if (error.response?.statusCode != 401) {
      return handler.next(error);
    }

    final refreshToken = _tokenStorage.refreshToken;
    if (refreshToken == null) {
      _forceLogout();
      return handler.next(error);
    }

    if (_isRefreshing) {
      try {
        final completer = Completer<String>();
        _refreshCompleters.add(completer);
        final newToken = await completer.future;
        final retryResponse =
            await _retryRequest(error.requestOptions, newToken);
        return handler.resolve(retryResponse);
      } catch (e) {
        return handler.next(error);
      }
    }

    _isRefreshing = true;

    try {
      final refreshDio = Dio(
        BaseOptions(
          baseUrl: ApiConstants.baseUrl,
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': ApiConstants.publishableKey,
          },
        ),
      );

      final response = await refreshDio.post(
        ApiConstants.refresh,
        data: {'refreshToken': refreshToken},
      );

      final raw = response.data as Map<String, dynamic>;
      final body = (raw.containsKey('success') && raw['data'] is Map)
          ? raw['data'] as Map<String, dynamic>
          : raw;
      final newAccessToken = body['accessToken'] as String;
      final newRefreshToken = body['refreshToken'] as String;

      await _tokenStorage.saveTokens(
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      );

      for (final completer in _refreshCompleters) {
        completer.complete(newAccessToken);
      }
      _refreshCompleters.clear();

      final retryResponse =
          await _retryRequest(error.requestOptions, newAccessToken);
      handler.resolve(retryResponse);
    } catch (e) {
      for (final completer in _refreshCompleters) {
        completer.completeError(e);
      }
      _refreshCompleters.clear();
      _forceLogout();
      handler.next(error);
    } finally {
      _isRefreshing = false;
    }
  }

  void _forceLogout() {
    _tokenStorage.clear();
    onForceLogout?.call();
  }

  Future<Response<dynamic>> _retryRequest(
    RequestOptions requestOptions,
    String newToken,
  ) {
    requestOptions.headers['Authorization'] = 'Bearer $newToken';
    return _dio.fetch(requestOptions);
  }
}
