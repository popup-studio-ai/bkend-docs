import '../../../core/storage/token_storage.dart';
import 'auth_api.dart';

class AuthRepository {
  final AuthApi _api;
  final TokenStorage _tokenStorage;

  AuthRepository({
    required AuthApi api,
    required TokenStorage tokenStorage,
  })  : _api = api,
        _tokenStorage = tokenStorage;

  Future<Map<String, dynamic>> signUp({
    required String email,
    required String password,
    required String name,
  }) async {
    final data = await _api.signUp(
      email: email,
      password: password,
      name: name,
    );
    await _saveTokensFromResponse(data);
    return data;
  }

  Future<Map<String, dynamic>> signIn({
    required String email,
    required String password,
  }) async {
    final data = await _api.signIn(
      email: email,
      password: password,
    );
    await _saveTokensFromResponse(data);
    return data;
  }

  Future<Map<String, dynamic>> getMe() async {
    return await _api.getMe();
  }

  Future<void> signOut() async {
    await _tokenStorage.clearTokens();
  }

  Future<bool> isAuthenticated() async {
    return await _tokenStorage.hasTokens();
  }

  Future<void> _saveTokensFromResponse(Map<String, dynamic> data) async {
    final accessToken = data['accessToken'] as String?;
    final refreshToken = data['refreshToken'] as String?;
    if (accessToken != null && refreshToken != null) {
      await _tokenStorage.saveTokens(
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
    }
  }
}
