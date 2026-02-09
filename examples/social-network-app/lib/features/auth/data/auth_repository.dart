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

  AuthRepository({
    required AuthApi api,
    required TokenStorage tokenStorage,
  })  : _api = api,
        _tokenStorage = tokenStorage;

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
    final data = response.data as Map<String, dynamic>;
    await _saveAuthData(data);
    return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
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
    await _saveAuthData(data);
    return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
  }

  Future<AuthUser> getMe() async {
    final response = await _api.getMe();
    final data = response.data as Map<String, dynamic>;
    return AuthUser.fromJson(data);
  }

  Future<void> signOut() async {
    await _tokenStorage.clear();
  }

  Future<void> _saveAuthData(Map<String, dynamic> data) async {
    final accessToken = data['accessToken'] as String;
    final refreshToken = data['refreshToken'] as String;
    final user = data['user'] as Map<String, dynamic>;
    final userId = user['id'] as String;

    await _tokenStorage.saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
    await _tokenStorage.saveUserId(userId);
  }

  bool get isAuthenticated => _tokenStorage.hasTokens;
  String? get currentUserId => _tokenStorage.userId;
}
