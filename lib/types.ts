import { z } from "zod";

/**
 * Product categories the storefront generates. The order here is also the
 * rotation order used by the infinite catalog generator in `products.ts`.
 */
export const CATEGORIES = [
  "Smartphones",
  "Tablets",
  "Watches",
  "Earbuds",
  "TVs",
  "Monitors",
  "Laptops",
  "Appliances",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Type guard: narrows an unknown URL/search-param value to a Category. */
export function isCategory(value: unknown): value is Category {
  return (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  );
}

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  colors: string[];
  description: string;
  specs: { label: string; value: string }[];
};

/**
 * What we actually persist per line item — a snapshot of the product at the
 * moment it was added, plus a quantity. We snapshot instead of storing only an
 * id so a cart survives even if the generation logic later changes.
 */
export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number().nonnegative(),
  image: z.string(),
  qty: z.number().int().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const checkoutSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(4, "Enter your street address"),
  city: z.string().min(2, "Enter your city"),
  zip: z.string().min(3, "Enter a valid postal code"),
});

export type Customer = z.infer<typeof checkoutSchema>;

export const orderSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  items: z.array(cartItemSchema),
  total: z.number().nonnegative(),
  customer: checkoutSchema,
});

export type Order = z.infer<typeof orderSchema>;

/**
 * Shape of the slice we write to localStorage. Used to validate (and discard)
 * anything malformed when rehydrating the Zustand store.
 */
export const persistedCartSchema = z.object({
  items: z.array(cartItemSchema),
  orders: z.array(orderSchema),
});

export type PersistedCart = z.infer<typeof persistedCartSchema>;
