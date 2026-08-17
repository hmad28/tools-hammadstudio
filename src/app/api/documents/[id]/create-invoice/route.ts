import { NextRequest, NextResponse } from "next/server";
import { memoryStore, generateNextDocumentNumber } from "@/db/store";
import { formatIDR } from "@/lib/formatters";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposal = memoryStore.getDocumentById(id);
    if (!proposal || proposal.type !== "proposal") {
      return NextResponse.json({ error: "Proposal tidak ditemukan" }, { status: 404 });
    }

    const payload = proposal.payload || {};
    const client = payload.client || {};
    const project = payload.project || {};
    const primaryPkg = payload.primaryPackage || {};

    const total = payload.total || primaryPkg.finalPrice || 399000;
    const dpPct = payload.dpPercent || 50;
    const dpAmount = Math.round((total * dpPct) / 100);
    const remainingAmount = total - dpAmount;

    const invoiceNumber = generateNextDocumentNumber("invoice");
    const issueDate = new Date().toISOString().split("T")[0];

    const invoicePayload = {
      invoiceNumber,
      invoiceSubtitle: `Pembayaran DP Project ${project.name || client.name || "Website"}`,
      statusText: "MENUNGGU PEMBAYARAN",
      status: "Waiting Payment",
      issueDate,
      dueDate: "Saat diterima",
      client: {
        id: client.id,
        name: client.name || "Client",
        contact: client.phone || client.email || "",
      },
      project: {
        id: project.id,
        name: project.name || "Project Website",
        meta: `${project.category || "Website Multipage"} • ${issueDate}`,
      },
      projectName: project.name || "Website Development",
      projectMeta: `${project.category || "Website Multipage"}`,
      items: [
        {
          description: `${project.name || "Website Development"} (${payload.projectValueLabel || "Multipage"})`,
          details: `Domain & hosting 1 tahun, SSL, basic SEO, responsive design, setup sampai online.`,
          quantity: 1,
          unitPrice: total,
          total: total,
        },
      ],
      subtotal: total,
      discount: 0,
      total,
      dpPercentage: dpPct,
      dpAmount,
      remainingAmount,
      paidAmount: 0,
      banks: memoryStore.getBankAccounts(),
      notes: memoryStore.getStudioSettings().default_invoice_notes,
    };

    const invoiceDoc = memoryStore.saveDocument({
      type: "invoice",
      number: invoiceNumber,
      clientId: proposal.clientId,
      projectId: proposal.projectId,
      title: `Invoice ${project.name || client.name}`,
      status: "Waiting Payment",
      issueDate,
      dueDate: "Saat diterima",
      currency: "IDR",
      subtotal: total,
      discount: 0,
      total,
      dpPercentage: dpPct,
      dpAmount,
      paidAmount: 0,
      remainingAmount,
      payload: invoicePayload,
    });

    return NextResponse.json(invoiceDoc, { status: 200 });
  } catch (error: any) {
    console.error("Create invoice from proposal API error:", error);
    return NextResponse.json(
      { error: "Gagal membuat invoice dari proposal", details: error.message },
      { status: 500 }
    );
  }
}
