import 'package:intl/intl.dart';

class FormatUtils {
  FormatUtils._();

  /// Calculate ingredient amount based on serving conversion
  /// [originalAmount] original amount (string, e.g. "2", "1/2", "1.5")
  /// [originalServings] original number of servings
  /// [targetServings] target number of servings
  static String convertAmount(
    String originalAmount,
    int originalServings,
    int targetServings,
  ) {
    if (originalServings <= 0 || targetServings <= 0) {
      return originalAmount;
    }

    final parsed = _parseAmount(originalAmount);
    if (parsed == null) return originalAmount;

    final ratio = targetServings / originalServings;
    final converted = parsed * ratio;

    // Display as a clean integer or fraction
    if (converted == converted.roundToDouble() && converted >= 1) {
      return converted.toInt().toString();
    }

    // Try common fraction representations
    final fraction = _toFraction(converted);
    if (fraction != null) return fraction;

    // One decimal place
    return converted.toStringAsFixed(1);
  }

  static double? _parseAmount(String amount) {
    final trimmed = amount.trim();
    if (trimmed.isEmpty) return null;

    // Fractions like "1/2"
    if (trimmed.contains('/')) {
      final parts = trimmed.split('/');
      if (parts.length == 2) {
        final numerator = double.tryParse(parts[0].trim());
        final denominator = double.tryParse(parts[1].trim());
        if (numerator != null && denominator != null && denominator != 0) {
          return numerator / denominator;
        }
      }
      return null;
    }

    return double.tryParse(trimmed);
  }

  static String? _toFraction(double value) {
    final fractions = {
      0.25: '1/4',
      0.33: '1/3',
      0.5: '1/2',
      0.67: '2/3',
      0.75: '3/4',
    };

    final intPart = value.floor();
    final decPart = value - intPart;

    if (decPart < 0.05) {
      return intPart > 0 ? intPart.toString() : null;
    }

    for (final entry in fractions.entries) {
      if ((decPart - entry.key).abs() < 0.05) {
        if (intPart > 0) {
          return '$intPart ${entry.value}';
        }
        return entry.value;
      }
    }

    return null;
  }

  /// Date format: "2024-01-15" -> "Jan 15 (Mon)"
  static String formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('MMM d (E)').format(date);
    } catch (_) {
      return dateStr;
    }
  }

  /// Date format: DateTime -> "2024-01-15"
  static String toDateString(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  /// Difficulty label
  static String difficultyLabel(String difficulty) {
    switch (difficulty) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return difficulty;
    }
  }

  /// Difficulty color index (0=Easy, 1=Medium, 2=Hard)
  static int difficultyIndex(String difficulty) {
    switch (difficulty) {
      case 'easy':
        return 0;
      case 'medium':
        return 1;
      case 'hard':
        return 2;
      default:
        return 0;
    }
  }

  /// Meal type label
  static String mealTypeLabel(String mealType) {
    switch (mealType) {
      case 'breakfast':
        return 'Breakfast';
      case 'lunch':
        return 'Lunch';
      case 'dinner':
        return 'Dinner';
      case 'snack':
        return 'Snack';
      default:
        return mealType;
    }
  }

  /// Cooking time format: 65 -> "1h 5min"
  static String formatCookingTime(int minutes) {
    if (minutes < 60) return '${minutes}min';
    final hours = minutes ~/ 60;
    final mins = minutes % 60;
    if (mins == 0) return '${hours}h';
    return '${hours}h ${mins}min';
  }

  /// Weekday label (1=Mon, 7=Sun)
  static String weekdayLabel(int weekday) {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels[weekday - 1];
  }
}
