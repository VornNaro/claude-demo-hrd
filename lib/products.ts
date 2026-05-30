import { faker } from "@faker-js/faker";
import { CATEGORIES, type Category, type Product } from "./types";

const CATEGORY_IMAGES: Record<Category, string[]> = {
  Smartphones: [
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1605457867610-e990b192e6a0?w=800&h=800&fit=crop&auto=format",
  ],
  Tablets: [
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1632763188414-2e6ba8eb7dd2?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop&auto=format",
  ],
  Watches: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop&auto=format",
  ],
  Earbuds: [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&auto=format",
  ],
  TVs: [
    "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop&auto=format",
  ],
  Monitors: [
    "https://images.unsplash.com/photo-1527443224154-c4a573d5f5a8?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&h=800&fit=crop&auto=format",
  ],
  Laptops: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop&auto=format",
  ],
  Appliances: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&auto=format",
  ],
};

/**
 * Endless, deterministic Samsung-style catalog.
 *
 * Every product is keyed by a global integer index. Before generating one we
 * re-seed faker with that index, so `generateProduct(n)` always returns the
 * exact same product no matter when or where it's called. That stability is
 * what lets the infinite-scroll feed page in more items without reshuffling,
 * and lets a product detail page rebuild a product from just its id.
 */

type CategoryConfig = {
  /** Builds the model name, e.g. "Galaxy S24 Ultra". */
  name: () => string;
  price: [min: number, max: number];
  /** Category-specific spec rows; faker is already seeded when called. */
  specs: () => { label: string; value: string }[];
};

const COLORS = [
  "Phantom Black",
  "Titanium Gray",
  "Cream",
  "Lavender",
  "Graphite",
  "Silver",
  "Mystic Bronze",
  "Sky Blue",
  "Green",
  "Burgundy",
];

const STORAGE = ["128GB", "256GB", "512GB", "1TB"];
const TV_SIZES = [43, 50, 55, 65, 75, 85, 98];
const MONITOR_SIZES = [24, 27, 32, 34, 49];

function pick<T>(items: readonly T[]): T {
  return faker.helpers.arrayElement(items);
}

const CONFIG: Record<Category, CategoryConfig> = {
  Smartphones: {
    name: () =>
      pick([
        `Galaxy S${faker.number.int({ min: 21, max: 25 })} ${pick(["", "+", "Ultra", "FE"])}`,
        `Galaxy Z Fold${faker.number.int({ min: 4, max: 6 })}`,
        `Galaxy Z Flip${faker.number.int({ min: 4, max: 6 })}`,
        `Galaxy A${faker.number.int({ min: 34, max: 73 })}`,
      ]).trim(),
    price: [299, 1799],
    specs: () => [
      { label: "Display", value: `${faker.number.float({ min: 6.1, max: 7.6, fractionDigits: 1 })}" Dynamic AMOLED 2X` },
      { label: "Storage", value: pick(STORAGE) },
      { label: "Battery", value: `${faker.number.int({ min: 3700, max: 5000 })} mAh` },
      { label: "Camera", value: `${pick([50, 108, 200])}MP main` },
    ],
  },
  Tablets: {
    name: () =>
      `Galaxy Tab ${pick(["S", "S", "A"])}${faker.number.int({ min: 8, max: 10 })} ${pick(["", "+", "Ultra", "FE"])}`.trim(),
    price: [199, 1299],
    specs: () => [
      { label: "Display", value: `${faker.number.float({ min: 10.4, max: 14.6, fractionDigits: 1 })}" WQXGA` },
      { label: "Storage", value: pick(STORAGE) },
      { label: "S Pen", value: pick(["Included", "Included", "Sold separately"]) },
      { label: "Battery", value: `${faker.number.int({ min: 7040, max: 11200 })} mAh` },
    ],
  },
  Watches: {
    name: () =>
      `Galaxy Watch${faker.number.int({ min: 5, max: 7 })} ${pick(["", "Classic", "Ultra", "Pro"])}`.trim(),
    price: [199, 649],
    specs: () => [
      { label: "Case", value: `${pick([40, 43, 44, 47])}mm ${pick(["Aluminum", "Titanium", "Stainless"])}` },
      { label: "Display", value: "Super AMOLED, Sapphire Crystal" },
      { label: "Sensors", value: "BioActive (HR, ECG, BIA)" },
      { label: "Battery", value: `${faker.number.int({ min: 300, max: 590 })} mAh` },
    ],
  },
  Earbuds: {
    name: () =>
      `Galaxy Buds${faker.number.int({ min: 2, max: 3 })} ${pick(["Pro", "FE", "Live", ""])}`.trim(),
    price: [89, 249],
    specs: () => [
      { label: "ANC", value: pick(["Active Noise Cancelling", "Intelligent ANC"]) },
      { label: "Audio", value: "24-bit Hi-Fi" },
      { label: "Battery", value: `${faker.number.int({ min: 5, max: 8 })}h (+${faker.number.int({ min: 18, max: 30 })}h case)` },
      { label: "Resistance", value: "IPX7" },
    ],
  },
  TVs: {
    name: () =>
      `${pick([`${pick(TV_SIZES)}"`, `${pick(TV_SIZES)}"`])} ${pick(["Neo QLED", "OLED", "Crystal UHD", "The Frame"])} ${pick(["4K", "8K"])}`,
    price: [499, 4499],
    specs: () => [
      { label: "Resolution", value: pick(["4K UHD", "8K"]) },
      { label: "Refresh", value: `${pick([120, 144])}Hz` },
      { label: "HDR", value: "Quantum HDR" },
      { label: "Smart", value: "Tizen OS, Gaming Hub" },
    ],
  },
  Monitors: {
    name: () =>
      `${pick(MONITOR_SIZES)}" ${pick(["Odyssey OLED", "Odyssey G9", "ViewFinity S9", "Smart Monitor M8"])}`,
    price: [229, 1799],
    specs: () => [
      { label: "Panel", value: pick(["OLED", "QD-OLED", "VA Curved"]) },
      { label: "Resolution", value: pick(["QHD", "4K UHD", "5K", "Dual QHD"]) },
      { label: "Refresh", value: `${pick([100, 144, 165, 240])}Hz` },
      { label: "Ports", value: "HDMI 2.1, USB-C" },
    ],
  },
  Laptops: {
    name: () =>
      `Galaxy Book${faker.number.int({ min: 3, max: 5 })} ${pick(["Pro", "Pro 360", "Ultra", "Edge"])}`,
    price: [749, 2399],
    specs: () => [
      { label: "Display", value: `${pick([14, 16])}" AMOLED` },
      { label: "Processor", value: pick(["Intel Core Ultra 7", "Intel Core Ultra 9", "Snapdragon X Elite"]) },
      { label: "Memory", value: pick(["16GB", "32GB"]) },
      { label: "Storage", value: pick(["512GB SSD", "1TB SSD"]) },
    ],
  },
  Appliances: {
    name: () =>
      pick([
        "Bespoke 4-Door Flex Refrigerator",
        "Bespoke Family Hub Refrigerator",
        "Bespoke AI Laundry Combo",
        "Bespoke Jet Bot AI+ Vacuum",
        "Bespoke AI Oven",
      ]),
    price: [399, 3999],
    specs: () => [
      { label: "Connectivity", value: "SmartThings, Wi-Fi" },
      { label: "Finish", value: pick(["Stainless", "Matte Black", "White Glass"]) },
      { label: "Energy", value: "ENERGY STAR certified" },
      { label: "Warranty", value: `${pick([1, 2, 10])}-year` },
    ],
  },
};

