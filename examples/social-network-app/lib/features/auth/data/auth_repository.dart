import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../../../core/constants/api_constants.dart';
import '../../../core/storage/token_storage.dart';
import 'auth_api.dart';

class AuthUser {
  final String id;
  final String email;
  final String? name;

  const AuthUser({
    required this.id,
    required this.email,
    this.name,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String?,
    );
  }
}

class AuthRepository {
  final AuthApi _api;
  final TokenStorage _tokenStorage;
  bool _googleInitialized = false;

  AuthRepository({
    required AuthApi api,
    required TokenStorage tokenStorage,
  })  : _api = api,
        _tokenStorage = tokenStorage;

  /// JWT payload에서 sub(userId) 추출
  String _userIdFromToken(String token) {
    final parts = token.split('.');
    final payload = parts[1];
    final normalized = base64Url.normalize(payload);
    final decoded = utf8.decode(base64Url.decode(normalized));
    final map = jsonDecode(decoded) as Map<String, dynamic>;
    return map['sub'] as String;
  }

  Future<AuthUser> signUp({
    required String email,
    required String password,
    required String name,
  }) async {
    final response = await _api.signUp(
      email: email,
      password: password,
      name: name,
    );
    // DioClient 인터셉터가 { success, data } 래퍼를 자동 언래핑함
    final data = response.data as Map<String, dynamic>;
    await _saveAuthData(data, email: email, name: name);

    // Mock에는 user 객체가 있고, 실제 API에는 없음
    if (data.containsKey('user')) {
      return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    }
    return AuthUser(
      id: _userIdFromToken(data['accessToken'] as String),
      email: email,
      name: name,
    );
  }

  Future<AuthUser> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _api.signIn(
      email: email,
      password: password,
    );
    final data = response.data as Map<String, dynamic>;
    await _saveAuthData(data, email: email);

    if (data.containsKey('user')) {
      return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    }
    return AuthUser(
      id: _userIdFromToken(data['accessToken'] as String),
      email: email,
    );
  }

  Future<AuthUser> getMe() async {
    final response = await _api.getMe();
    final data = response.data as Map<String, dynamic>;
    return AuthUser.fromJson(data);
  }

  /// Google OAuth 로그인.
  /// google_sign_in v7으로 네이티브 인증 → idToken → bkend 콜백 POST.
  /// Mock 모드에서는 Google Sign-In을 건너뛰고 바로 Mock 토큰을 반환합니다.
  Future<AuthUser> signInWithGoogle() async {
    if (ApiConstants.mockMode) {
      await _tokenStorage.saveTokens(
        accessToken: 'mock-google-access-token',
        refreshToken: 'mock-google-refresh-token',
      );
      await _tokenStorage.saveUserId('user-1');
      return const AuthUser(
        id: 'user-1',
        email: 'demo@bkend.ai',
        name: 'Demo User',
      );
    }

    // 1. Google Sign-In 초기화 (v7: 싱글톤, 한 번만 호출)
    final googleSignIn = GoogleSignIn.instance;
    if (!_googleInitialized) {
      await googleSignIn.initialize(
        clientId: ApiConstants.googleClientId.isNotEmpty
            ? ApiConstants.googleClientId
            : null,
        serverClientId: ApiConstants.googleServerClientId.isNotEmpty
            ? ApiConstants.googleServerClientId
            : null,
      );
      _googleInitialized = true;
    }

    // 2. 네이티브 인증 (GoogleSignInException 발생 가능)
    final account = await googleSignIn.authenticate(
      scopeHint: ['email', 'profile'],
    );

    final idToken = account.authentication.idToken;
    debugPrint('[GoogleAuth] idToken: ${idToken != null ? '${idToken.substring(0, 20)}...' : 'NULL'}');
    if (idToken == null) {
      throw Exception('Failed to get Google ID token.');
    }

    // 3. bkend에 idToken POST → accessToken + refreshToken 수신
    debugPrint('[GoogleAuth] POST /v1/auth/google/callback');
    final response = await _api.googleCallback(idToken: idToken);
    debugPrint('[GoogleAuth] Response: ${response.statusCode} ${response.data}');
    final data = response.data as Map<String, dynamic>;

    // 4. 토큰 저장
    await _saveAuthData(data, email: account.email, name: account.displayName);

    // 5. 사용자 정보 반환
    if (data.containsKey('user')) {
      return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    }
    return AuthUser(
      id: _userIdFromToken(data['accessToken'] as String),
      email: account.email,
      name: account.displayName,
    );
  }

  Future<void> signOut() async {
    await _tokenStorage.clear();
  }

  Future<void> _saveAuthData(
    Map<String, dynamic> data, {
    String? email,
    String? name,
  }) async {
    final accessToken = data['accessToken'] as String;
    final refreshToken = data['refreshToken'] as String;
    final userId = data.containsKey('user')
        ? (data['user'] as Map<String, dynamic>)['id'] as String
        : _userIdFromToken(accessToken);

    await _tokenStorage.saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
    await _tokenStorage.saveUserId(userId);
  }

  bool get isAuthenticated => _tokenStorage.hasTokens;
  String? get currentUserId => _tokenStorage.userId;
}
