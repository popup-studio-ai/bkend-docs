"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  loadingFallback: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function QueryBoundary({
  isLoading,
  isError,
  error,
  loadingFallback,
  onRetry,
  children,
}: QueryBoundaryProps) {
  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (isError) {
    const message =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "Failed to load data.";

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Something went wrong
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {message}
        </p>
        {onRetry && (
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
