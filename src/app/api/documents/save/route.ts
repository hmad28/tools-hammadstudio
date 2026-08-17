import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/db/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.type || !["proposal", "invoice"].includes(body.type)) {
      return NextResponse.json({ error: "Tipe dokumen tidak valid" }, { status: 400 });
    }

    const savedDoc = memoryStore.saveDocument(body);

    return NextResponse.json(savedDoc, { status: 200 });
  } catch (error: any) {
    console.error("Save document API error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan dokumen", details: error.message },
      { status: 500 }
    );
  }
}
