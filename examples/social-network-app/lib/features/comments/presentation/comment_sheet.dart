import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../shared/widgets/loading_indicator.dart';
import '../providers/comment_provider.dart';
import 'widgets/comment_input.dart';
import 'widgets/comment_list.dart';

class CommentSheet extends StatefulWidget {
  final String postId;
  final VoidCallback? onCommentAdded;

  const CommentSheet({
    super.key,
    required this.postId,
    this.onCommentAdded,
  });

  @override
  State<CommentSheet> createState() => _CommentSheetState();
}

class _CommentSheetState extends State<CommentSheet> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CommentProvider>().loadComments(widget.postId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.4,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(20),
            ),
          ),
          child: Column(
            children: [
              // Handle
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.outline,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Title
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Comments',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              const Divider(),

              // Comments list
              Expanded(
                child: Consumer<CommentProvider>(
                  builder: (context, provider, _) {
                    if (provider.isLoading) {
                      return const LoadingIndicator(
                        message: 'Loading comments...',
                      );
                    }

                    return SingleChildScrollView(
                      controller: scrollController,
                      child: CommentList(
                        comments: provider.comments,
                        postId: widget.postId,
                      ),
                    );
                  },
                ),
              ),

              // Input
              CommentInput(
                postId: widget.postId,
                onCommentAdded: widget.onCommentAdded,
              ),
            ],
          ),
        );
      },
    );
  }
}
