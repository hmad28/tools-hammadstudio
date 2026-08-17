"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatIDR, parseIDRInput } from "@/lib/formatters";
import { DocumentPreview } from "./document-preview";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Download,
  Receipt,
  Building,
} from "lucide-react";

interface ClientOption {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}

interface ProjectOption {
  id: string;
  clientId?: string | null;
  name: string;
  category: string;
}

interface BankOption {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
}

interface InvoiceFormProps {
  initialData?: any;
  clients: ClientOption[];
  projects: ProjectOption[];
  bankAccounts: BankOption[];
}

export function InvoiceForm({ initialData, clients, projects, bankAccounts }: InvoiceFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client & Project Selection
  const [selectedClientId, setSelectedClientId] = useState(initialData?.clientId || clients[0]?.id || "");
  const [selectedProjectId, setSelectedProjectId] = useState(initialData?.projectId || projects[0]?.id || "");

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.number || initialData?.payload?.invoiceNumber || "");
  const [invoiceSubtitle, setInvoiceSubtitle] = useState(initialData?.payload?.invoiceSubtitle || "Pembayaran DP Project Website Travel Umroh Jam Wisata");
  const [status, setStatus] = useState(initialData?.status || "Waiting Payment");
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "Saat diterima");

  // Line Items
  const [items, setItems] = useState<any[]>(initialData?.payload?.items || [
    {
      description: "Website Travel Umroh Jam Wisata - Multipage (maks. 5 halaman)",
      details: "Domain .id 1 tahun, hosting 1 tahun, SSL, basic SEO, responsive, setup sampai online, dan maintenance konten dasar 1 tahun. CMS/dashboard tidak termasuk.",
      quantity: 1,
      unitPrice: 399000,
      total: 399000,
    },
  ]);

  // Discount & DP
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [dpPercent, setDpPercent] = useState(initialData?.dpPercentage || 50);
  const [paidAmount, setPaidAmount] = useState(initialData?.paidAmount || 0);

  // Bank Accounts selection (snapshot)
  const [selectedBanks, setSelectedBanks] = useState<any[]>(initialData?.payload?.banks || bankAccounts);

  // Notes
  const [notes, setNotes] = useState<string[]>(initialData?.payload?.notes || [
    "DP 50% digunakan untuk konfirmasi project dan reservasi slot pengerjaan.",
    "Sisa pelunasan dibayarkan setelah hasil final disetujui, sebelum website dipublikasikan ke domain utama.",
    "Mohon kirim bukti transfer setelah pembayaran agar dapat kami konfirmasi."
  ]);

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const total = Math.max(0, subtotal - discount);
  const dpAmount = Math.round((total * dpPercent) / 100);
  const remainingAmount = total - dpAmount;
  const outstandingAmount = Math.max(0, total - paidAmount);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const buildPayload = () => {
    return {
      invoiceNumber,
      invoiceSubtitle,
      statusText: status === "Waiting Payment" ? "MENUNGGU PEMBAYARAN" : status === "Paid" ? "LUNAS" : status.toUpperCase(),
      status,
      issueDate,
      dueDate,
      client: {
        id: selectedClient?.id,
        name: selectedClient?.name || "Client",
        contact: selectedClient?.phone || selectedClient?.email || "",
      },
      project: {
        id: selectedProject?.id,
        name: selectedProject?.name || "Project",
        meta: `${selectedProject?.category || "Website Multipage"} • ${issueDate}`,
      },
      projectName: selectedProject?.name || "Website Development",
      projectMeta: `${selectedProject?.category || "Website Multipage"}`,
      items,
      subtotal,
      discount,
      total,
      dpPercentage: dpPercent,
      dpAmount,
      remainingAmount,
      paidAmount,
      outstandingAmount,
      banks: selectedBanks,
      notes,
    };
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const documentRecord = {
        id: initialData?.id,
        type: "invoice",
        number: invoiceNumber || undefined,
        clientId: selectedClientId,
        projectId: selectedProjectId,
        title: `Invoice ${selectedProject?.name || invoiceSubtitle}`,
        status,
        issueDate,
        dueDate,
        currency: "IDR",
        subtotal,
        discount,
        total,
        dpPercentage: dpPercent,
        dpAmount,
        paidAmount,
        remainingAmount,
        payload,
      };

      const res = await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentRecord),
      });

      const data = await res.json();
      if (data.id) {
        router.push(`/documents/${data.id}`);
      } else {
        router.push("/documents");
      }
    } catch (err) {
      alert("Gagal menyimpan invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndGenerate = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const documentRecord = {
        id: initialData?.id,
        type: "invoice",
        number: invoiceNumber || undefined,
        clientId: selectedClientId,
        projectId: selectedProjectId,
        title: `Invoice ${selectedProject?.name || invoiceSubtitle}`,
        status: status || "Waiting Payment",
        issueDate,
        dueDate,
        currency: "IDR",
        subtotal,
        discount,
        total,
        dpPercentage: dpPercent,
        dpAmount,
        paidAmount,
        remainingAmount,
        payload,
      };

      const res = await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentRecord),
      });

      const data = await res.json();
      const docId = data.id || initialData?.id || "doc-inv-sample";

      window.location.href = `/api/documents/${docId}/download`;
      setTimeout(() => {
        router.push(`/documents/${docId}`);
      }, 1000);
    } catch (err) {
      alert("Gagal membuat DOCX invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    "1. Klien & Project",
    "2. Invoice Details",
    "3. Rincian Tagihan",
    "4. Bank & Pembayaran",
    "5. Catatan",
    "6. Review & Generate",
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Stepper Tabs */}
      <div className="flex items-center overflow-x-auto no-scrollbar space-x-2 border-b border-slate-200 pb-2">
        {steps.map((st, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <button
              key={st}
              onClick={() => setStep(stepNum)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : isDone
                  ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <span>{st}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: CLIENT & PROJECT */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
            <span>Klien & Project Target</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Klien *</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Project *</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.category}]
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: INVOICE DETAILS */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>Detail Invoice</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subjudul / Peruntukan Invoice</label>
              <input
                type="text"
                value={invoiceSubtitle}
                onChange={(e) => setInvoiceSubtitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                placeholder="Pembayaran DP Project Website Travel Umroh"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Invoice</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
              >
                <option value="Waiting Payment">Menunggu Pembayaran</option>
                <option value="Partially Paid">Dibayar Sebagian</option>
                <option value="Paid">Lunas</option>
                <option value="Draft">Draft</option>
                <option value="Cancelled">Dibatalkan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Invoice</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jatuh Tempo</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                placeholder="Saat diterima"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ITEMS */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Rincian Tagihan (Line Items)</span>
            </h2>
            <button
              onClick={() => setItems([...items, { description: "Item Baru", details: "Detail layanan", quantity: 1, unitPrice: 100000, total: 100000 }])}
              className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-700">Item #{idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Deskripsi Utama Item *</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].description = e.target.value;
                      setItems(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Detail & Fasilitas Inklusi</label>
                  <textarea
                    rows={2}
                    value={item.details}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].details = e.target.value;
                      setItems(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">QTY</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                        updated[idx].total = updated[idx].quantity * updated[idx].unitPrice;
                        setItems(updated);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Harga Satuan (Rp)</label>
                    <input
                      type="text"
                      value={formatIDR(item.unitPrice)}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[idx].unitPrice = parseIDRInput(e.target.value);
                        updated[idx].total = updated[idx].quantity * updated[idx].unitPrice;
                        setItems(updated);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Total Line Item</label>
                    <input
                      type="text"
                      readOnly
                      value={formatIDR(item.quantity * item.unitPrice)}
                      className="w-full bg-slate-200/60 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: BANKS & PAYMENTS */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">4</span>
            <span>Rekening Bank & Perhitungan Pembayaran</span>
          </h2>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-bold text-xs text-slate-900 uppercase">Perhitungan Finansial Server Validated</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold">SUBTOTAL</span>
                <p className="font-bold text-slate-900 text-sm">{formatIDR(subtotal)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold">TOTAL PROJECT</span>
                <p className="font-extrabold text-slate-900 text-sm">{formatIDR(total)}</p>
              </div>
              <div>
                <span className="text-[10px] text-indigo-600 font-bold">DP {dpPercent}% (SEKARANG)</span>
                <p className="font-extrabold text-indigo-900 text-sm">{formatIDR(dpAmount)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold">SISA PELUNASAN</span>
                <p className="font-bold text-slate-700 text-sm">{formatIDR(remainingAmount)}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase mb-3">Tampilkan Rekening Bank di Invoice</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {bankAccounts.map((b) => {
                const isChecked = selectedBanks.some((sb) => sb.bankName === b.bankName);
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedBanks(selectedBanks.filter((sb) => sb.bankName !== b.bankName));
                      } else {
                        setSelectedBanks([...selectedBanks, b]);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      isChecked ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-xs text-slate-900">{b.bankName}</span>
                    </div>
                    <p className="font-mono text-xs font-semibold text-slate-700 mt-1">{b.accountNumber}</p>
                    <p className="text-[10px] text-slate-500">{b.accountHolder}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: NOTES */}
      {step === 5 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">5</span>
            <span>Catatan Invoice</span>
          </h2>

          <div className="space-y-2">
            {notes.map((note, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => {
                    const updated = [...notes];
                    updated[idx] = e.target.value;
                    setNotes(updated);
                  }}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                />
                <button
                  onClick={() => setNotes(notes.filter((_, i) => i !== idx))}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setNotes([...notes, "Catatan tambahan."])}
              className="text-xs font-semibold text-slate-900 flex items-center space-x-1 mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Catatan</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: REVIEW */}
      {step === 6 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">6</span>
              <span>Review Data & Live Preview Invoice</span>
            </h2>
            <DocumentPreview type="invoice" payload={buildPayload()} />
          </div>
        </div>
      )}

      {/* Form Navigation Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <button
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draft</span>
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-xs transition"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveAndGenerate}
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isSubmitting ? "Generating DOCX..." : "Generate & Download Invoice DOCX"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
