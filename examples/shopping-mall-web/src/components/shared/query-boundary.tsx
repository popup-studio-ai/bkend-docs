"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  loadingFallback?: React.ReactNode;
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
    return <>{loadingFallback || <DefaultLoadingFallback />}</>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/30">
        <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          An error occurred
        </h3>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error?.message || "There was a problem loading the data."}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-50" />
    </div>
  );
}
