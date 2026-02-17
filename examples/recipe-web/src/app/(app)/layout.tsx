"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useMe } from "@/hooks/queries/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { Loader2 } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  const { data: user, isLoading } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !tokenStorage.hasTokens()) {
      router.replace("/sign-in");
    }
  }, [mounted, router]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted || (isLoading && !isAuthenticated)) {
    return (
      <div className="flex h-screen items-center justify-center bg-amber-50 dark:bg-stone-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm text-stone-500 dark:text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
