"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Headphones,
  Home,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Watch,
  LayoutGrid,
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

export function CategoryFilter({ selected }: { selected?: Category }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(category?: Category) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => navigate(undefined)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
          !selected
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
        )}
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
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {category}
          </button>
        );
      })}
    </div>
  );
}
