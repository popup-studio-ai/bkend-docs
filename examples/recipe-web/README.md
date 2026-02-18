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

### Configuration

Copy `.env.local.example` to `.env.local` and configure your bkend project:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api-client.bkend.ai
NEXT_PUBLIC_PUBLISHABLE_KEY=pk_your_publishable_key
```

### Running

1. Create a project in the [bkend console](https://console.bkend.ai)
2. Set your publishable key in `.env.local`
3. Create the table structures (recipes, ingredients, meal_plans, shopping_lists, cooking_logs) from the cookbook in the console
4. Start the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

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
├── infrastructure/         # HTTP client, token storage
│   ├── api/client.ts       #   bkendFetch wrapper
│   └── storage/            #   Token storage
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
