"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { PublicShell } from "./public-shell";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { useMe } from "@/hooks/queries/use-auth";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  /** Content to display when user is not authenticated */
  publicFallback?: React.ReactNode;
}

export function AppShell({ children, publicFallback }: AppShellProps) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  const [hasTokens, setHasTokens] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasTokens(tokenStorage.hasTokens());
  }, []);

  const { data: user, isError, isLoading } = useMe();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  // Clear auth state if token check fails
  useEffect(() => {
    if (mounted && isError && !tokenStorage.hasTokens()) {
      clearUser();
      setHasTokens(false);
    }
  }, [mounted, isError, clearUser]);

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Not authenticated: show public fallback or PublicShell
  if (!hasTokens && !isAuthenticated) {
    if (publicFallback) {
      return <PublicShell>{publicFallback}</PublicShell>;
    }
    return <PublicShell>{children}</PublicShell>;
  }

  // Authenticated but still loading user data
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div
        className={cn(
          "hidden transition-all duration-300 md:block",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <Sidebar />
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
