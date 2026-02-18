"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/hooks/queries/use-files";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  className?: string;
}

export function ImageUpload({ currentUrl, onUpload, className }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const uploadFile = useUploadFile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const url = await uploadFile.mutateAsync(file);
      onUpload(url);
      setPreview(url);
    } catch {
      setPreview(currentUrl || null);
    }

    URL.revokeObjectURL(objectUrl);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative inline-block">
          <img
            src={getOptimizedImageUrl(preview, IMAGE_PRESETS.thumbnail)}
            alt="Preview"
            className="h-40 w-40 rounded-md border border-border object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
          {uploadFile.isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
        >
          {uploadFile.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">Upload Image</span>
            </>
          )}
        </button>
      )}

      {!preview && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadFile.isPending}
        >
          <Upload className="mr-2 h-3 w-3" />
          Choose File
        </Button>
      )}
    </div>
  );
}
