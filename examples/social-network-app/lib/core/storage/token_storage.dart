import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userIdKey = 'user_id';

  SharedPreferences? _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  SharedPreferences get _storage {
    if (_prefs == null) {
      throw StateError('TokenStorage is not initialized. Call init() first.');
    }
    return _prefs!;
  }

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.setString(_accessTokenKey, accessToken);
    await _storage.setString(_refreshTokenKey, refreshToken);
  }

  Future<void> saveUserId(String userId) async {
    await _storage.setString(_userIdKey, userId);
  }

  String? get accessToken => _storage.getString(_accessTokenKey);
  String? get refreshToken => _storage.getString(_refreshTokenKey);
  String? get userId => _storage.getString(_userIdKey);

  bool get hasTokens => accessToken != null && refreshToken != null;

  Future<void> clear() async {
    await _storage.remove(_accessTokenKey);
    await _storage.remove(_refreshTokenKey);
    await _storage.remove(_userIdKey);
  }
}
