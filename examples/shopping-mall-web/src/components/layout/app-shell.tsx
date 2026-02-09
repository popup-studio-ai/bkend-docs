"use client";

import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";
import { CartDrawer } from "./cart-drawer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Topbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <CartDrawer />
    </div>
  );
}
