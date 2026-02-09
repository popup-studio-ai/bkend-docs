# shopping-mall-web

A shopping mall web application built with the bkend platform.

- **Cookbook**: [cookbooks/shopping-mall](../../cookbooks/shopping-mall/)
- **Design Theme**: Premium Commerce (luxury commerce, refined grid)

## Features

- Product CRUD (category/price filters, image upload)
- Cart management (duplicate prevention, quantity update)
- Order creation & status management (status transition validation)
- Reviews & ratings (average/distribution)
- Email authentication (sign up/sign in)
- Dark/light mode toggle

## Tech Stack

| Technology | Role |
|------|------|
| Next.js 16 (App Router) | Framework |
| Tailwind CSS + shadcn/ui | Styling |
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

### Running (Mock Mode)

Runs immediately with mock data, no API server required.

```bash
cp .env.local.example .env.local
pnpm dev
```

Open `http://localhost:3000` in your browser.

**Demo Account:**

```
Email: demo@bkend.ai
Password: Bkend123$
```

### Running (bkend API Integration)

Edit `.env.local`:

```env
# Disable mock mode
NEXT_PUBLIC_MOCK_MODE=false

# bkend API
NEXT_PUBLIC_API_URL=https://api-client.bkend.ai
NEXT_PUBLIC_PROJECT_ID=your-project-id
NEXT_PUBLIC_ENVIRONMENT=dev
```

1. Create a project in the [bkend console](https://console.bkend.ai)
2. Set the project ID in `NEXT_PUBLIC_PROJECT_ID`
3. Create the table structures (products, carts, orders, reviews) from the cookbook in the console
4. Run with `pnpm dev`

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── (auth)/             #   Sign in, Sign up
│   └── (app)/              #   Products, Cart, Orders, Reviews
├── infrastructure/         # HTTP client, token, mock
│   ├── api/client.ts       #   API client
│   ├── storage/            #   Token storage
│   └── mock/               #   Mock handler + data
├── application/dto/        # TypeScript type definitions
├── lib/api/                # Domain API functions
├── hooks/queries/          # React Query hooks
├── stores/                 # Zustand stores (auth, cart, ui)
└── components/             # UI components
    ├── ui/                 #   shadcn/ui base components
    ├── products/           #   Product related
    ├── cart/               #   Cart
    ├── orders/             #   Order related
    ├── reviews/            #   Reviews & ratings
    ├── files/              #   File upload
    ├── auth/               #   Auth forms
    └── layout/             #   Layout, navigation
```

## References

- [Cookbook: shopping-mall](../../cookbooks/shopping-mall/)
- [bkend Docs](../../ko/)
