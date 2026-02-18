"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridCard } from "@/components/products/product-grid-card";
import { useProducts } from "@/hooks/queries/use-products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

const CATEGORY_ICONS: Record<string, string> = {
  electronics: "💻",
  home: "🏠",
  fashion: "👕",
  food: "🍔",
  lifestyle: "🧘",
};

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
];

export default function StorefrontPage() {
  const { data: newArrivals, isLoading: isLoadingNew } = useProducts({
    page: 1,
    limit: 8,
    isActive: true,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-brand">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4" />
              New Arrivals
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Amazing
              <br />
              Products
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-lg">
              Shop the latest trends with the best prices. Quality products delivered right to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 font-semibold"
                asChild
              >
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              <Button
                size="lg"
                className="border border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold backdrop-blur-sm"
                asChild
              >
                <Link href="/products?category=electronics">
                  Trending
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex items-center gap-3 py-4 px-4 sm:px-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-color/10">
                  <feature.icon className="h-5 w-5 text-accent-color" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
            <p className="mt-1 text-muted-foreground">Find exactly what you need</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {PRODUCT_CATEGORIES.map((category, i) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/products?category=${category.value}`}>
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-accent-color/30 hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-5">
                    <span className="text-3xl mb-2">
                      {CATEGORY_ICONS[category.value] ?? "📦"}
                    </span>
                    <span className="text-sm font-medium text-center group-hover:text-accent-color transition-colors">
                      {category.label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
            <p className="mt-1 text-muted-foreground">Fresh products just for you</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              See All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoadingNew ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : newArrivals?.items && newArrivals.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.items.map((product, i) => (
              <ProductGridCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium">No products yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Products will appear here once they are added
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-brand-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to start shopping?
          </h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Create an account to save your favorites, track orders, and get exclusive deals.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button size="lg" className="bg-gradient-brand text-white border-0 shadow-sm hover:opacity-90" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">
                <span className="text-gradient-brand">bkend</span> Mall
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with bkend.ai — Backend as a Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
