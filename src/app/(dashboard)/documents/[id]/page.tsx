import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { memoryStore } from "@/db/store";
import { formatIDR, formatIndonesianDate } from "@/lib/formatters";
import { DocumentPreview } from "@/components/documents/document-preview";
import { DocumentActions } from "@/components/documents/document-actions";
import {
  FileSpreadsheet,
  Receipt,
  User,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = memoryStore.getDocumentById(id);

  if (!doc) {
    notFound();
  }

  const type = doc.type as "proposal" | "invoice";
  const payload = doc.payload || {};
  const clientName = payload.client?.name || "Client";
  const projectName = payload.project?.name || doc.title || "Project";

  return (
    <div>
      <Header
        title={`${type === "proposal" ? "Proposal" : "Invoice"} ${doc.number}`}
        subtitle={`${projectName} • ${clientName}`}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Document Status Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              type === "proposal" ? "bg-purple-600 shadow-purple-500/20" : "bg-indigo-600 shadow-indigo-500/20"
            }`}>
              {type === "proposal" ? <FileSpreadsheet className="w-6 h-6" /> : <Receipt className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {type === "proposal" ? "Proposal" : "Invoice"}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                  {doc.status}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">{doc.number}</h1>
              <p className="text-xs text-slate-500">{doc.title}</p>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <DocumentActions doc={doc} />
        </div>

        {/* Metadata Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Client Information */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase">
              <User className="w-4 h-4 text-purple-600" />
              <span>Informasi Klien</span>
            </div>
            <p className="font-bold text-sm text-slate-900">{clientName}</p>
            {payload.client?.companyName && (
              <p className="text-xs text-slate-600">{payload.client.companyName}</p>
            )}
            {payload.client?.phone && (
              <p className="text-xs text-slate-500">{payload.client.phone}</p>
            )}
          </div>

          {/* Project Summary */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Informasi Project</span>
            </div>
            <p className="font-bold text-sm text-slate-900">{projectName}</p>
            <p className="text-xs text-slate-600">{payload.project?.category || "Website Multipage"}</p>
          </div>

          {/* Financial Summary */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span>Ringkasan Finansial</span>
            </div>
            <p className="font-extrabold text-lg text-purple-950">{formatIDR(doc.total)}</p>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>DP {doc.dpPercentage}%: {formatIDR(doc.dpAmount)}</span>
              <span>Sisa: {formatIDR(doc.remainingAmount)}</span>
            </div>
          </div>
        </div>

        {/* HTML Document Live Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Live Document HTML Preview</span>
            </h3>
            <span className="text-xs text-slate-500">Persis dengan tampilan `.docx` master template</span>
          </div>

          <DocumentPreview type={type} payload={payload} />
        </div>

        {/* Activity Metadata Footer */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-500 flex flex-wrap justify-between gap-2">
          <span>Dibuat: {formatIndonesianDate(doc.createdAt)}</span>
          <span>Terakhir Diperbarui: {formatIndonesianDate(doc.updatedAt)}</span>
          <span>Terakhir Digenerate DOCX: {doc.generatedAt ? formatIndonesianDate(doc.generatedAt) : "Belum pernah"}</span>
        </div>
      </div>
    </div>
  );
}
