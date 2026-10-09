import { auth } from "@/auth";
import { listProducts } from "@/lib/product-store";
import { SearchQuerySchema, defaultQuery } from "@/lib/products";
import ProductForm from "@/components/ProductForm";
import ProductSearchForm from "@/components/ProductSearchForm";
import ProductTable from "@/components/ProductTable";
import { createProductAction } from "./actions";
import { AuthButtons } from "./auth-buttons";
import { cardClass } from "@/lib/ui";

type HomePageProps = {
  searchParams: Promise<{ q?: string; limit?: string; sortBy?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  // เงื่อนไขค้นหามาจาก URL ซึ่งผู้ใช้แก้เองได้ จึงตรวจด้วย Schema ก่อนใช้
  const raw = await searchParams;
  const parsed = SearchQuerySchema.safeParse({
    q: raw.q ?? defaultQuery.q,
    limit: raw.limit === undefined ? defaultQuery.limit : Number(raw.limit),
    sortBy: raw.sortBy ?? defaultQuery.sortBy,
  });
  const query = parsed.success ? parsed.data : defaultQuery;

  const { items, total } = await listProducts(query);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-300 pb-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            รายการสินค้า
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            ข้อมูลตั้งต้นจาก dummyjson.com เก็บในหน่วยความจำของเซิร์ฟเวอร์
            การแก้ไขจะหายเมื่อรีสตาร์ต
          </p>
        </div>
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-6">
          <ProductSearchForm
            key={`${query.q}|${query.limit}|${query.sortBy}`}
            initial={query}
          />

          {isLoggedIn ? (
            <ProductForm
              title="เพิ่มสินค้า"
              submitLabel="เพิ่มสินค้า"
              action={createProductAction}
              resetOnSuccess
            />
          ) : (
            <div className={cardClass}>
              <h2 className="text-base font-semibold">จัดการสินค้า</h2>
              <p className="mt-1 text-sm text-slate-600">
                เข้าสู่ระบบด้วย Google เพื่อเพิ่ม แก้ไข หรือลบสินค้า
              </p>
            </div>
          )}
        </div>

        <section>
          <ProductTable products={items} total={total} canManage={isLoggedIn} />
        </section>
      </div>
    </main>
  );
}
