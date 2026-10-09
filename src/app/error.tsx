"use client";

import { primaryButton } from "@/lib/ui";

// สถานะ "เกิดข้อผิดพลาด" ของทั้งแอป เช่น ไม่พบสินค้าตอนแก้ไขหรือลบ
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <div
        role="alert"
        className="rounded-xl border border-rose-200 bg-rose-50 p-6"
      >
        <h1 className="text-lg font-semibold text-rose-800">
          เกิดข้อผิดพลาด
        </h1>
        <p className="mt-1 text-sm text-rose-700">
          ดำเนินการไม่สำเร็จ ลองใหม่อีกครั้ง หากยังเป็นอยู่ให้กลับหน้าแรก
        </p>
        <button type="button" onClick={reset} className={primaryButton + " mt-4"}>
          ลองใหม่
        </button>
      </div>
    </main>
  );
}
