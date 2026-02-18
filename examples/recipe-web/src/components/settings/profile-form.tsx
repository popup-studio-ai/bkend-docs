"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Upload, Loader2 } from "lucide-react";
import { useMe } from "@/hooks/queries/use-auth";
import { useUpdateProfile, useGetAvatarUploadUrl, useUpdateAvatar } from "@/hooks/queries/use-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useDemoGuard } from "@/hooks/use-demo-guard";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { data: user } = useMe();
  const { addToast } = useToast();
  const updateProfile = useUpdateProfile();
  const getUploadUrl = useGetAvatarUploadUrl();
  const updateAvatar = useUpdateAvatar();
  const [imageUrl, setImageUrl] = useState(user?.image);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { isDemoAccount } = useDemoGuard();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Sync imageUrl when user updates
  useEffect(() => {
    if (user?.image) {
      setImageUrl(user.image);
    }
  }, [user?.image]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    setIsUploadingAvatar(true);
    try {
      // 1. Request presigned URL
      const { url, key } = await getUploadUrl.mutateAsync({
        userId: user.id,
        data: {
          filename: file.name,
          contentType: file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        },
      });

      // 2. Upload to S3
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Update avatar with s3Key
      const updatedUser = await updateAvatar.mutateAsync({
        userId: user.id,
        data: { s3Key: key },
      });

      setImageUrl(updatedUser.image || "");

      addToast({
        title: "Avatar uploaded",
        description: "Your avatar has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      addToast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          name: data.name,
        },
      });

      addToast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      addToast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user.email} disabled className="bg-muted" />
        <p className="text-sm text-muted-foreground">
          Email cannot be changed
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.avatar)}
                alt="Avatar"
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
              className="hidden"
              id="avatar-upload"
            />
            <Label htmlFor="avatar-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingAvatar || isDemoAccount}
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Avatar
                  </>
                )}
              </Button>
            </Label>
          </div>
        </div>
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
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
