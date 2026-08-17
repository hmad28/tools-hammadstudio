import { formatIDR } from "@/lib/formatters";
import { FileText, FileSpreadsheet, Receipt, DollarSign, Clock, CheckCircle2 } from "lucide-react";

interface MetricsProps {
  totalDocuments: number;
  proposalsCount: number;
  invoicesCount: number;
  totalProjectValue: number;
  outstandingPayments: number;
  paidRevenue: number;
}

export function MetricsCards({
  totalDocuments,
  proposalsCount,
  invoicesCount,
  totalProjectValue,
  outstandingPayments,
  paidRevenue,
}: MetricsProps) {
  const cards = [
    {
      title: "Total Dokumen",
      value: totalDocuments,
      icon: FileText,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      description: "Proposal & Invoice terdaftar",
    },
    {
      title: "Proposal",
      value: proposalsCount,
      icon: FileSpreadsheet,
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
      description: "Penawaran project",
    },
    {
      title: "Invoice",
      value: invoicesCount,
      icon: Receipt,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
      description: "Tagihan pembayaran",
    },
    {
      title: "Total Nilai Project",
      value: formatIDR(totalProjectValue),
      icon: DollarSign,
      color: "bg-slate-900/5 text-slate-900 border-slate-200",
      description: "Akumulasi nilai seluruh project",
    },
    {
      title: "Tagihan Outstanding",
      value: formatIDR(outstandingPayments),
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 border-amber-200",
      description: "Menunggu pelunasan klien",
    },
    {
      title: "Pendapatan Masuk",
      value: formatIDR(paidRevenue),
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      description: "Pembayaran terkonfirmasi",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wide">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
