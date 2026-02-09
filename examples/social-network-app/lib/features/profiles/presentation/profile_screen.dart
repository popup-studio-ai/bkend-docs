import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../../auth/providers/auth_provider.dart';
import '../../follows/providers/follow_provider.dart';
import '../../follows/presentation/widgets/follow_button.dart';
import '../../posts/providers/post_provider.dart';
import '../../posts/presentation/widgets/post_card.dart';
import '../models/profile.dart';
import '../providers/profile_provider.dart';
import 'widgets/profile_header.dart';

class ProfileScreen extends StatefulWidget {
  final String? userId;

  const ProfileScreen({super.key, this.userId});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Profile? _profile;
  bool _isMyProfile = false;
  int _followerCount = 0;
  int _followingCount = 0;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  String get _targetUserId {
    return widget.userId ??
        context.read<AuthProvider>().currentUserId ??
        '';
  }

  Future<void> _loadProfile() async {
    final profileProvider = context.read<ProfileProvider>();
    final authProvider = context.read<AuthProvider>();
    final postProvider = context.read<PostProvider>();
    final followProvider = context.read<FollowProvider>();
    final myUserId = authProvider.currentUserId ?? '';

    _isMyProfile = widget.userId == null || widget.userId == myUserId;

    if (_isMyProfile) {
      await profileProvider.loadMyProfile(myUserId);
      _profile = profileProvider.myProfile;
    } else {
      _profile = await profileProvider.loadProfileByUserId(_targetUserId);
      if (myUserId.isNotEmpty) {
        await followProvider.checkFollowStatus(
          myUserId: myUserId,
          targetUserId: _targetUserId,
        );
      }
    }

    if (_profile != null) {
      await postProvider.loadUserPosts(_targetUserId);
      await _loadCounts();
    }

    if (mounted) setState(() {});
  }

  Future<void> _loadCounts() async {
    final followProvider = context.read<FollowProvider>();
    await followProvider.loadFollowers(_targetUserId);
    await followProvider.loadFollowing(_targetUserId);
    if (mounted) {
      setState(() {
        _followerCount = followProvider.followersPagination.total;
        _followingCount = followProvider.followingPagination.total;
      });
    }
  }

  void _navigateToProfileSetup() {
    if (_profile == null) {
      // Create profile
      context.push('/profile/edit');
    } else {
      context.push('/profile/edit');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_profile?.nickname ?? 'Profile'),
        actions: [
          if (_isMyProfile)
            PopupMenuButton<String>(
              onSelected: (value) {
                switch (value) {
                  case 'edit':
                    _navigateToProfileSetup();
                    break;
                  case 'logout':
                    context.read<AuthProvider>().signOut();
                    context.go('/sign-in');
                    break;
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'edit',
                  child: Row(
                    children: [
                      Icon(Icons.edit_outlined, size: 20),
                      SizedBox(width: 8),
                      Text('Edit Profile'),
                    ],
                  ),
                ),
                PopupMenuItem(
                  value: 'logout',
                  child: Row(
                    children: [
                      Icon(
                        Icons.logout,
                        size: 20,
                        color: theme.colorScheme.error,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Sign Out',
                        style: TextStyle(color: theme.colorScheme.error),
                      ),
                    ],
                  ),
                ),
              ],
            ),
        ],
      ),
      body: Consumer2<ProfileProvider, PostProvider>(
        builder: (context, profileProvider, postProvider, _) {
          if (profileProvider.isLoading && _profile == null) {
            return const _ProfileShimmerBody();
          }

          final profile = _isMyProfile
              ? profileProvider.myProfile
              : profileProvider.viewingProfile;

          if (profile == null) {
            if (_isMyProfile) {
              return EmptyState(
                icon: Icons.person_add_outlined,
                title: 'Set up your profile',
                subtitle: 'Register a nickname and profile picture\nto create your own profile.',
                actionLabel: 'Create Profile',
                onAction: _navigateToProfileSetup,
              );
            }
            return const EmptyState(
              icon: Icons.person_off_outlined,
              title: 'Profile not found',
            );
          }

          return RefreshIndicator(
            onRefresh: _loadProfile,
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: ProfileHeader(
                    profile: profile,
                    postCount: postProvider.pagination.total,
                    followerCount: _followerCount,
                    followingCount: _followingCount,
                    isMyProfile: _isMyProfile,
                    actionButton: _isMyProfile
                        ? OutlinedButton(
                            onPressed: _navigateToProfileSetup,
                            child: const Text('Edit Profile'),
                          )
                        : FollowButton(
                            targetUserId: _targetUserId,
                          ),
                    onFollowersTap: () {
                      context.push('/profile/$_targetUserId/followers');
                    },
                    onFollowingTap: () {
                      context.push('/profile/$_targetUserId/following');
                    },
                  ),
                ),
                if (postProvider.isLoading)
                  const SliverToBoxAdapter(
                    child: PostCardShimmer(),
                  )
                else if (postProvider.posts.isEmpty)
                  const SliverToBoxAdapter(
                    child: Padding(
                      padding: EdgeInsets.only(top: 48),
                      child: EmptyState(
                        icon: Icons.article_outlined,
                        title: 'No posts yet',
                      ),
                    ),
                  )
                else
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final post = postProvider.posts[index];
                        return PostCard(
                          post: post,
                          onTap: () => context.push('/post/${post.id}'),
                        )
                            .animate()
                            .fadeIn(
                              delay: Duration(milliseconds: 50 * index),
                              duration: 400.ms,
                            )
                            .slideY(begin: 0.1);
                      },
                      childCount: postProvider.posts.length,
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _ProfileShimmerBody extends StatelessWidget {
  const _ProfileShimmerBody();

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      child: Column(
        children: [
          ProfileShimmer(),
          PostCardShimmer(),
          PostCardShimmer(),
        ],
      ),
    );
  }
}
