"use client";

import { PasswordForm } from "@/components/settings/password-form";

export default function PasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Change Password
        </h2>
        <p className="text-stone-500 text-sm mt-1 dark:text-stone-400">
          Update your password to keep your account secure
        </p>
      </div>

      <PasswordForm />
    </div>
  );
}
