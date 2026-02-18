"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthGuard } from "@/components/shared/auth-guard";

const tabs = [
  { id: "profile", label: "Profile", href: "/settings" },
  { id: "password", label: "Password", href: "/settings/password" },
  { id: "account", label: "Account", href: "/settings/account" },
];

export function SettingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="border-b">
            <nav className="flex gap-6">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                      "pb-3 border-b-2 transition-colors text-sm font-medium",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="max-w-2xl">{children}</div>
        </div>
      </PageTransition>
    </AuthGuard>
  );
}
