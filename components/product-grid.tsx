"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts, getProductsByCategory } from "@/lib/products";
import type { Category, Product } from "@/lib/types";

const PAGE_SIZE = 12;

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function ProductGrid({
  initialProducts,
  category,
}: {
  initialProducts: Product[];
  category?: Category;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  // The first page (0) is server-rendered, so we resume from page 1.
  const pageRef = useRef(1);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ rootMargin: "600px" });

  // Note: this component is keyed by `category` in the parent, so a filter
  // change remounts a fresh instance — no manual reset effect is needed, and
  // any in-flight loadMore from the previous category dies with its instance.

  const loadMore = useCallback(async () => {
    setLoading(true);
    // Tiny delay so the skeletons register as a real "loading more" beat.
    await new Promise((r) => setTimeout(r, 350));
    const next = category
      ? getProductsByCategory(category, pageRef.current, PAGE_SIZE)
      : getProducts(pageRef.current, PAGE_SIZE);
    pageRef.current += 1;
    setProducts((prev) => [...prev, ...next]);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    if (inView && !loading) {
      void loadMore();
    }
  }, [inView, loading, loadMore]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
        {loading &&
          Array.from({ length: 4 }, (_, i) => <SkeletonCard key={`s-${i}`} />)}
      </div>

      {/* Sentinel: scrolling near this triggers the next page. */}
      <div ref={ref} className="flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading more products</span>
      </div>
    </div>
  );
}
