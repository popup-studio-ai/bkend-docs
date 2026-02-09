"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Share2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/shared/price-display";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { ProductGallery } from "./product-gallery";
import { ReviewList } from "@/components/reviews/review-list";
import { useAddToCart } from "@/hooks/queries/use-carts";
import { useUiStore } from "@/stores/ui-store";
import type { ProductDto } from "@/application/dto/product.dto";

interface ProductDetailProps {
  product: ProductDto;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useAddToCart();
  const { openCartDrawer } = useUiStore();

  const handleAddToCart = async () => {
    await addToCart.mutateAsync({ productId: product.id, quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart.mutateAsync({ productId: product.id, quantity });
    openCartDrawer();
    router.push("/checkout");
  };

  const isOutOfStock = !product.isActive || product.stock === 0;

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery imageUrl={product.imageUrl} productName={product.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {product.name}
            </h1>

            <PriceDisplay price={product.price} size="lg" />

            <Separator />

            <div className="prose prose-slate max-w-none text-sm dark:prose-invert">
              <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                {product.description}
              </p>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Stock
              </span>
              {isOutOfStock ? (
                <Badge variant="destructive">Sold Out</Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="warning">{product.stock} left</Badge>
              ) : (
                <Badge variant="success">In Stock</Badge>
              )}
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Quantity
                </span>
                <QuantityStepper
                  value={quantity}
                  max={product.stock}
                  onChange={setQuantity}
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addToCart.isPending}
              >
                {addedToCart ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  Buy Now
                </Button>
              </motion.div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" className="text-slate-500">
                <Heart className="mr-1 h-4 w-4" />
                Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500">
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <section>
        <h2 className="mb-6 text-xl font-extrabold text-slate-900 dark:text-slate-50">
          Product Reviews
        </h2>
        <ReviewList productId={product.id} />
      </section>
    </div>
  );
}
