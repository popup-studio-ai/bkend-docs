"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/hooks/queries/use-files";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadFile();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // 3-step upload
    try {
      const metadata = await upload.mutateAsync(file);
      onChange(metadata.url);
    } catch {
      setPreview(value || null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {preview ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-orange-200 dark:border-stone-700">
          <Image
            src={preview}
            alt="Recipe image"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          {upload.isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 text-stone-500 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-800/50 dark:hover:border-stone-600 dark:hover:text-orange-400"
        >
          {upload.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <ImagePlus className="h-8 w-8" />
          )}
          <span className="text-sm">
            {upload.isPending ? "Uploading..." : "Select an image"}
          </span>
        </button>
      )}
    </div>
  );
}
