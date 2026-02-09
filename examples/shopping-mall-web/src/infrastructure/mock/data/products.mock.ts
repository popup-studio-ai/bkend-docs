import type { ProductDto } from "@/application/dto/product.dto";

const now = new Date().toISOString();

const initialProducts: ProductDto[] = [
  {
    id: "prod-1",
    name: "Premium Cashmere Coat",
    description: "A luxurious winter coat made from soft cashmere. Classic design offers an elegant look wherever you go.",
    price: 289.00,
    category: "Clothing",
    stock: 15,
    imageUrl: "https://picsum.photos/seed/product-1/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-2",
    name: "Wireless Bluetooth Earbuds Pro",
    description: "Premium wireless earbuds with active noise cancellation. Up to 30 hours of playback on a single charge.",
    price: 158.00,
    category: "Electronics",
    stock: 42,
    imageUrl: "https://picsum.photos/seed/product-2/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-3",
    name: "Solid Wood Desk 48\"",
    description: "A 48-inch desk crafted from natural solid wood. Simple yet warm design that complements any interior.",
    price: 345.00,
    category: "Furniture",
    stock: 8,
    imageUrl: "https://picsum.photos/seed/product-3/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-4",
    name: "Organic Granola 500g",
    description: "Healthy granola made with organic grains and nuts. Perfect for a nutritious breakfast.",
    price: 12.90,
    category: "Food",
    stock: 120,
    imageUrl: "https://picsum.photos/seed/product-4/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-5",
    name: "Cica Repair Serum 50ml",
    description: "A soothing repair serum with centella asiatica for sensitive skin. Strengthens the skin barrier and keeps skin hydrated.",
    price: 32.00,
    category: "Beauty",
    stock: 67,
    imageUrl: "https://picsum.photos/seed/product-5/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-6",
    name: "Slim Fit Jeans",
    description: "Comfortable stretch slim-fit denim pants. Great for everyday casual wear.",
    price: 59.00,
    category: "Clothing",
    stock: 35,
    imageUrl: "https://picsum.photos/seed/product-6/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-7",
    name: "Smart Watch SE",
    description: "A smartwatch with health monitoring, fitness tracking, and notification features. Best value for the price.",
    price: 199.00,
    category: "Electronics",
    stock: 23,
    imageUrl: "https://picsum.photos/seed/product-7/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-8",
    name: "Ergonomic Office Chair",
    description: "An ergonomically designed office chair comfortable for extended sitting. Breathable mesh material for great ventilation.",
    price: 420.00,
    category: "Furniture",
    stock: 5,
    imageUrl: "https://picsum.photos/seed/product-8/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-9",
    name: "Protein Bar 12-Pack",
    description: "High-protein bars for a quick post-workout snack. Assorted flavors: chocolate, vanilla, and cookies & cream.",
    price: 24.90,
    category: "Food",
    stock: 80,
    imageUrl: "https://picsum.photos/seed/product-9/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-10",
    name: "Hyaluronic Acid Moisturizer 100ml",
    description: "A deep hydrating cream with triple hyaluronic acid. Provides 72-hour moisture for dry skin.",
    price: 28.00,
    category: "Beauty",
    stock: 55,
    imageUrl: "https://picsum.photos/seed/product-10/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-11",
    name: "Oversized Crewneck Sweatshirt",
    description: "A heavyweight oversized crewneck sweatshirt. Unisex design for comfortable everyday wear.",
    price: 39.00,
    category: "Clothing",
    stock: 50,
    imageUrl: "https://picsum.photos/seed/product-11/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-12",
    name: "USB-C Multi Hub 7-in-1",
    description: "Connect up to 7 devices including HDMI, USB 3.0, and SD card through a single USB-C port.",
    price: 45.00,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://picsum.photos/seed/product-12/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-13",
    name: "LED Desk Lamp",
    description: "An LED desk lamp with 5-level brightness adjustment. Modern design perfect for a home office or study.",
    price: 78.00,
    category: "Furniture",
    stock: 18,
    imageUrl: "https://picsum.photos/seed/product-13/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-14",
    name: "Dried Tangerine Chips 100g x 5",
    description: "All-natural dried tangerine fruit chips. No added sugar for a healthy snacking option.",
    price: 15.80,
    category: "Food",
    stock: 95,
    imageUrl: "https://picsum.photos/seed/product-14/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-15",
    name: "Sunscreen SPF50+ PA++++",
    description: "A lightweight, high-protection sunscreen. Applies sheer without any white cast.",
    price: 22.00,
    category: "Beauty",
    stock: 70,
    imageUrl: "https://picsum.photos/seed/product-15/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-16",
    name: "Linen Shirt (White)",
    description: "A cool oversized linen shirt. Perfect daily essential for the summer season.",
    price: 49.00,
    category: "Clothing",
    stock: 28,
    imageUrl: "https://picsum.photos/seed/product-16/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-17",
    name: "Wireless Charging Pad",
    description: "A Qi-compatible 15W fast wireless charging pad. Slim design sits neatly on your desk.",
    price: 25.00,
    category: "Electronics",
    stock: 60,
    imageUrl: "https://picsum.photos/seed/product-17/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-18",
    name: "Candle Warmer Set",
    description: "An electric candle warmer set to use with aroma candles. Create a cozy atmosphere with a gentle fragrance.",
    price: 35.00,
    category: "Furniture",
    stock: 22,
    imageUrl: "https://picsum.photos/seed/product-18/400/400",
    isActive: true,
    createdBy: "user-1",
    createdAt: now,
    updatedAt: now,
  },
];

// Discounted products (originalPrice > price)
interface MockProduct extends ProductDto {
  originalPrice?: number;
}

const productsWithDiscount: MockProduct[] = initialProducts.map((p) => {
  if (["prod-1", "prod-7", "prod-8", "prod-11", "prod-15"].includes(p.id)) {
    return { ...p, originalPrice: Math.round(p.price * 1.3 * 100) / 100 };
  }
  return p;
});

let products: MockProduct[] = [...productsWithDiscount];
let nextId = 19;

export function getProducts() {
  return products;
}

export function resetProducts() {
  products = [...productsWithDiscount];
  nextId = 19;
}

export function findProduct(id: string): MockProduct | undefined {
  return products.find((p) => p.id === id);
}

export function createProduct(body: Record<string, unknown>): MockProduct {
  const id = `prod-${nextId++}`;
  const product: MockProduct = {
    id,
    name: (body.name as string) || "",
    description: (body.description as string) || "",
    price: (body.price as number) || 0,
    category: (body.category as string) || "Other",
    stock: (body.stock as number) || 0,
    imageUrl: (body.imageUrl as string) || `https://picsum.photos/seed/${id}/400/400`,
    isActive: body.isActive !== undefined ? (body.isActive as boolean) : true,
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(product);
  return product;
}

export function updateProduct(id: string, body: Record<string, unknown>): MockProduct | null {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = {
    ...products[idx],
    ...body,
    id,
    updatedAt: new Date().toISOString(),
  } as MockProduct;
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  return true;
}
