import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cooking_log_provider.dart';
import 'widgets/star_rating.dart';

/// Add cooking log dialog (rating + notes)
class CookingLogFormDialog extends StatefulWidget {
  final String recipeId;

  const CookingLogFormDialog({super.key, required this.recipeId});

  /// Dialog display helper
  static Future<bool?> show(BuildContext context, String recipeId) {
    return showDialog<bool>(
      context: context,
      builder: (_) => CookingLogFormDialog(recipeId: recipeId),
    );
  }

  @override
  State<CookingLogFormDialog> createState() => _CookingLogFormDialogState();
}

class _CookingLogFormDialogState extends State<CookingLogFormDialog> {
  int _rating = 0;
  final _notesController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_rating == 0) return;

    setState(() => _isSubmitting = true);

    final success =
        await context.read<CookingLogProvider>().addCookingLog(
              recipeId: widget.recipeId,
              rating: _rating,
              notes: _notesController.text.trim(),
            );

    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        Navigator.pop(context, true);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AlertDialog(
      title: const Text('Add Cooking Log'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Rating
            Text(
              'Rating',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Center(
              child: StarRating(
                rating: _rating,
                size: 40,
                interactive: true,
                onChanged: (value) {
                  setState(() => _rating = value);
                },
              ),
            ),
            if (_rating == 0)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Center(
                  child: Text(
                    'Tap a star to select a rating',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 20),

            // Notes
            Text(
              'Notes (optional)',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _notesController,
              maxLines: 3,
              maxLength: 500,
              decoration: const InputDecoration(
                hintText: 'Share your cooking tips or thoughts',
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isSubmitting ? null : () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: _isSubmitting || _rating == 0 ? null : _submit,
          child: _isSubmitting
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Save'),
        ),
      ],
    );
  }
}
