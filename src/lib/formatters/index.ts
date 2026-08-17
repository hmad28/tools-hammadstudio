/**
 * Centralized Indonesian Formatters for Hammad Studio Document Generator
 */

/**
 * Formats a numeric amount as Indonesian Rupiah (IDR).
 * Example: 399000 -> "Rp399.000"
 */
export function formatIDR(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "Rp0";
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat("id-ID").format(rounded);
  return `Rp${formatted}`;
}

/**
 * Parses a string input (e.g. "Rp 399.000" or "399000") into integer Rupiah value.
 */
export function parseIDRInput(val: string | number): number {
  if (typeof val === "number") return Math.max(0, Math.round(val));
  if (!val) return 0;
  const digitsOnly = val.replace(/[^\d]/g, "");
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTHS_SHORT_ID = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

/**
 * Formats a Date object or YYYY-MM-DD string into Indonesian Date.
 * Example: "2026-08-17" -> "17 Agustus 2026"
 */
export function formatIndonesianDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const day = date.getDate();
  const month = MONTHS_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formats a Date object or YYYY-MM-DD string into Short Indonesian Date.
 * Example: "2026-08-17" -> "17 AUG 2026"
 */
export function formatShortIndonesianDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const day = date.getDate();
  const month = MONTHS_SHORT_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formats Indonesian Phone Number consistently.
 * Example: "085222927499" -> "+62 852-2292-7499"
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "+62" + cleaned.slice(1);
  }
  if (cleaned.startsWith("62")) {
    cleaned = "+" + cleaned;
  }
  if (cleaned.startsWith("+62") && cleaned.length >= 12) {
    const p1 = cleaned.slice(3, 6);
    const p2 = cleaned.slice(6, 10);
    const p3 = cleaned.slice(10);
    return `+62 ${p1}-${p2}${p3 ? "-" + p3 : ""}`;
  }
  return cleaned;
}

/**
 * Sanitizes string for clean filename.
 * Example: "Proposal Jam Wisata" -> "Proposal_Jam_Wisata"
 */
export function slugifyFilename(str: string): string {
  return str
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "_");
}
