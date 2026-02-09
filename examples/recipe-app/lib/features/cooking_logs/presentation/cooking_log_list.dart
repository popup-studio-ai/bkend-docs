import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../shared/utils/format_utils.dart';
import '../providers/cooking_log_provider.dart';
import 'cooking_log_form_dialog.dart';
import 'widgets/star_rating.dart';

/// Cooking log list widget per recipe
class CookingLogList extends StatelessWidget {
  final String recipeId;

  const CookingLogList({super.key, required this.recipeId});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Consumer<CookingLogProvider>(
      builder: (context, provider, _) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: title + add button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(
                      'Cooking Log',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    if (provider.cookingLogs.isNotEmpty) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${provider.cookingLogs.length}x',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                TextButton.icon(
                  onPressed: () async {
                    final added =
                        await CookingLogFormDialog.show(context, recipeId);
                    if (added == true) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Cooking log has been added.')),
                        );
                      }
                    }
                  },
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Add'),
                ),
              ],
            ),

            // Average rating
            if (provider.cookingLogs.isNotEmpty) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  StarRating(
                    rating: provider.averageRating.round(),
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Avg. ${provider.averageRating.toStringAsFixed(1)}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ],

            const SizedBox(height: 12),

            // Loading state
            if (provider.isLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                ),
              )
            // Empty state
            else if (provider.cookingLogs.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 24),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: theme.colorScheme.outline),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.restaurant_outlined,
                      size: 40,
                      color: theme.colorScheme.onSurfaceVariant
                          .withOpacity(0.5),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'No cooking logs yet',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Record your cooking experience!',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant
                            .withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              )
            // Log list
            else
              ...provider.cookingLogs.asMap().entries.map((entry) {
                final index = entry.key;
                final log = entry.value;
                return _CookingLogTile(
                  log: log,
                  onDelete: () => _confirmDelete(context, provider, log.id),
                ).animate().fadeIn(
                      delay: Duration(milliseconds: index * 50),
                      duration: 300.ms,
                    );
              }),

            // Load more button
            if (provider.hasNextPage)
              Center(
                child: Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: provider.isLoadingMore
                      ? const CircularProgressIndicator()
                      : TextButton(
                          onPressed: () => provider.loadMore(recipeId),
                          child: const Text('Load More'),
                        ),
                ),
              ),
          ],
        );
      },
    );
  }

  void _confirmDelete(
    BuildContext context,
    CookingLogProvider provider,
    String logId,
  ) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Log'),
        content: const Text('Are you sure you want to delete this cooking log?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await provider.deleteCookingLog(logId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

class _CookingLogTile extends StatelessWidget {
  final dynamic log;
  final VoidCallback onDelete;

  const _CookingLogTile({required this.log, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.colorScheme.outline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  StarRating(rating: log.rating, size: 16),
                  const SizedBox(width: 8),
                  Text(
                    FormatUtils.formatDate(log.cookedAt),
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: onDelete,
                child: Icon(
                  Icons.close,
                  size: 18,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
          if (log.notes.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              log.notes,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface,
                height: 1.4,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
