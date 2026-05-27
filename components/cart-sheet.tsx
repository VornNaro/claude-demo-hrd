"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore, useCartCount, useCartTotal } from "@/store/cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export function CartSheet() {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const count = useCartCount();
  const total = useCartTotal();

  const badgeClass =
    "absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground";

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open cart"
          />
        }
      >
        <ShoppingCart />
        {hydrated &&
          count > 0 &&
          (reduce ? (
            <span className={badgeClass}>{count > 99 ? "99+" : count}</span>
          ) : (
            // Re-keying on `count` remounts the badge, so it springs on every
            // quantity change — visual weight for "added to cart".
            <motion.span
              key={count}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className={badgeClass}
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          ))}
      </SheetTrigger>

      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Your cart{hydrated && count > 0 ? ` (${count})` : ""}
          </SheetTitle>
        </SheetHeader>
        <Separator />

        {!hydrated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {hydrated ? "Your cart is empty." : "Loading cart…"}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y">
              <AnimatePresence initial={false}>
                {items.map((item) =>
                  reduce ? (
                    <li key={item.id} className="overflow-hidden">
                      <CartRow
                        item={item}
                        setQty={setQty}
                        removeItem={removeItem}
                      />
                    </li>
                  ) : (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <CartRow
                        item={item}
                        setQty={setQty}
                        removeItem={removeItem}
                      />
                    </motion.li>
                  )
                )}
              </AnimatePresence>
            </ul>
          </div>
        )}

        {hydrated && items.length > 0 && (
          <SheetFooter>
            <Separator />
            <div className="flex items-center justify-between py-2 text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <SheetClose
              render={
                <Link
                  href="/checkout"
                  className={cn(buttonVariants({ size: "lg" }))}
                />
              }
            >
              Checkout
            </SheetClose>
            <SheetClose
              render={
                <Link
                  href="/cart"
                  className={cn(buttonVariants({ variant: "outline" }))}
                />
              }
            >
              View full cart
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartRow({
  item,
  setQty,
  removeItem,
}: {
  item: CartItem;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 p-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${item.id}`}
            className="line-clamp-2 text-sm font-medium hover:underline"
          >
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            className="text-muted-foreground transition-colors hover:text-destructive"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => setQty(item.id, item.qty - 1)}
              aria-label="Decrease quantity"
            >
              <Minus />
            </Button>
            <span className="w-6 text-center text-sm tabular-nums">
              {item.qty}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => setQty(item.id, item.qty + 1)}
              aria-label="Increase quantity"
            >
              <Plus />
            </Button>
          </div>
          <span className="text-sm font-semibold">
            {formatPrice(item.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}
