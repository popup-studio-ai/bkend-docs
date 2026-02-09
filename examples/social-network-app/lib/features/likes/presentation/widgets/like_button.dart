import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../auth/providers/auth_provider.dart';
import '../../../posts/providers/post_provider.dart';
import '../../providers/like_provider.dart';

class LikeButton extends StatefulWidget {
  final String postId;
  final int likesCount;
  final bool showCount;

  const LikeButton({
    super.key,
    required this.postId,
    required this.likesCount,
    this.showCount = true,
  });

  @override
  State<LikeButton> createState() => _LikeButtonState();
}

class _LikeButtonState extends State<LikeButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _bounceController;
  late Animation<double> _bounceAnimation;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _bounceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _bounceAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 1.0, end: 1.3)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween(begin: 1.3, end: 1.0)
            .chain(CurveTween(curve: Curves.bounceOut)),
        weight: 50,
      ),
    ]).animate(_bounceController);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkLikeStatus();
    });
  }

  Future<void> _checkLikeStatus() async {
    final userId = context.read<AuthProvider>().currentUserId;
    if (userId == null) return;

    await context.read<LikeProvider>().checkLikeStatus(
          postId: widget.postId,
          userId: userId,
        );
    _initialized = true;
  }

  @override
  void dispose() {
    _bounceController.dispose();
    super.dispose();
  }

  Future<void> _handleTap() async {
    final userId = context.read<AuthProvider>().currentUserId;
    if (userId == null) return;

    final likeProvider = context.read<LikeProvider>();
    final postProvider = context.read<PostProvider>();

    final success = await likeProvider.toggleLike(
      postId: widget.postId,
      userId: userId,
      currentLikesCount: widget.likesCount,
      onCountChanged: (newCount) {
        final posts = postProvider.posts;
        final index = posts.indexWhere((p) => p.id == widget.postId);
        if (index != -1) {
          postProvider.updatePostInList(
            posts[index].copyWith(likesCount: newCount),
          );
        }
      },
    );

    if (success && likeProvider.isLiked(widget.postId)) {
      _bounceController.forward(from: 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Consumer<LikeProvider>(
      builder: (context, likeProvider, _) {
        final isLiked = likeProvider.isLiked(widget.postId);
        final isProcessing = likeProvider.isProcessing(widget.postId);

        return GestureDetector(
          onTap: isProcessing ? null : _handleTap,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedBuilder(
                animation: _bounceAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _initialized ? _bounceAnimation.value : 1.0,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 200),
                      transitionBuilder: (child, animation) {
                        return ScaleTransition(
                          scale: animation,
                          child: child,
                        );
                      },
                      child: Icon(
                        isLiked ? Icons.favorite : Icons.favorite_border,
                        key: ValueKey(isLiked),
                        size: 22,
                        color: isLiked
                            ? const Color(0xFFF472B6)
                            : theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  );
                },
              ),
              if (widget.showCount && widget.likesCount > 0) ...[
                const SizedBox(width: 4),
                Text(
                  widget.likesCount.toString(),
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: isLiked
                        ? const Color(0xFFF472B6)
                        : theme.colorScheme.onSurfaceVariant,
                    fontWeight: isLiked ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
