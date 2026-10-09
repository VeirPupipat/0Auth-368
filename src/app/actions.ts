"use server";

import { auth } from "@/auth";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/product-store";
import { ProductDraftSchema } from "@/lib/products";
import type { ActionResult, ProductDraft } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ด่านฝั่ง server: ปฏิเสธทุกคำขอที่ไม่มี session แม้ผู้ใช้จะเรียก Server Action ตรง
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// ข้อมูลจากฟอร์มฝั่ง client เชื่อถือไม่ได้ จึงตรวจด้วย Schema ซ้ำที่ server
type Checked =
  | { ok: true; data: ProductDraft }
  | { ok: false; error: string };

function validate(values: ProductDraft): Checked {
  const result = ProductDraftSchema.safeParse(values);
  return result.success
    ? { ok: true, data: result.data }
    : {
        ok: false,
        error: result.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
}

export async function createProductAction(
  values: ProductDraft
): Promise<ActionResult> {
  await requireUser();

  const checked = validate(values);
  if (!checked.ok) {
    return { error: checked.error };
  }

  await createProduct(checked.data);
  revalidatePath("/");
}

export async function updateProductAction(
  id: number,
  values: ProductDraft
): Promise<ActionResult> {
  await requireUser();

  const checked = validate(values);
  if (!checked.ok) {
    return { error: checked.error };
  }

  await updateProduct(id, checked.data);
  revalidatePath("/");
  redirect("/");
}

export async function deleteProductAction(id: number) {
  await requireUser();
  await deleteProduct(id);
  revalidatePath("/");
  redirect("/");
}