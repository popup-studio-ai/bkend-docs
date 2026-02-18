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
  ChevronRight,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { DEMO_EMAIL } from "@/lib/constants";

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

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const initials = user?.name ? getInitials(user.name) : "U";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/recipes") {
      return pathname === "/recipes" || (pathname.startsWith("/recipes/") && !pathname.startsWith("/recipes/new"));
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand">
          <ChefHat className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          <span className="text-gradient-brand">Recipe</span>{" "}
          <span className="text-foreground">App</span>
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-3 pt-4">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Main
          </p>
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", active && "text-accent-color")} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {isAuthenticated && (
          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Manage
            </p>
            <div className="space-y-0.5">
              {manageNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active && "text-accent-color")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User profile section */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/50 overflow-hidden",
            pathname.startsWith("/settings") && "bg-accent"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-xs font-semibold text-white">
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
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
