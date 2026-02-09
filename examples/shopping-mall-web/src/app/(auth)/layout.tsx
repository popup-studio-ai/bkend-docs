"use client";

import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 dark:bg-slate-50">
            <ShoppingBag className="h-4 w-4 text-white dark:text-slate-900" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            MALL
          </span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
