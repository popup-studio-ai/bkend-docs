"use client";

import { ProfileForm } from "@/components/settings/profile-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Profile Information
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Update your profile information and avatar
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
