// คลาส Tailwind ที่ใช้ซ้ำในหลายคอมโพเนนต์ รวมไว้ที่เดียวตามหลักไม่เขียนซ้ำ
// สไตล์ของช่องที่ไม่ผ่านผูกกับ aria-invalid ที่เราควบคุมเอง ไม่ใช้ :invalid

export const cardBase = "rounded-xl bg-white p-5 shadow-sm";

export const cardClass = `${cardBase} ring-1 ring-slate-900/10`;

export const labelClass = "block text-sm font-medium text-slate-700";

export const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 " +
  "text-sm text-slate-900 placeholder:text-slate-400 " +
  "focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25 " +
  "aria-invalid:border-rose-500 aria-invalid:bg-rose-50/40 " +
  "aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/25";

export const errorClass = "mt-1 min-h-5 text-xs font-medium text-rose-600";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm " +
  "font-medium transition-colors focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-teal-700 " +
  "disabled:cursor-not-allowed";

export const primaryButton =
  `${buttonBase} bg-teal-700 text-white hover:bg-teal-800 ` +
  "disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200";

export const secondaryButton =
  `${buttonBase} border border-slate-300 bg-white text-slate-700 ` +
  "hover:bg-slate-50 disabled:opacity-50";
