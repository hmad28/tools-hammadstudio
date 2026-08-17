/**
 * Initial Seed Data for Hammad Studio Document Generator
 */

export const INITIAL_BANK_ACCOUNTS = [
  {
    bankName: "BSI",
    accountNumber: "7340421005",
    accountHolder: "a.n. Hammad",
    sortOrder: 1,
    isActive: true,
  },
  {
    bankName: "BANK JAGO",
    accountNumber: "504756394754",
    accountHolder: "a.n. Hammad",
    sortOrder: 2,
    isActive: true,
  },
  {
    bankName: "BLU BY BCA DIGITAL",
    accountNumber: "000665154406",
    accountHolder: "a.n. Hammad",
    sortOrder: 3,
    isActive: true,
  },
];

export const INITIAL_PROJECT_PRESETS = [
  {
    name: "Travel / Umrah Website",
    category: "Travel / Umrah Website",
    description: "Scope lengkap website travel umrah multipage profesional.",
    defaultPayload: {
      proposalTitle: "REBRANDING WEBSITE",
      coverDescription: "Website Jam Wisata yang lebih modern, konsisten dengan Brand DNA, dan lebih profesional untuk memperkuat identitas serta kepercayaan calon jamaah.",
      promoLabel: "Spesial Kemerdekaan",
      estimatedTimeline: "7-14 Hari Kerja",
      domainIncludeLabel: "Domain .id Termasuk",
      projectHeadline: "Rebranding website yang membawa identitas lebih kuat, modern, dan konsisten.",
      projectOverview: "Hammad Studio akan melakukan rebranding website dengan tampilan modern, profesional, mobile-friendly, dan konsisten dengan Brand DNA yang disiapkan Client. Project mencakup maksimal 5 halaman utama.",
      objectives: [
        { title: "Memperkuat Brand", description: "Membawa identitas secara lebih konsisten dan mudah dikenali melalui website." },
        { title: "Menampilkan Paket", description: "Menyajikan paket Umrah, Haji, dan perjalanan secara lebih rapi, jelas, dan menarik." },
        { title: "Mempermudah Konsultasi", description: "Mengarahkan calon jamaah ke WhatsApp dengan CTA yang jelas dan mudah ditemukan." },
        { title: "Fondasi Digital", description: "Basic SEO dan struktur website yang siap dikembangkan lebih lanjut ke CMS di tahap berikutnya." }
      ],
      designDirections: [
        "Visual modern, clean, dan profesional mengikuti Brand DNA serta referensi Client.",
        "Fokus mobile-first karena mayoritas calon jamaah mengakses via smartphone.",
        "CTA WhatsApp dibuat jelas agar calon jamaah mudah berkonsultasi.",
        "Konten, warna, tipografi, dan layout disesuaikan dengan aset resmi Client."
      ],
      scopeIntro: "Paket Spesial Kemerdekaan: rebranding website maksimal 5 halaman dengan domain .id.",
      scopes: [
        { area: "Home", description: "Hero, identitas, highlight paket, trust point, dan CTA WhatsApp.", status: "included" },
        { area: "Paket / Program", description: "Informasi paket Umrah/Haji/Tour, jadwal, harga, fasilitas, dan detail penting.", status: "included" },
        { area: "Tentang / Legalitas", description: "Profil perusahaan, value/keunggulan, legalitas, pengalaman, dan info bisnis.", status: "included" },
        { area: "Kontak / Konsultasi", description: "WhatsApp, alamat/maps, social media, dan CTA konsultasi.", status: "included" },
        { area: "Galeri & Testimoni", description: "Dokumentasi perjalanan dan testimoni ditempatkan sesuai struktur final.", status: "included" },
        { area: "Dashboard / CMS", description: "Pengelolaan paket, artikel, galeri, testimoni, dan konten melalui dashboard admin.", status: "optional", optionalPrice: 400000, statusText: "Belum Termasuk - Opsional - Paket Rp799.000" },
        { area: "Navigasi & CTA", description: "Menu antar halaman dan CTA WhatsApp agar alur calon jamaah mudah.", status: "included" },
        { area: "Rebranding & Brand DNA", description: "Implementasi warna, tipografi, tone visual, dan identitas visual.", status: "included" },
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
        "Brand DNA, logo, warna, font, dan guideline visual.",
        "Materi paket Umrah/Haji/Tour, foto perjalanan, fasilitas, harga, jadwal, dan info layanan.",
        "Legalitas/profil perusahaan, alamat, WhatsApp, social media, testimoni, dan materi pendukung."
      ],
      timelinePhases: [
        { number: 1, title: "Kickoff & Materi", duration: "Hari 1-2", description: "Konfirmasi Brand DNA, struktur maksimal 5 halaman, domain, aset, konten, dan referensi visual." },
        { number: 2, title: "Design & Development", duration: "Hari 2-8", description: "Pembuatan struktur maksimal 5 halaman, implementasi Brand DNA, responsive layout, navigasi, dan integrasi CTA." },
        { number: 3, title: "Review Client", duration: "Hari 8-10", description: "Client mengecek hasil dan mengirim feedback terstruktur." },
        { number: 4, title: "Revisi & Final QA", duration: "Hari 10-12", description: "Penyesuaian sesuai scope, testing mobile/desktop, dan optimasi dasar." },
        { number: 5, title: "Go-Live & Serah Terima", duration: "Maks. Hari 14", description: "Setup domain, publish, pengecekan akhir, dan serah terima project." }
      ],
      primaryPackage: {
        name: "PAKET SPESIAL KEMERDEKAAN",
        description: "Maksimal 5 halaman + domain .id 1 tahun + hosting + SSL + responsive + basic SEO + setup sampai online. Desain mengikuti Brand DNA. Tanpa CMS.",
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
      closingMessage: "Setelah proposal disetujui, Hammad Studio akan menyiapkan MoU/perjanjian kerja dan invoice DP sebelum pengerjaan dimulai."
    }
  },
  {
    name: "Company Profile",
    Category: "Company Profile",
    description: "Website profil perusahaan profesional untuk memperkuat brand authority.",
    defaultPayload: {
      proposalTitle: "WEBSITE COMPANY PROFILE",
      coverDescription: "Website profil perusahaan modern, profesional, dan responsif untuk memperkuat citra bisnis.",
      promoLabel: "Paket Perusahaan",
      estimatedTimeline: "5-10 Hari Kerja",
      domainIncludeLabel: "Domain & Hosting Included",
      projectHeadline: "Menampilkan kredibilitas dan keunggulan bisnis secara elegan.",
      projectOverview: "Pengembangan website Company Profile mencakup Home, About Us, Services, Portfolio, Testimonials, dan Contact.",
      objectives: [
        { title: "Kredibilitas Bisnis", description: "Meningkatkan kepercayaan klien dan mitra bisnis." },
        { title: "Showcase Layanan", description: "Menampilkan portofolio dan jangkauan layanan perusahaan secara jelas." },
        { title: "Kemudahan Kontak", description: "Integrasi formulir kontak dan tombol WhatsApp interaktif." }
      ],
      designDirections: [
        "Desain eksklusif dan profesional mencerminkan identitas perusahaan.",
        "Tata letak bersih, cepat dimuat, dan responsif di semua perangkat.",
        "Struktur navigasi intuitif untuk memudahkan akses informasi."
      ],
      scopeIntro: "Pengembangan website Company Profile standar bisnis.",
      scopes: [
        { area: "Home Page", description: "Hero section, company overview, highlight services, CTA.", status: "included" },
        { area: "About Us", description: "Sejarah, visi misi, nilai perusahaan, dan tim utama.", status: "included" },
        { area: "Services / Products", description: "Detail layanan/produk perusahaan.", status: "included" },
        { area: "Portfolio / Projects", description: "Galeri hasil karya / proyek yang telah diselesaikan.", status: "included" },
        { area: "Contact Us", description: "Form kontak, peta lokasi, WhatsApp CTA, sosial media.", status: "included" }
      ],
      inclusions: [
        { name: "Domain .com / .co.id", value: "1 tahun" },
        { name: "Hosting Cloud", value: "1 tahun" },
        { name: "SSL Certificate", value: "aktif" },
        { name: "Responsive Design", value: "desktop, tablet, mobile" }
      ],
      clientMaterials: [
        "Logo perusahaan vector/PNG resolusi tinggi.",
        "Teks profil perusahaan, deskripsi layanan, dan kontak.",
        "Foto portofolio/kegiatan perusahaan."
      ],
      timelinePhases: [
        { number: 1, title: "Persiapan & Materi", duration: "Hari 1-2", description: "Pengumpulan materi dan diskusi konsep visual." },
        { number: 2, title: "Desain & Pengerjaan", duration: "Hari 3-7", description: "Coding dan penataan konten website." },
        { number: 3, title: "Review & Testing", duration: "Hari 8-9", description: "Pengecekan bersama dan revisi." },
        { number: 4, title: "Peluncuran", duration: "Hari 10", description: "Go-live dan penyerahan akses." }
      ],
      primaryPackage: {
        name: "COMPANY PROFILE STANDARD",
        description: "Website Company Profile 5 halaman responsif + domain + hosting + SSL.",
        normalPrice: 2500000,
        discount: 500000,
        finalPrice: 2000000
      },
      dpPercent: 50,
      closingMessage: "Hammad Studio siap menjadi mitra digital terbaik untuk pertumbuhan bisnis Anda."
    }
  },
  {
    name: "Landing Page",
    category: "Landing Page",
    description: "Landing page tinggi konversi untuk promosi produk/jasa spesifik.",
    defaultPayload: {
      proposalTitle: "LANDING PAGE HIGH CONVERSION",
      coverDescription: "Landing page modern dengan CTA optimal untuk memaksimalkan penjualan dan lead.",
      promoLabel: "Paket Promosi",
      estimatedTimeline: "3-5 Hari Kerja",
      domainIncludeLabel: "Domain & Hosting Included",
      projectHeadline: "Landing page cepat, responsif, dan fokus pada konversi.",
      projectOverview: "Pembuatan single page landing page lengkap dengan Hero, Benefits, Features, Testimonials, Pricing, dan WhatsApp CTA.",
      objectives: [
        { title: "Tingkatkan Konversi", description: "Fokus desain mengarahkan pengunjung melakukan pembelian / kontak." },
        { title: "Cepat & Ringan", description: "Optimasi kecepatan loading untuk campaign iklan (Google/FB Ads)." }
      ],
      designDirections: [
        "Headings menarik dan persuasif.",
        "Tombol CTA WhatsApp yang mencolok dan selalu terlihat.",
        "Visual produk/layanan yang jelas."
      ],
      scopeIntro: "Pengembangan High-Converting Landing Page.",
      scopes: [
        { area: "Hero Section", description: "Headline menarik, subheadline, image/video hero, CTA utama.", status: "included" },
        { area: "Benefits & Features", description: "Poin-poin keunggulan produk/jasa.", status: "included" },
        { area: "Testimonials & Social Proof", description: "Ulasan pembeli / klien terdahulu.", status: "included" },
        { area: "Pricing / Offer", description: "Tabel paket harga dan promo khusus.", status: "included" },
        { area: "Direct WhatsApp CTA", description: "Integrasi pesan otomatis ke WhatsApp sales.", status: "included" }
      ],
      inclusions: [
        { name: "Domain", value: "1 tahun" },
        { name: "Hosting Fast", value: "1 tahun" },
        { name: "SSL", value: "aktif" },
        { name: "Pixel / Analytics Setup", value: "on-page" }
      ],
      clientMaterials: [
        "Teks penawaran & materi promo.",
        "Foto/gambar produk kualitas baik.",
        "Nomor WhatsApp tujuan."
      ],
      timelinePhases: [
        { number: 1, title: "Kickoff & Copywriting", duration: "Hari 1", description: "Finalisasi teks dan penawaran." },
        { number: 2, title: "Development", duration: "Hari 2-3", description: "Pengerjaan halaman dan integrasi CTA." },
        { number: 3, title: "Review & Launch", duration: "Hari 4-5", description: "Uji coba dan go-live." }
      ],
      primaryPackage: {
        name: "LANDING PAGE PROMO",
        description: "Landing page lengkap siap pakai untuk campaign iklan.",
        normalPrice: 1200000,
        discount: 300000,
        finalPrice: 900000
      },
      dpPercent: 50,
      closingMessage: "Siap meluncurkan campaign promosi Anda sekarang!"
    }
  }
];

export const DEFAULT_STUDIO_SETTINGS = {
  company_profile: {
    name: "Hammad Studio",
    tagline: "Web Development & Digital Solutions",
    website: "www.hammad.studio",
    email: "halo@hammad.studio",
    phone: "+62 852-2292-7499",
    address: "Indonesia",
  },
  default_terms: [
    { title: "SCOPE", body: "Harga yang disepakati berlaku untuk pengerjaan project sesuai scope proposal. Penambahan fitur, halaman, atau custom software di luar scope akan dikonfirmasi sebagai pekerjaan tambahan." },
    { title: "CMS / SUPPORT", body: "Pengembangan tahap awal dikerjakan sesuai paket yang dipilih. Perubahan konten setelah serah terima dapat dibantu berdasarkan perjanjian support." },
    { title: "REVISI", body: "Termasuk maksimal 2 putaran revisi minor pada tahap review. Perubahan konsep besar atau penambahan fitur di luar scope akan dihitung sebagai pekerjaan baru." },
    { title: "DOMAIN & HOSTING", body: "Domain, hosting, dan SSL termasuk untuk 1 tahun pertama. Biaya perpanjangan tahun berikutnya akan diinformasikan sebelum masa aktif berakhir." },
    { title: "ASET & KONTEN", body: "Client menyediakan materi, logo, teks, foto, dan aset resmi yang memiliki hak penggunaan sah." },
    { title: "SEO", body: "Basic SEO berarti fondasi on-page dan technical setup dasar. Tidak termasuk jaminan peringkat #1 Google atau campaign SEO bulanan." },
    { title: "OWNERSHIP", body: "Akses dan aset project diserahterimakan penuh setelah seluruh kewajiban pembayaran selesai." }
  ],
  default_invoice_notes: [
    "DP 50% digunakan untuk konfirmasi project dan reservasi slot pengerjaan.",
    "Sisa pelunasan dibayarkan setelah hasil final disetujui, sebelum website dipublikasikan ke domain utama.",
    "Mohon kirim bukti transfer setelah pembayaran agar dapat kami konfirmasi."
  ]
};
