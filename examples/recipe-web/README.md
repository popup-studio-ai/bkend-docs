# recipe-web

A recipe management web application built with the bkend platform.

- **Cookbook**: [cookbooks/recipe-app](../../cookbooks/recipe-app/)
- **Design theme**: Warm Kitchen (warm tones, food photography focus)

## Features

- Recipe CRUD (difficulty/time filters, image upload)
- Ingredient management (serving conversion)
- Meal planning (weekly calendar)
- Shopping lists (auto-generate from recipes)
- Cooking logs & ratings (cooking_logs)
- Email authentication (sign-up/sign-in)
- Dark/light mode toggle

## Tech Stack

| Tech | Role |
|------|------|
| Next.js 16 (App Router) | Framework |
| Tailwind CSS + shadcn/ui | Styling |
| Zustand | Client state |
| TanStack Query v5 | Server state (caching) |
| React Hook Form + Zod | Forms & validation |
| framer-motion | Animation |
| next-themes | Dark/light toggle |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
cd examples/recipe-web
pnpm install
```

### Run (Mock Mode)

Runs immediately with mock data, no API server required.

```bash
cp .env.local.example .env.local
pnpm dev
```

Open `http://localhost:3000` in your browser.

**Demo account:**

```
Email: demo@bkend.ai
Password: Bkend123$
```

### Run (bkend API Integration)

Edit `.env.local`:

```env
# Disable mock mode
NEXT_PUBLIC_MOCK_MODE=false

# bkend API
NEXT_PUBLIC_API_URL=https://api-client.bkend.ai
NEXT_PUBLIC_PROJECT_ID=your-project-id
NEXT_PUBLIC_ENVIRONMENT=dev
```

1. Create a project at the [bkend console](https://console.bkend.ai)
2. Set your project ID in `NEXT_PUBLIC_PROJECT_ID`
3. Create the cookbook table structures (recipes, ingredients, meal_plans, shopping_lists, cooking_logs) in the console
4. Run `pnpm dev`

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── (auth)/             #   Sign-in, sign-up
│   └── (app)/              #   Recipes, ingredients, meal plans, shopping
├── infrastructure/         # HTTP client, token, mock
│   ├── api/client.ts       #   API client
│   ├── storage/            #   Token storage
│   └── mock/               #   Mock handler + data
├── application/dto/        # TypeScript type definitions
├── lib/
│   ├── api/                #   Domain API functions
│   └── format.ts           #   Serving conversion & utilities
├── hooks/queries/          # React Query hooks
├── stores/                 # Zustand stores
└── components/             # UI components
    ├── ui/                 #   shadcn/ui base components
    ├── recipes/            #   Recipe related
    ├── ingredients/        #   Ingredient related
    ├── meal-plans/         #   Meal planning
    ├── shopping/           #   Shopping lists
    ├── cooking-logs/       #   Cooking logs & ratings
    ├── files/              #   File upload
    ├── auth/               #   Auth forms
    └── layout/             #   Layout, navigation
```

## References

- [Cookbook: recipe-app](../../cookbooks/recipe-app/)
- [bkend Docs](../../ko/)
