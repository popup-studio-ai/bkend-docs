import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../models/profile.dart';

class ProfileHeader extends StatelessWidget {
  final Profile profile;
  final int postCount;
  final int followerCount;
  final int followingCount;
  final bool isMyProfile;
  final Widget? actionButton;
  final VoidCallback? onFollowersTap;
  final VoidCallback? onFollowingTap;

  const ProfileHeader({
    super.key,
    required this.profile,
    this.postCount = 0,
    this.followerCount = 0,
    this.followingCount = 0,
    this.isMyProfile = false,
    this.actionButton,
    this.onFollowersTap,
    this.onFollowingTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          CircleAvatar(
            radius: 44,
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            backgroundImage: profile.avatarUrl != null &&
                    profile.avatarUrl!.isNotEmpty
                ? CachedNetworkImageProvider(profile.avatarUrl!)
                : null,
            child: profile.avatarUrl == null || profile.avatarUrl!.isEmpty
                ? Icon(
                    Icons.person,
                    size: 44,
                    color: theme.colorScheme.onSurfaceVariant,
                  )
                : null,
          ).animate().fadeIn(duration: 400.ms).scale(
                begin: const Offset(0.8, 0.8),
                end: const Offset(1, 1),
              ),
          const SizedBox(height: 12),
          Text(
            profile.nickname,
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ).animate().fadeIn(delay: 100.ms, duration: 400.ms),
          if (profile.bio != null && profile.bio!.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              profile.bio!,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ).animate().fadeIn(delay: 200.ms, duration: 400.ms),
          ],
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _StatItem(
                label: 'Posts',
                count: postCount,
              ),
              const SizedBox(width: 32),
              _StatItem(
                label: 'Followers',
                count: followerCount,
                onTap: onFollowersTap,
              ),
              const SizedBox(width: 32),
              _StatItem(
                label: 'Following',
                count: followingCount,
                onTap: onFollowingTap,
              ),
            ],
          ).animate().fadeIn(delay: 300.ms, duration: 400.ms),
          if (actionButton != null) ...[
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: actionButton!,
            ).animate().fadeIn(delay: 400.ms, duration: 400.ms),
          ],
          const Divider(height: 32),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final int count;
  final VoidCallback? onTap;

  const _StatItem({
    required this.label,
    required this.count,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Text(
            count.toString(),
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}
