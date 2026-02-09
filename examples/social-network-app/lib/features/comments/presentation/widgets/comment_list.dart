import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../../auth/providers/auth_provider.dart';
import '../../../profiles/data/profile_repository.dart';
import '../../../profiles/models/profile.dart';
import '../../models/comment.dart';
import '../../providers/comment_provider.dart';

class CommentList extends StatelessWidget {
  final List<Comment> comments;
  final String postId;

  const CommentList({
    super.key,
    required this.comments,
    required this.postId,
  });

  @override
  Widget build(BuildContext context) {
    if (comments.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Text(
            'No comments yet.\nBe the first to comment!',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: comments.length,
      itemBuilder: (context, index) {
        return _CommentItem(
          comment: comments[index],
        ).animate().fadeIn(
              delay: Duration(milliseconds: 50 * index),
              duration: 300.ms,
            );
      },
    );
  }
}

class _CommentItem extends StatefulWidget {
  final Comment comment;

  const _CommentItem({required this.comment});

  @override
  State<_CommentItem> createState() => _CommentItemState();
}

class _CommentItemState extends State<_CommentItem> {
  Profile? _profile;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final repo = context.read<ProfileRepository>();
      _profile = await repo.getProfileByUserId(widget.comment.createdBy);
      if (mounted) setState(() {});
    } catch (_) {}
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final diff = now.difference(dateTime);

    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${dateTime.month}/${dateTime.day}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final myUserId = context.read<AuthProvider>().currentUserId;
    final isAuthor = widget.comment.createdBy == myUserId;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            backgroundImage: _profile?.avatarUrl != null &&
                    _profile!.avatarUrl!.isNotEmpty
                ? CachedNetworkImageProvider(_profile!.avatarUrl!)
                : null,
            child: _profile?.avatarUrl == null || _profile!.avatarUrl!.isEmpty
                ? Icon(
                    Icons.person,
                    size: 16,
                    color: theme.colorScheme.onSurfaceVariant,
                  )
                : null,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      _profile?.nickname ?? '...',
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _formatTime(widget.comment.createdAt),
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  widget.comment.content,
                  style: theme.textTheme.bodyMedium,
                ),
              ],
            ),
          ),
          if (isAuthor)
            IconButton(
              icon: Icon(
                Icons.more_horiz,
                size: 18,
                color: theme.colorScheme.onSurfaceVariant,
              ),
              onPressed: () => _showDeleteDialog(context),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
        ],
      ),
    );
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Comment'),
        content: const Text('Are you sure you want to delete this comment?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(ctx);
              context
                  .read<CommentProvider>()
                  .deleteComment(widget.comment.id);
            },
            style: FilledButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
