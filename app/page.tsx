import { Suspense } from "react";

import { CategoryFilter } from "@/components/category-filter";
import { ProductGrid } from "@/components/product-grid";
import { getProducts, getProductsByCategory } from "@/lib/products";
import { isCategory } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const category = isCategory(rawCategory) ? rawCategory : undefined;

  const initialProducts = category
    ? getProductsByCategory(category, 0, 12)
    : getProducts(0, 12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="animate-hero-gradient mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-950 via-blue-950 to-neutral-800 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <h1 className="animate-in fade-in slide-in-from-bottom-3 text-3xl font-bold tracking-tight duration-700 sm:text-5xl">
          The endless Samsung catalog
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-3 mx-auto mt-4 max-w-xl text-neutral-300 delay-150 duration-700 fill-mode-both">
          Phones, tablets, watches, TVs and more — keep scrolling, it never
          runs out.
        </p>
      </section>

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">{category ?? "All products"}</h2>
      </div>

      <Suspense>
        <CategoryFilter selected={category} />
      </Suspense>

      {/*
       * Keying on category remounts the grid on filter change, so the
       * pageRef/products state and any in-flight loadMore from the previous
       * category are discarded by construction — no race, no manual reset.
       */}
      <ProductGrid
        key={category ?? "all"}
        initialProducts={initialProducts}
        category={category}
      />
    </div>
  );
}
