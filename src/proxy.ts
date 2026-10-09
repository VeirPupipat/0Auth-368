// Next 16 ใช้ชื่อ proxy แทน middleware เดิม
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/products/:id/edit", "/products/:id/delete"],
};
