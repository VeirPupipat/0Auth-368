// แสดงอัตโนมัติระหว่างที่ Server Component กำลังดึงข้อมูล (สถานะ "กำลังโหลด")
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/10">
        <p
          role="status"
          className="flex items-center gap-3 text-sm text-slate-600"
        >
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700 motion-reduce:animate-none"
          />
          กำลังโหลดข้อมูล
        </p>
        <div aria-hidden="true" className="mt-4 space-y-3">
          {[0, 1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-9 animate-pulse rounded-md bg-slate-100 motion-reduce:animate-none"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
