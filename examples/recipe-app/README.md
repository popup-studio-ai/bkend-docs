# recipe-app

A recipe management mobile app built with the bkend platform.

- **Cookbook**: [cookbooks/recipe-app](../../cookbooks/recipe-app/)
- **Design Theme**: Warm Kitchen (warm tones, food photo emphasis)

## Features

- Recipe CRUD (difficulty/time filter, image upload)
- Ingredient management
- Meal planning (weekly calendar)
- Shopping lists (auto-generate)
- Cooking logs & ratings (cooking_logs)
- Email authentication (sign up / sign in)
- Dark / light mode toggle

## Tech Stack

| Technology | Role |
|------|------|
| Flutter | SDK |
| Provider | State management |
| go_router | Routing |
| dio | HTTP client |
| flutter_animate | Animation |
| shimmer | Skeleton loading |
| cached_network_image | Image caching |

## Getting Started

### Prerequisites

- Flutter 3.24+ ([fvm](https://fvm.app) recommended)
- Android Studio or Xcode

### Installation

```bash
cd examples/recipe-app
fvm install
fvm flutter pub get
```

### Run (Mock Mode)

Runs immediately with mock data, no API server needed. Mock mode is the default.

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
Password: Bkend123$
```

### Run (bkend API Integration)

To connect to an actual bkend project, configure via `--dart-define`.

```bash
fvm flutter run \
  --dart-define=MOCK_MODE=false \
  --dart-define=API_BASE_URL=https://api-client.bkend.ai \
  --dart-define=PROJECT_ID=your-project-id \
  --dart-define=ENVIRONMENT=dev
```

1. Create a project at [bkend console](https://console.bkend.ai)
2. Set the project ID in `PROJECT_ID`
3. Create the cookbook table structures (recipes, ingredients, meal_plans, shopping_lists, cooking_logs) in the console
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
│   ├── recipes/                #   Recipes
│   ├── ingredients/            #   Ingredients
│   ├── meal_plans/             #   Meal plans
│   ├── shopping/               #   Shopping lists
│   ├── cooking_logs/           #   Cooking logs & ratings
│   └── settings/               #   Settings
├── shared/                     # Shared widgets, models
└── main.dart                   # Entry point
```

## Reference

- [Cookbook: recipe-app](../../cookbooks/recipe-app/)
- [bkend Docs](../../ko/)
