import Link from "next/link";
import { Package } from "lucide-react";

import { CartSheet } from "@/components/cart-sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg font-bold tracking-tight">SAMSUNG</span>
          <span className="hidden text-sm font-normal text-muted-foreground sm:inline">
            Store
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/orders"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Package />
            <span className="hidden sm:inline">Orders</span>
          </Link>
          <CartSheet />
        </nav>
      </div>
    </header>
  );
}
