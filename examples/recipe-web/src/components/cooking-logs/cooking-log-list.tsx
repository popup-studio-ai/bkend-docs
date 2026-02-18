"use client";

import { useState } from "react";
import { Trash2, Loader2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StarRating } from "./star-rating";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import {
  useCookingLogs,
  useDeleteCookingLog,
} from "@/hooks/queries/use-cooking-logs";
import { calculateAverageRating } from "@/lib/api/cooking-logs";
import { formatDate } from "@/lib/format";
import { useDemoGuard } from "@/hooks/use-demo-guard";

interface CookingLogListProps {
  recipeId: string;
}

export function CookingLogList({ recipeId }: CookingLogListProps) {
  const { data, isLoading, isError, error, refetch } =
    useCookingLogs(recipeId);
  const deleteCookingLog = useDeleteCookingLog(recipeId);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { isDemoAccount } = useDemoGuard();

  const handleDelete = async (id: string) => {
    await deleteCookingLog.mutateAsync(id);
    setDeleteId(null);
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingFallback={<TableSkeleton rows={3} />}
      onRetry={() => refetch()}
    >
      {data && (
        <div className="space-y-4">
          {/* Stats summary */}
          {data.items.length > 0 && (
            <div className="flex items-center gap-4 rounded-lg bg-accent px-4 py-3">
              <div className="flex items-center gap-2">
                <StarRating
                  value={Math.round(calculateAverageRating(data.items))}
                  readonly
                  size="sm"
                />
                <span className="text-sm font-medium text-foreground">
                  {calculateAverageRating(data.items)}
                </span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-sm text-muted-foreground">
                {data.items.length} times cooked
              </span>
            </div>
          )}

          {/* Log list */}
          {data.items.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No cooking logs yet"
              description="Try cooking this recipe and leave a log!"
            />
          ) : (
            <ul className="space-y-3">
              {data.items.map((log) => (
                <li
                  key={log.id}
                  className="flex items-start justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <StarRating value={log.rating} readonly size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(log.cookedAt, "yyyy.MM.dd")}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-muted-foreground">
                        {log.notes}
                      </p>
                    )}
                  </div>

                  <Dialog
                    open={deleteId === log.id}
                    onOpenChange={(open) => setDeleteId(open ? log.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0" disabled={isDemoAccount}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Log</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this cooking log? This action
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(log.id)}
                          disabled={deleteCookingLog.isPending}
                        >
                          {deleteCookingLog.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </QueryBoundary>
  );
}
