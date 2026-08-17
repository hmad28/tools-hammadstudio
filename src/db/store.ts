import {
  INITIAL_BANK_ACCOUNTS,
  INITIAL_PROJECT_PRESETS,
  DEFAULT_STUDIO_SETTINGS,
} from "./seed-data";

export interface Client {
  id: string;
  name: string;
  companyName?: string | null;
  picName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  website?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  clientId?: string | null;
  name: string;
  category: string;
  description?: string | null;
  status: string;
  basePrice: number;
  finalPrice: number;
  startDate?: string | null;
  targetCompletionDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPreset {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  defaultPayload: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  type: "proposal" | "invoice";
  number: string;
  clientId?: string | null;
  projectId?: string | null;
  templateId?: string | null;
  title: string;
  status: string;
  issueDate: string;
  dueDate?: string | null;
  currency: string;
  subtotal: number;
  discount: number;
  total: number;
  dpPercentage: number;
  dpAmount: number;
  paidAmount: number;
  remainingAmount: number;
  payload: any;
  generatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Global Memory Cache for fallback / rapid local testing
const globalStore = global as unknown as {
  __hs_clients?: Client[];
  __hs_projects?: Project[];
  __hs_presets?: ProjectPreset[];
  __hs_banks?: BankAccount[];
  __hs_documents?: DocumentRecord[];
  __hs_settings?: Record<string, any>;
  __hs_sequences?: Record<string, number>;
};

function initStore() {
  if (!globalStore.__hs_clients) {
    globalStore.__hs_clients = [
      {
        id: "client-jam-wisata",
        name: "Jam Wisata",
        companyName: "PT Jam Wisata Indonesia",
        picName: "Bapak Ahmad",
        phone: "+62 852-2292-7499",
        email: "info@jamwisata.com",
        address: "Jl. Wisata No. 17, Jakarta",
        website: "www.jamwisata.com",
        notes: "Klien travel umrah & tur.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  if (!globalStore.__hs_projects) {
    globalStore.__hs_projects = [
      {
        id: "project-travel-umrah",
        clientId: "client-jam-wisata",
        name: "Website Travel Umrah Jam Wisata",
        category: "Travel / Umrah Website",
        description: "Rebranding website travel umrah multipage (maks. 5 halaman).",
        status: "Confirmed",
        basePrice: 799000,
        finalPrice: 399000,
        startDate: "2026-08-17",
        targetCompletionDate: "2026-08-31",
        notes: "Promo Kemerdekaan 17 Agustus 2026.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  if (!globalStore.__hs_presets) {
    globalStore.__hs_presets = INITIAL_PROJECT_PRESETS.map((p, idx) => ({
      id: `preset-${idx + 1}`,
      name: p.name,
      category: p.category || "General",
      description: p.description,
      defaultPayload: p.defaultPayload,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  if (!globalStore.__hs_banks) {
    globalStore.__hs_banks = INITIAL_BANK_ACCOUNTS.map((b, idx) => ({
      id: `bank-${idx + 1}`,
      bankName: b.bankName,
      accountNumber: b.accountNumber,
      accountHolder: b.accountHolder,
      isActive: b.isActive,
      sortOrder: b.sortOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  if (!globalStore.__hs_settings) {
    globalStore.__hs_settings = { ...DEFAULT_STUDIO_SETTINGS };
  }

  if (!globalStore.__hs_documents) {
    globalStore.__hs_documents = [
      {
        id: "doc-prop-sample",
        type: "proposal",
        number: "PROP-HS-170826-001",
        clientId: "client-jam-wisata",
        projectId: "project-travel-umrah",
        title: "Proposal Rebranding Website Jam Wisata",
        status: "Approved",
        issueDate: "2026-08-17",
        currency: "IDR",
        subtotal: 799000,
        discount: 400000,
        total: 399000,
        dpPercentage: 50,
        dpAmount: 199500,
        paidAmount: 0,
        remainingAmount: 199500,
        payload: {
          proposalNumber: "PROP-HS-170826-001",
          proposalTitle: "REBRANDING WEBSITE",
          client: {
            id: "client-jam-wisata",
            name: "Jam Wisata",
            companyName: "PT Jam Wisata Indonesia",
            picName: "Bapak Ahmad",
            phone: "+62 852-2292-7499",
            email: "info@jamwisata.com",
          },
          project: {
            id: "project-travel-umrah",
            name: "Website Travel Umrah Jam Wisata",
            category: "Travel / Umrah Website",
          },
          coverDescription: "Website Jam Wisata yang lebih modern, konsisten dengan Brand DNA, dan lebih profesional untuk memperkuat identitas serta kepercayaan calon jamaah.",
          promoLabel: "Spesial Kemerdekaan",
          estimatedTimeline: "7-14 Hari Kerja",
          domainIncludeLabel: "Domain .id Termasuk",
          proposalDate: "2026-08-17",
          projectValueLabel: "Rp399.000 (Maks. 5 Halaman)",
          projectHeadline: "Rebranding website yang membawa identitas Jam Wisata lebih kuat, modern, dan konsisten.",
          projectOverview: "Hammad Studio akan melakukan rebranding website Jam Wisata dengan tampilan modern, profesional, mobile-friendly, dan konsisten dengan Brand DNA yang disiapkan Client. Project mencakup maksimal 5 halaman utama.",
          objectives: [
            { title: "Memperkuat Brand", description: "Membawa identitas Jam Wisata secara lebih konsisten dan mudah dikenali melalui website." },
            { title: "Menampilkan Paket", description: "Menyajikan paket Umrah, Haji, dan perjalanan secara lebih rapi, jelas, dan menarik." },
            { title: "Mempermudah Konsultasi", description: "Mengarahkan calon jamaah ke WhatsApp dengan CTA yang jelas dan mudah ditemukan." },
            { title: "Fondasi Digital", description: "Basic SEO dan struktur website yang siap dikembangkan lebih lanjut ke CMS di tahap berikutnya." }
          ],
          designDirections: [
            "Visual modern, clean, dan profesional dengan arah desain mengikuti Brand DNA Jam Wisata serta referensi yang diberikan Client.",
            "Fokus mobile-first karena mayoritas calon jamaah akan mengakses website melalui smartphone.",
            "CTA WhatsApp dibuat jelas agar calon jamaah mudah berkonsultasi dan menghubungi tim Jam Wisata.",
            "Konten, warna, tipografi, dan layout disesuaikan dengan Brand DNA dan aset resmi Jam Wisata."
          ],
          scopeIntro: "Paket Spesial Kemerdekaan: rebranding website Jam Wisata maksimal 5 halaman dengan domain .id Rp399.000.",
          scopes: [
            { area: "Home", description: "Hero, identitas Jam Wisata, highlight paket, trust point, dan CTA WhatsApp.", status: "included" },
            { area: "Paket / Program", description: "Informasi paket Umrah/Haji/Tour, jadwal, harga, fasilitas, dan detail penting sesuai materi Client.", status: "included" },
            { area: "Tentang / Legalitas", description: "Profil Jam Wisata, value/keunggulan, legalitas, pengalaman, dan informasi perusahaan.", status: "included" },
            { area: "Kontak / Konsultasi", description: "WhatsApp, alamat/maps, social media, dan CTA konsultasi calon jamaah.", status: "included" },
            { area: "Galeri & Testimoni", description: "Dokumentasi perjalanan dan testimoni dapat ditempatkan sebagai halaman/section sesuai struktur final.", status: "included" },
            { area: "Dashboard / CMS", description: "Pengelolaan paket, artikel, galeri, testimoni, dan konten melalui dashboard admin.", status: "optional", optionalPrice: 400000, statusText: "Belum Termasuk - Opsional - Paket Rp799.000" },
            { area: "Navigasi & CTA", description: "Menu antar halaman dan CTA WhatsApp agar alur calon jamaah tetap jelas dan mudah.", status: "included" },
            { area: "Rebranding & Brand DNA", description: "Implementasi warna, tipografi, tone visual, dan elemen identitas berdasarkan Brand DNA Jam Wisata.", status: "included" },
            { area: "Google Ads Management", description: "Setup/optimasi campaign dan pengelolaan Google Ads berbayar.", status: "excluded" }
          ],
          inclusions: [
            { name: "Domain .id", value: "1 tahun" },
            { name: "Hosting", value: "1 tahun" },
            { name: "SSL / HTTPS", value: "aktif" },
            { name: "Responsive", value: "desktop & mobile" },
            { name: "Basic SEO", value: "on-page foundation" },
            { name: "Setup", value: "sampai online" }
          ],
          clientMaterials: [
            "Brand DNA Jam Wisata, logo, warna, font, dan guideline/arah visual yang tersedia.",
            "Materi paket Umrah/Haji/Tour, foto perjalanan, fasilitas, harga, jadwal, dan informasi layanan yang ingin ditampilkan.",
            "Legalitas/profil perusahaan, alamat, WhatsApp, social media, testimoni, dan materi pendukung lainnya."
          ],
          timelinePhases: [
            { number: 1, title: "Kickoff & Materi", duration: "Hari 1-2", description: "Konfirmasi Brand DNA, struktur maksimal 5 halaman, domain, aset, konten, dan referensi visual." },
            { number: 2, title: "Design & Development", duration: "Hari 2-8", description: "Pembuatan struktur maksimal 5 halaman, implementasi Brand DNA, responsive layout, navigasi, dan integrasi CTA." },
            { number: 3, title: "Review Client", duration: "Hari 8-10", description: "Client mengecek hasil dan mengirim feedback terstruktur." },
            { number: 4, title: "Revisi & Final QA", duration: "Hari 10-12", description: "Penyesuaian sesuai scope, testing mobile/desktop, dan optimasi dasar." },
            { number: 5, title: "Go-Live & Serah Terima", duration: "Maks. Hari 14", description: "Setup domain, publish, pengecekan akhir, dan serah terima project." }
          ],
          primaryPackage: {
            name: "PAKET SPESIAL KEMERDEKAAN - REBRANDING JAM WISATA",
            description: "Maksimal 5 halaman + domain .id 1 tahun + hosting + SSL + responsive + basic SEO + setup sampai online. Desain mengikuti Brand DNA Jam Wisata. Tanpa CMS.",
            normalPrice: 799000,
            discount: 400000,
            finalPrice: 399000
          },
          optionalPackage: {
            name: "PROMO SPESIAL KEMERDEKAAN - WEBSITE MULTIPAGE + CMS",
            description: "Seluruh fasilitas paket multipage + dashboard CMS untuk kelola armada, harga, layanan, galeri, dan konten secara mandiri.",
            price: 799000
          },
          dpPercent: 50,
          terms: DEFAULT_STUDIO_SETTINGS.default_terms,
          closingMessage: "Setelah proposal disetujui, Hammad Studio akan menyiapkan MoU/perjanjian kerja dan invoice DP sebelum pengerjaan dimulai."
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "doc-inv-sample",
        type: "invoice",
        number: "INV-HS-170826-002",
        clientId: "client-jam-wisata",
        projectId: "project-travel-umrah",
        title: "Invoice DP Project Website Travel Umroh Jam Wisata",
        status: "Waiting Payment",
        issueDate: "2026-08-17",
        dueDate: "Saat diterima",
        currency: "IDR",
        subtotal: 399000,
        discount: 0,
        total: 399000,
        dpPercentage: 50,
        dpAmount: 199500,
        paidAmount: 0,
        remainingAmount: 199500,
        payload: {
          invoiceNumber: "INV-HS-170826-002",
          invoiceSubtitle: "Pembayaran DP Project Website Travel Umroh Jam Wisata",
          statusText: "MENUNGGU PEMBAYARAN",
          issueDate: "2026-08-17",
          dueDate: "Saat diterima",
          client: {
            id: "client-jam-wisata",
            name: "Client Website Travel Umroh Jam Wisata",
            contact: "+62 852-2292-7499",
            email: "info@jamwisata.com",
          },
          project: {
            id: "project-travel-umrah",
            name: "Website Travel Umroh Jam Wisata - Multipage",
            meta: "Maks. 5 halaman • Promo Merdeka 17 Agustus",
          },
          items: [
            {
              description: "Website Travel Umroh Jam Wisata - Multipage (maks. 5 halaman)",
              details: "Domain .id 1 tahun, hosting 1 tahun, SSL, basic SEO, responsive, setup sampai online, dan maintenance konten dasar 1 tahun. CMS/dashboard tidak termasuk.",
              quantity: 1,
              unitPrice: 399000,
              total: 399000,
            },
          ],
          total: 399000,
          dpPercentage: 50,
          dpAmount: 199500,
          remainingAmount: 199500,
          banks: INITIAL_BANK_ACCOUNTS,
          notes: DEFAULT_STUDIO_SETTINGS.default_invoice_notes,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  if (!globalStore.__hs_sequences) {
    globalStore.__hs_sequences = {
      "proposal-170826": 1,
      "invoice-170826": 2,
    };
  }
}

initStore();

/**
 * Concurrency-safe Document Number Sequence Generator
 * Format:
 * Proposal: PROP-HS-DDMMYY-###
 * Invoice: INV-HS-DDMMYY-###
 */
export function generateNextDocumentNumber(type: "proposal" | "invoice", dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  const dateKey = `${day}${month}${year}`;

  const seqKey = `${type}-${dateKey}`;
  const currentVal = globalStore.__hs_sequences![seqKey] || 0;
  const nextVal = currentVal + 1;
  globalStore.__hs_sequences![seqKey] = nextVal;

  const prefix = type === "proposal" ? "PROP-HS" : "INV-HS";
  const numFormatted = String(nextVal).padStart(3, "0");
  return `${prefix}-${dateKey}-${numFormatted}`;
}

export const memoryStore = {
  // CLIENTS
  getClients: () => globalStore.__hs_clients || [],
  getClientById: (id: string) => globalStore.__hs_clients?.find((c) => c.id === id) || null,
  saveClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const now = new Date().toISOString();
    if (client.id) {
      const idx = globalStore.__hs_clients!.findIndex((c) => c.id === client.id);
      if (idx !== -1) {
        const updated = { ...globalStore.__hs_clients![idx], ...client, updatedAt: now };
        globalStore.__hs_clients![idx] = updated;
        return updated;
      }
    }
    const newClient: Client = {
      id: client.id || `client-${Date.now()}`,
      name: client.name,
      companyName: client.companyName || null,
      picName: client.picName || null,
      phone: client.phone || null,
      email: client.email || null,
      address: client.address || null,
      website: client.website || null,
      notes: client.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    globalStore.__hs_clients!.unshift(newClient);
    return newClient;
  },

  // PROJECTS
  getProjects: () => globalStore.__hs_projects || [],
  getProjectById: (id: string) => globalStore.__hs_projects?.find((p) => p.id === id) || null,
  saveProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const now = new Date().toISOString();
    if (project.id) {
      const idx = globalStore.__hs_projects!.findIndex((p) => p.id === project.id);
      if (idx !== -1) {
        const updated = { ...globalStore.__hs_projects![idx], ...project, updatedAt: now };
        globalStore.__hs_projects![idx] = updated;
        return updated;
      }
    }
    const newProject: Project = {
      id: project.id || `project-${Date.now()}`,
      clientId: project.clientId || null,
      name: project.name,
      category: project.category || "Landing Page",
      description: project.description || null,
      status: project.status || "Lead",
      basePrice: project.basePrice || 0,
      finalPrice: project.finalPrice || 0,
      startDate: project.startDate || null,
      targetCompletionDate: project.targetCompletionDate || null,
      notes: project.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    globalStore.__hs_projects!.unshift(newProject);
    return newProject;
  },

  // PRESETS
  getPresets: () => globalStore.__hs_presets || [],
  getPresetById: (id: string) => globalStore.__hs_presets?.find((p) => p.id === id) || null,
  savePreset: (preset: Omit<ProjectPreset, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const now = new Date().toISOString();
    if (preset.id) {
      const idx = globalStore.__hs_presets!.findIndex((p) => p.id === preset.id);
      if (idx !== -1) {
        const updated = { ...globalStore.__hs_presets![idx], ...preset, updatedAt: now };
        globalStore.__hs_presets![idx] = updated;
        return updated;
      }
    }
    const newPreset: ProjectPreset = {
      id: preset.id || `preset-${Date.now()}`,
      name: preset.name,
      category: preset.category,
      description: preset.description || null,
      defaultPayload: preset.defaultPayload,
      isActive: preset.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    globalStore.__hs_presets!.unshift(newPreset);
    return newPreset;
  },

  // BANK ACCOUNTS
  getBankAccounts: () => globalStore.__hs_banks || [],
  saveBankAccount: (bank: Omit<BankAccount, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const now = new Date().toISOString();
    if (bank.id) {
      const idx = globalStore.__hs_banks!.findIndex((b) => b.id === bank.id);
      if (idx !== -1) {
        const updated = { ...globalStore.__hs_banks![idx], ...bank, updatedAt: now };
        globalStore.__hs_banks![idx] = updated;
        return updated;
      }
    }
    const newBank: BankAccount = {
      id: bank.id || `bank-${Date.now()}`,
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      accountHolder: bank.accountHolder,
      isActive: bank.isActive ?? true,
      sortOrder: bank.sortOrder ?? (globalStore.__hs_banks!.length + 1),
      createdAt: now,
      updatedAt: now,
    };
    globalStore.__hs_banks!.push(newBank);
    return newBank;
  },

  // STUDIO SETTINGS
  getStudioSettings: () => globalStore.__hs_settings || DEFAULT_STUDIO_SETTINGS,
  saveStudioSettings: (key: string, value: any) => {
    globalStore.__hs_settings![key] = value;
    return globalStore.__hs_settings;
  },

  // DOCUMENTS
  getDocuments: () => globalStore.__hs_documents || [],
  getDocumentById: (id: string) => globalStore.__hs_documents?.find((d) => d.id === id) || null,
  saveDocument: (doc: Omit<DocumentRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const now = new Date().toISOString();
    if (doc.id) {
      const idx = globalStore.__hs_documents!.findIndex((d) => d.id === doc.id);
      if (idx !== -1) {
        const updated = { ...globalStore.__hs_documents![idx], ...doc, updatedAt: now };
        globalStore.__hs_documents![idx] = updated;
        return updated;
      }
    }
    const newDoc: DocumentRecord = {
      id: doc.id || `doc-${Date.now()}`,
      type: doc.type,
      number: doc.number || generateNextDocumentNumber(doc.type, doc.issueDate),
      clientId: doc.clientId || null,
      projectId: doc.projectId || null,
      templateId: doc.templateId || null,
      title: doc.title,
      status: doc.status || "Draft",
      issueDate: doc.issueDate,
      dueDate: doc.dueDate || null,
      currency: doc.currency || "IDR",
      subtotal: doc.subtotal,
      discount: doc.discount,
      total: doc.total,
      dpPercentage: doc.dpPercentage,
      dpAmount: doc.dpAmount,
      paidAmount: doc.paidAmount || 0,
      remainingAmount: doc.remainingAmount,
      payload: doc.payload,
      generatedAt: doc.generatedAt || null,
      createdAt: now,
      updatedAt: now,
    };
    globalStore.__hs_documents!.unshift(newDoc);
    return newDoc;
  },
  deleteDocument: (id: string) => {
    globalStore.__hs_documents = globalStore.__hs_documents?.filter((d) => d.id !== id);
    return true;
  },
};
