"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { PageTransition } from "@/components/motion/page-transition";
import { ShoppingItem } from "./shopping-item";
import {
  useShoppingList,
  useUpdateShoppingList,
  useDeleteShoppingList,
} from "@/hooks/queries/use-shopping-lists";
import { formatDate } from "@/lib/format";

interface ShoppingListViewProps {
  listId: string;
}

export function ShoppingListView({ listId }: ShoppingListViewProps) {
  const router = useRouter();
  const { data: list, isLoading, isError, error, refetch } =
    useShoppingList(listId);
  const updateList = useUpdateShoppingList();
  const deleteList = useDeleteShoppingList();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleToggleItem = async (index: number) => {
    if (!list) return;

    const updatedItems = list.items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    const checkedItems = updatedItems.filter((i) => i.checked).length;

    await updateList.mutateAsync({
      id: listId,
      data: {
        items: updatedItems,
        checkedItems,
      },
    });
  };

  const handleDelete = async () => {
    await deleteList.mutateAsync(listId);
    router.push("/shopping-lists");
  };

  const progress = list
    ? list.totalItems > 0
      ? Math.round((list.checkedItems / list.totalItems) * 100)
      : 0
    : 0;

  return (
    <PageTransition>
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<DetailSkeleton />}
        onRetry={() => refetch()}
      >
        {list && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.push("/shopping-lists")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Button>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Shopping List</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete &quot;{list.name}&quot;?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteList.isPending}
                    >
                      {deleteList.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    {list.name}
                  </h2>
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    {formatDate(list.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-orange-100 dark:bg-stone-700">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    {list.checkedItems}/{list.totalItems}
                  </span>
                  {progress === 100 && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Item list */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-orange-500" />
                  Items to Buy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {list.items.length > 0 ? (
                  <div className="space-y-1">
                    {/* Unchecked items */}
                    {list.items
                      .filter((item) => !item.checked)
                      .map((item, idx) => {
                        const originalIndex = list.items.indexOf(item);
                        return (
                          <ShoppingItem
                            key={`${item.name}-${item.unit}`}
                            item={item}
                            index={idx}
                            onToggle={() => handleToggleItem(originalIndex)}
                          />
                        );
                      })}

                    {/* Separator */}
                    {list.items.some((i) => i.checked) &&
                      list.items.some((i) => !i.checked) && (
                        <Separator className="my-3" />
                      )}

                    {/* Checked items */}
                    {list.items
                      .filter((item) => item.checked)
                      .map((item, idx) => {
                        const originalIndex = list.items.indexOf(item);
                        return (
                          <ShoppingItem
                            key={`checked-${item.name}-${item.unit}`}
                            item={item}
                            index={idx}
                            onToggle={() => handleToggleItem(originalIndex)}
                          />
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-center text-sm text-stone-400 py-8">
                    No items
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </QueryBoundary>
    </PageTransition>
  );
}
