import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:go_router/go_router.dart';
import 'package:mime/mime.dart';
import 'package:provider/provider.dart';

import '../../../core/utils/demo_guard.dart';
import '../../auth/providers/auth_provider.dart';
import '../providers/profile_provider.dart';
import 'widgets/avatar_picker.dart';

class ProfileEditScreen extends StatefulWidget {
  const ProfileEditScreen({super.key});

  @override
  State<ProfileEditScreen> createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends State<ProfileEditScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  File? _selectedAvatar;
  String? _randomAvatarUrl;
  bool _isUploading = false;

  bool get _isEditing =>
      context.read<ProfileProvider>().myProfile != null;

  Future<void> _handleSave() async {
    if (DemoGuard.check(context)) return;
    if (!(_formKey.currentState?.saveAndValidate() ?? false)) return;

    final values = _formKey.currentState!.value;
    final profileProvider = context.read<ProfileProvider>();
    final authProvider = context.read<AuthProvider>();
    final userId = authProvider.currentUserId;

    if (userId == null) return;

    String? avatarUrl = _randomAvatarUrl;

    // Upload avatar if selected
    if (_selectedAvatar != null) {
      setState(() => _isUploading = true);

      final filename = _selectedAvatar!.path.split('/').last;
      final contentType =
          lookupMimeType(filename) ?? 'image/jpeg';
      final bytes = await _selectedAvatar!.readAsBytes();

      avatarUrl = await profileProvider.uploadAvatar(
        filename: filename,
        contentType: contentType,
        bytes: bytes,
      );

      setState(() => _isUploading = false);

      if (avatarUrl == null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to upload image.')),
        );
        return;
      }
    }

    bool success;
    if (_isEditing) {
      success = await profileProvider.updateProfile(
        nickname: values['nickname'] as String,
        bio: values['bio'] as String? ?? '',
        avatarUrl: avatarUrl,
      );
    } else {
      success = await profileProvider.createProfile(
        userId: userId,
        nickname: values['nickname'] as String,
        bio: values['bio'] as String? ?? '',
        avatarUrl: avatarUrl,
      );
    }

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditing ? 'Profile updated.' : 'Profile created.'),
        ),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit Profile' : 'Create Profile'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
        actions: [
          Consumer<ProfileProvider>(
            builder: (context, provider, _) {
              final isSaving = provider.isSaving || _isUploading;
              return TextButton(
                onPressed: isSaving ? null : _handleSave,
                child: isSaving
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Save'),
              );
            },
          ),
        ],
      ),
      body: Consumer<ProfileProvider>(
        builder: (context, profileProvider, _) {
          final profile = profileProvider.myProfile;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: FormBuilder(
              key: _formKey,
              initialValue: {
                'nickname': profile?.nickname ?? '',
                'bio': profile?.bio ?? '',
              },
              child: Column(
                children: [
                  Center(
                    child: AvatarPicker(
                      currentAvatarUrl:
                          _randomAvatarUrl ?? profile?.avatarUrl,
                      radius: 48,
                      selectedFile: _selectedAvatar,
                      onPicked: (file) {
                        setState(() {
                          _selectedAvatar = file;
                          _randomAvatarUrl = null;
                        });
                      },
                      onRandomPicked: (url) {
                        setState(() {
                          _selectedAvatar = null;
                          _randomAvatarUrl = url;
                        });
                      },
                    ),
                  ),
                  const SizedBox(height: 32),
                  FormBuilderTextField(
                    name: 'nickname',
                    decoration: const InputDecoration(
                      labelText: 'Nickname',
                      hintText: 'Enter your nickname',
                      prefixIcon: Icon(Icons.alternate_email),
                    ),
                    textInputAction: TextInputAction.next,
                    validator: FormBuilderValidators.compose([
                      FormBuilderValidators.required(
                          errorText: 'Please enter a nickname.'),
                      FormBuilderValidators.minLength(2,
                          errorText: 'Nickname must be at least 2 characters.'),
                      FormBuilderValidators.maxLength(20,
                          errorText: 'Nickname must be 20 characters or less.'),
                    ]),
                  ),
                  const SizedBox(height: 16),
                  FormBuilderTextField(
                    name: 'bio',
                    decoration: const InputDecoration(
                      labelText: 'Bio',
                      hintText: 'Write a short bio about yourself',
                      prefixIcon: Icon(Icons.info_outlined),
                      alignLabelWithHint: true,
                    ),
                    maxLines: 3,
                    maxLength: 200,
                    textInputAction: TextInputAction.done,
                  ),
                  if (profileProvider.error != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      profileProvider.error!,
                      style: TextStyle(
                        color: theme.colorScheme.error,
                        fontSize: 14,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
