import 'package:flutter/material.dart';
import '../../models/shopping_list.dart';

class ShoppingItemTile extends StatelessWidget {
  final ShoppingItem item;
  final VoidCallback onToggle;

  const ShoppingItemTile({
    super.key,
    required this.item,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onToggle,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        margin: const EdgeInsets.only(bottom: 6),
        decoration: BoxDecoration(
          color: item.checked
              ? theme.colorScheme.secondary.withOpacity(0.05)
              : theme.colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: item.checked
                ? theme.colorScheme.secondary.withOpacity(0.2)
                : theme.colorScheme.outline.withOpacity(0.2),
          ),
        ),
        child: Row(
          children: [
            // Checkbox
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: item.checked
                    ? theme.colorScheme.secondary
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: item.checked
                      ? theme.colorScheme.secondary
                      : theme.colorScheme.outline.withOpacity(0.5),
                  width: 2,
                ),
              ),
              child: item.checked
                  ? const Icon(
                      Icons.check,
                      size: 16,
                      color: Colors.white,
                    )
                  : null,
            ),
            const SizedBox(width: 12),

            // Name
            Expanded(
              child: Text(
                item.name,
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                  decoration:
                      item.checked ? TextDecoration.lineThrough : null,
                  color: item.checked
                      ? theme.colorScheme.onSurfaceVariant.withOpacity(0.5)
                      : null,
                ),
              ),
            ),

            // Amount + Unit
            Text(
              '${item.amount} ${item.unit}',
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: item.checked
                    ? theme.colorScheme.onSurfaceVariant.withOpacity(0.4)
                    : theme.colorScheme.primary,
                decoration:
                    item.checked ? TextDecoration.lineThrough : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
