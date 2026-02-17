"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChefHat, Loader2, Camera, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { useMe } from "@/hooks/queries/use-auth";
import {
  useUpdateProfile,
  useGetAvatarUploadUrl,
  useUpdateAvatar,
  useChangePassword,
  useDeleteAccount
} from "@/hooks/queries/use-users";
import { cn, getInitials } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter current password"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfileSection() {
  useMe(); // Fetch and sync user data to store
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const getAvatarUploadUrl = useGetAvatarUploadUrl();
  const updateAvatar = useUpdateAvatar();
  const changePasswordMut = useChangePassword();
  const deleteAccountMut = useDeleteAccount();
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Initialize form and avatar when user data loads (once)
  useEffect(() => {
    if (user && !isInitialized) {
      profileForm.reset({
        name: user.name,
      });
      setImageUrl(user.image || "");
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Get presigned URL and s3Key
      const { url, key } = await getAvatarUploadUrl.mutateAsync({
        userId: user.id,
        data: {
          filename: file.name,
          contentType: file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        },
      });

      // 2. Upload file to S3
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(file);
      });

      // 3. Update avatar with s3Key
      const updatedUser = await updateAvatar.mutateAsync({
        userId: user.id,
        data: { s3Key: key },
      });

      setImageUrl(updatedUser.image || "");
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    await updateProfile.mutateAsync({
      userId: user.id,
      data: { name: data.name },
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    await changePasswordMut.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    passwordForm.reset();
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    await deleteAccountMut.mutateAsync(user.id);
  };

  const initials = user?.name ? getInitials(user.name) : "U";

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden border-orange-200 dark:border-stone-700">
        <div className="h-24 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 dark:from-orange-700 dark:via-amber-700 dark:to-orange-600" />
        <CardContent className="relative pt-0 -mt-12 px-6 pb-6">
          {/* Avatar */}
          <div className="relative mb-6 inline-block">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-bold text-white shadow-lg dark:border-stone-800">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={user?.name || "Avatar"}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <label
              className={cn(
                "absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-md transition-colors hover:bg-orange-600 dark:border-stone-800",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
            {isUploading && uploadProgress > 0 && (
              <div className="absolute -bottom-3 left-0 right-0 h-1 overflow-hidden rounded-full bg-orange-100">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  {...profileForm.register("name")}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-red-500">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-stone-50 dark:bg-stone-800"
                />
                <p className="text-xs text-stone-400">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {updateProfile.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Profile
              </Button>
              {profileSuccess && (
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Profile updated successfully
                </span>
              )}
              {updateProfile.isError && (
                <span className="text-sm text-red-500">
                  {(updateProfile.error as Error)?.message || "Update failed"}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card className="border-orange-200 dark:border-stone-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-orange-500" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-red-500">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant="outline"
                disabled={changePasswordMut.isPending}
              >
                {changePasswordMut.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Password
              </Button>
              {passwordSuccess && (
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Password changed successfully
                </span>
              )}
              {changePasswordMut.isError && (
                <span className="text-sm text-red-500">
                  {(changePasswordMut.error as Error)?.message || "Password change failed"}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
            Once you delete your account, all your recipes, meal plans, and
            cooking logs will be permanently removed. This action cannot be
            undone.
          </p>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteAccountMut.isPending}
              >
                {deleteAccountMut.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Yes, delete my account
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
