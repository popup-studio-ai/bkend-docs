import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../auth/providers/auth_provider.dart';
import '../../providers/follow_provider.dart';

class FollowButton extends StatefulWidget {
  final String targetUserId;
  final bool compact;

  const FollowButton({
    super.key,
    required this.targetUserId,
    this.compact = false,
  });

  @override
  State<FollowButton> createState() => _FollowButtonState();
}

class _FollowButtonState extends State<FollowButton> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkFollowStatus();
    });
  }

  Future<void> _checkFollowStatus() async {
    final myUserId = context.read<AuthProvider>().currentUserId;
    if (myUserId == null || myUserId == widget.targetUserId) return;

    await context.read<FollowProvider>().checkFollowStatus(
          myUserId: myUserId,
          targetUserId: widget.targetUserId,
        );
  }

  Future<void> _handleTap() async {
    final myUserId = context.read<AuthProvider>().currentUserId;
    if (myUserId == null) return;

    await context.read<FollowProvider>().toggleFollow(
          myUserId: myUserId,
          targetUserId: widget.targetUserId,
        );
  }

  @override
  Widget build(BuildContext context) {
    final myUserId = context.read<AuthProvider>().currentUserId;

    // Don't show follow button for own profile
    if (myUserId == widget.targetUserId) {
      return const SizedBox.shrink();
    }

    return Consumer<FollowProvider>(
      builder: (context, followProvider, _) {
        final isFollowing = followProvider.isFollowing(widget.targetUserId);
        final isProcessing = followProvider.isProcessing(widget.targetUserId);

        if (widget.compact) {
          return _CompactFollowButton(
            isFollowing: isFollowing,
            isProcessing: isProcessing,
            onTap: _handleTap,
          );
        }

        return AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          child: isFollowing
              ? OutlinedButton(
                  onPressed: isProcessing ? null : _handleTap,
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(
                      color: Theme.of(context).colorScheme.outline,
                    ),
                  ),
                  child: isProcessing
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Following'),
                )
              : FilledButton(
                  onPressed: isProcessing ? null : _handleTap,
                  child: isProcessing
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Follow'),
                ),
        );
      },
    );
  }
}

class _CompactFollowButton extends StatelessWidget {
  final bool isFollowing;
  final bool isProcessing;
  final VoidCallback onTap;

  const _CompactFollowButton({
    required this.isFollowing,
    required this.isProcessing,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SizedBox(
      height: 32,
      child: isFollowing
          ? OutlinedButton(
              onPressed: isProcessing ? null : onTap,
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                minimumSize: Size.zero,
                side: BorderSide(color: theme.colorScheme.outline),
                textStyle: const TextStyle(fontSize: 12),
              ),
              child: isProcessing
                  ? const SizedBox(
                      width: 12,
                      height: 12,
                      child: CircularProgressIndicator(strokeWidth: 1.5),
                    )
                  : const Text('Following'),
            )
          : FilledButton(
              onPressed: isProcessing ? null : onTap,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                minimumSize: Size.zero,
                textStyle: const TextStyle(fontSize: 12),
              ),
              child: isProcessing
                  ? const SizedBox(
                      width: 12,
                      height: 12,
                      child: CircularProgressIndicator(
                        strokeWidth: 1.5,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Follow'),
            ),
    );
  }
}
