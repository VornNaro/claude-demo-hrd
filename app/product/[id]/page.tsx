import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to catalog
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="animate-in fade-in zoom-in-95 relative aspect-square overflow-hidden rounded-2xl bg-muted duration-500">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-4 delay-100 duration-500 fill-mode-both">
          <div>
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="mt-2">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>
          </div>

          <p className="text-3xl font-semibold">{formatPrice(product.price)}</p>

          <p className="text-muted-foreground">{product.description}</p>

          <div>
            <p className="mb-2 text-sm font-medium">Colors</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Badge key={color} variant="outline">
                  {color}
                </Badge>
              ))}
            </div>
          </div>

          <AddToCartButton product={product} size="lg" className="w-full sm:w-auto" />

          <Separator className="my-2" />

          <div>
            <h2 className="mb-3 font-semibold">Specifications</h2>
            <dl className="divide-y rounded-lg border">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-4 px-4 py-2.5 text-sm"
                >
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
