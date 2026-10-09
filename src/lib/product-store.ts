import "server-only";
import {
  fallbackProducts,
  fetchProducts,
} from "@/lib/products";
import type { Product, ProductDraft, SearchQuery } from "@/lib/products";

// ที่เก็บสินค้าในหน่วยความจำของ server (สำหรับเรียนรู้ ข้อมูลหายเมื่อ restart)
// ครั้งแรกที่ถูกเรียก จะโหลดข้อมูลตั้งต้นจาก External API แล้วเก็บไว้
// ถ้าเรียก API ไม่ได้ ใช้ข้อมูลสำรองจาก products-fallback.json แทน
// ส่วนงานจริงควรเปลี่ยนเป็นฐานข้อมูล เช่น PostgreSQL

const seedQuery: SearchQuery = { q: "", limit: 30, sortBy: "title" };

async function loadInitialProducts(): Promise<Product[]> {
  try {
    return (await fetchProducts(seedQuery)).products;
  } catch {
    return fallbackProducts(seedQuery).products;
  }
}

const g = globalThis as typeof globalThis & {
  demoProducts?: Promise<Product[]>;
};

// เก็บไว้ที่ globalThis เพื่อให้ข้อมูลไม่ถูกรีเซ็ตเมื่อ dev server โหลดโมดูลใหม่
function getStore(): Promise<Product[]> {
  g.demoProducts ??= loadInitialProducts();
  return g.demoProducts;
}

export async function listProducts(query: SearchQuery) {
  const products = await getStore();
  const keyword = query.q.toLowerCase();
  const { sortBy } = query;

  const matched = products
    .filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.category.includes(keyword)
    )
    .sort((a, b) =>
      sortBy === "title"
        ? a.title.localeCompare(b.title)
        : a[sortBy] - b[sortBy]
    );

  return { items: matched.slice(0, query.limit), total: matched.length };
}

export async function getProduct(id: number) {
  const products = await getStore();
  return products.find((item) => item.id === id);
}

export async function createProduct(draft: ProductDraft) {
  const products = await getStore();
  const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  products.push({ ...draft, id: nextId });
}

export async function updateProduct(id: number, draft: ProductDraft) {
  const product = await getProduct(id);
  if (!product) {
    throw new Error("Product not found");
  }
  Object.assign(product, draft);
}

export async function deleteProduct(id: number) {
  const products = await getStore();
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  products.splice(index, 1);
}
