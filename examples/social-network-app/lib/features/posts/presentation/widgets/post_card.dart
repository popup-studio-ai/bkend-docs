import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../likes/presentation/widgets/like_button.dart';
import '../../../profiles/models/profile.dart';
import '../../../profiles/data/profile_repository.dart';
import '../../models/post.dart';
import 'post_image.dart';

class PostCard extends StatefulWidget {
  final Post post;
  final VoidCallback? onTap;
  final VoidCallback? onCommentTap;

  const PostCard({
    super.key,
    required this.post,
    this.onTap,
    this.onCommentTap,
  });

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  double _scale = 1.0;
  Profile? _authorProfile;
  bool _loadingProfile = true;

  @override
  void initState() {
    super.initState();
    _loadAuthorProfile();
  }

  Future<void> _loadAuthorProfile() async {
    try {
      final repo = context.read<ProfileRepository>();
      _authorProfile = await repo.getProfileByUserId(widget.post.createdBy);
    } catch (_) {
      // ignore
    } finally {
      if (mounted) {
        setState(() => _loadingProfile = false);
      }
    }
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final diff = now.difference(dateTime);

    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    if (diff.inDays < 30) return '${(diff.inDays / 7).floor()}w ago';
    return '${dateTime.month}/${dateTime.day}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTapDown: (_) => setState(() => _scale = 0.98),
      onTapUp: (_) {
        setState(() => _scale = 1.0);
        widget.onTap?.call();
      },
      onTapCancel: () => setState(() => _scale = 1.0),
      child: AnimatedScale(
        scale: _scale,
        duration: const Duration(milliseconds: 100),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Author row
                Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor:
                          theme.colorScheme.surfaceContainerHighest,
                      backgroundImage: _authorProfile?.avatarUrl != null &&
                              _authorProfile!.avatarUrl!.isNotEmpty
                          ? CachedNetworkImageProvider(
                              _authorProfile!.avatarUrl!)
                          : null,
                      child: _authorProfile?.avatarUrl == null ||
                              _authorProfile!.avatarUrl!.isEmpty
                          ? Icon(
                              Icons.person,
                              size: 18,
                              color: theme.colorScheme.onSurfaceVariant,
                            )
                          : null,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _loadingProfile
                                ? '...'
                                : _authorProfile?.nickname ?? 'Unknown',
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            _formatTime(widget.post.createdAt),
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Content
                Text(
                  widget.post.content,
                  style: theme.textTheme.bodyLarge,
                  maxLines: 5,
                  overflow: TextOverflow.ellipsis,
                ),

                // Image
                if (widget.post.imageUrl != null &&
                    widget.post.imageUrl!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  PostImage(
                    imageUrl: widget.post.imageUrl!,
                    heroTag: 'post-image-${widget.post.id}',
                    height: 240,
                  ),
                ],

                const SizedBox(height: 12),

                // Actions
                Row(
                  children: [
                    LikeButton(
                      postId: widget.post.id,
                      likesCount: widget.post.likesCount,
                    ),
                    const SizedBox(width: 16),
                    _ActionButton(
                      icon: Icons.comment_outlined,
                      count: widget.post.commentsCount,
                      onTap: widget.onCommentTap,
                    ),
                    const Spacer(),
                    Icon(
                      Icons.share_outlined,
                      size: 20,
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final int count;
  final VoidCallback? onTap;

  const _ActionButton({
    required this.icon,
    required this.count,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(
            icon,
            size: 20,
            color: theme.colorScheme.onSurfaceVariant,
          ),
          if (count > 0) ...[
            const SizedBox(width: 4),
            Text(
              count.toString(),
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
