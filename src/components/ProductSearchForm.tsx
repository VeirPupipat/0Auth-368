"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";
import {
  cardClass,
  errorClass,
  inputClass,
  labelClass,
  primaryButton,
} from "@/lib/ui";

type ProductSearchFormProps = {
  initial: SearchQuery;
};

export default function ProductSearchForm({ initial }: ProductSearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: initial,
  });

  // เงื่อนไขค้นหาเก็บใน URL ให้หน้าแรก (Server Component) อ่านแล้วดึงข้อมูลเอง
  function search(query: SearchQuery) {
    const params = new URLSearchParams({
      q: query.q,
      limit: String(query.limit),
      sortBy: query.sortBy,
    });
    startTransition(() => router.push(`/?${params.toString()}`));
  }

  return (
    <form onSubmit={handleSubmit(search)} noValidate className={cardClass}>
      <h2 className="text-base font-semibold">ค้นหาสินค้า</h2>

      <div className="mt-4">
        <label htmlFor="q" className={labelClass}>คำค้น</label>
        <input
          id="q"
          {...register("q")}
          placeholder="phone"
          className={inputClass}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="limit" className={labelClass}>จำนวนรายการ</label>
          <input
            id="limit"
            type="number"
            required
            {...register("limit", { valueAsNumber: true })}
            aria-invalid={!!errors.limit}
            aria-describedby="limit-error"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="sortBy" className={labelClass}>เรียงตาม</label>
          <select id="sortBy" {...register("sortBy")} className={inputClass}>
            {SORT_FIELDS.map((field) => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
      </div>
      <span id="limit-error" role="alert" className={errorClass + " block"}>
        {errors.limit?.message}
      </span>

      <button
        type="submit"
        disabled={isPending}
        className={primaryButton + " mt-2 w-full"}
      >
        {isPending ? "กำลังค้นหา" : "ค้นหา"}
      </button>
    </form>
  );
}
