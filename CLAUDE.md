# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Read the warning above first.** This repo runs a modified Next.js (16.x) whose
> APIs may differ from training data. Before writing any Next.js-specific code
> (routing, server/client components, config, caching), read the relevant guide in
> `node_modules/next/dist/docs/` — the `01-app/` tree covers the App Router used here.

## Commands

```bash
npm run dev      # Start the dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Serve the production build (run build first)
npm run lint     # ESLint (eslint-config-next)
```

There is no test framework configured in this project.

## What this is

A demo Samsung storefront. There is **no backend and no database** — the entire
product catalog is generated on the fly, and the only persisted state (cart +
orders) lives in the browser's localStorage. Type checking is via TypeScript;
path alias `@/*` maps to the repo root.

## Project structure

```
app/                      # Next.js App Router
├── layout.tsx            # Root layout: Header, footer, <Toaster>
├── page.tsx              # Home — server-renders first catalog page
├── product/[id]/page.tsx # Product detail (rebuilt from id)
├── cart/page.tsx         # Cart
├── checkout/page.tsx     # Checkout form (Zod + react-hook-form)
└── orders/page.tsx       # Order history
components/               # App-specific components (header, product-card, …)
└── ui/                   # shadcn/ui primitives (button, sheet, card, …)
lib/
├── products.ts           # Deterministic faker-seeded catalog generator
├── types.ts              # Domain types + Zod schemas (source of truth)
├── format.ts             # Price/number formatting helpers
└── utils.ts              # cn() + misc utilities
store/cart.ts             # Zustand cart/orders store (persisted to localStorage)
hooks/use-hydrated.ts     # Client-mount gate to avoid hydration mismatch
```

## Architecture

**Deterministic generated catalog (`lib/products.ts`)** — the core idea everything
else depends on. Every product is keyed by an integer index; `generateProduct(n)`
re-seeds faker with that index (`faker.seed(index + 1000)`) before building the
product, so the same index *always* yields the same product. This single property
is what makes the rest work without a data store:
- `app/page.tsx` server-renders products 0–11 for fast first paint.
- `components/product-grid.tsx` (client) resumes infinite scroll from page 1 using
  a `react-intersection-observer` sentinel — no reshuffling because generation is stable.
- `getProductById(id)` rebuilds any product detail page from just the id in the URL.

If you change generation logic, you change the identity of every existing product
(and any cart snapshot's display data) — treat the index→product mapping as a
stable contract.

**Cart state (`store/cart.ts`)** — a Zustand store with the `persist` middleware
writing to localStorage under key `samsung-store`. Two design choices to preserve:
- Line items **snapshot** product fields (name, price, image, …) rather than
  storing only an id, so a cart stays intact even if catalog generation changes.
- On rehydrate, the persisted blob is validated with a Zod schema
  (`persistedCartSchema` in `lib/types.ts`); malformed or incompatible data is
  **discarded**, not crashed on. Bump/adjust the schema when changing persisted shape.
- `placeOrder` snapshots the current cart into an order and clears the cart.
- Derived values (`useCartCount`, `useCartTotal`) are exported as selector hooks so
  components re-render only on the slice they read.

**SSR / hydration discipline** — because cart state is client-only (localStorage),
any UI that reflects it must avoid server/client markup mismatch. Use the
`useHydrated()` hook (`hooks/use-hydrated.ts`) to gate persisted-state-dependent UI
until after mount. Server components await route `params` as a Promise (see
`app/product/[id]/page.tsx`) — this is the Next 16 convention in use here.

**Types & validation (`lib/types.ts`)** — single source of truth for domain types.
Zod schemas (`cartItemSchema`, `checkoutSchema`, `orderSchema`, `persistedCartSchema`)
back both the runtime validation and the inferred TypeScript types; checkout forms
use these schemas via `@hookform/resolvers`.

**UI** — shadcn/ui components (built on `@base-ui/react`) live in `components/ui/`;
app-specific components sit directly in `components/`. Tailwind v4. Toasts via
`sonner` (the `<Toaster>` is mounted once in `app/layout.tsx`). Remote product
images come from `picsum.photos`, which is allow-listed in `next.config.ts` — any
new external image host must be added there.
