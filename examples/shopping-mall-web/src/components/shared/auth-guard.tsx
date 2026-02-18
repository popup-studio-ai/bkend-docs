"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/stores/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Where to redirect when not authenticated (default: /sign-in) */
  redirectTo?: string;
}

/**
 * Protects pages that require authentication.
 * Redirects to sign-in page if user is not authenticated.
 */
export function AuthGuard({ children, redirectTo = "/sign-in" }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !tokenStorage.hasTokens() && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [mounted, isAuthenticated, router, redirectTo]);

  if (!mounted) {
    return null;
  }

  if (!tokenStorage.hasTokens() && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
