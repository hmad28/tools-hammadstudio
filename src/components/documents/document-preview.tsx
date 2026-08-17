"use client";

import { formatIDR, formatIndonesianDate } from "@/lib/formatters";
import { Check, Info, FileSpreadsheet, Receipt } from "lucide-react";

interface DocumentPreviewProps {
  type: "proposal" | "invoice";
  payload: any;
}

export function DocumentPreview({ type, payload }: DocumentPreviewProps) {
  if (!payload) return null;

  if (type === "proposal") {
    const clientName = payload.client?.name || "Nama Client";
    const proposalTitle = payload.proposalTitle || "REBRANDING WEBSITE";
    const promoLabel = payload.promoLabel || "Spesial Project";
    const estimatedTimeline = payload.estimatedTimeline || "7-14 Hari Kerja";
    const domainLabel = payload.domainIncludeLabel || "Domain .id Termasuk";
    const proposalDate = formatIndonesianDate(payload.proposalDate || payload.issueDate);
    const projectValue = payload.projectValueLabel || formatIDR(payload.primaryPackage?.finalPrice || payload.total);

    return (
      <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-inner">
        <div className="bg-white max-w-3xl mx-auto rounded-xl border border-slate-300 shadow-xl overflow-hidden font-sans text-slate-800 text-sm">
          {/* Top Header Branding */}
          <div className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between border-b-4 border-purple-600">
            <div>
              <div className="text-xl font-black tracking-tight text-white">Hammad Studio</div>
              <p className="text-xs text-purple-300 font-medium">www.hammad.studio</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-purple-600/30 text-purple-200 text-[11px] font-semibold px-3 py-1 rounded-full border border-purple-400/30">
                PROPOSAL PROJECT
              </span>
              <p className="text-xs text-slate-400 mt-1">{proposalDate}</p>
            </div>
          </div>

          {/* Cover Header */}
          <div className="p-8 bg-gradient-to-br from-purple-50 via-white to-slate-50 border-b border-slate-200">
            <h1 className="text-2xl font-extrabold text-purple-950 tracking-tight">{proposalTitle}</h1>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{clientName.toUpperCase()}</h2>
            <p className="text-slate-600 text-xs mt-3 leading-relaxed max-w-xl">
              {payload.coverDescription}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">UNTUK</span>
                <p className="font-semibold text-slate-900 text-xs">{clientName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">PROMO</span>
                <p className="font-semibold text-purple-700 text-xs">{promoLabel}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">ESTIMASI</span>
                <p className="font-semibold text-slate-900 text-xs">{estimatedTimeline}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">NILAI PROJECT</span>
                <p className="font-bold text-purple-700 text-xs">{projectValue}</p>
              </div>
            </div>
          </div>

          {/* Section 01: Project Summary */}
          <div className="p-8 border-b border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-purple-900 font-bold text-base border-b border-purple-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">01</span>
              <h3>Ringkasan Project</h3>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {payload.projectHeadline}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {payload.projectOverview}
            </p>

            {payload.objectives && payload.objectives.length > 0 && (
              <div className="mt-4 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Tujuan Utama</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {payload.objectives.map((obj: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="font-bold text-xs text-purple-950">
                        {String(idx + 1).padStart(2, "0")} — {obj.title}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{obj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 02: Scope & Deliverables */}
          <div className="p-8 border-b border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-purple-900 font-bold text-base border-b border-purple-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">02</span>
              <h3>Scope & Deliverables</h3>
            </div>
            <p className="text-xs text-slate-500 italic">{payload.scopeIntro}</p>

            {/* Scope Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 w-1/4">Area</th>
                    <th className="py-2.5 px-4 w-1/2">Cakupan</th>
                    <th className="py-2.5 px-4 w-1/4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {payload.scopes?.map((s: any, idx: number) => (
                    <tr key={idx} className={s.status === "included" ? "bg-white" : "bg-slate-50/50"}>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{s.area}</td>
                      <td className="py-2.5 px-4 text-slate-600">{s.description}</td>
                      <td className="py-2.5 px-4">
                        {s.status === "included" && (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Termasuk</span>
                          </span>
                        )}
                        {s.status === "optional" && (
                          <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                            {s.statusText || `Opsional ${s.optionalPrice ? formatIDR(s.optionalPrice) : ""}`}
                          </span>
                        )}
                        {s.status === "excluded" && (
                          <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                            Belum Termasuk
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 03: Timeline & Investment */}
          <div className="p-8 border-b border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-purple-900 font-bold text-base border-b border-purple-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">03</span>
              <h3>Timeline & Investasi</h3>
            </div>

            {/* Packages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl border-2 border-purple-600 bg-purple-50/40 relative">
                <span className="absolute -top-3 left-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Paket Utama
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">
                  {payload.primaryPackage?.name}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {payload.primaryPackage?.description}
                </p>
                <div className="mt-3 text-lg font-black text-purple-900">
                  {formatIDR(payload.primaryPackage?.finalPrice)}
                </div>
              </div>

              {payload.optionalPackage && (
                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 relative">
                  <span className="absolute -top-3 left-4 bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Paket Upgrade / Opsional
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {payload.optionalPackage?.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {payload.optionalPackage?.description}
                  </p>
                  <div className="mt-3 text-lg font-bold text-slate-900">
                    {formatIDR(payload.optionalPackage?.price)}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Scheme */}
            <div className="mt-4 p-3 bg-purple-100/50 rounded-lg border border-purple-200 text-xs flex justify-around text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-700">DP {payload.dpPercent || 50}%</span>
                <p className="font-bold text-purple-950">
                  {formatIDR(payload.dpAmount || Math.round(((payload.primaryPackage?.finalPrice || payload.total || 0) * (payload.dpPercent || 50)) / 100))}
                </p>
              </div>
              <div className="border-r border-purple-200" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600">Pelunasan {100 - (payload.dpPercent || 50)}%</span>
                <p className="font-bold text-slate-900">
                  {formatIDR(payload.remainingAmount || Math.round((payload.primaryPackage?.finalPrice || payload.total || 0) - ((payload.primaryPackage?.finalPrice || payload.total || 0) * (payload.dpPercent || 50)) / 100))}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-900 text-slate-400 p-6 text-[11px] flex justify-between items-center">
            <span>www.hammad.studio</span>
            <span>CONFIDENTIAL</span>
          </div>
        </div>
      </div>
    );
  }

  // INVOICE PREVIEW
  const clientName = payload.client?.name || "Nama Client";
  const invoiceNumber = payload.invoiceNumber || payload.number || "INV-HS-001";
  const issueDate = formatIndonesianDate(payload.issueDate);
  const dueDate = payload.dueDate || "Saat diterima";
  const statusText = payload.statusText || payload.status || "MENUNGGU PEMBAYARAN";

  return (
    <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-inner">
      <div className="bg-white max-w-3xl mx-auto rounded-xl border border-slate-300 shadow-xl overflow-hidden font-sans text-slate-800 text-sm">
        {/* Top Invoice Header */}
        <div className="bg-slate-900 text-white p-8 border-b-4 border-indigo-600">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-black text-white">Hammad Studio</div>
              <p className="text-xs text-indigo-300">Web Development & Digital Solutions • www.hammad.studio</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded">
                {statusText}
              </span>
              <h2 className="text-2xl font-black text-white tracking-widest mt-2">INVOICE</h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-4 border-t border-slate-800 pt-3">
            {payload.invoiceSubtitle}
          </p>
        </div>

        {/* Invoice Meta Grid */}
        <div className="p-8 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">NO. INVOICE</span>
            <p className="font-bold text-indigo-950 mt-0.5">{invoiceNumber}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">TANGGAL</span>
            <p className="font-semibold text-slate-800 mt-0.5">{issueDate}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">JATUH TEMPO</span>
            <p className="font-semibold text-slate-800 mt-0.5">{dueDate}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">DITAGIHKAN KEPADA</span>
            <p className="font-bold text-slate-900 mt-0.5">{clientName}</p>
            {payload.client?.contact && <p className="text-[11px] text-slate-500">{payload.client.contact}</p>}
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="p-8 border-b border-slate-200">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">RINCIAN TAGIHAN</h3>
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 w-3/5">Deskripsi</th>
                <th className="py-2.5 px-4 text-center">QTY</th>
                <th className="py-2.5 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payload.items?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{item.description}</p>
                    {item.details && <p className="text-[11px] text-slate-500 mt-0.5">{item.details}</p>}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">{item.quantity || 1}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{formatIDR(item.total || item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="mt-4 ml-auto max-w-xs space-y-1.5 text-xs text-right border-t border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Total Project:</span>
              <span className="font-semibold text-slate-900">{formatIDR(payload.total)}</span>
            </div>
            <div className="flex justify-between text-indigo-700 font-bold bg-indigo-50 p-2 rounded border border-indigo-100">
              <span>DP {payload.dpPercentage || 50}% (Dibayar Sekarang):</span>
              <span>{formatIDR(payload.dpAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Sisa Pelunasan:</span>
              <span>{formatIDR(payload.remainingAmount)}</span>
            </div>
          </div>
        </div>

        {/* Bank Accounts Info */}
        <div className="p-8 bg-slate-50 border-b border-slate-200">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">INFORMASI PEMBAYARAN</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {payload.banks?.map((bank: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">{bank.bankName}</span>
                <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">{bank.accountNumber}</p>
                <p className="text-[11px] text-slate-500">{bank.accountHolder}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {payload.notes && payload.notes.length > 0 && (
          <div className="p-6 bg-white text-xs text-slate-600 space-y-1">
            {payload.notes.map((note: string, idx: number) => (
              <p key={idx} className="flex items-start space-x-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>{note}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
