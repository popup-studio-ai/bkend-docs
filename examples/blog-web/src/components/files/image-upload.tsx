"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/hooks/queries/use-files";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const { mutateAsync: upload, isPending, progress } = useUploadFile();
  const { addToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        addToast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, WebP)",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        addToast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
        });
        return;
      }

      try {
        const record = await upload(file);
        onChange(record.url);
        addToast({
          variant: "success",
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
      } catch (error) {
        addToast({
          variant: "destructive",
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Failed to upload image",
        });
      }
    },
    [upload, onChange, addToast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-lg border">
        <div className="relative aspect-video w-full">
          <img
            src={value}
            alt="Cover image"
            className="h-full w-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        isDragging
          ? "border-accent-color bg-accent-color/5"
          : "border-border hover:border-accent-color/50"
      )}
    >
      {isPending ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent-color" />
          <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent-color transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Drag and drop an image or click to upload
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WebP (max 5MB)
          </p>
          <label className="mt-4">
            <Button type="button" variant="outline" size="sm" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
        </>
      )}
    </div>
  );
}
