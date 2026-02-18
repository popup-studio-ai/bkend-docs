"use client";

import { DangerZone } from "@/components/settings/danger-zone";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Account Management
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account settings and data
        </p>
      </div>

      <DangerZone />
    </div>
  );
}
