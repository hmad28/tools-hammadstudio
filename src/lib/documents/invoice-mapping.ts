import { formatIDR, formatIndonesianDate, formatPhone } from "../formatters";

export function mapInvoicePayloadToTemplate(payload: any): Record<string, any> {
  const invoiceNumber = payload.invoiceNumber || payload.number || "INV-HS-001";
  const issueDateFormatted = formatIndonesianDate(payload.issueDate || payload.invoiceDate);
  const dueDateFormatted = payload.dueDate
    ? (payload.dueDate.toLowerCase().includes("saat") ? payload.dueDate : formatIndonesianDate(payload.dueDate))
    : "Saat diterima";

  const clientName = payload.client?.name || "Client";
  const clientContact = payload.client?.contact || formatPhone(payload.client?.phone) || payload.client?.email || "";

  const item = payload.items?.[0] || {
    description: payload.projectName || "Website Development",
    details: "Domain & hosting 1 tahun, SSL, basic SEO, responsive design.",
    quantity: 1,
    unitPrice: payload.total || 399000,
    total: payload.total || 399000,
  };

  const total = payload.total ?? item.total ?? 399000;
  const dpPct = payload.dpPercentage ?? 50;
  const remainingPct = 100 - dpPct;
  const dpAmount = payload.dpAmount ?? Math.round((total * dpPct) / 100);
  const remainingAmount = payload.remainingAmount ?? (total - dpAmount);

  const statusText = (payload.statusText || payload.status || "Waiting Payment").toUpperCase();
  let normalizedStatusText = "MENUNGGU PEMBAYARAN";
  if (statusText.includes("PAID") || statusText.includes("LUNAS")) {
    normalizedStatusText = "LUNAS";
  } else if (statusText.includes("PARTIAL")) {
    normalizedStatusText = "DIBAYAR SEBAGIAN";
  } else if (statusText.includes("CANCEL")) {
    normalizedStatusText = "DIBATALKAN";
  }

  return {
    STATUS: normalizedStatusText,
    INVOICE_SUBTITLE: payload.invoiceSubtitle || `Pembayaran DP Project ${payload.projectName || clientName}`,
    INVOICE_NUMBER: invoiceNumber,
    INVOICE_DATE: issueDateFormatted,
    DUE_DATE: dueDateFormatted,

    CLIENT_NAME: clientName,
    CLIENT_CONTACT: clientContact,

    PROJECT_NAME: payload.projectName || payload.project?.name || "Project Web Development",
    PROJECT_META: payload.projectMeta || payload.project?.meta || "Multipage Website",

    ITEM_DESCRIPTION: item.description,
    ITEM_DETAILS: item.details || "",

    PROJECT_TOTAL: formatIDR(total),
    DP_PERCENT: String(dpPct),
    DP_AMOUNT: formatIDR(dpAmount),
    REMAINING_AMOUNT: formatIDR(remainingAmount),
    REMAINING_PERCENT: String(remainingPct),
  };
}
