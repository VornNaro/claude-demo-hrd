"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const hydrated = useHydrated();
  const orders = useCartStore((s) => s.orders);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted-foreground">
        Loading orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-20 text-center">
        <Package className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <p className="text-muted-foreground">
          Orders you place will appear here.
        </p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your orders</h1>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()} ·{" "}
                    {order.customer.name}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(order.total)}</p>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-0">
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <Link
                      href={`/product/${item.id}`}
                      className="flex-1 text-sm hover:underline"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      × {item.qty}
                    </span>
                    <span className="w-20 text-right text-sm font-medium">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
