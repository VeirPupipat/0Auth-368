import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/product-store";
import { updateProductAction } from "@/app/actions";
import ProductForm from "@/components/ProductForm";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // กันเหนียวอีกชั้นนอกเหนือจาก proxy
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  // ใน Next 16 params เป็น Promise จึงต้อง await
  const { id: rawId } = await params;
  const id = Number(rawId);
  const product = Number.isInteger(id) ? await getProduct(id) : undefined;
  if (!product) {
    notFound();
  }

  // ผูก id ให้ Server Action ไว้ล่วงหน้า ฟอร์มจึงส่งแค่ค่าของฟอร์ม
  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Link href="/" className="text-sm text-teal-700 hover:underline">
        กลับหน้ารายการสินค้า
      </Link>
      <div className="mt-4">
        <ProductForm
          title="แก้ไขสินค้า"
          submitLabel="บันทึกการแก้ไข"
          action={updateAction}
          initial={{
            title: product.title,
            price: product.price,
            stock: product.stock,
            category: product.category,
          }}
          cancelHref="/"
        />
      </div>
    </main>
  );
}
