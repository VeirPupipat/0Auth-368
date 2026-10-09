"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { ActionResult, ProductDraft } from "@/lib/products";
import {
  cardBase,
  errorClass,
  inputClass,
  labelClass,
  primaryButton,
  secondaryButton,
} from "@/lib/ui";

type ProductFormProps = {
  title: string;
  submitLabel: string;
  // Server Action ที่รับค่าจากฟอร์มที่ผ่าน Schema แล้ว
  action: (values: ProductDraft) => Promise<ActionResult>;
  // ถ้ามี = โหมดแก้ไข (ใช้เป็นค่าเริ่มต้นของฟอร์ม)
  initial?: ProductDraft;
  // ถ้ามี = แสดงปุ่มยกเลิกเป็นลิงก์ไปที่นี่
  cancelHref?: string;
  // ล้างฟอร์มหลังบันทึกสำเร็จ (ใช้กับโหมดเพิ่ม)
  resetOnSuccess?: boolean;
};

export default function ProductForm({
  title,
  submitLabel,
  action,
  initial,
  cancelHref,
  resetOnSuccess = false,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: initial ?? {
      title: "",
      price: undefined,
      stock: undefined,
    },
  });

  function saveProduct(values: ProductDraft) {
    setServerError("");

    startTransition(async () => {
      try {
        const result = await action(values);
        if (result?.error) {
          setServerError(result.error);
          return;
        }
        if (resetOnSuccess) {
          reset();
        }
      } catch {
        setServerError("บันทึกไม่สำเร็จ อาจยังไม่ได้เข้าสู่ระบบ");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(saveProduct)}
      noValidate
      className={
        initial
          ? `${cardBase} ring-2 ring-teal-600`
          : `${cardBase} ring-1 ring-slate-900/10`
      }
    >
      <h2 className="text-base font-semibold">{title}</h2>

      <div className="mt-4">
        <label htmlFor="title" className={labelClass}>ชื่อสินค้า</label>
        <input
          id="title"
          required
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby="title-error"
          className={inputClass}
        />
        <span id="title-error" role="alert" className={errorClass + " block"}>
          {errors.title?.message}
        </span>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="price" className={labelClass}>ราคา (USD)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            required
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            aria-describedby="price-error"
            className={inputClass}
          />
          <span id="price-error" role="alert" className={errorClass + " block"}>
            {errors.price?.message}
          </span>
        </div>

        <div>
          <label htmlFor="stock" className={labelClass}>คงเหลือ</label>
          <input
            id="stock"
            type="number"
            required
            {...register("stock", { valueAsNumber: true })}
            aria-invalid={!!errors.stock}
            aria-describedby="stock-error"
            className={inputClass}
          />
          <span id="stock-error" role="alert" className={errorClass + " block"}>
            {errors.stock?.message}
          </span>
        </div>
      </div>

      <div className="mt-1">
        <label htmlFor="category" className={labelClass}>หมวดหมู่</label>
        <select
          id="category"
          required
          {...register("category")}
          aria-invalid={!!errors.category}
          aria-describedby="category-error"
          className={inputClass}
        >
          <option value="">กรุณาเลือกหมวดหมู่</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <span id="category-error" role="alert" className={errorClass + " block"}>
          {errors.category?.message}
        </span>
      </div>

      {serverError && (
        <p
          role="alert"
          className="mt-1 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {serverError}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={!isDirty || !isValid || isPending}
          className={primaryButton + " flex-1"}
        >
          {isPending ? "กำลังบันทึก" : submitLabel}
        </button>

        {cancelHref && (
          <Link href={cancelHref} className={secondaryButton}>
            ยกเลิก
          </Link>
        )}
      </div>
    </form>
  );
}
