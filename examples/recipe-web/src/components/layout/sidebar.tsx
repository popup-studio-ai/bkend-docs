"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  UtensilsCrossed,
  CalendarDays,
  ShoppingCart,
  LayoutDashboard,
  Plus,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recipes", label: "Recipes", icon: ChefHat },
  { href: "/ingredients", label: "Ingredients", icon: UtensilsCrossed },
];

const manageNav = [
  { href: "/recipes/new", label: "New Recipe", icon: Plus },
  { href: "/meal-plans", label: "Meal Plans", icon: CalendarDays },
  { href: "/shopping-lists", label: "Shopping Lists", icon: ShoppingCart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);

  const initials = user?.name ? getInitials(user.name) : "U";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/recipes") {
      return pathname === "/recipes" || (pathname.startsWith("/recipes/") && !pathname.startsWith("/recipes/new"));
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-orange-200 bg-amber-50 transition-transform duration-300 lg:static lg:translate-x-0 dark:border-stone-700 dark:bg-stone-900",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
              <ChefHat className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-orange-600 dark:text-orange-400">Recipe</span>{" "}
              <span className="text-stone-900 dark:text-stone-100">App</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Separator className="bg-orange-200 dark:bg-stone-700" />

        {/* Navigation */}
        <nav className="flex-1 space-y-6 p-3 pt-4">
          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Main
            </p>
            <div className="space-y-0.5">
              {mainNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-orange-100 text-orange-700 shadow-sm dark:bg-orange-900/30 dark:text-orange-400"
                        : "text-stone-600 hover:bg-orange-50 hover:text-orange-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-orange-400"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active && "text-orange-600 dark:text-orange-400")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Manage
            </p>
            <div className="space-y-0.5">
              {manageNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-orange-100 text-orange-700 shadow-sm dark:bg-orange-900/30 dark:text-orange-400"
                        : "text-stone-600 hover:bg-orange-50 hover:text-orange-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-orange-400"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active && "text-orange-600 dark:text-orange-400")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User profile section */}
        <div className="border-t border-orange-200 p-3 dark:border-stone-700">
          <Link
            href="/settings"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-orange-50 overflow-hidden dark:hover:bg-stone-800",
              pathname.startsWith("/settings") && "bg-orange-100 dark:bg-orange-900/30"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-xs font-semibold text-white">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate text-stone-900 dark:text-stone-100">{user?.name || "User"}</p>
              <p className="text-xs text-stone-500 truncate dark:text-stone-400">{user?.email || ""}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-stone-400 shrink-0 dark:text-stone-500" />
          </Link>
        </div>
      </aside>
    </>
  );
}
