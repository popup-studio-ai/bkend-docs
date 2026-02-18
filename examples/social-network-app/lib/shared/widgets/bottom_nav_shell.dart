import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../features/auth/providers/auth_provider.dart';
import '../../features/feed/providers/feed_provider.dart';

class BottomNavShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const BottomNavShell({
    super.key,
    required this.navigationShell,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) {
          navigationShell.goBranch(
            index,
            initialLocation: index == navigationShell.currentIndex,
          );
          // Refresh feed when switching to Home tab
          if (index == 0) {
            final userId = context.read<AuthProvider>().currentUserId;
            if (userId != null) {
              context.read<FeedProvider>().loadFeed(userId);
            }
          }
        },
        backgroundColor: theme.colorScheme.surface,
        indicatorColor: theme.colorScheme.primary.withValues(alpha: 0.15),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: theme.colorScheme.primary),
            label: 'Home',
          ),
          NavigationDestination(
            icon: const Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore, color: theme.colorScheme.primary),
            label: 'Explore',
          ),
          NavigationDestination(
            icon: const Icon(Icons.notifications_outlined),
            selectedIcon:
                Icon(Icons.notifications, color: theme.colorScheme.primary),
            label: 'Alerts',
          ),
          NavigationDestination(
            icon: const Icon(Icons.person_outlined),
            selectedIcon: Icon(Icons.person, color: theme.colorScheme.primary),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
