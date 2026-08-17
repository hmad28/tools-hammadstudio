"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { memoryStore, Project } from "@/db/store";
import { formatIDR, parseIDRInput } from "@/lib/formatters";
import { Briefcase, Plus, Search, Edit, X } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState(memoryStore.getProjects());
  const clients = memoryStore.getClients();
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    clientId: clients[0]?.id || "",
    category: "Landing Page",
    description: "",
    status: "Lead",
    basePrice: 799000,
    finalPrice: 399000,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      clientId: clients[0]?.id || "",
      category: "Landing Page",
      description: "",
      status: "Lead",
      basePrice: 799000,
      finalPrice: 399000,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setFormData(proj);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Nama project wajib diisi");
      return;
    }
    memoryStore.saveProject(formData as any);
    setProjects(memoryStore.getProjects());
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div>
      <Header
        title="Manajemen Project"
        subtitle="Daftar & status project Hammad Studio"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Project</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Nama Project</th>
                <th className="py-3.5 px-4">Klien</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Harga Final</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Belum ada project terdaftar.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const client = clients.find((c) => c.id === p.clientId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{client?.name || "-"}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{formatIDR(p.finalPrice)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-purple-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {formData.id ? "Edit Data Project" : "Tambah Project Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Project *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  placeholder="Website Travel Umrah Jam Wisata"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Klien</label>
                  <select
                    value={formData.clientId || ""}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Project</label>
                  <select
                    value={formData.category || "Landing Page"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Landing Page">Landing Page</option>
                    <option value="Company Profile">Company Profile</option>
                    <option value="Travel / Umrah Website">Travel / Umrah Website</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Business System">Business System</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="Website Redesign">Website Redesign</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Project</label>
                  <select
                    value={formData.status || "Lead"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Final Project (Rp)</label>
                  <input
                    type="text"
                    value={formatIDR(formData.finalPrice || 0)}
                    onChange={(e) => setFormData({ ...formData, finalPrice: parseIDRInput(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
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
                  Simpan Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
