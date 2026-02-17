"use client";

import { ProfileForm } from "@/components/settings/profile-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Profile Information
        </h2>
        <p className="text-stone-500 text-sm mt-1 dark:text-stone-400">
          Update your profile information and avatar
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
