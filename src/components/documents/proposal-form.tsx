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
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  Download,
  CheckCircle2,
  Sliders,
} from "lucide-react";

interface ClientOption {
  id: string;
  name: string;
  companyName?: string | null;
  picName?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface ProjectOption {
  id: string;
  clientId?: string | null;
  name: string;
  category: string;
}

interface PresetOption {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  defaultPayload: any;
}

interface ProposalFormProps {
  initialData?: any;
  clients: ClientOption[];
  projects: ProjectOption[];
  presets: PresetOption[];
}

export function ProposalForm({ initialData, clients, projects, presets }: ProposalFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState("");

  // Form State
  const [selectedClientId, setSelectedClientId] = useState(initialData?.clientId || clients[0]?.id || "");
  const [selectedProjectId, setSelectedProjectId] = useState(initialData?.projectId || projects[0]?.id || "");

  const [proposalNumber, setProposalNumber] = useState(initialData?.number || initialData?.payload?.proposalNumber || "");
  const [proposalTitle, setProposalTitle] = useState(initialData?.payload?.proposalTitle || "REBRANDING WEBSITE");
  const [coverDescription, setCoverDescription] = useState(initialData?.payload?.coverDescription || "Website Jam Wisata yang lebih modern, konsisten dengan Brand DNA, dan lebih profesional untuk memperkuat identitas serta kepercayaan calon jamaah.");
  const [promoLabel, setPromoLabel] = useState(initialData?.payload?.promoLabel || "Spesial Kemerdekaan");
  const [estimatedTimeline, setEstimatedTimeline] = useState(initialData?.payload?.estimatedTimeline || "7-14 Hari Kerja");
  const [domainIncludeLabel, setDomainIncludeLabel] = useState(initialData?.payload?.domainIncludeLabel || "Domain .id Termasuk");
  const [proposalDate, setProposalDate] = useState(initialData?.issueDate || new Date().toISOString().split("T")[0]);

  // Project Summary
  const [projectHeadline, setProjectHeadline] = useState(initialData?.payload?.projectHeadline || "Rebranding website yang membawa identitas Jam Wisata lebih kuat, modern, dan konsisten.");
  const [projectOverview, setProjectOverview] = useState(initialData?.payload?.projectOverview || "Hammad Studio akan melakukan rebranding website Jam Wisata dengan tampilan modern, profesional, mobile-friendly, dan konsisten dengan Brand DNA yang disiapkan Client. Project mencakup maksimal 5 halaman utama.");
  const [objectives, setObjectives] = useState(initialData?.payload?.objectives || [
    { title: "Memperkuat Brand", description: "Membawa identitas Jam Wisata secara lebih konsisten dan mudah dikenali melalui website." },
    { title: "Menampilkan Paket", description: "Menyajikan paket Umrah, Haji, dan perjalanan secara lebih rapi, jelas, dan menarik." },
    { title: "Mempermudah Konsultasi", description: "Mengarahkan calon jamaah ke WhatsApp dengan CTA yang jelas dan mudah ditemukan." },
    { title: "Fondasi Digital", description: "Basic SEO dan struktur website yang siap dikembangkan lebih lanjut ke CMS di tahap berikutnya." }
  ]);
  const [designDirections, setDesignDirections] = useState<string[]>(initialData?.payload?.designDirections || [
    "Visual modern, clean, dan profesional dengan arah desain mengikuti Brand DNA Jam Wisata serta referensi yang diberikan Client.",
    "Fokus mobile-first karena mayoritas calon jamaah akan mengakses website melalui smartphone.",
    "CTA WhatsApp dibuat jelas agar calon jamaah mudah berkonsultasi dan menghubungi tim Jam Wisata.",
    "Konten, warna, tipografi, dan layout disesuaikan dengan Brand DNA dan aset resmi Jam Wisata."
  ]);

  // Scope
  const [scopeIntro, setScopeIntro] = useState(initialData?.payload?.scopeIntro || "Paket Spesial Kemerdekaan: rebranding website Jam Wisata maksimal 5 halaman dengan domain .id Rp399.000.");
  const [scopes, setScopes] = useState<any[]>(initialData?.payload?.scopes || [
    { area: "Home", description: "Hero, identitas Jam Wisata, highlight paket, trust point, dan CTA WhatsApp.", status: "included" },
    { area: "Paket / Program", description: "Informasi paket Umrah/Haji/Tour, jadwal, harga, fasilitas, dan detail penting sesuai materi Client.", status: "included" },
    { area: "Tentang / Legalitas", description: "Profil Jam Wisata, value/keunggulan, legalitas, pengalaman, dan informasi perusahaan.", status: "included" },
    { area: "Kontak / Konsultasi", description: "WhatsApp, alamat/maps, social media, dan CTA konsultasi calon jamaah.", status: "included" },
    { area: "Galeri & Testimoni", description: "Dokumentasi perjalanan dan testimoni dapat ditempatkan sebagai halaman/section sesuai struktur final.", status: "included" },
    { area: "Dashboard / CMS", description: "Pengelolaan paket, artikel, galeri, testimoni, dan konten melalui dashboard admin.", status: "optional", optionalPrice: 400000, statusText: "Belum Termasuk - Opsional - Paket Rp799.000" },
    { area: "Navigasi & CTA", description: "Menu antar halaman dan CTA WhatsApp agar alur calon jamaah tetap jelas dan mudah.", status: "included" },
    { area: "Rebranding & Brand DNA", description: "Implementasi warna, tipografi, tone visual, dan elemen identitas berdasarkan Brand DNA Jam Wisata.", status: "included" },
    { area: "Google Ads Management", description: "Setup/optimasi campaign dan pengelolaan Google Ads berbayar.", status: "excluded" }
  ]);

  // Client Materials
  const [clientMaterials, setClientMaterials] = useState<string[]>(initialData?.payload?.clientMaterials || [
    "Brand DNA Jam Wisata, logo, warna, font, dan guideline/arah visual yang tersedia.",
    "Materi paket Umrah/Haji/Tour, foto perjalanan, fasilitas, harga, jadwal, dan informasi layanan yang ingin ditampilkan.",
    "Legalitas/profil perusahaan, alamat, WhatsApp, social media, testimoni, dan materi pendukung lainnya."
  ]);

  // Timeline
  const [timelinePhases, setTimelinePhases] = useState<any[]>(initialData?.payload?.timelinePhases || [
    { number: 1, title: "Kickoff & Materi", duration: "Hari 1-2", description: "Konfirmasi Brand DNA, struktur maksimal 5 halaman, domain, aset, konten, dan referensi visual." },
    { number: 2, title: "Design & Development", duration: "Hari 2-8", description: "Pembuatan struktur maksimal 5 halaman, implementasi Brand DNA, responsive layout, navigasi, dan integrasi CTA." },
    { number: 3, title: "Review Client", duration: "Hari 8-10", description: "Client mengecek hasil dan mengirim feedback terstruktur." },
    { number: 4, title: "Revisi & Final QA", duration: "Hari 10-12", description: "Penyesuaian sesuai scope, testing mobile/desktop, dan optimasi dasar." },
    { number: 5, title: "Go-Live & Serah Terima", duration: "Maks. Hari 14", description: "Setup domain, publish, pengecekan akhir, dan serah terima project." }
  ]);

  // Investment / Pricing
  const [normalPrice, setNormalPrice] = useState(initialData?.payload?.primaryPackage?.normalPrice || 799000);
  const [discount, setDiscount] = useState(initialData?.payload?.primaryPackage?.discount || 400000);
  const [finalPrice, setFinalPrice] = useState(initialData?.payload?.primaryPackage?.finalPrice || 399000);
  const [primaryPkgName, setPrimaryPkgName] = useState(initialData?.payload?.primaryPackage?.name || "PAKET SPESIAL KEMERDEKAAN - REBRANDING JAM WISATA");
  const [primaryPkgDesc, setPrimaryPkgDesc] = useState(initialData?.payload?.primaryPackage?.description || "Maksimal 5 halaman + domain .id 1 tahun + hosting + SSL + responsive + basic SEO + setup sampai online. Desain mengikuti Brand DNA Jam Wisata. Tanpa CMS.");

  const [optPkgName, setOptPkgName] = useState(initialData?.payload?.optionalPackage?.name || "PROMO SPESIAL KEMERDEKAAN - WEBSITE MULTIPAGE + CMS");
  const [optPkgDesc, setOptPkgDesc] = useState(initialData?.payload?.optionalPackage?.description || "Seluruh fasilitas paket multipage + dashboard CMS untuk kelola armada, harga, layanan, galeri, dan konten secara mandiri.");
  const [optPkgPrice, setOptPkgPrice] = useState(initialData?.payload?.optionalPackage?.price || 799000);

  const [dpPercent, setDpPercent] = useState(initialData?.dpPercentage || 50);

  // Terms
  const [terms, setTerms] = useState<any[]>(initialData?.payload?.terms || [
    { title: "SCOPE", body: "Harga Rp399.000 berlaku untuk rebranding website Jam Wisata maksimal 5 halaman tanpa CMS sesuai scope proposal." },
    { title: "CMS / SUPPORT", body: "Project tahap awal tidak termasuk dashboard CMS. Perubahan konten setelah serah terima dapat dibantu berdasarkan kebutuhan." },
    { title: "REVISI", body: "Termasuk maksimal 2 putaran revisi minor pada tahap review." },
    { title: "DOMAIN & HOSTING", body: "Domain .id, hosting, dan SSL termasuk untuk 1 tahun pertama." },
    { title: "ASET & KONTEN", body: "Jam Wisata menyediakan Brand DNA, logo, materi paket, foto, dan legalitas." },
    { title: "SEO", body: "Basic SEO berarti fondasi on-page dan technical setup dasar." },
    { title: "OWNERSHIP", body: "Akses dan aset project diserahterimakan sesuai kesepakatan setelah kewajiban pembayaran selesai." }
  ]);

  const [closingMessage, setClosingMessage] = useState(initialData?.payload?.closingMessage || "Setelah proposal disetujui, Hammad Studio akan menyiapkan MoU/perjanjian kerja dan invoice DP sebelum pengerjaan dimulai.");

  // Recalculate price when normalPrice or discount changes
  useEffect(() => {
    const calculated = Math.max(0, normalPrice - discount);
    setFinalPrice(calculated);
  }, [normalPrice, discount]);

  // Apply Preset Payload
  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = presets.find((pr) => pr.id === presetId);
    if (!p || !p.defaultPayload) return;

    const dp = p.defaultPayload;
    if (dp.proposalTitle) setProposalTitle(dp.proposalTitle);
    if (dp.coverDescription) setCoverDescription(dp.coverDescription);
    if (dp.promoLabel) setPromoLabel(dp.promoLabel);
    if (dp.estimatedTimeline) setEstimatedTimeline(dp.estimatedTimeline);
    if (dp.domainIncludeLabel) setDomainIncludeLabel(dp.domainIncludeLabel);
    if (dp.projectHeadline) setProjectHeadline(dp.projectHeadline);
    if (dp.projectOverview) setProjectOverview(dp.projectOverview);
    if (dp.objectives) setObjectives(dp.objectives);
    if (dp.designDirections) setDesignDirections(dp.designDirections);
    if (dp.scopeIntro) setScopeIntro(dp.scopeIntro);
    if (dp.scopes) setScopes(dp.scopes);
    if (dp.clientMaterials) setClientMaterials(dp.clientMaterials);
    if (dp.timelinePhases) setTimelinePhases(dp.timelinePhases);
    if (dp.primaryPackage) {
      setPrimaryPkgName(dp.primaryPackage.name || primaryPkgName);
      setPrimaryPkgDesc(dp.primaryPackage.description || primaryPkgDesc);
      setNormalPrice(dp.primaryPackage.normalPrice || 799000);
      setDiscount(dp.primaryPackage.discount || 400000);
      setFinalPrice(dp.primaryPackage.finalPrice || 399000);
    }
    if (dp.optionalPackage) {
      setOptPkgName(dp.optionalPackage.name || optPkgName);
      setOptPkgDesc(dp.optionalPackage.description || optPkgDesc);
      setOptPkgPrice(dp.optionalPackage.price || 799000);
    }
    if (dp.dpPercent) setDpPercent(dp.dpPercent);
    if (dp.closingMessage) setClosingMessage(dp.closingMessage);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const calculatedDpAmount = Math.round((finalPrice * dpPercent) / 100);
  const calculatedRemainingAmount = finalPrice - calculatedDpAmount;

  // Build Document Payload
  const buildPayload = () => {
    return {
      proposalNumber,
      proposalTitle,
      coverDescription,
      promoLabel,
      estimatedTimeline,
      domainIncludeLabel,
      proposalDate,
      projectValueLabel: `${formatIDR(finalPrice)} (Maks. 5 Halaman)`,
      client: {
        id: selectedClient?.id,
        name: selectedClient?.name || "Client",
        companyName: selectedClient?.companyName,
        picName: selectedClient?.picName,
        phone: selectedClient?.phone,
        email: selectedClient?.email,
      },
      project: {
        id: selectedProject?.id,
        name: selectedProject?.name || "Project",
        category: selectedProject?.category || "Landing Page",
      },
      projectHeadline,
      projectOverview,
      objectives,
      designDirections,
      scopeIntro,
      scopes,
      inclusions: [
        { name: "Domain .id", value: "1 tahun" },
        { name: "Hosting", value: "1 tahun" },
        { name: "SSL / HTTPS", value: "aktif" },
        { name: "Responsive", value: "desktop & mobile" },
        { name: "Basic SEO", value: "on-page foundation" },
        { name: "Setup", value: "sampai online" }
      ],
      clientMaterials,
      timelinePhases,
      primaryPackage: {
        name: primaryPkgName,
        description: primaryPkgDesc,
        normalPrice,
        discount,
        finalPrice,
      },
      optionalPackage: {
        name: optPkgName,
        description: optPkgDesc,
        price: optPkgPrice,
      },
      total: finalPrice,
      dpPercent,
      dpAmount: calculatedDpAmount,
      remainingAmount: calculatedRemainingAmount,
      terms,
      closingMessage,
    };
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const documentRecord = {
        id: initialData?.id,
        type: "proposal",
        number: proposalNumber || undefined,
        clientId: selectedClientId,
        projectId: selectedProjectId,
        title: `Proposal ${selectedProject?.name || proposalTitle}`,
        status: initialData?.status || "Draft",
        issueDate: proposalDate,
        currency: "IDR",
        subtotal: normalPrice,
        discount: discount,
        total: finalPrice,
        dpPercentage: dpPercent,
        dpAmount: calculatedDpAmount,
        paidAmount: 0,
        remainingAmount: calculatedRemainingAmount,
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
        alert("Berhasil menyimpan draft!");
        router.push("/documents");
      }
    } catch (err) {
      alert("Gagal menyimpan proposal");
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
        type: "proposal",
        number: proposalNumber || undefined,
        clientId: selectedClientId,
        projectId: selectedProjectId,
        title: `Proposal ${selectedProject?.name || proposalTitle}`,
        status: "Approved",
        issueDate: proposalDate,
        currency: "IDR",
        subtotal: normalPrice,
        discount: discount,
        total: finalPrice,
        dpPercentage: dpPercent,
        dpAmount: calculatedDpAmount,
        paidAmount: 0,
        remainingAmount: calculatedRemainingAmount,
        payload,
      };

      const res = await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentRecord),
      });

      const data = await res.json();
      const docId = data.id || initialData?.id || "doc-prop-sample";

      // Trigger binary download directly
      window.location.href = `/api/documents/${docId}/download`;
      setTimeout(() => {
        router.push(`/documents/${docId}`);
      }, 1000);
    } catch (err) {
      alert("Gagal membuat DOCX proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    "1. Klien & Project",
    "2. Summary",
    "3. Scope",
    "4. Timeline",
    "5. Investasi",
    "6. Ketentuan",
    "7. Review & Generate",
  ];

  return (
    <div className="space-y-6">
      {/* Preset Selector Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-purple-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Gunakan Scope Preset Studio</h3>
            <p className="text-xs text-purple-200">Pilih preset untuk mengisi scope, timeline & ketentuan otomatis.</p>
          </div>
        </div>
        <select
          value={selectedPresetId}
          onChange={(e) => handleApplyPreset(e.target.value)}
          className="bg-slate-800 border border-purple-400/40 text-white text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
        >
          <option value="">-- Pilih Preset Scope --</option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.category})
            </option>
          ))}
        </select>
      </div>

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
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-purple-600 text-white shadow-sm"
                  : isDone
                  ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
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
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">1</span>
            <span>Informasi Klien & Project</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Klien *</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Project *</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.category}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Proposal (Cover)</label>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                placeholder="REBRANDING WEBSITE"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Proposal</label>
              <input
                type="date"
                value={proposalDate}
                onChange={(e) => setProposalDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Label Promo</label>
              <input
                type="text"
                value={promoLabel}
                onChange={(e) => setPromoLabel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                placeholder="Spesial Kemerdekaan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimasi Timeline Cover</label>
              <input
                type="text"
                value={estimatedTimeline}
                onChange={(e) => setEstimatedTimeline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                placeholder="7-14 Hari Kerja"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Halaman Cover</label>
            <textarea
              rows={3}
              value={coverDescription}
              onChange={(e) => setCoverDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {/* STEP 2: SUMMARY & OBJECTIVES */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">2</span>
            <span>Ringkasan & Tujuan Utama</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Headline</label>
            <input
              type="text"
              value={projectHeadline}
              onChange={(e) => setProjectHeadline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Overview</label>
            <textarea
              rows={3}
              value={projectOverview}
              onChange={(e) => setProjectOverview(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
            />
          </div>

          {/* Dynamic Objectives */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-900 uppercase">Tujuan Utama Project (Max 4)</label>
              {objectives.length < 4 && (
                <button
                  onClick={() => setObjectives([...objectives, { title: "Tujuan Baru", description: "Deskripsi tujuan" }])}
                  className="text-purple-600 hover:text-purple-700 text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tujuan</span>
                </button>
              )}
            </div>

            {objectives.map((obj: { title: string; description: string }, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-900">0{idx + 1}</span>
                  {objectives.length > 1 && (
                    <button
                      onClick={() => setObjectives(objectives.filter((_: any, i: number) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={obj.title}
                    onChange={(e) => {
                      const updated = [...objectives];
                      updated[idx].title = e.target.value;
                      setObjectives(updated);
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                    placeholder="Judul Tujuan"
                  />
                  <input
                    type="text"
                    value={obj.description}
                    onChange={(e) => {
                      const updated = [...objectives];
                      updated[idx].description = e.target.value;
                      setObjectives(updated);
                    }}
                    className="sm:col-span-2 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                    placeholder="Deskripsi Singkat"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: SCOPE & DELIVERABLES */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>Scope & Deliverables</span>
            </h2>
            <button
              onClick={() => setScopes([...scopes, { area: "Area Baru", description: "Cakupan pengerjaan", status: "included" }])}
              className="bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Scope</span>
            </button>
          </div>

          <div className="space-y-3">
            {scopes.map((s, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={s.area}
                    onChange={(e) => {
                      const updated = [...scopes];
                      updated[idx].area = e.target.value;
                      setScopes(updated);
                    }}
                    className="font-bold text-xs text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 w-1/3"
                    placeholder="Nama Area"
                  />
                  <select
                    value={s.status}
                    onChange={(e) => {
                      const updated = [...scopes];
                      updated[idx].status = e.target.value;
                      setScopes(updated);
                    }}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800"
                  >
                    <option value="included">Termasuk</option>
                    <option value="optional">Opsional</option>
                    <option value="excluded">Belum Termasuk</option>
                  </select>

                  <button
                    onClick={() => setScopes(scopes.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={s.description}
                  onChange={(e) => {
                    const updated = [...scopes];
                    updated[idx].description = e.target.value;
                    setScopes(updated);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                  placeholder="Detail cakupan pekerjaan"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: TIMELINE & PHASES */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">4</span>
              <span>Timeline Pengerjaan</span>
            </h2>
            {timelinePhases.length < 5 && (
              <button
                onClick={() => setTimelinePhases([...timelinePhases, { number: timelinePhases.length + 1, title: "Tahap Baru", duration: "Hari 1", description: "Deskripsi" }])}
                className="bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tahap</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {timelinePhases.map((phase, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-purple-900">0{idx + 1}</span>
                  <input
                    type="text"
                    value={phase.title}
                    onChange={(e) => {
                      const updated = [...timelinePhases];
                      updated[idx].title = e.target.value;
                      setTimelinePhases(updated);
                    }}
                    className="font-bold text-xs text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 flex-1"
                    placeholder="Judul Tahap"
                  />
                  <input
                    type="text"
                    value={phase.duration}
                    onChange={(e) => {
                      const updated = [...timelinePhases];
                      updated[idx].duration = e.target.value;
                      setTimelinePhases(updated);
                    }}
                    className="text-xs font-semibold text-purple-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 w-28"
                    placeholder="Hari 1-2"
                  />
                </div>
                <input
                  type="text"
                  value={phase.description}
                  onChange={(e) => {
                    const updated = [...timelinePhases];
                    updated[idx].description = e.target.value;
                    setTimelinePhases(updated);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                  placeholder="Deskripsi kegiatan di tahap ini"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: INVESTMENT & PAYMENT */}
      {step === 5 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">5</span>
            <span>Investasi & Pembayaran</span>
          </h2>

          <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-4">
            <h3 className="font-bold text-xs text-purple-950 uppercase">Paket Utama</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Paket Utama</label>
              <input
                type="text"
                value={primaryPkgName}
                onChange={(e) => setPrimaryPkgName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Normal (Rp)</label>
                <input
                  type="text"
                  value={formatIDR(normalPrice)}
                  onChange={(e) => setNormalPrice(parseIDRInput(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diskon Promo (Rp)</label>
                <input
                  type="text"
                  value={formatIDR(discount)}
                  onChange={(e) => setDiscount(parseIDRInput(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Final Project (Rp)</label>
                <input
                  type="text"
                  readOnly
                  value={formatIDR(finalPrice)}
                  className="w-full bg-purple-100/60 border border-purple-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-purple-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Paket Utama</label>
              <textarea
                rows={2}
                value={primaryPkgDesc}
                onChange={(e) => setPrimaryPkgDesc(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700"
              />
            </div>
          </div>

          {/* Skema DP */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-bold text-xs text-slate-900 uppercase">Skema Pembayaran</h3>
            <div className="flex items-center space-x-3">
              <label className="text-xs font-semibold text-slate-700">DP Percentage:</label>
              <select
                value={dpPercent}
                onChange={(e) => setDpPercent(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-purple-900"
              >
                <option value={30}>30% DP</option>
                <option value={50}>50% DP</option>
                <option value={100}>100% Full</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-bold">JUMLAH DP ({dpPercent}%)</span>
                <p className="text-sm font-extrabold text-purple-950">{formatIDR(calculatedDpAmount)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold">SISA PELUNASAN ({100 - dpPercent}%)</span>
                <p className="text-sm font-extrabold text-slate-900">{formatIDR(calculatedRemainingAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: TERMS & CONDITIONS */}
      {step === 6 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">6</span>
              <span>Ketentuan & Perjanjian</span>
            </h2>
          </div>

          <div className="space-y-3">
            {terms.map((term, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  value={term.title}
                  onChange={(e) => {
                    const updated = [...terms];
                    updated[idx].title = e.target.value;
                    setTerms(updated);
                  }}
                  className="font-bold text-xs text-purple-950 bg-white border border-slate-300 rounded-lg px-2.5 py-1"
                />
                <textarea
                  rows={2}
                  value={term.body}
                  onChange={(e) => {
                    const updated = [...terms];
                    updated[idx].body = e.target.value;
                    setTerms(updated);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 7: REVIEW & PREVIEW */}
      {step === 7 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">7</span>
              <span>Review Data & Live Preview Proposal</span>
            </h2>
            <DocumentPreview type="proposal" payload={buildPayload()} />
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

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-xs transition"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveAndGenerate}
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isSubmitting ? "Generating DOCX..." : "Generate & Download DOCX"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
