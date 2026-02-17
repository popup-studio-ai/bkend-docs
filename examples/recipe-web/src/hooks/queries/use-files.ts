"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/lib/api/files";
import { useState } from "react";

export function useUploadFile() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (file: File) => uploadFile(file, setProgress),
    onSettled: () => {
      setProgress(0);
    },
  });

  return {
    ...mutation,
    progress,
  };
}
