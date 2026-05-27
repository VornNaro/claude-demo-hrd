import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export default function HomePage() {
  // First page is rendered on the server for a fast first paint; the grid
  // takes over and streams in more as you scroll.
  const initialProducts = getProducts(0, 12);

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
        <h2 className="text-xl font-semibold">All products</h2>
      </div>

      <ProductGrid initialProducts={initialProducts} />
    </div>
  );
}
