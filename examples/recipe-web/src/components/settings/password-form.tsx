"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useChangePassword } from "@/hooks/queries/use-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useDemoGuard } from "@/hooks/use-demo-guard";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const { addToast } = useToast();
  const changePassword = useChangePassword();
  const { isDemoAccount } = useDemoGuard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch("newPassword");

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2) return { label: "Weak", color: "text-destructive" };
    if (strength <= 4) return { label: "Medium", color: "text-amber-500" };
    return { label: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword || "");

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      reset();
      addToast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
        variant: "success",
      });
    } catch (error) {
      addToast({
        variant: "destructive",
        title: "Change failed",
        description: error instanceof Error ? error.message : "Failed to change password",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register("currentPassword")}
          placeholder="Enter current password"
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          {...register("newPassword")}
          placeholder="Enter new password"
        />
        {newPassword && passwordStrength.label && (
          <p className={`text-sm ${passwordStrength.color}`}>
            Password strength: {passwordStrength.label}
          </p>
        )}
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Must include uppercase, lowercase, number, and special character
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm new password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isDemoAccount}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </div>
    </form>
  );
}
