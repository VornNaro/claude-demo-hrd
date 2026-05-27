"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const reduce = useReducedMotion();

  const card = (
    <Card className="group h-full overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <Badge variant="secondary" className="absolute left-2 top-2">
            {product.category}
          </Badge>
        </div>
      </Link>

      <CardContent className="flex flex-col gap-1.5">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-1 font-medium hover:underline">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <p className="text-lg font-semibold">{formatPrice(product.price)}</p>
      </CardContent>

      <CardFooter>
        <AddToCartButton product={product} size="sm" className="w-full" />
      </CardFooter>
    </Card>
  );

  if (reduce) {
    return card;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      // Small per-position delay so a row that scrolls in together cascades.
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: Math.min((index % 12) * 0.04, 0.4),
      }}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {card}
    </motion.div>
  );
}
