"use client";

import { motion } from "framer-motion";
import { ChefHat, CalendarDays, ShoppingCart, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const features = [
  {
    icon: ChefHat,
    title: "Recipe Management",
    description: "Create, edit, and organize your recipes with photos and detailed instructions.",
  },
  {
    icon: CalendarDays,
    title: "Meal Planning",
    description: "Plan your weekly meals with a drag-and-drop calendar interface.",
  },
  {
    icon: ShoppingCart,
    title: "Smart Shopping Lists",
    description: "Auto-generate shopping lists from your meal plans.",
  },
  {
    icon: Shield,
    title: "Powered by bkend",
    description: "Built on the bkend platform with secure authentication and data management.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0wIDM2YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTgtMThjMS42NTcgMCAzLTEuMzQzIDMtM3MtMS4zNDMtMy0zLTMtMyAxLjM0My0zIDMgMS4zNDMgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <ChefHat className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">Recipe App</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-4">
              Your kitchen,
              <br />
              organized.
            </h1>
            <p className="text-lg text-white/80 mb-12 max-w-md">
              A full-featured recipe management app built on the bkend platform.
              Plan meals, create shopping lists, and cook with confidence.
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-sm text-white/70 mt-0.5">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <ChefHat className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Recipe App</span>
          </div>

          {children}

          {/* Demo credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-xl border border-dashed border-border bg-muted/50 p-4"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Account</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Email: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">demo@bkend.ai</code>
              </p>
              <p>
                Password: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">Bkend123$</code>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
