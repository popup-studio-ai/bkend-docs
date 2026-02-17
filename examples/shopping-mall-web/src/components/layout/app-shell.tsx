"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StorefrontHeader } from "./storefront-header";
import { CartDrawer } from "./cart-drawer";
import { QuickView } from "@/components/products/quick-view";
import { useAuthStore } from "@/stores/auth-store";
import { useMe } from "@/hooks/queries/use-auth";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { Loader2 } from "lucide-react";

// Pages that require authentication
const AUTH_REQUIRED_PATHS = ["/orders", "/reviews", "/settings", "/checkout", "/cart"];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore((s) => s.setUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only fetch user profile if tokens exist
  const hasTokens = mounted && tokenStorage.hasTokens();
  const { data: user, isError } = useMe();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  // Redirect to sign-in only for auth-required pages when not authenticated
  useEffect(() => {
    if (!mounted) return;
    const needsAuth = AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p));
    if (needsAuth && !tokenStorage.hasTokens()) {
      router.replace("/sign-in");
    }
  }, [mounted, pathname, router]);

  useEffect(() => {
    if (mounted && isError && !tokenStorage.hasTokens()) {
      // Clear stale user state, but don't redirect unless on auth-required page
      const needsAuth = AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p));
      if (needsAuth) {
        router.replace("/sign-in");
      }
    }
  }, [mounted, isError, pathname, router]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />
      <main>{children}</main>
      <CartDrawer />
      <QuickView />
    </div>
  );
}
