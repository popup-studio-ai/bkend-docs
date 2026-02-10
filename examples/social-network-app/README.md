# social-network-app

A social network mobile app built with the bkend platform.

- **Cookbook**: [cookbooks/social-network](../../cookbooks/social-network/)
- **Design Theme**: Dark Vibrant (dark-first, neon accent)

## Features

- Profile management (avatar upload)
- Post CRUD (image attachments)
- Comments, like toggle
- Follow/unfollow
- Following-based feed (infinite scroll)
- Email authentication (sign up / sign in)
- Dark/light mode toggle

## Tech Stack

| Technology | Role |
|------------|------|
| Flutter | SDK |
| Provider | State management |
| go_router | Routing |
| dio | HTTP client |
| flutter_animate | Animations |
| shimmer | Skeleton loading |
| cached_network_image | Image caching |

## Getting Started

### Prerequisites

- Flutter 3.24+ ([fvm](https://fvm.app) recommended)
- Android Studio or Xcode

### Installation

```bash
cd examples/social-network-app
fvm install
fvm flutter pub get
```

### Run (Mock Mode)

Runs immediately with mock data, no API server required. Mock mode is enabled by default.

```bash
# iOS Simulator
open -a Simulator
fvm flutter run -d "iPhone 17 Pro"

# Android Emulator
emulator -avd {AVD_NAME} &
fvm flutter run -d android
```

**Demo Account:**

```
Email: demo@bkend.ai
Password: abc123
```

### Run (bkend API Integration)

To connect with a real bkend project, configure via `--dart-define`.

```bash
fvm flutter run \
  --dart-define=MOCK_MODE=false \
  --dart-define=API_BASE_URL=https://api-client.bkend.ai \
  --dart-define=PROJECT_ID=your-project-id \
  --dart-define=ENVIRONMENT=dev
```

1. Create a project in the [bkend console](https://console.bkend.ai)
2. Set your project ID in `PROJECT_ID`
3. Create the table structures from the cookbook (profiles, posts, comments, likes, follows) in the console
4. Run with the command above

### Build

```bash
# Android
fvm flutter build apk --dart-define=MOCK_MODE=false --dart-define=PROJECT_ID=your-project-id

# iOS
fvm flutter build ios --dart-define=MOCK_MODE=false --dart-define=PROJECT_ID=your-project-id
```

## Project Structure

```
lib/
├── core/                       # Infrastructure
│   ├── constants/              #   API constants
│   ├── network/dio_client.dart #   Dio HTTP client
│   ├── storage/                #   Token storage
│   └── mock/                   #   Mock interceptor + data
├── app/                        # App configuration
│   ├── app.dart                #   MaterialApp
│   ├── router.dart             #   GoRouter
│   └── theme.dart              #   Material 3 theme
├── features/                   # Feature modules
│   ├── auth/                   #   Authentication
│   ├── profiles/               #   Profiles
│   ├── posts/                  #   Posts
│   ├── comments/               #   Comments
│   ├── likes/                  #   Likes
│   ├── follows/                #   Follows
│   └── feed/                   #   Feed
├── shared/                     # Shared widgets, models
└── main.dart                   # Entry point
```

## Reference Docs

- [Cookbook: social-network](../../cookbooks/social-network/)
- [bkend Docs](../../ko/)
