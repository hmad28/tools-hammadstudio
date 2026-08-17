/**
 * Centralized Financial Calculation Rules for Hammad Studio Document Generator
 * All monetary amounts are integers in Indonesian Rupiah (IDR).
 */

export interface LineItemInput {
  quantity: number;
  unitPrice: number;
}

export function calculateLineTotal(item: LineItemInput): number {
  const qty = Math.max(0, Math.round(item.quantity || 0));
  const price = Math.max(0, Math.round(item.unitPrice || 0));
  return qty * price;
}

export function calculateSubtotal(items: LineItemInput[]): number {
  if (!items || items.length === 0) return 0;
  return items.reduce((acc, item) => acc + calculateLineTotal(item), 0);
}

export function calculateDiscount(subtotal: number, discountInput: number): number {
  const safeSubtotal = Math.max(0, Math.round(subtotal || 0));
  const safeDiscount = Math.max(0, Math.round(discountInput || 0));
  return Math.min(safeSubtotal, safeDiscount);
}

export function calculateTotal(subtotal: number, discount: number): number {
  const safeSubtotal = Math.max(0, Math.round(subtotal || 0));
  const safeDiscount = calculateDiscount(safeSubtotal, discount);
  return Math.max(0, safeSubtotal - safeDiscount);
}

export function calculateDpAmount(total: number, dpPercentage: number): number {
  const safeTotal = Math.max(0, Math.round(total || 0));
  const safeDpPct = Math.max(0, Math.min(100, Math.round(dpPercentage || 0)));
  return Math.round((safeTotal * safeDpPct) / 100);
}

export function calculateRemainingAmount(total: number, dpAmount: number): number {
  const safeTotal = Math.max(0, Math.round(total || 0));
  const safeDp = Math.max(0, Math.min(safeTotal, Math.round(dpAmount || 0)));
  return safeTotal - safeDp;
}

export function calculateOutstandingAmount(total: number, paidAmount: number): number {
  const safeTotal = Math.max(0, Math.round(total || 0));
  const safePaid = Math.max(0, Math.round(paidAmount || 0));
  return Math.max(0, safeTotal - safePaid);
}

export interface FinancialCalculationResult {
  subtotal: number;
  discount: number;
  total: number;
  dpPercentage: number;
  dpAmount: number;
  remainingAmount: number;
  paidAmount: number;
  outstandingAmount: number;
}

export function calculateFinancialSummary(input: {
  items?: LineItemInput[];
  subtotal?: number;
  discount?: number;
  total?: number;
  dpPercentage?: number;
  paidAmount?: number;
}): FinancialCalculationResult {
  const itemsSubtotal = input.items ? calculateSubtotal(input.items) : (input.subtotal ?? 0);
  const subtotal = Math.max(0, Math.round(itemsSubtotal));
  const discount = calculateDiscount(subtotal, input.discount ?? 0);
  const total = input.total !== undefined && (!input.items || input.items.length === 0)
    ? Math.max(0, Math.round(input.total))
    : calculateTotal(subtotal, discount);
  
  const dpPercentage = input.dpPercentage ?? 50;
  const dpAmount = calculateDpAmount(total, dpPercentage);
  const remainingAmount = calculateRemainingAmount(total, dpAmount);
  const paidAmount = Math.max(0, Math.round(input.paidAmount ?? 0));
  const outstandingAmount = calculateOutstandingAmount(total, paidAmount);

  return {
    subtotal,
    discount,
    total,
    dpPercentage,
    dpAmount,
    remainingAmount,
    paidAmount,
    outstandingAmount,
  };
}
