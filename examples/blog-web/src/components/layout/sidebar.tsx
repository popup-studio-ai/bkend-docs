"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Bookmark,
  Tag,
  PenSquare,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/articles/new", label: "New Article", icon: PenSquare },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card",
        className
      )}
    >
      <div className="flex h-14 items-center gap-2 px-6">
        <Home className="h-5 w-5 text-accent-color" />
        <span className="text-lg font-bold">Blog</span>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">
          bkend Blog Demo
        </p>
      </div>
    </aside>
  );
}
