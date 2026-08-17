import { formatIDR, formatIndonesianDate, formatShortIndonesianDate } from "../formatters";

export function mapProposalPayloadToTemplate(payload: any): Record<string, any> {
  const clientName = payload.client?.name || "Client";
  const clientNameUpper = clientName.toUpperCase();
  const proposalDateStr = payload.proposalDate || payload.issueDate || new Date().toISOString();
  const proposalDateFormatted = formatIndonesianDate(proposalDateStr);
  const proposalDateShortFormatted = formatShortIndonesianDate(proposalDateStr);

  // Objectives (Goal 1 to 4)
  const obj1 = payload.objectives?.[0] || { title: "Memperkuat Brand", description: "Membawa identitas secara lebih konsisten." };
  const obj2 = payload.objectives?.[1] || { title: "Menampilkan Paket", description: "Menyajikan paket dan layanan secara rapi." };
  const obj3 = payload.objectives?.[2] || { title: "Mempermudah Konsultasi", description: "Mengarahkan calon klien ke WhatsApp CTA." };
  const obj4 = payload.objectives?.[3] || { title: "Fondasi Digital", description: "Basic SEO dan struktur website profesional." };

  // Design Directions (1 to 4)
  const dd = payload.designDirections || [
    "Visual modern, clean, dan profesional mengikuti Brand DNA.",
    "Fokus mobile-first untuk pengalaman pengguna optimal.",
    "CTA WhatsApp jelas dan mudah diakses.",
    "Konten dan layout disesuaikan dengan identitas Client."
  ];

  // Scopes array mapping
  const findScope = (keyword: string) => {
    return payload.scopes?.find((s: any) =>
      s.area.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const scopeHome = findScope("home")?.description || "Hero, highlight layanan, trust point, dan CTA WhatsApp.";
  const scopeProduct = findScope("paket")?.description || findScope("program")?.description || "Informasi paket/layanan, harga, dan fasilitas.";
  const scopeAbout = findScope("tentang")?.description || findScope("legalitas")?.description || "Profil perusahaan, keunggulan, dan informasi legalitas.";
  const scopeContact = findScope("kontak")?.description || "WhatsApp, alamat, maps, dan sosial media.";
  const scopeGallery = findScope("galeri")?.description || findScope("testimoni")?.description || "Dokumentasi portofolio dan testimoni klien.";
  const scopeCms = findScope("cms")?.description || findScope("dashboard")?.description || "Pengelolaan konten melalui dashboard admin.";
  const cmsScopeObj = findScope("cms") || findScope("dashboard");
  const cmsStatusPrice = cmsScopeObj?.statusText || (cmsScopeObj?.status === "included" ? "Termasuk" : "Belum Termasuk - Opsional");

  const scopeNav = findScope("navigasi")?.description || "Menu navigasi antar halaman dan CTA.";
  const scopeBranding = findScope("brand")?.description || "Implementasi warna, tipografi, dan identitas visual.";
  const scopeAds = findScope("ads")?.description || "Setup/optimasi campaign Google Ads.";

  // Materials
  const materials = payload.clientMaterials || [
    "Brand DNA, logo, warna, font, dan guideline visual.",
    "Materi produk/layanan, foto, fasilitas, dan harga.",
    "Legalitas/profil perusahaan, alamat, WhatsApp, dan sosial media."
  ];

  // Timeline phases (1 to 5)
  const t1 = payload.timelinePhases?.[0] || { duration: "Hari 1-2", description: "Kickoff & materi awal." };
  const t2 = payload.timelinePhases?.[1] || { duration: "Hari 2-8", description: "Design & Development." };
  const t3 = payload.timelinePhases?.[2] || { duration: "Hari 8-10", description: "Review Client." };
  const t4 = payload.timelinePhases?.[3] || { duration: "Hari 10-12", description: "Revisi & Final QA." };
  const t5 = payload.timelinePhases?.[4] || { duration: "Maks. Hari 14", description: "Go-Live & Serah Terima." };

  // Pricing & Packages
  const p1 = payload.primaryPackage || {
    name: "PAKET SPESIAL",
    description: "Website multipage responsif + domain + hosting + SSL + basic SEO.",
    finalPrice: payload.total || 399000
  };
  const p2 = payload.optionalPackage || {
    name: "PAKET SPESIAL + CMS",
    description: "Seluruh fasilitas paket multipage + dashboard CMS.",
    price: (p1.finalPrice || 399000) + 400000
  };

  const dpPct = payload.dpPercent ?? 50;
  const remainingPct = 100 - dpPct;

  // Terms
  const findTerm = (key: string) => {
    return payload.terms?.find((t: any) => t.title.toUpperCase().includes(key))?.body || "";
  };

  return {
    PROPOSAL_TITLE: payload.proposalTitle || "PROPOSAL PROJECT",
    CLIENT_NAME_UPPER: clientNameUpper,
    COVER_DESCRIPTION: payload.coverDescription || `Website ${clientName} yang lebih modern dan profesional.`,
    PROMO_LABEL: payload.promoLabel || "Spesial Project",
    ESTIMATED_TIMELINE: payload.estimatedTimeline || "7-14 Hari Kerja",
    DOMAIN_INCLUDE_LABEL: payload.domainIncludeLabel || "Domain & Hosting Included",
    CLIENT_NAME: clientName,
    PROPOSAL_DATE: proposalDateFormatted,
    PROJECT_VALUE_LABEL: payload.projectValueLabel || `${formatIDR(p1.finalPrice)}`,
    PROPOSAL_DATE_SHORT: proposalDateShortFormatted,

    PROJECT_HEADLINE: payload.projectHeadline || `Pengembangan website profesional untuk ${clientName}.`,
    PROJECT_OVERVIEW: payload.projectOverview || `Hammad Studio akan mengembangkan website profesional untuk ${clientName}.`,

    GOAL_1_TITLE: `01  ${obj1.title}`,
    GOAL_1_DESC: obj1.description,
    GOAL_2_TITLE: `02  ${obj2.title}`,
    GOAL_2_DESC: obj2.description,
    GOAL_3_TITLE: `03  ${obj3.title}`,
    GOAL_3_DESC: obj3.description,
    GOAL_4_TITLE: `04  ${obj4.title}`,
    GOAL_4_DESC: obj4.description,

    DESIGN_DIRECTION_1: dd[0] || "",
    DESIGN_DIRECTION_2: dd[1] || "",
    DESIGN_DIRECTION_3: dd[2] || "",
    DESIGN_DIRECTION_4: dd[3] || "",

    SCOPE_INTRO: payload.scopeIntro || `Scope dan deliverables project ${clientName}.`,
    SCOPE_HOME: scopeHome,
    SCOPE_PRODUCT_SERVICE: scopeProduct,
    SCOPE_ABOUT: scopeAbout,
    SCOPE_CONTACT: scopeContact,
    SCOPE_GALLERY_TESTIMONIAL: scopeGallery,
    SCOPE_CMS: scopeCms,
    CMS_STATUS_PRICE: cmsStatusPrice,
    SCOPE_NAV_CTA: scopeNav,
    SCOPE_BRANDING: scopeBranding,
    SCOPE_ADS: scopeAds,

    DOMAIN_TYPE: payload.domainType || ".id",
    DURATION: payload.duration || "1 tahun",

    CLIENT_MATERIAL_1: materials[0] || "",
    CLIENT_MATERIAL_2: materials[1] || "",
    CLIENT_MATERIAL_3: materials[2] || "",

    T1_TIME: t1.duration,
    T1_DESC: t1.description,
    T2_TIME: t2.duration,
    T2_DESC: t2.description,
    T3_TIME: t3.duration,
    T3_DESC: t3.description,
    T4_TIME: t4.duration,
    T4_DESC: t4.description,
    T5_TIME: t5.duration,
    T5_DESC: t5.description,

    P1_NAME: p1.name,
    P1_DESC: p1.description,
    P1_PRICE: formatIDR(p1.finalPrice ?? p1.price ?? payload.total),

    P2_NAME: p2.name,
    P2_DESC: p2.description,
    P2_PRICE: formatIDR(p2.price ?? p2.finalPrice),

    DP_PERCENT: String(dpPct),
    REMAINING_PERCENT: String(remainingPct),

    TERM_SCOPE: findTerm("SCOPE") || "Harga berlaku untuk pengerjaan project sesuai scope proposal.",
    TERM_CMS_SUPPORT: findTerm("CMS") || "Project tahap awal dikerjakan sesuai paket yang dipilih.",
    TERM_REVISION: findTerm("REVISI") || "Termasuk maksimal 2 putaran revisi minor.",
    CURRENT_DOMAIN: payload.currentDomain || `${clientName.toLowerCase().replace(/\s+/g, "")}.com`,
    TERM_ASSETS_CONTENT: findTerm("ASET") || "Client menyediakan materi dan aset resmi.",
    TERM_SEO: findTerm("SEO") || "Basic SEO berarti fondasi on-page dan technical setup dasar.",
    TERM_OWNERSHIP: findTerm("OWNERSHIP") || "Akses diserahterimakan setelah kewajiban pembayaran selesai.",

    CLOSING_MESSAGE: payload.closingMessage || "Setelah proposal disetujui, Hammad Studio akan menyiapkan MoU dan invoice DP."
  };
}
