"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  UtensilsCrossed,
  CalendarDays,
  ShoppingCart,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Recipes", href: "/recipes", icon: ChefHat },
  { name: "Ingredients", href: "/ingredients", icon: UtensilsCrossed },
  { name: "Meal Plans", href: "/meal-plans", icon: CalendarDays },
  { name: "Shopping Lists", href: "/shopping-lists", icon: ShoppingCart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

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
        <div className="flex h-16 items-center justify-between border-b border-orange-200 px-6 dark:border-stone-700">
          <Link href="/recipes" className="flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-orange-600 dark:text-orange-400" />
            <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Recipe App
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

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-stone-600 hover:bg-orange-50 hover:text-orange-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-orange-400"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
