import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../data/profile_repository.dart';
import '../models/profile.dart';

class ProfileProvider extends ChangeNotifier {
  final ProfileRepository _repository;

  ProfileProvider({required ProfileRepository repository})
      : _repository = repository;

  Profile? _myProfile;
  Profile? _viewingProfile;
  bool _isLoading = false;
  bool _isSaving = false;
  String? _error;

  Profile? get myProfile => _myProfile;
  Profile? get viewingProfile => _viewingProfile;
  bool get isLoading => _isLoading;
  bool get isSaving => _isSaving;
  String? get error => _error;
  bool get hasProfile => _myProfile != null;

  Future<void> loadMyProfile(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _myProfile = await _repository.getProfileByUserId(userId);
    } on DioException catch (e) {
      _error = _parseError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Profile?> loadProfileByUserId(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _viewingProfile = await _repository.getProfileByUserId(userId);
      return _viewingProfile;
    } on DioException catch (e) {
      _error = _parseError(e);
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Load profile, auto-create if not exists
  Future<void> ensureProfile({
    required String userId,
    String? name,
    String? email,
  }) async {
    await loadMyProfile(userId);
    if (_myProfile == null) {
      final nickname = (name != null && name.isNotEmpty)
          ? name
          : (email != null ? email.split('@').first : 'User');
      await createProfile(userId: userId, nickname: nickname);
    }
  }

  Future<bool> createProfile({
    required String userId,
    required String nickname,
    String? bio,
    String? avatarUrl,
  }) async {
    _isSaving = true;
    _error = null;
    notifyListeners();

    try {
      _myProfile = await _repository.createProfile(
        userId: userId,
        nickname: nickname,
        bio: bio,
        avatarUrl: avatarUrl,
      );
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
      return false;
    } finally {
      _isSaving = false;
      notifyListeners();
    }
  }

  Future<bool> updateProfile({
    String? nickname,
    String? bio,
    String? avatarUrl,
  }) async {
    if (_myProfile == null) return false;

    _isSaving = true;
    _error = null;
    notifyListeners();

    try {
      _myProfile = await _repository.updateProfile(
        _myProfile!.id,
        nickname: nickname,
        bio: bio,
        avatarUrl: avatarUrl,
      );
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
      return false;
    } finally {
      _isSaving = false;
      notifyListeners();
    }
  }

  Future<String?> uploadAvatar({
    required String filename,
    required String contentType,
    required List<int> bytes,
  }) async {
    try {
      return await _repository.uploadAvatar(
        filename: filename,
        contentType: contentType,
        bytes: bytes,
      );
    } on DioException catch (e) {
      _error = _parseError(e);
      notifyListeners();
      return null;
    }
  }

  void clearViewingProfile() {
    _viewingProfile = null;
  }

  void clearProfile() {
    _myProfile = null;
    _viewingProfile = null;
    _error = null;
    notifyListeners();
  }

  String _parseError(DioException e) {
    final data = e.response?.data;
    if (data is Map<String, dynamic> && data.containsKey('message')) {
      return data['message'] as String;
    }
    return 'An error occurred while processing profile.';
  }
}
