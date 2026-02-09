"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  loadingFallback: React.ReactNode;
  children: React.ReactNode;
  onRetry?: () => void;
}

export function QueryBoundary({
  isLoading,
  isError,
  error,
  loadingFallback,
  children,
  onRetry,
}: QueryBoundaryProps) {
  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">An error occurred</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || "There was a problem loading the data."}
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
