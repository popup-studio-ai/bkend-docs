"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="rounded-full bg-orange-100 p-4 dark:bg-stone-800">
        <Icon className="h-8 w-8 text-orange-500 dark:text-orange-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
