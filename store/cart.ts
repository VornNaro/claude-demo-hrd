import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  persistedCartSchema,
  type CartItem,
  type Customer,
  type Order,
  type Product,
} from "@/lib/types";

type CartState = {
  items: CartItem[];
  orders: Order[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  /** Snapshots the current cart into an order, then empties the cart. */
  placeOrder: (customer: Customer) => Order;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],

      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          const item: CartItem = {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            qty,
          };
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clear: () => set({ items: [] }),

      placeOrder: (customer) => {
        const items = get().items;
        const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const order: Order = {
          id: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString(),
          items,
          total,
          customer,
        };
        set((state) => ({ orders: [order, ...state.orders], items: [] }));
        return order;
      },
    }),
    {
      name: "samsung-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, orders: state.orders }),
      // Validate whatever we read back from localStorage; discard if corrupt
      // or from an incompatible older shape rather than crashing on hydrate.
      merge: (persisted, current) => {
        const parsed = persistedCartSchema.safeParse(persisted);
        return parsed.success ? { ...current, ...parsed.data } : current;
      },
    }
  )
);

// Derived selectors — kept as hooks so components only re-render on changes.
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));

export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0));
