import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../../auth/providers/auth_provider.dart';
import '../../comments/presentation/comment_sheet.dart';
import '../../posts/presentation/widgets/post_card.dart';
import '../providers/feed_provider.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadFeed();
    });
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<FeedProvider>().loadMoreFeed();
    }
  }

  Future<void> _loadFeed() async {
    final userId = context.read<AuthProvider>().currentUserId;
    if (userId != null) {
      await context.read<FeedProvider>().loadFeed(userId);
    }
  }

  void _showCommentSheet(String postId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CommentSheet(postId: postId),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Social Network',
          style: TextStyle(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: false,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await context.push<bool>('/post/create');
          if (result == true) {
            _loadFeed();
          }
        },
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: theme.colorScheme.onPrimary,
        child: const Icon(Icons.edit),
      ),
      body: Consumer<FeedProvider>(
        builder: (context, feedProvider, _) {
          if (feedProvider.isFeedLoading) {
            return ListView.builder(
              itemCount: 3,
              itemBuilder: (context, index) => const PostCardShimmer(),
            );
          }

          if (feedProvider.feedPosts.isEmpty) {
            return RefreshIndicator(
              onRefresh: _loadFeed,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: SizedBox(
                  height: MediaQuery.of(context).size.height * 0.7,
                  child: const EmptyState(
                    icon: Icons.people_outline,
                    title: 'Your feed is empty',
                    subtitle:
                        'Follow other users to see\ntheir posts here.\nDiscover people in the Explore tab!',
                  ),
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _loadFeed,
            child: ListView.builder(
              controller: _scrollController,
              itemCount: feedProvider.feedPosts.length +
                  (feedProvider.isFeedLoadingMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index >= feedProvider.feedPosts.length) {
                  return const Padding(
                    padding: EdgeInsets.all(16),
                    child: Center(
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  );
                }

                final post = feedProvider.feedPosts[index];
                return PostCard(
                  post: post,
                  onTap: () => context.push('/post/${post.id}'),
                  onCommentTap: () => _showCommentSheet(post.id),
                )
                    .animate()
                    .fadeIn(
                      delay: Duration(milliseconds: 50 * index),
                      duration: 400.ms,
                    )
                    .slideY(begin: 0.05);
              },
            ),
          );
        },
      ),
    );
  }
}
