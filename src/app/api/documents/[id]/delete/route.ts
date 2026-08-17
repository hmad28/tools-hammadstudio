import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/db/store";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    memoryStore.deleteDocument(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghapus dokumen" }, { status: 500 });
  }
}
