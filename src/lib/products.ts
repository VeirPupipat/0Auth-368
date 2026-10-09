import { z } from "zod";
import fallbackData from "@/data/products-fallback.json";

/* ------------------------------------------------------------------ */
/* 1.3  Schema และ Type ของข้อมูล                                      */
/* ------------------------------------------------------------------ */

// รายชื่อหมวดหมู่ คัดลอกจาก
// https://dummyjson.com/products/category-list
export const CATEGORIES = [
  "beauty", "fragrances", "furniture", "groceries",
  "home-decoration", "kitchen-accessories", "laptops",
  "mens-shirts", "mens-shoes", "mens-watches",
  "mobile-accessories", "motorcycle", "skin-care",
  "smartphones", "sports-accessories", "sunglasses",
  "tablets", "tops", "vehicle", "womens-bags",
  "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches",
] as const;

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;

/* ------------------------------------------------------------------ */
/* 3.1  Schema ของแบบร่างสินค้า (ยังไม่มี id)                           */
/* ------------------------------------------------------------------ */

export const ProductDraftSchema = ProductSchema.omit({ id: true });

export type ProductDraft = z.infer<typeof ProductDraftSchema>;

/* ------------------------------------------------------------------ */
/* 1.4 + 2.2  เงื่อนไขค้นหาและการประกอบที่อยู่ของคำขอ                    */
/* ------------------------------------------------------------------ */

const API_BASE = "https://dummyjson.com";

export const SORT_FIELDS = ["title", "price", "stock"] as const;

export const SearchQuerySchema = z.object({
  q: z.string().trim(),
  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),
  sortBy: z.enum(SORT_FIELDS),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

export function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();
  params.set("q", query.q);
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");
  params.set("select", "title,price,stock,category");

  return `${API_BASE}/products/search?${params.toString()}`;
}

// ผลลัพธ์ของ Server Action ที่ไม่ได้ redirect: undefined = สำเร็จ
export type ActionResult = { error: string } | undefined;

/* ------------------------------------------------------------------ */
/* 1.5  เรียก API และตรวจข้อมูลที่ได้รับ                                */
/* ------------------------------------------------------------------ */

export function parseProductList(data: unknown): ProductList {
  const result = ProductListSchema.safeParse(data);

  if (!result.success) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }

  return result.data;
}

export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {
  // โหมดข้อมูลสำรอง: เปิดด้วย NEXT_PUBLIC_USE_FALLBACK=true ใน .env.local
  if (process.env.NEXT_PUBLIC_USE_FALLBACK === "true") {
    return parseProductList(searchFallback(query));
  }

  const response = await fetch(buildProductUrl(query));

  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
  }

  const data = await response.json();

  return parseProductList(data);
}

/* ------------------------------------------------------------------ */
/* ข้อมูลสำรอง: จำลองการค้นหาของ API จากไฟล์ JSON ในเครื่อง             */
/* ------------------------------------------------------------------ */

export function searchFallback(query: SearchQuery) {
  const keyword = query.q.toLowerCase();
  const { sortBy } = query;

  const matched = fallbackData.products
    .filter((item) => item.title.toLowerCase().includes(keyword))
    .sort((a, b) =>
      sortBy === "title"
        ? a.title.localeCompare(b.title)
        : a[sortBy] - b[sortBy]
    );

  return {
    products: matched.slice(0, query.limit),
    total: matched.length,
    skip: 0,
    limit: query.limit,
  };
}

export function fallbackProducts(query: SearchQuery): ProductList {
  return parseProductList(searchFallback(query));
}
