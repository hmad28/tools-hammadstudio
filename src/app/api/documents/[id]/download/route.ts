import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/db/store";
import { generateDocxBuffer } from "@/lib/documents/generate-docx";
import { slugifyFilename } from "@/lib/formatters";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID Dokumen tidak valid" }, { status: 400 });
    }

    const doc = memoryStore.getDocumentById(id);
    if (!doc) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    const type = doc.type as "proposal" | "invoice";
    const payload = doc.payload || {};

    // Build filename
    const clientName = payload.client?.name || "Client";
    const titleOrNumber = doc.number || payload.proposalNumber || payload.invoiceNumber || "Doc";
    const prefix = type === "proposal" ? "Proposal_Hammad_Studio" : "Invoice_Hammad_Studio";

    const cleanClient = slugifyFilename(clientName);
    const cleanNumber = slugifyFilename(titleOrNumber);

    const filename = `${prefix}_${cleanClient}_${cleanNumber}.docx`;

    // Generate DOCX buffer in memory
    const buffer = await generateDocxBuffer(type, payload);

    // Update generatedAt timestamp
    memoryStore.saveDocument({
      ...doc,
      generatedAt: new Date().toISOString(),
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("DOCX Download API Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat dokumen DOCX. Silakan coba lagi.", details: error.message },
      { status: 500 }
    );
  }
}
