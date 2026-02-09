"use client";

import { useEffect } from "react";
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
  const { isAuthenticated, isLoading } = useAuthStore();
  useMe();

  useEffect(() => {
    if (!tokenStorage.hasTokens()) {
      router.replace("/signin");
    }
  }, [router]);

  if (!tokenStorage.hasTokens()) {
    return null;
  }

  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-amber-50 dark:bg-stone-900">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
