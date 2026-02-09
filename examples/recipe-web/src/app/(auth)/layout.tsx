"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";
import { tokenStorage } from "@/infrastructure/storage/token-storage";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (tokenStorage.hasTokens()) {
      router.replace("/recipes");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-amber-50 dark:bg-stone-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/30">
              <ChefHat className="h-9 w-9 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-stone-900 dark:text-stone-100">
              Recipe App
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
