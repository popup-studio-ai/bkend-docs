"use client";

import { use } from "react";
import { ShoppingListView } from "@/components/shopping/shopping-list-view";

export default function ShoppingListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ShoppingListView listId={id} />;
}
