"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { ProductList } from "@/components/products/product-grid";
import { ProductForm } from "@/components/products/product-form";
import { DemoBanner } from "@/components/shared/demo-banner";
import { useAuthStore } from "@/stores/auth-store";
import { useDemoGuard } from "@/hooks/use-demo-guard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? undefined;
  const searchFromUrl = searchParams.get("q") ?? undefined;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isDemoAccount } = useDemoGuard();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="space-y-6">
        {isDemoAccount && <DemoBanner />}

        <PageHeader
          title="Products"
          description="Discover a wide range of products"
        >
          {isAuthenticated && (
            <Button
              onClick={() => setIsFormOpen(true)}
              disabled={isDemoAccount}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </PageHeader>

        <ProductList
          key={`${categoryFromUrl ?? "all"}-${searchFromUrl ?? ""}`}
          initialCategory={categoryFromUrl}
          initialSearch={searchFromUrl}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Register a new product
              </DialogDescription>
            </DialogHeader>
            <ProductForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
