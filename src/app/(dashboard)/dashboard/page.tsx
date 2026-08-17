import Link from "next/link";
import { Header } from "@/components/layout/header";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { memoryStore } from "@/db/store";
import { formatIDR, formatIndonesianDate } from "@/lib/formatters";
import {
  PlusCircle,
  FileSpreadsheet,
  Receipt,
  Eye,
  Download,
  Copy,
  ArrowRight,
  FileText,
  UserPlus,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const documents = memoryStore.getDocuments();

  const totalDocuments = documents.length;
  const proposals = documents.filter((d) => d.type === "proposal");
  const invoices = documents.filter((d) => d.type === "invoice");

  const proposalsCount = proposals.length;
  const invoicesCount = invoices.length;

  const totalProjectValue = documents.reduce((acc, d) => acc + (d.total || 0), 0);
  const outstandingPayments = documents.reduce((acc, d) => acc + (d.remainingAmount || 0), 0);
  const paidRevenue = documents.reduce((acc, d) => acc + (d.paidAmount || 0), 0);

  const recentDocuments = documents.slice(0, 5);

  return (
    <div>
      <Header
        title="Dashboard Overview"
        subtitle="Hammad Studio Operational & Document Management"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Quick Action Bar */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">Selamat Datang di Hammad Studio</h2>
            <p className="text-xs text-purple-200 mt-1 max-w-xl leading-relaxed">
              Buat proposal dan invoice `.docx` profesional secara otomatis menggunakan template resmi Hammad Studio.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/documents/proposals/new"
              className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Proposal</span>
            </Link>
            <Link
              href="/documents/invoices/new"
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-400/30 text-xs font-semibold px-4 py-2.5 rounded-xl transition active:scale-95"
            >
              <Receipt className="w-4 h-4 text-purple-400" />
              <span>+ New Invoice</span>
            </Link>
            <Link
              href="/clients"
              className="inline-flex items-center space-x-1.5 bg-slate-950/60 hover:bg-slate-950 text-slate-300 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <UserPlus className="w-4 h-4 text-slate-400" />
              <span>+ New Client</span>
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        <MetricsCards
          totalDocuments={totalDocuments}
          proposalsCount={proposalsCount}
          invoicesCount={invoicesCount}
          totalProjectValue={totalProjectValue}
          outstandingPayments={outstandingPayments}
          paidRevenue={paidRevenue}
        />

        {/* Recent Documents Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Dokumen Terbaru</h3>
              <p className="text-xs text-slate-500">Proposal dan Invoice yang baru saja dibuat atau diperbarui</p>
            </div>

            <Link
              href="/documents"
              className="text-purple-600 hover:text-purple-700 text-xs font-semibold flex items-center space-x-1 transition"
            >
              <span>Lihat Semua Dokumen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Dokumen</th>
                  <th className="py-3 px-4">Klien</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Nilai</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Belum ada dokumen terdaftar.
                    </td>
                  </tr>
                ) : (
                  recentDocuments.map((doc) => {
                    const clientName = doc.payload?.client?.name || "Klien";
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{doc.number}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">{doc.title}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">{clientName}</td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{formatIDR(doc.total)}</td>
                        <td className="py-3 px-4 text-slate-500">{formatIndonesianDate(doc.issueDate)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/documents/${doc.id}`}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition"
                              title="Lihat Detail"
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
    </div>
  );
}
