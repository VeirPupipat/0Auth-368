import Link from "next/link";
import type { Product } from "@/lib/products";

type ProductTableProps = {
  products: Product[];
  total: number;
  // ใช้ซ่อน/แสดงลิงก์เท่านั้น เป็น UX ไม่ใช่การป้องกัน
  // การป้องกันจริงอยู่ที่ proxy และ requireUser ใน Server Action
  canManage: boolean;
};

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
        หมด
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
        เหลือ {stock}
      </span>
    );
  }
  return <span className="text-slate-700">{stock}</span>;
}

export default function ProductTable({
  products,
  total,
  canManage,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 p-10 text-center">
        <p className="font-medium text-slate-700">
          ไม่พบสินค้าที่ตรงกับเงื่อนไข
        </p>
        <p className="mt-1 text-sm text-slate-500">ลองเปลี่ยนคำค้น</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="px-4 py-3 text-left text-sm text-slate-500">
            แสดง {products.length} จาก {total} รายการที่ตรงเงื่อนไข
          </caption>
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">ชื่อสินค้า</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">ราคา</th>
              <th scope="col" className="px-4 py-2.5 font-medium">คงเหลือ</th>
              <th scope="col" className="px-4 py-2.5 font-medium">หมวดหมู่</th>
              {canManage && (
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  <span className="sr-only">จัดการ</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50" data-testid="product">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {item.title}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {priceFormat.format(item.price)}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  <StockBadge stock={item.stock} />
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {item.category}
                  </span>
                </td>
                {canManage && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      href={`/products/${item.id}/edit`}
                      aria-label={`แก้ไข ${item.title}`}
                      className="rounded-md px-2 py-1 font-medium text-teal-700 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-700"
                    >
                      แก้ไข
                    </Link>
                    <Link
                      href={`/products/${item.id}/delete`}
                      aria-label={`ลบ ${item.title}`}
                      className="rounded-md px-2 py-1 font-medium text-rose-600 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-600"
                    >
                      ลบ
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
