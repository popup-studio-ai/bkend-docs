"use client";

import { useCallback, useState, useRef } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/hooks/queries/use-files";
import { cn } from "@/lib/utils";
import { MAX_IMAGE_SIZE } from "@/lib/constants";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, className, disabled }: ImageUploadProps) {
  const { mutateAsync: upload, isPending, progress } = useUploadFile();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_IMAGE_SIZE) return;

      try {
        const record = await upload(file);
        onChange(record.key);
      } catch {
        // Upload failed silently
      }
    },
    [upload, onChange]
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

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (value) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl border border-border", className)}>
        <div className="relative aspect-[4/3] w-full">
          <img
            src={getOptimizedImageUrl(value, IMAGE_PRESETS.detail)}
            alt="Recipe image"
            className="h-full w-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <div
        onDrop={disabled ? undefined : handleDrop}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onClick={disabled ? undefined : () => inputRef.current?.click()}
        className={cn(
          "flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200",
          disabled
            ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
            : isDragging
              ? "cursor-pointer border-orange-500 bg-orange-50 shadow-[0_0_0_4px_rgba(249,115,22,0.1)] dark:bg-orange-900/10"
              : "cursor-pointer border-border bg-muted/50 hover:border-orange-400 hover:bg-accent"
        )}
      >
        {isPending ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm text-muted-foreground">
              Uploading... {progress}%
            </p>
            <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Drag and drop an image or click to upload
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, WebP (max 5MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
