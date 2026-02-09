import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';

class AvatarPicker extends StatelessWidget {
  final String? currentAvatarUrl;
  final double radius;
  final Function(File file) onPicked;
  final File? selectedFile;

  const AvatarPicker({
    super.key,
    this.currentAvatarUrl,
    this.radius = 48,
    required this.onPicked,
    this.selectedFile,
  });

  Future<void> _pickImage(BuildContext context) async {
    final picker = ImagePicker();
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Choose from gallery'),
              onTap: () => Navigator.pop(context, ImageSource.gallery),
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined),
              title: const Text('Take a photo'),
              onTap: () => Navigator.pop(context, ImageSource.camera),
            ),
          ],
        ),
      ),
    );

    if (source == null) return;

    final picked = await picker.pickImage(
      source: source,
      maxWidth: 512,
      maxHeight: 512,
      imageQuality: 85,
    );

    if (picked != null) {
      onPicked(File(picked.path));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: () => _pickImage(context),
      child: Stack(
        children: [
          CircleAvatar(
            radius: radius,
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            backgroundImage: _getImage(),
            child: _shouldShowIcon()
                ? Icon(
                    Icons.person,
                    size: radius,
                    color: theme.colorScheme.onSurfaceVariant,
                  )
                : null,
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                shape: BoxShape.circle,
                border: Border.all(
                  color: theme.colorScheme.surface,
                  width: 2,
                ),
              ),
              child: Icon(
                Icons.camera_alt,
                size: 16,
                color: theme.colorScheme.onPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  ImageProvider? _getImage() {
    if (selectedFile != null) {
      return FileImage(selectedFile!);
    }
    if (currentAvatarUrl != null && currentAvatarUrl!.isNotEmpty) {
      return CachedNetworkImageProvider(currentAvatarUrl!);
    }
    return null;
  }

  bool _shouldShowIcon() {
    return selectedFile == null &&
        (currentAvatarUrl == null || currentAvatarUrl!.isEmpty);
  }
}
