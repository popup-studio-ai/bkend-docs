import 'package:flutter/material.dart';

class ServingConverter extends StatelessWidget {
  final int originalServings;
  final int currentServings;
  final ValueChanged<int> onChanged;

  const ServingConverter({
    super.key,
    required this.originalServings,
    required this.currentServings,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isOriginal = currentServings == originalServings;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.15),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.people_outline,
            size: 20,
            color: theme.colorScheme.primary,
          ),
          const SizedBox(width: 8),
          Text(
            'Adjust Servings',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.primary,
            ),
          ),
          const Spacer(),
          // Decrease button
          _buildButton(
            context,
            Icons.remove,
            currentServings > 1,
            () => onChanged(currentServings - 1),
          ),
          Container(
            constraints: const BoxConstraints(minWidth: 48),
            alignment: Alignment.center,
            child: Text(
              '$currentServings servings',
              style: theme.textTheme.bodyLarge?.copyWith(
                fontWeight: FontWeight.w700,
                color: theme.colorScheme.primary,
              ),
            ),
          ),
          // Increase button
          _buildButton(
            context,
            Icons.add,
            currentServings < 20,
            () => onChanged(currentServings + 1),
          ),
          if (!isOriginal) ...[
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () => onChanged(originalServings),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: theme.colorScheme.onSurfaceVariant.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Reset',
                  style: TextStyle(
                    fontSize: 11,
                    color: theme.colorScheme.onSurfaceVariant,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildButton(
    BuildContext context,
    IconData icon,
    bool enabled,
    VoidCallback onTap,
  ) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: enabled
              ? theme.colorScheme.primary.withOpacity(0.1)
              : theme.colorScheme.onSurfaceVariant.withOpacity(0.05),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          size: 16,
          color: enabled
              ? theme.colorScheme.primary
              : theme.colorScheme.onSurfaceVariant.withOpacity(0.3),
        ),
      ),
    );
  }
}
