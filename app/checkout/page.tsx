"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useCartTotal } from "@/store/cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { checkoutSchema, type Customer } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const placeOrder = useCartStore((s) => s.placeOrder);
  const total = useCartTotal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Customer>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: Customer) => {
    const order = placeOrder(data);
    toast.success("Order placed!", {
      description: `Confirmation ${order.id}`,
    });
    router.push("/orders");
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-muted-foreground">
        Loading checkout…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Nothing to check out</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          Browse products
        </Link>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Full name", placeholder: "Jane Doe", type: "text" },
    { name: "email", label: "Email", placeholder: "jane@example.com", type: "email" },
    { name: "address", label: "Street address", placeholder: "123 Galaxy Ave", type: "text" },
    { name: "city", label: "City", placeholder: "Seoul", type: "text" },
    { name: "zip", label: "Postal code", placeholder: "06236", type: "text" },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <h2 className="font-semibold">Shipping details</h2>
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                aria-invalid={!!errors[field.name]}
                {...register(field.name)}
              />
              {errors[field.name] && (
                <p className="text-sm text-destructive">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" size="lg" disabled={isSubmitting}>
            Place order · {formatPrice(total)}
          </Button>
          <p className="text-xs text-muted-foreground">
            This is a demo — no payment is taken and no data leaves your browser.
          </p>
        </form>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardContent className="flex flex-col gap-3">
            <h2 className="font-semibold">Order summary</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="line-clamp-1 text-muted-foreground">
                    {item.name} × {item.qty}
                  </span>
                  <span className="shrink-0">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