const FEATURES = [
  "Galaxy AI built in",
  "SmartThings ecosystem ready",
  "Knox security",
  "Fast wireless charging",
  "Eco-conscious recycled materials",
  "Seamless multi-device connectivity",
];

export function generateProduct(index: number): Product {
  // Offset keeps index 0 from being faker's "unseeded" default state.
  faker.seed(index + 1_000);

  const category = CATEGORIES[index % CATEGORIES.length];
  const config = CONFIG[category];
  const name = config.name();
  const [min, max] = config.price;
  const price = faker.number.int({ min, max });

  // Cycle the per-category images by category-LOCAL position, not the global
  // index. Using the global index here means `index % images.length` only
  // advances when gcd(CATEGORIES.length, images.length) === 1 — e.g. with
  // 8 categories and a 4-image array, every product in that slot would get
  // image[0]. Local position dodges the gcd trap regardless of array size.
  const images = CATEGORY_IMAGES[category];
  const localPos = Math.floor(index / CATEGORIES.length);

  return {
    id: String(index),
    name,
    category,
    price,
    image: images[localPos % images.length],
    rating: faker.number.float({ min: 3.8, max: 5, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 12, max: 5400 }),
    colors: faker.helpers.arrayElements(COLORS, { min: 2, max: 4 }),
    description: `The ${name} brings Samsung's latest innovation to your everyday life. ${faker.helpers.arrayElement(FEATURES)} and ${faker.helpers.arrayElement(FEATURES).toLowerCase()} make it a standout in the ${category.toLowerCase()} lineup.`,
    specs: config.specs(),
  };
}

/** Returns one page of the infinite catalog. `page` is zero-based. */
export function getProducts(page: number, pageSize = 12): Product[] {
  const start = page * pageSize;
  return Array.from({ length: pageSize }, (_, i) => generateProduct(start + i));
}

/**
 * Returns one page of products from a single category. `page` is zero-based.
 *
 * Because the catalog rotates categories round-robin (index % CATEGORIES.length),
 * the n-th product of category at slot `c` lives at global index `c + n * 8`.
 */
export function getProductsByCategory(
  category: Category,
  page: number,
  pageSize = 12,
): Product[] {
  const catIndex = CATEGORIES.indexOf(category);
  const start = page * pageSize;
  return Array.from({ length: pageSize }, (_, i) =>
    generateProduct(catIndex + (start + i) * CATEGORIES.length),
  );
}

/** Rebuilds a single product from its id, or null if the id isn't valid. */
export function getProductById(id: string): Product | null {
  const index = Number(id);
  if (!Number.isInteger(index) || index < 0) return null;
  return generateProduct(index);
}
