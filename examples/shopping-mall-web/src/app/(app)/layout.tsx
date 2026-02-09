"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { QuickView } from "@/components/products/quick-view";
import { useMe } from "@/hooks/queries/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { tokenStorage } from "@/infrastructure/storage/token-storage";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, setLoading } = useAuthStore();

  useMe();

  useEffect(() => {
    if (!tokenStorage.hasTokens()) {
      setLoading(false);
      router.push("/signin");
    }
  }, [router, setLoading]);

  if (isLoading && tokenStorage.hasTokens()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-50" />
          <span className="text-sm text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      {children}
      <QuickView />
    </AppShell>
  );
}
