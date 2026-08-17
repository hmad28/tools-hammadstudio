"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { memoryStore } from "@/db/store";
import { formatIDR, formatIndonesianDate } from "@/lib/formatters";
import {
  FileText,
  FileSpreadsheet,
  Receipt,
  Search,
  PlusCircle,
  Eye,
  Download,
  Copy,
  Trash2,
  Filter,
  ArrowUpDown,
  Plus,
} from "lucide-react";

function DocumentsListContent() {
  const searchParams = useSearchParams();
  const initialTypeFilter = searchParams.get("type") || "all";

  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const [documents, setDocuments] = useState(memoryStore.getDocuments());

  // Delete Action
  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      memoryStore.deleteDocument(id);
      setDocuments(memoryStore.getDocuments());
    }
  };

  // Duplicate Action
  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.id) {
        setDocuments(memoryStore.getDocuments());
        alert(`Berhasil menduplikasi dokumen ${data.number}!`);
      }
    } catch (err) {
      alert("Gagal menduplikasi dokumen.");
    }
  };

  // Filter & Search Logic
  const filteredDocs = documents.filter((doc) => {
    if (typeFilter !== "all" && doc.type !== typeFilter) return false;
    if (statusFilter !== "all" && doc.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const clientName = (doc.payload?.client?.name || "").toLowerCase();
      const docNum = (doc.number || "").toLowerCase();
      const title = (doc.title || "").toLowerCase();
      return clientName.includes(q) || docNum.includes(q) || title.includes(q);
    }
    return true;
  });

  // Sorting
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    if (sortBy === "oldest") return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
    if (sortBy === "highest") return b.total - a.total;
    if (sortBy === "lowest") return a.total - b.total;
    return 0;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Type Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              typeFilter === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Semua Dokumen ({documents.length})
          </button>
          <button
            onClick={() => setTypeFilter("proposal")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              typeFilter === "proposal"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-purple-50"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Proposal ({documents.filter((d) => d.type === "proposal").length})</span>
          </button>
          <button
            onClick={() => setTypeFilter("invoice")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              typeFilter === "invoice"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-indigo-50"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoice ({documents.filter((d) => d.type === "invoice").length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/documents/proposals/new"
            className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Proposal</span>
          </Link>
          <Link
            href="/documents/invoices/new"
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Invoice</span>
          </Link>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nomor dokumen, klien, atau project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="waiting payment">Waiting Payment</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="highest">Nilai Tertinggi</option>
            <option value="lowest">Nilai Terendah</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Dokumen & Nomor</th>
                <th className="py-3.5 px-4">Klien</th>
                <th className="py-3.5 px-4">Tipe</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Nilai Total</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="max-w-xs mx-auto text-center space-y-3">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">Belum Ada Dokumen</h4>
                        <p className="text-xs text-slate-500">
                          Buat proposal atau invoice pertama untuk mulai mengelola dokumen Hammad Studio.
                        </p>
                      </div>
                      <div className="flex justify-center space-x-2 pt-2">
                        <Link
                          href="/documents/proposals/new"
                          className="bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                        >
                          + Buat Proposal
                        </Link>
                        <Link
                          href="/documents/invoices/new"
                          className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                        >
                          + Buat Invoice
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedDocs.map((doc) => {
                  const clientName = doc.payload?.client?.name || "Klien";
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/documents/${doc.id}`}
                          className="font-bold text-slate-900 hover:text-purple-600 transition"
                        >
                          {doc.number}
                        </Link>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{doc.title}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{clientName}</td>
                      <td className="py-3.5 px-4">
                        {doc.type === "proposal" ? (
                          <span className="inline-flex items-center space-x-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            <FileSpreadsheet className="w-3 h-3" />
                            <span>Proposal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            <Receipt className="w-3 h-3" />
                            <span>Invoice</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{formatIDR(doc.total)}</td>
                      <td className="py-3.5 px-4 text-slate-500">{formatIndonesianDate(doc.issueDate)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Link
                            href={`/documents/${doc.id}`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition"
                            title="Lihat Detail & Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <a
                            href={`/api/documents/${doc.id}/download`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition"
                            title="Download DOCX"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDuplicate(doc.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Duplikasi Dokumen"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <div>
      <Header
        title="Dokumen Studio"
        subtitle="Kelola Proposal & Invoice Hammad Studio"
      />
      <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading documents...</div>}>
        <DocumentsListContent />
      </Suspense>
    </div>
  );
}
