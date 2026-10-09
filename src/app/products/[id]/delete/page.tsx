import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/product-store";
import { deleteProductAction } from "@/app/actions";
import { cardClass, secondaryButton } from "@/lib/ui";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  const product = Number.isInteger(id) ? await getProduct(id) : undefined;
  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className={cardClass}>
        <h1 className="text-lg font-semibold">ยืนยันการลบ</h1>
        <p className="mt-2 text-slate-700">
          ต้องการลบสินค้า “{product.title}” หรือไม่?
        </p>
        <p className="mt-1 text-sm text-slate-500">
          การลบไม่สามารถย้อนกลับได้
        </p>

        <div className="mt-5 flex gap-2">
          {/* การลบจริงใช้ form + Server Action แบบ POST ไม่ใช้ลิงก์ GET */}
          <form action={deleteAction}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              ยืนยันการลบ
            </button>
          </form>
          <Link href="/" className={secondaryButton}>
            ยกเลิก
          </Link>
        </div>
      </div>
    </main>
  );
}
