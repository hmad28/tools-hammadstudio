"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { memoryStore, Client } from "@/db/store";
import { formatIDR } from "@/lib/formatters";
import {
  Users,
  Plus,
  Building,
  Phone,
  Mail,
  Globe,
  FileSpreadsheet,
  Receipt,
  Search,
  ChevronRight,
  Briefcase,
  X,
  Edit,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState(memoryStore.getClients());
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    companyName: "",
    picName: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    notes: "",
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      companyName: "",
      picName: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Nama klien wajib diisi");
      return;
    }
    const saved = memoryStore.saveClient(formData as any);
    setClients(memoryStore.getClients());
    setSelectedClient(saved);
    setIsModalOpen(false);
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.companyName || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  // Calculate client metrics if selected
  const allDocs = memoryStore.getDocuments();
  const allProjects = memoryStore.getProjects();

  const clientProjects = selectedClient
    ? allProjects.filter((p) => p.clientId === selectedClient.id)
    : [];

  const clientDocs = selectedClient
    ? allDocs.filter((d) => d.clientId === selectedClient.id)
    : [];

  const clientProposals = clientDocs.filter((d) => d.type === "proposal");
  const clientInvoices = clientDocs.filter((d) => d.type === "invoice");

  const totalValue = clientDocs.reduce((acc, d) => acc + (d.total || 0), 0);
  const outstandingAmount = clientDocs.reduce((acc, d) => acc + (d.remainingAmount || 0), 0);

  return (
    <div>
      <Header
        title="Manajemen Klien"
        subtitle="Daftar & riwayat klien Hammad Studio"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Client List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Daftar Klien</span>
              </h2>
              <button
                onClick={handleOpenAdd}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Klien Baru</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari klien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Belum ada klien ditemukan.
                </div>
              ) : (
                filteredClients.map((c) => {
                  const isSelected = selectedClient?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedClient(c)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "bg-purple-50 border-purple-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{c.name}</div>
                        {c.companyName && (
                          <div className="text-[11px] text-slate-500">{c.companyName}</div>
                        )}
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? "text-purple-600" : "text-slate-300"}`} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Client Detail Drawer */}
          <div className="lg:col-span-2 space-y-6">
            {selectedClient ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-extrabold text-slate-900">{selectedClient.name}</h2>
                      <button
                        onClick={() => handleOpenEdit(selectedClient)}
                        className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    {selectedClient.companyName && (
                      <p className="text-xs text-slate-500 font-medium">{selectedClient.companyName}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/documents/proposals/new"
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center space-x-1"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Buat Proposal</span>
                    </Link>
                    <Link
                      href="/documents/invoices/new"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center space-x-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Buat Invoice</span>
                    </Link>
                  </div>
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">PIC</span>
                    <p className="font-semibold text-slate-800">{selectedClient.picName || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Telepon / WhatsApp</span>
                    <p className="font-semibold text-slate-800">{selectedClient.phone || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Email</span>
                    <p className="font-semibold text-slate-800">{selectedClient.email || "-"}</p>
                  </div>
                </div>

                {/* Client Financial Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200">
                    <span className="text-[10px] font-bold text-purple-700 uppercase">Total Project Value</span>
                    <div className="text-xl font-black text-purple-950 mt-1">{formatIDR(totalValue)}</div>
                  </div>
                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">Tagihan Outstanding</span>
                    <div className="text-xl font-black text-amber-950 mt-1">{formatIDR(outstandingAmount)}</div>
                  </div>
                </div>

                {/* Client Documents History */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs text-slate-900 uppercase">Riwayat Dokumen Klien</h3>
                  <div className="space-y-2">
                    {clientDocs.length === 0 ? (
                      <p className="text-xs text-slate-400">Belum ada dokumen untuk klien ini.</p>
                    ) : (
                      clientDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{doc.number}</span>
                            <p className="text-[11px] text-slate-500">{doc.title}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-purple-950">{formatIDR(doc.total)}</span>
                            <p className="text-[10px] text-slate-400">{doc.status}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
                Pilih klien untuk melihat detail.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add/Edit Client */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {formData.id ? "Edit Data Klien" : "Tambah Klien Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Klien *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  placeholder="Jam Wisata"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Perusahaan</label>
                <input
                  type="text"
                  value={formData.companyName || ""}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  placeholder="PT Jam Wisata Indonesia"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama PIC</label>
                  <input
                    type="text"
                    value={formData.picName || ""}
                    onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    placeholder="Bapak Ahmad"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    placeholder="+62 852-2292-7499"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  placeholder="info@jamwisata.com"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-xs"
                >
                  Simpan Klien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
