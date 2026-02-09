import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../../comments/presentation/comment_sheet.dart';
import '../../posts/presentation/widgets/post_card.dart';
import '../providers/feed_provider.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadExplore();
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
      context.read<FeedProvider>().loadMoreExplore();
    }
  }

  Future<void> _loadExplore() async {
    await context.read<FeedProvider>().loadExplore();
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore'),
        centerTitle: false,
      ),
      body: Consumer<FeedProvider>(
        builder: (context, feedProvider, _) {
          if (feedProvider.isExploreLoading) {
            return ListView.builder(
              itemCount: 3,
              itemBuilder: (context, index) => const PostCardShimmer(),
            );
          }

          if (feedProvider.explorePosts.isEmpty) {
            return RefreshIndicator(
              onRefresh: _loadExplore,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: SizedBox(
                  height: MediaQuery.of(context).size.height * 0.7,
                  child: const EmptyState(
                    icon: Icons.explore_outlined,
                    title: 'No posts yet',
                    subtitle: 'No one has posted anything yet.',
                  ),
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _loadExplore,
            child: ListView.builder(
              controller: _scrollController,
              itemCount: feedProvider.explorePosts.length +
                  (feedProvider.isExploreLoadingMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index >= feedProvider.explorePosts.length) {
                  return const Padding(
                    padding: EdgeInsets.all(16),
                    child: Center(
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  );
                }

                final post = feedProvider.explorePosts[index];
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
