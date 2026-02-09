# blog-web

A blog web application built with the bkend platform.

- **Cookbook**: [cookbooks/blog](../../cookbooks/blog/)
- **Design Theme**: Editorial Minimal (typography-focused, clean reading experience)

## Features

- Article CRUD (category filter, sorting)
- Tag management
- Bookmark toggle
- Image upload (Presigned URL 3-step flow)
- Email authentication (sign up / sign in)
- Dark / light mode toggle

## Tech Stack

| Technology | Role |
|------|------|
| Next.js 16 (App Router) | Framework |
| Tailwind CSS + shadcn/ui | Styling |
| Zustand | Client state |
| TanStack Query v5 | Server state (caching) |
| React Hook Form + Zod | Forms & validation |
| framer-motion | Animations |
| next-themes | Dark / light toggle |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
cd examples/blog-web
pnpm install
```

### Running (Mock Mode)

Runs immediately with mock data, no API server required.

```bash
pnpm dev
```

> `.env.local.example` is set to `NEXT_PUBLIC_MOCK_MODE=true` by default.
> Copy it to `.env.local` before your first run.

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

To connect with an actual bkend project, edit `.env.local`:

```env
# Disable mock mode
NEXT_PUBLIC_MOCK_MODE=false

# bkend API
NEXT_PUBLIC_API_URL=https://api-client.bkend.ai
NEXT_PUBLIC_PROJECT_ID=your-project-id
NEXT_PUBLIC_ENVIRONMENT=dev
```

1. Create a project in the [bkend Console](https://console.bkend.ai)
2. Set your project ID in `NEXT_PUBLIC_PROJECT_ID`
3. Create the table structures (articles, tags, bookmarks) from the cookbook in the console
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
│   ├── (auth)/             #   Sign in, Sign up
│   └── (app)/              #   Articles, Tags, Bookmarks
├── infrastructure/         # HTTP client, Token, Mock
│   ├── api/client.ts       #   bkendFetch wrapper
│   ├── storage/            #   Token storage
│   └── mock/               #   Mock handler + data
├── application/dto/        # TypeScript type definitions
├── lib/api/                # Domain-specific API functions
├── hooks/queries/          # React Query hooks
├── stores/                 # Zustand stores
└── components/             # UI components
    ├── ui/                 #   shadcn/ui base components
    ├── articles/           #   Article-related
    ├── tags/               #   Tag-related
    ├── bookmarks/          #   Bookmark-related
    ├── files/              #   File upload
    ├── auth/               #   Auth forms
    └── layout/             #   Layout, Navigation
```

## References

- [Cookbook: blog](../../cookbooks/blog/)
- [bkend Docs](../../ko/)
