"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Bookmark,
  Tag,
  PenSquare,
  LayoutDashboard,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

const manageNav = [
  { href: "/articles/new", label: "New Article", icon: PenSquare },
  { href: "/tags", label: "Tags", icon: Tag },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // Exact match for /articles to avoid conflict with /articles/new
    if (href === "/articles") {
      return pathname === "/articles" || (pathname.startsWith("/articles/") && !pathname.startsWith("/articles/new"));
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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          <span className="text-gradient-brand">bkend</span>{" "}
          <span className="text-foreground">Blog</span>
        </span>
      </div>

      <Separator />

      {/* Main Navigation */}
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
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
      </nav>

      {/* User profile section */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50 overflow-hidden",
            pathname.startsWith("/settings") && "bg-accent"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs bg-gradient-brand text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
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
