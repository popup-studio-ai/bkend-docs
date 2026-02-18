# shopping-mall-web

A shopping mall web application built with the bkend platform.

- **Cookbook**: [cookbooks/shopping-mall](../../cookbooks/shopping-mall/)
- **Design Theme**: Premium Commerce (orange/red accent, refined grid)

## Features

- **Dashboard** with stats cards (products, orders, cart) and recent activity
- **Product browsing** with search (Cmd+K), grid/list toggle, category filter, sorting
- **Cart management** with slide-out drawer, quantity stepper, checkout flow
- **Order creation** and status management (status transition validation)
- **Reviews & ratings** with average/distribution display
- **Settings** with profile editing, password change, account deletion
- **Email authentication** (sign up / sign in) with 2-panel layout
- **Dark/light mode** toggle
- **SSR hydration safety** with mounted guard pattern

## Tech Stack

| Technology | Role |
|------|------|
| Next.js 16 (App Router) | Framework |
| Tailwind CSS v4 + shadcn/ui | Styling (CSS variables) |
| Zustand | Client state |
| TanStack Query v5 | Server state (caching) |
| React Hook Form + Zod | Form & validation |
| framer-motion | Animation |
| next-themes | Dark/light toggle |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
cd examples/shopping-mall-web
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

# Google OAuth (optional - Google login button hidden if not set)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Running

1. Create a project in the [bkend console](https://console.bkend.ai)
2. Set your publishable key in `.env.local`
3. Create the table structures (products, carts, orders, reviews) from the cookbook in the console
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
│   ├── (auth)/             #   Sign in (/sign-in), Sign up (/sign-up)
│   └── (app)/              #   Dashboard, Products, Cart, Orders, Reviews, Settings
├── infrastructure/         # HTTP client, token storage
│   ├── api/client.ts       #   bkendFetch (unified API client)
│   └── storage/            #   Token storage (setTokens/clearTokens)
├── application/dto/        # TypeScript type definitions
├── lib/api/                # Domain API functions (bkendFetch based)
├── hooks/queries/          # React Query hooks
├── stores/                 # Zustand stores (auth, cart, ui)
└── components/             # UI components
    ├── ui/                 #   shadcn/ui base components + Toast
    ├── products/           #   Product grid/list, search, quick view
    ├── cart/               #   Cart drawer, quantity stepper
    ├── orders/             #   Order status, checkout
    ├── reviews/            #   Reviews & ratings
    ├── files/              #   File upload
    ├── settings/           #   Profile, password, account deletion
    ├── auth/               #   Sign in/up forms
    ├── layout/             #   App shell, sidebar, topbar, cart drawer
    └── shared/             #   Pagination, empty state, search
```

## References

- [Cookbook: shopping-mall](../../cookbooks/shopping-mall/)
- [bkend Docs](../../ko/)