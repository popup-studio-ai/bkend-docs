/// Initial mock data used in mock mode.
///
/// Activated with `--dart-define=MOCK_MODE=true` (default).
/// Allows experiencing all app features without actual API calls.
library;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

const mockAuthTokens = {
  'accessToken': 'mock-access-token',
  'refreshToken': 'mock-refresh-token',
};

const mockCurrentUser = {
  'id': 'user-1',
  'email': 'demo@bkend.ai',
  'name': 'Demo User',
};

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

final List<Map<String, dynamic>> mockProfiles = [
  {
    'id': 'profile-1',
    'userId': 'user-1',
    'nickname': 'Demo User',
    'bio': 'Welcome to the bkend social network!',
    'avatarUrl': 'https://picsum.photos/seed/user1/200/200',
    'createdBy': 'user-1',
    'createdAt': '2025-01-01T09:00:00.000Z',
  },
  {
    'id': 'profile-2',
    'userId': 'user-2',
    'nickname': 'Alex Kim',
    'bio': 'Photography enthusiast & coffee lover',
    'avatarUrl': 'https://picsum.photos/seed/user2/200/200',
    'createdBy': 'user-2',
    'createdAt': '2025-01-02T10:00:00.000Z',
  },
  {
    'id': 'profile-3',
    'userId': 'user-3',
    'nickname': 'Sarah Lee',
    'bio': 'Foodie exploring hidden gems around the city',
    'avatarUrl': 'https://picsum.photos/seed/user3/200/200',
    'createdBy': 'user-3',
    'createdAt': '2025-01-03T11:00:00.000Z',
  },
  {
    'id': 'profile-4',
    'userId': 'user-4',
    'nickname': 'Jamie Park',
    'bio': 'Documenting everyday life.',
    'avatarUrl': 'https://picsum.photos/seed/user4/200/200',
    'createdBy': 'user-4',
    'createdAt': '2025-01-04T12:00:00.000Z',
  },
  {
    'id': 'profile-5',
    'userId': 'user-5',
    'nickname': 'Chris Choi',
    'bio': 'Coder by day, traveler by weekend',
    'avatarUrl': 'https://picsum.photos/seed/user5/200/200',
    'createdBy': 'user-5',
    'createdAt': '2025-01-05T13:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

final List<Map<String, dynamic>> mockPosts = [
  {
    'id': 'post-1',
    'content': 'Caught an amazing sunset by the river today! The sky was on fire.',
    'imageUrl': 'https://picsum.photos/seed/post1/600/600',
    'likesCount': 12,
    'commentsCount': 3,
    'createdBy': 'user-2',
    'createdAt': '2025-02-01T18:30:00.000Z',
  },
  {
    'id': 'post-2',
    'content': 'Found a new cafe downtown! Their latte is absolutely incredible.',
    'imageUrl': 'https://picsum.photos/seed/post2/600/600',
    'likesCount': 8,
    'commentsCount': 2,
    'createdBy': 'user-3',
    'createdAt': '2025-02-02T14:00:00.000Z',
  },
  {
    'id': 'post-3',
    'content': 'Weekend cooking challenge — tried making pasta from scratch!',
    'imageUrl': 'https://picsum.photos/seed/post3/600/600',
    'likesCount': 15,
    'commentsCount': 3,
    'createdBy': 'user-1',
    'createdAt': '2025-02-03T12:00:00.000Z',
  },
  {
    'id': 'post-4',
    'content': 'Day 1 of my Jeju Island trip. The weather is perfect!',
    'imageUrl': 'https://picsum.photos/seed/post4/600/600',
    'likesCount': 22,
    'commentsCount': 5,
    'createdBy': 'user-5',
    'createdAt': '2025-02-04T09:00:00.000Z',
  },
  {
    'id': 'post-5',
    'content': 'Today\'s workout log: 5km run complete! Feeling great.',
    'imageUrl': null,
    'likesCount': 6,
    'commentsCount': 2,
    'createdBy': 'user-4',
    'createdAt': '2025-02-05T07:30:00.000Z',
  },
  {
    'id': 'post-6',
    'content': 'Cherry blossoms are starting to bloom! Spring is finally here.',
    'imageUrl': 'https://picsum.photos/seed/post6/600/600',
    'likesCount': 30,
    'commentsCount': 4,
    'createdBy': 'user-2',
    'createdAt': '2025-02-06T16:00:00.000Z',
  },
  {
    'id': 'post-7',
    'content': 'Book recommendation: "Clean Code" is a must-read for every developer!',
    'imageUrl': 'https://picsum.photos/seed/post7/600/600',
    'likesCount': 18,
    'commentsCount': 3,
    'createdBy': 'user-5',
    'createdAt': '2025-02-07T20:00:00.000Z',
  },
  {
    'id': 'post-8',
    'content': 'Afternoon walk with my dog. Best way to unwind!',
    'imageUrl': 'https://picsum.photos/seed/post8/600/600',
    'likesCount': 25,
    'commentsCount': 6,
    'createdBy': 'user-3',
    'createdAt': '2025-02-08T15:00:00.000Z',
  },
  {
    'id': 'post-9',
    'content': 'Homemade burgers for dinner. Way better than eating out!',
    'imageUrl': 'https://picsum.photos/seed/post9/600/600',
    'likesCount': 11,
    'commentsCount': 2,
    'createdBy': 'user-1',
    'createdAt': '2025-02-09T13:00:00.000Z',
  },
  {
    'id': 'post-10',
    'content': 'Finally deployed my side project! Two months of hard work paid off.',
    'imageUrl': null,
    'likesCount': 40,
    'commentsCount': 8,
    'createdBy': 'user-4',
    'createdAt': '2025-02-10T22:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

final List<Map<String, dynamic>> mockComments = [
  // post-1 comments
  {
    'id': 'comment-1',
    'postId': 'post-1',
    'content': 'Wow, that looks absolutely stunning!',
    'createdBy': 'user-3',
    'createdAt': '2025-02-01T19:00:00.000Z',
  },
  {
    'id': 'comment-2',
    'postId': 'post-1',
    'content': 'Where was this? I\'d love to visit!',
    'createdBy': 'user-1',
    'createdAt': '2025-02-01T19:30:00.000Z',
  },
  {
    'id': 'comment-3',
    'postId': 'post-1',
    'content': 'River sunsets are always the best!',
    'createdBy': 'user-5',
    'createdAt': '2025-02-01T20:00:00.000Z',
  },
  // post-2 comments
  {
    'id': 'comment-4',
    'postId': 'post-2',
    'content': 'Where is this cafe located?',
    'createdBy': 'user-4',
    'createdAt': '2025-02-02T15:00:00.000Z',
  },
  {
    'id': 'comment-5',
    'postId': 'post-2',
    'content': 'I need to check this place out!',
    'createdBy': 'user-1',
    'createdAt': '2025-02-02T16:00:00.000Z',
  },
  // post-3 comments
  {
    'id': 'comment-6',
    'postId': 'post-3',
    'content': 'That looks delicious! Can you share the recipe?',
    'createdBy': 'user-2',
    'createdAt': '2025-02-03T13:00:00.000Z',
  },
  {
    'id': 'comment-7',
    'postId': 'post-3',
    'content': 'I want to learn cooking too!',
    'createdBy': 'user-4',
    'createdAt': '2025-02-03T14:00:00.000Z',
  },
  {
    'id': 'comment-8',
    'postId': 'post-3',
    'content': 'Is that cream pasta? Looks amazing!',
    'createdBy': 'user-5',
    'createdAt': '2025-02-03T15:00:00.000Z',
  },
  // post-4 comments
  {
    'id': 'comment-9',
    'postId': 'post-4',
    'content': 'So jealous! I want to go too.',
    'createdBy': 'user-1',
    'createdAt': '2025-02-04T10:00:00.000Z',
  },
  {
    'id': 'comment-10',
    'postId': 'post-4',
    'content': 'Where are you staying?',
    'createdBy': 'user-3',
    'createdAt': '2025-02-04T11:00:00.000Z',
  },
  // post-5 comments
  {
    'id': 'comment-11',
    'postId': 'post-5',
    'content': 'Impressive! I really need to start exercising too...',
    'createdBy': 'user-2',
    'createdAt': '2025-02-05T08:00:00.000Z',
  },
  {
    'id': 'comment-12',
    'postId': 'post-5',
    'content': 'Love the consistency! Keep it up!',
    'createdBy': 'user-3',
    'createdAt': '2025-02-05T09:00:00.000Z',
  },
  // post-6 comments
  {
    'id': 'comment-13',
    'postId': 'post-6',
    'content': 'Spring already! Time really flies.',
    'createdBy': 'user-1',
    'createdAt': '2025-02-06T17:00:00.000Z',
  },
  {
    'id': 'comment-14',
    'postId': 'post-6',
    'content': 'Time for a cherry blossom picnic!',
    'createdBy': 'user-4',
    'createdAt': '2025-02-06T18:00:00.000Z',
  },
  {
    'id': 'comment-15',
    'postId': 'post-6',
    'content': 'Where did you take this? So beautiful!',
    'createdBy': 'user-5',
    'createdAt': '2025-02-06T19:00:00.000Z',
  },
  // post-7 comments
  {
    'id': 'comment-16',
    'postId': 'post-7',
    'content': 'I read it too! Such a great book.',
    'createdBy': 'user-1',
    'createdAt': '2025-02-07T21:00:00.000Z',
  },
  {
    'id': 'comment-17',
    'postId': 'post-7',
    'content': 'You should try "Refactoring" next!',
    'createdBy': 'user-4',
    'createdAt': '2025-02-07T22:00:00.000Z',
  },
  // post-8 comments
  {
    'id': 'comment-18',
    'postId': 'post-8',
    'content': 'Your dog is so adorable!',
    'createdBy': 'user-1',
    'createdAt': '2025-02-08T16:00:00.000Z',
  },
  {
    'id': 'comment-19',
    'postId': 'post-8',
    'content': 'What breed is it?',
    'createdBy': 'user-2',
    'createdAt': '2025-02-08T17:00:00.000Z',
  },
  {
    'id': 'comment-20',
    'postId': 'post-8',
    'content': 'Perfect weather for a walk!',
    'createdBy': 'user-5',
    'createdAt': '2025-02-08T18:00:00.000Z',
  },
  // post-9 comments
  {
    'id': 'comment-21',
    'postId': 'post-9',
    'content': 'Homemade burgers are the best! How did you make the patties?',
    'createdBy': 'user-3',
    'createdAt': '2025-02-09T14:00:00.000Z',
  },
  {
    'id': 'comment-22',
    'postId': 'post-9',
    'content': 'I gotta try this too!',
    'createdBy': 'user-5',
    'createdAt': '2025-02-09T15:00:00.000Z',
  },
  // post-10 comments
  {
    'id': 'comment-23',
    'postId': 'post-10',
    'content': 'Congrats! Please share the link!',
    'createdBy': 'user-1',
    'createdAt': '2025-02-10T23:00:00.000Z',
  },
  {
    'id': 'comment-24',
    'postId': 'post-10',
    'content': 'Great job on the two months of hard work!',
    'createdBy': 'user-2',
    'createdAt': '2025-02-10T23:30:00.000Z',
  },
  {
    'id': 'comment-25',
    'postId': 'post-10',
    'content': 'Curious about what the project is!',
    'createdBy': 'user-3',
    'createdAt': '2025-02-11T00:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Likes
// ---------------------------------------------------------------------------

final List<Map<String, dynamic>> mockLikes = [
  {
    'id': 'like-1',
    'postId': 'post-1',
    'createdBy': 'user-1',
    'createdAt': '2025-02-01T19:00:00.000Z',
  },
  {
    'id': 'like-2',
    'postId': 'post-2',
    'createdBy': 'user-1',
    'createdAt': '2025-02-02T15:00:00.000Z',
  },
  {
    'id': 'like-3',
    'postId': 'post-4',
    'createdBy': 'user-1',
    'createdAt': '2025-02-04T10:00:00.000Z',
  },
  {
    'id': 'like-4',
    'postId': 'post-6',
    'createdBy': 'user-1',
    'createdAt': '2025-02-06T17:00:00.000Z',
  },
  {
    'id': 'like-5',
    'postId': 'post-3',
    'createdBy': 'user-2',
    'createdAt': '2025-02-03T13:00:00.000Z',
  },
  {
    'id': 'like-6',
    'postId': 'post-8',
    'createdBy': 'user-1',
    'createdAt': '2025-02-08T16:00:00.000Z',
  },
  {
    'id': 'like-7',
    'postId': 'post-10',
    'createdBy': 'user-1',
    'createdAt': '2025-02-10T23:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Follows
// ---------------------------------------------------------------------------

final List<Map<String, dynamic>> mockFollows = [
  {
    'id': 'follow-1',
    'followerId': 'user-1',
    'followingId': 'user-2',
    'createdBy': 'user-1',
    'createdAt': '2025-01-10T10:00:00.000Z',
  },
  {
    'id': 'follow-2',
    'followerId': 'user-1',
    'followingId': 'user-3',
    'createdBy': 'user-1',
    'createdAt': '2025-01-11T10:00:00.000Z',
  },
  {
    'id': 'follow-3',
    'followerId': 'user-2',
    'followingId': 'user-1',
    'createdBy': 'user-2',
    'createdAt': '2025-01-12T10:00:00.000Z',
  },
  {
    'id': 'follow-4',
    'followerId': 'user-3',
    'followingId': 'user-1',
    'createdBy': 'user-3',
    'createdAt': '2025-01-13T10:00:00.000Z',
  },
  {
    'id': 'follow-5',
    'followerId': 'user-4',
    'followingId': 'user-2',
    'createdBy': 'user-4',
    'createdAt': '2025-01-14T10:00:00.000Z',
  },
  {
    'id': 'follow-6',
    'followerId': 'user-5',
    'followingId': 'user-3',
    'createdBy': 'user-5',
    'createdAt': '2025-01-15T10:00:00.000Z',
  },
];
