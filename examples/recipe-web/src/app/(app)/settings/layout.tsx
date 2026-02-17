"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/motion/page-transition";

const tabs = [
  { id: "profile", label: "Profile", href: "/settings" },
  { id: "password", label: "Password", href: "/settings/password" },
  { id: "account", label: "Account", href: "/settings/account" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Settings
          </h1>
          <p className="text-stone-500 mt-1 dark:text-stone-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="border-b border-orange-200 dark:border-stone-700">
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
                      ? "border-orange-600 text-orange-600 dark:border-orange-400 dark:text-orange-400"
                      : "border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-300"
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
  );
}
