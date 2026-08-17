import { NextRequest, NextResponse } from "next/server";
import { memoryStore, generateNextDocumentNumber } from "@/db/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = memoryStore.getDocumentById(id);
    if (!doc) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    const type = doc.type as "proposal" | "invoice";
    const newNumber = generateNextDocumentNumber(type);
    const issueDate = new Date().toISOString().split("T")[0];

    // Deep copy payload and update sequence/dates
    const newPayload = JSON.parse(JSON.stringify(doc.payload || {}));
    if (type === "proposal") {
      newPayload.proposalNumber = newNumber;
      newPayload.proposalDate = issueDate;
    } else {
      newPayload.invoiceNumber = newNumber;
      newPayload.issueDate = issueDate;
      newPayload.paidAmount = 0;
      newPayload.statusText = "DRAFT";
    }

    const duplicatedDoc = memoryStore.saveDocument({
      type,
      number: newNumber,
      clientId: doc.clientId,
      projectId: doc.projectId,
      title: `${doc.title} (Salinan)`,
      status: "Draft",
      issueDate,
      dueDate: doc.dueDate,
      currency: doc.currency,
      subtotal: doc.subtotal,
      discount: doc.discount,
      total: doc.total,
      dpPercentage: doc.dpPercentage,
      dpAmount: doc.dpAmount,
      paidAmount: 0,
      remainingAmount: doc.remainingAmount,
      payload: newPayload,
    });

    return NextResponse.json(duplicatedDoc, { status: 200 });
  } catch (error: any) {
    console.error("Duplicate document API error:", error);
    return NextResponse.json(
      { error: "Gagal menduplikasi dokumen", details: error.message },
      { status: 500 }
    );
  }
}
