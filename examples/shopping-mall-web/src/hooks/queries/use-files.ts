"use client";

import { useMutation } from "@tanstack/react-query";
import { filesApi } from "@/lib/api/files";

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => filesApi.uploadFile(file),
  });
}
