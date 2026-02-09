import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'app/app.dart';
import 'core/network/dio_client.dart';
import 'core/storage/token_storage.dart';
import 'features/auth/data/auth_api.dart';
import 'features/auth/data/auth_repository.dart';
import 'features/auth/providers/auth_provider.dart';
import 'features/comments/data/comment_api.dart';
import 'features/comments/providers/comment_provider.dart';
import 'features/feed/providers/feed_provider.dart';
import 'features/follows/data/follow_api.dart';
import 'features/follows/providers/follow_provider.dart';
import 'features/likes/data/like_api.dart';
import 'features/likes/providers/like_provider.dart';
import 'features/posts/data/post_api.dart';
import 'features/posts/data/post_repository.dart';
import 'features/posts/providers/post_provider.dart';
import 'features/profiles/data/profile_api.dart';
import 'features/profiles/data/profile_repository.dart';
import 'features/profiles/providers/profile_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize token storage
  final tokenStorage = TokenStorage();
  await tokenStorage.init();

  // Initialize DIO client
  final dioClient = DioClient(tokenStorage: tokenStorage);

  // Initialize APIs
  final authApi = AuthApi(client: dioClient);
  final profileApi = ProfileApi(client: dioClient);
  final postApi = PostApi(client: dioClient);
  final commentApi = CommentApi(client: dioClient);
  final likeApi = LikeApi(client: dioClient);
  final followApi = FollowApi(client: dioClient);

  // Initialize repositories
  final authRepository = AuthRepository(
    api: authApi,
    tokenStorage: tokenStorage,
  );
  final profileRepository = ProfileRepository(api: profileApi);
  final postRepository = PostRepository(api: postApi);

  // Initialize providers
  final authProvider = AuthProvider(repository: authRepository);
  final profileProvider = ProfileProvider(repository: profileRepository);
  final postProvider = PostProvider(repository: postRepository);
  final commentProvider = CommentProvider(api: commentApi);
  final likeProvider = LikeProvider(api: likeApi);
  final followProvider = FollowProvider(api: followApi);
  final feedProvider = FeedProvider(
    client: dioClient,
    followProvider: followProvider,
  );

  // Set force logout callback
  dioClient.onForceLogout = () {
    authProvider.forceLogout();
  };

  // Check initial auth status
  await authProvider.checkAuth();

  // If authenticated, load profile
  if (authProvider.isAuthenticated && authProvider.currentUserId != null) {
    await profileProvider.loadMyProfile(authProvider.currentUserId!);
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProvider.value(value: profileProvider),
        ChangeNotifierProvider.value(value: postProvider),
        ChangeNotifierProvider.value(value: commentProvider),
        ChangeNotifierProvider.value(value: likeProvider),
        ChangeNotifierProvider.value(value: followProvider),
        ChangeNotifierProvider.value(value: feedProvider),
        Provider.value(value: profileRepository),
        Provider.value(value: postRepository),
      ],
      child: const App(),
    ),
  );
}
