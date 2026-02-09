"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RecipeListSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { PageTransition } from "@/components/motion/page-transition";
import { useShoppingLists } from "@/hooks/queries/use-shopping-lists";
import { formatDate } from "@/lib/format";
import { motion } from "framer-motion";

export default function ShoppingListsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useShoppingLists(page);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Shopping Lists"
          description="Auto-generate from recipes or create your own"
        >
          <Link href="/shopping-lists/generate">
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              Auto Generate
            </Button>
          </Link>
        </PageHeader>

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<RecipeListSkeleton count={3} />}
          onRetry={() => refetch()}
        >
          {data && data.items.length > 0 ? (
            <div className="space-y-3">
              {data.items.map((list, index) => {
                const progress =
                  list.totalItems > 0
                    ? Math.round(
                        (list.checkedItems / list.totalItems) * 100
                      )
                    : 0;
                const isComplete = progress === 100;

                return (
                  <motion.div
                    key={list.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/shopping-lists/${list.id}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-stone-700">
                              {isComplete ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                              ) : (
                                <ShoppingCart className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                                {list.name}
                              </h3>
                              <p className="text-xs text-stone-500 dark:text-stone-400">
                                {formatDate(list.date)} | {list.totalItems} items
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                                {progress}%
                              </span>
                              <div className="mt-1 h-1.5 w-20 rounded-full bg-orange-100 dark:bg-stone-700">
                                <div
                                  className="h-full rounded-full bg-green-500 transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}

              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.pagination.hasPrev}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-stone-500">
                    {data.pagination.page} / {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingCart}
              title="No shopping lists"
              description="Auto-generate a shopping list from your recipes"
            >
              <Link href="/shopping-lists/generate">
                <Button>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Auto Generate
                </Button>
              </Link>
            </EmptyState>
          )}
        </QueryBoundary>
      </div>
    </PageTransition>
  );
}
