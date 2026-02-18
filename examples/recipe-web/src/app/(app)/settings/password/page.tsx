"use client";

import { PasswordForm } from "@/components/settings/password-form";

export default function PasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Change Password
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <PasswordForm />
    </div>
  );
}
