import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/loading_indicator.dart';
import '../../profiles/data/profile_repository.dart';
import '../../profiles/models/profile.dart';
import '../providers/follow_provider.dart';
import 'widgets/follow_button.dart';

class FollowingScreen extends StatefulWidget {
  final String userId;

  const FollowingScreen({super.key, required this.userId});

  @override
  State<FollowingScreen> createState() => _FollowingScreenState();
}

class _FollowingScreenState extends State<FollowingScreen> {
  @override
  void initState() {
    super.initState();
    context.read<FollowProvider>().loadFollowing(widget.userId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Following'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: () => context.pop(),
        ),
      ),
      body: Consumer<FollowProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const LoadingIndicator();
          }

          if (provider.following.isEmpty) {
            return const EmptyState(
              icon: Icons.people_outline,
              title: 'No following',
              subtitle: 'You are not following anyone yet.',
            );
          }

          return ListView.builder(
            itemCount: provider.following.length,
            itemBuilder: (context, index) {
              final follow = provider.following[index];
              return _FollowingUserTile(
                userId: follow.followingId,
              )
                  .animate()
                  .fadeIn(
                    delay: Duration(milliseconds: 50 * index),
                    duration: 300.ms,
                  )
                  .slideX(begin: 0.05);
            },
          );
        },
      ),
    );
  }
}

class _FollowingUserTile extends StatefulWidget {
  final String userId;

  const _FollowingUserTile({required this.userId});

  @override
  State<_FollowingUserTile> createState() => _FollowingUserTileState();
}

class _FollowingUserTileState extends State<_FollowingUserTile> {
  Profile? _profile;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final repo = context.read<ProfileRepository>();
      _profile = await repo.getProfileByUserId(widget.userId);
      if (mounted) setState(() {});
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListTile(
      leading: CircleAvatar(
        radius: 22,
        backgroundColor: theme.colorScheme.surfaceContainerHighest,
        backgroundImage: _profile?.avatarUrl != null &&
                _profile!.avatarUrl!.isNotEmpty
            ? CachedNetworkImageProvider(_profile!.avatarUrl!)
            : null,
        child: _profile?.avatarUrl == null || _profile!.avatarUrl!.isEmpty
            ? Icon(
                Icons.person,
                color: theme.colorScheme.onSurfaceVariant,
              )
            : null,
      ),
      title: Text(
        _profile?.nickname ?? '...',
        style: theme.textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: _profile?.bio != null && _profile!.bio!.isNotEmpty
          ? Text(
              _profile!.bio!,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            )
          : null,
      trailing: FollowButton(
        targetUserId: widget.userId,
        compact: true,
      ),
      onTap: () => context.push('/profile/${widget.userId}'),
    );
  }
}
