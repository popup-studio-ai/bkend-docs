"use client";

import Link from "next/link";
import { ChefHat, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface PublicShellProps {
  children: React.ReactNode;
}

/**
 * Layout for unauthenticated users.
 * No sidebar, centered content, top bar with logo and sign in/up buttons.
 */
export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand">
              <ChefHat className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-gradient-brand">Recipe</span>{" "}
              <span className="text-foreground">App</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/sign-in">
                <LogIn className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content - centered, no sidebar */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
