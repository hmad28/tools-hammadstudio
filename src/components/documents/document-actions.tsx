"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Edit,
  Copy,
  Receipt,
  Trash2,
} from "lucide-react";

interface DocumentActionsProps {
  doc: {
    id: string;
    type: "proposal" | "invoice";
    number: string;
    title: string;
  };
}

export function DocumentActions({ doc }: DocumentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.id) {
        alert(`Berhasil menduplikasi dokumen! Nomor baru: ${data.number}`);
        router.push(`/documents/${data.id}`);
      }
    } catch (err) {
      alert("Gagal menduplikasi dokumen.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}/create-invoice`, { method: "POST" });
      const data = await res.json();
      if (data.id) {
        alert(`Invoice berhasil dibuat dari proposal! Nomor Invoice: ${data.number}`);
        router.push(`/documents/${data.id}`);
      }
    } catch (err) {
      alert("Gagal membuat invoice dari proposal.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      setLoading(true);
      try {
        await fetch(`/api/documents/${doc.id}/delete`, { method: "DELETE" });
        alert("Dokumen berhasil dihapus.");
        router.push("/documents");
      } catch (err) {
        alert("Gagal menghapus dokumen.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`/api/documents/${doc.id}/download`}
        className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
      >
        <Download className="w-4 h-4" />
        <span>Download DOCX</span>
      </a>

      {doc.type === "proposal" && (
        <button
          onClick={handleCreateInvoice}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95"
        >
          <Receipt className="w-4 h-4 text-indigo-300" />
          <span>Buat Invoice</span>
        </button>
      )}

      <button
        onClick={handleDuplicate}
        disabled={loading}
        className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl transition"
        title="Duplikasi Dokumen"
      >
        <Copy className="w-3.5 h-3.5" />
        <span>Duplikasi</span>
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
        title="Hapus Dokumen"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
