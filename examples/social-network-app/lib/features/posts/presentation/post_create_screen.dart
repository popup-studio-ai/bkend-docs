import 'dart:io';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mime/mime.dart';
import 'package:provider/provider.dart';

import '../../../core/utils/demo_guard.dart';
import '../providers/post_provider.dart';

class PostCreateScreen extends StatefulWidget {
  const PostCreateScreen({super.key});

  @override
  State<PostCreateScreen> createState() => _PostCreateScreenState();
}

class _PostCreateScreenState extends State<PostCreateScreen> {
  final _contentController = TextEditingController();
  File? _selectedImage;
  String? _randomImageUrl;
  bool _isUploading = false;

  @override
  void dispose() {
    _contentController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final choice = await showModalBottomSheet<String>(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Choose from gallery'),
              onTap: () => Navigator.pop(context, 'gallery'),
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined),
              title: const Text('Take a photo'),
              onTap: () => Navigator.pop(context, 'camera'),
            ),
            ListTile(
              leading: const Icon(Icons.shuffle_rounded),
              title: const Text('Random photo (demo)'),
              subtitle: const Text('Use a sample image'),
              onTap: () => Navigator.pop(context, 'random'),
            ),
          ],
        ),
      ),
    );

    if (choice == null) return;

    if (choice == 'random') {
      final seed = Random().nextInt(9999);
      setState(() {
        _selectedImage = null;
        _randomImageUrl = 'https://picsum.photos/seed/$seed/800/600';
      });
      return;
    }

    final picker = ImagePicker();
    try {
      final picked = await picker.pickImage(
        source:
            choice == 'camera' ? ImageSource.camera : ImageSource.gallery,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );
      if (picked != null) {
        setState(() {
          _selectedImage = File(picked.path);
          _randomImageUrl = null;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Camera is not available on this device.'),
          ),
        );
      }
    }
  }

  Future<void> _handlePost() async {
    if (DemoGuard.check(context)) return;
    final content = _contentController.text.trim();
    if (content.isEmpty) return;

    final postProvider = context.read<PostProvider>();
    String? imageUrl = _randomImageUrl;

    if (_selectedImage != null) {
      setState(() => _isUploading = true);

      final filename = _selectedImage!.path.split('/').last;
      final contentType = lookupMimeType(filename) ?? 'image/jpeg';
      final bytes = await _selectedImage!.readAsBytes();

      imageUrl = await postProvider.uploadImage(
        filename: filename,
        contentType: contentType,
        bytes: bytes,
      );

      setState(() => _isUploading = false);

      if (imageUrl == null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to upload image.')),
        );
        return;
      }
    }

    final post = await postProvider.createPost(
      content: content,
      imageUrl: imageUrl,
    );

    if (post != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Post created successfully.')),
      );
      context.pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('New Post'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
        actions: [
          Consumer<PostProvider>(
            builder: (context, provider, _) {
              final isWorking = provider.isCreating || _isUploading;
              return FilledButton(
                onPressed: isWorking ||
                        _contentController.text.trim().isEmpty
                    ? null
                    : _handlePost,
                child: isWorking
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Post'),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: _contentController,
                    maxLength: 1000,
                    maxLines: null,
                    minLines: 5,
                    decoration: const InputDecoration(
                      hintText: 'What\'s on your mind?',
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      counterText: '',
                    ),
                    style: theme.textTheme.bodyLarge,
                    onChanged: (_) => setState(() {}),
                  ),
                  if (_selectedImage != null || _randomImageUrl != null) ...[
                    const SizedBox(height: 16),
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: _selectedImage != null
                              ? Image.file(
                                  _selectedImage!,
                                  width: double.infinity,
                                  height: 240,
                                  fit: BoxFit.cover,
                                )
                              : Image.network(
                                  _randomImageUrl!,
                                  width: double.infinity,
                                  height: 240,
                                  fit: BoxFit.cover,
                                ),
                        ),
                        Positioned(
                          top: 8,
                          right: 8,
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedImage = null;
                                _randomImageUrl = null;
                              });
                            },
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.black54,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Icon(
                                Icons.close,
                                color: Colors.white,
                                size: 20,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
          // Bottom toolbar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: theme.colorScheme.outline),
              ),
            ),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(
                      Icons.image_outlined,
                      color: theme.colorScheme.primary,
                    ),
                    onPressed: _pickImage,
                  ),
                  const Spacer(),
                  Text(
                    '${_contentController.text.length}/1000',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: _contentController.text.length > 900
                          ? theme.colorScheme.error
                          : theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
