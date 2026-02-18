import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../features/auth/providers/auth_provider.dart';

class DemoGuard {
  DemoGuard._();

  static const demoEmail = 'demo@bkend.ai';

  /// Returns true if the current user is the demo account (action blocked).
  static bool check(BuildContext context, {String? message}) {
    final auth = context.read<AuthProvider>();
    if (auth.user?.email != demoEmail) return false;

    ScaffoldMessenger.of(context)
      ..clearSnackBars()
      ..showSnackBar(
        SnackBar(
          content: Text(message ?? 'Not available in demo mode.'),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 2),
        ),
      );
    return true;
  }

  /// Check by email string (for sign-in screen where auth is not yet set).
  static bool isDemoEmail(String email) =>
      email.trim().toLowerCase() == demoEmail;
}
