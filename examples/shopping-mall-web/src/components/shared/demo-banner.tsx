"use client";

import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
      <Info className="h-4 w-4 shrink-0" />
      <span>This is a demo account. Create, edit, and delete actions are disabled.</span>
    </div>
  );
}
