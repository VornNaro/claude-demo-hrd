"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Headphones,
  Home,
  Laptop,
  LayoutGrid,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Watch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CATEGORIES, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  Smartphones: Smartphone,
  Tablets: Tablet,
  Watches: Watch,
  Earbuds: Headphones,
  TVs: Tv,
  Monitors: Monitor,
  Laptops: Laptop,
  Appliances: Home,
};

const PILL_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors";

function pillClass(active: boolean): string {
  return cn(
    PILL_BASE,
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
  );
}

export function CategoryFilter({ selected }: { selected?: Category }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(category?: Category) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => navigate(undefined)}
        aria-pressed={!selected}
        className={pillClass(!selected)}
      >
        <LayoutGrid className="size-3.5" />
        All
      </button>

      {CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category];
        const active = selected === category;
        return (
          <button
            key={category}
            onClick={() => navigate(category)}
            aria-pressed={active}
            className={pillClass(active)}
          >
            <Icon className="size-3.5" />
            {category}
          </button>
        );
      })}
    </div>
  );
}
