"use client";

import { motion, useReducedMotion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  className,
  size = "default",
}: {
  product: Product;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const reduce = useReducedMotion();
  const addItem = useCartStore((s) => s.addItem);

  const onClick = () => {
    addItem(product);
    toast.success("Added to cart", { description: product.name });
  };

  if (reduce) {
    return (
      <Button size={size} className={className} onClick={onClick}>
        <ShoppingCart />
        Add to cart
      </Button>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.96 }} className={cn("inline-flex", className)}>
      <Button size={size} className="w-full" onClick={onClick}>
        <ShoppingCart />
        Add to cart
      </Button>
    </motion.div>
  );
}
