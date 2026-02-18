"use client";

import Link from "next/link";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useSignOut } from "@/hooks/queries/use-auth";
import { useUIStore } from "@/stores/ui-store";
export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const signOut = useSignOut();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);

  const initials = user?.name ? getInitials(user.name) : "U";

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs bg-gradient-brand text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/account">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
