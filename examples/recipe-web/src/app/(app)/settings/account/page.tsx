"use client";

import { DangerZone } from "@/components/settings/danger-zone";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Account Management
        </h2>
        <p className="text-stone-500 text-sm mt-1 dark:text-stone-400">
          Manage your account settings and data
        </p>
      </div>

      <DangerZone />
    </div>
  );
}
