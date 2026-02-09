import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/comment_provider.dart';

class CommentInput extends StatefulWidget {
  final String postId;
  final VoidCallback? onCommentAdded;

  const CommentInput({
    super.key,
    required this.postId,
    this.onCommentAdded,
  });

  @override
  State<CommentInput> createState() => _CommentInputState();
}

class _CommentInputState extends State<CommentInput> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _sendComment() async {
    final content = _controller.text.trim();
    if (content.isEmpty) return;

    final provider = context.read<CommentProvider>();
    final comment = await provider.addComment(
      postId: widget.postId,
      content: content,
    );

    if (comment != null) {
      _controller.clear();
      widget.onCommentAdded?.call();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          top: BorderSide(color: theme.colorScheme.outline),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _controller,
                maxLength: 500,
                maxLines: 3,
                minLines: 1,
                decoration: InputDecoration(
                  hintText: 'Write a comment...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide(color: theme.colorScheme.outline),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide(color: theme.colorScheme.outline),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide:
                        BorderSide(color: theme.colorScheme.primary, width: 2),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 10,
                  ),
                  counterText: '',
                  isDense: true,
                ),
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendComment(),
                onChanged: (_) => setState(() {}),
              ),
            ),
            const SizedBox(width: 8),
            Consumer<CommentProvider>(
              builder: (context, provider, _) {
                return IconButton(
                  onPressed: provider.isSending ||
                          _controller.text.trim().isEmpty
                      ? null
                      : _sendComment,
                  icon: provider.isSending
                      ? SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: theme.colorScheme.primary,
                          ),
                        )
                      : Icon(
                          Icons.send_rounded,
                          color: _controller.text.trim().isEmpty
                              ? theme.colorScheme.onSurfaceVariant
                              : theme.colorScheme.primary,
                        ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
