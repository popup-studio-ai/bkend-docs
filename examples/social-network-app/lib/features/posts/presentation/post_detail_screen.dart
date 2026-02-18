import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../../core/utils/demo_guard.dart';
import '../../../shared/widgets/loading_indicator.dart';
import '../../auth/providers/auth_provider.dart';
import '../../comments/presentation/comment_sheet.dart';
import '../../likes/presentation/widgets/like_button.dart';
import '../../profiles/data/profile_repository.dart';
import '../../profiles/models/profile.dart';
import '../models/post.dart';
import '../providers/post_provider.dart';
import 'widgets/post_image.dart';

class PostDetailScreen extends StatefulWidget {
  final String postId;

  const PostDetailScreen({super.key, required this.postId});

  @override
  State<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends State<PostDetailScreen> {
  Profile? _authorProfile;

  @override
  void initState() {
    super.initState();
    _loadPost();
  }

  Future<void> _loadPost() async {
    await context.read<PostProvider>().loadPost(widget.postId);
    final post = context.read<PostProvider>().currentPost;
    if (post != null) {
      _loadAuthorProfile(post.createdBy);
    }
  }

  Future<void> _loadAuthorProfile(String userId) async {
    try {
      final repo = context.read<ProfileRepository>();
      _authorProfile = await repo.getProfileByUserId(userId);
      if (mounted) setState(() {});
    } catch (_) {}
  }

  String _formatDate(DateTime dateTime) {
    return '${dateTime.year}. ${dateTime.month}. ${dateTime.day}. '
        '${dateTime.hour.toString().padLeft(2, '0')}:'
        '${dateTime.minute.toString().padLeft(2, '0')}';
  }

  void _showComments(Post post) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CommentSheet(
        postId: post.id,
        onCommentAdded: () {
          final provider = context.read<PostProvider>();
          final updated = post.copyWith(
            commentsCount: post.commentsCount + 1,
          );
          provider.updatePostInList(updated);
        },
      ),
    );
  }

  Future<void> _handleDelete(Post post) async {
    if (DemoGuard.check(context)) return;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Post'),
        content: const Text('Are you sure you want to delete this post?\nDeleted posts cannot be recovered.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await context.read<PostProvider>().deletePost(post.id);
      if (mounted) context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final myUserId = context.read<AuthProvider>().currentUserId;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Post'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: () => context.pop(),
        ),
      ),
      body: Consumer<PostProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const LoadingIndicator(message: 'Loading post...');
          }

          final post = provider.currentPost;
          if (post == null) {
            return Center(
              child: Text(
                'Post not found.',
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            );
          }

          final isAuthor = post.createdBy == myUserId;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Author
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          context.push('/profile/${post.createdBy}');
                        },
                        child: CircleAvatar(
                          radius: 22,
                          backgroundColor:
                              theme.colorScheme.surfaceContainerHighest,
                          backgroundImage:
                              _authorProfile?.avatarUrl != null &&
                                      _authorProfile!.avatarUrl!.isNotEmpty
                                  ? CachedNetworkImageProvider(
                                      _authorProfile!.avatarUrl!)
                                  : null,
                          child: _authorProfile?.avatarUrl == null ||
                                  _authorProfile!.avatarUrl!.isEmpty
                              ? Icon(
                                  Icons.person,
                                  size: 22,
                                  color: theme.colorScheme.onSurfaceVariant,
                                )
                              : null,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            context.push('/profile/${post.createdBy}');
                          },
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _authorProfile?.nickname ?? '...',
                                style: theme.textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                _formatDate(post.createdAt),
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: theme.colorScheme.onSurfaceVariant,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      if (isAuthor)
                        PopupMenuButton<String>(
                          onSelected: (value) {
                            if (value == 'delete') {
                              _handleDelete(post);
                            }
                          },
                          itemBuilder: (context) => [
                            PopupMenuItem(
                              value: 'delete',
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.delete_outlined,
                                    size: 20,
                                    color: theme.colorScheme.error,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Delete',
                                    style: TextStyle(
                                      color: theme.colorScheme.error,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                ).animate().fadeIn(duration: 400.ms),

                // Content
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    post.content,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      height: 1.6,
                    ),
                  ),
                ).animate().fadeIn(delay: 100.ms, duration: 400.ms),

                // Image
                if (post.imageUrl != null &&
                    post.imageUrl!.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: PostImage(
                      imageUrl: post.imageUrl!,
                      heroTag: 'post-image-${post.id}',
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ).animate().fadeIn(delay: 200.ms, duration: 400.ms),
                ],

                // Actions
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      LikeButton(
                        postId: post.id,
                        likesCount: post.likesCount,
                        showCount: true,
                      ),
                      const SizedBox(width: 24),
                      GestureDetector(
                        onTap: () => _showComments(post),
                        child: Row(
                          children: [
                            Icon(
                              Icons.comment_outlined,
                              size: 22,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Comments ${post.commentsCount}',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 300.ms, duration: 400.ms),

                const Divider(),

                // Comment section button
                ListTile(
                  leading: Icon(
                    Icons.mode_comment_outlined,
                    color: theme.colorScheme.primary,
                  ),
                  title: Text(
                    'View all ${post.commentsCount} comments',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => _showComments(post),
                ).animate().fadeIn(delay: 400.ms, duration: 400.ms),
              ],
            ),
          );
        },
      ),
    );
  }
}
