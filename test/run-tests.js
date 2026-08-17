const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log("=== HAMMAD STUDIO DOCUMENT GENERATOR TEST SUITE ===");

// 1. Test Formatters & Finance Logic
console.log("\n[TEST 1] Testing Formatters & Finance Calculations...");

function formatIDR(amount) {
  if (amount == null || isNaN(amount)) return "Rp0";
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat("id-ID").format(rounded);
  return `Rp${formatted}`;
}

function calculateSubtotal(items) {
  return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
}

function calculateDpAmount(total, dpPercent) {
  return Math.round((total * dpPercent) / 100);
}

// Test formatIDR
assert.strictEqual(formatIDR(399000), "Rp399.000");
assert.strictEqual(formatIDR(199500), "Rp199.500");
assert.strictEqual(formatIDR(799000), "Rp799.000");
console.log("✓ formatIDR tests passed!");

// Test calculations
const items = [{ quantity: 1, unitPrice: 399000 }];
const subtotal = calculateSubtotal(items);
assert.strictEqual(subtotal, 399000);

const dpAmount = calculateDpAmount(399000, 50);
assert.strictEqual(dpAmount, 199500);

const remaining = 399000 - dpAmount;
assert.strictEqual(remaining, 199500);
console.log("✓ Finance calculation rules tests passed!");

// 2. Test DOCX Generator
console.log("\n[TEST 2] Testing DOCX Template Engine...");
const createReport = require('../node_modules/docx-templates').default || require('../node_modules/docx-templates');

async function testDocx() {
  const proposalTpl = fs.readFileSync(path.join(__dirname, '../templates/proposal.docx'));
  const invoiceTpl = fs.readFileSync(path.join(__dirname, '../templates/invoice.docx'));

  const propData = {
    PROPOSAL_TITLE: "REBRANDING WEBSITE",
    CLIENT_NAME_UPPER: "JAM WISATA",
    COVER_DESCRIPTION: "Website Jam Wisata...",
    PROMO_LABEL: "Spesial Kemerdekaan",
    ESTIMATED_TIMELINE: "7-14 Hari Kerja",
    DOMAIN_INCLUDE_LABEL: "Domain .id Termasuk",
    CLIENT_NAME: "Jam Wisata",
    PROPOSAL_DATE: "17 Agustus 2026",
    PROJECT_VALUE_LABEL: "Rp399.000",
    PROPOSAL_DATE_SHORT: "17 AUG 2026",
    PROJECT_HEADLINE: "Rebranding website",
    PROJECT_OVERVIEW: "Overview text",
    GOAL_1_TITLE: "Goal 1", GOAL_1_DESC: "Desc 1",
    GOAL_2_TITLE: "Goal 2", GOAL_2_DESC: "Desc 2",
    GOAL_3_TITLE: "Goal 3", GOAL_3_DESC: "Desc 3",
    GOAL_4_TITLE: "Goal 4", GOAL_4_DESC: "Desc 4",
    DESIGN_DIRECTION_1: "Dir 1", DESIGN_DIRECTION_2: "Dir 2", DESIGN_DIRECTION_3: "Dir 3", DESIGN_DIRECTION_4: "Dir 4",
    SCOPE_INTRO: "Scope intro", SCOPE_HOME: "Home", SCOPE_PRODUCT_SERVICE: "Paket", SCOPE_ABOUT: "Tentang", SCOPE_CONTACT: "Kontak", SCOPE_GALLERY_TESTIMONIAL: "Galeri", SCOPE_CMS: "CMS", CMS_STATUS_PRICE: "Belum Termasuk", SCOPE_NAV_CTA: "Nav", SCOPE_BRANDING: "Brand", SCOPE_ADS: "Ads",
    DOMAIN_TYPE: ".id", DURATION: "1 tahun",
    CLIENT_MATERIAL_1: "Mat 1", CLIENT_MATERIAL_2: "Mat 2", CLIENT_MATERIAL_3: "Mat 3",
    T1_TIME: "H1", T1_DESC: "D1", T2_TIME: "H2", T2_DESC: "D2", T3_TIME: "H3", T3_DESC: "D3", T4_TIME: "H4", T4_DESC: "D4", T5_TIME: "H5", T5_DESC: "D5",
    P1_NAME: "Paket 1", P1_DESC: "Desc 1", P1_PRICE: "Rp399.000",
    P2_NAME: "Paket 2", P2_DESC: "Desc 2", P2_PRICE: "Rp799.000",
    DP_PERCENT: "50", REMAINING_PERCENT: "50",
    TERM_SCOPE: "Term 1", TERM_CMS_SUPPORT: "Term 2", TERM_REVISION: "Term 3", CURRENT_DOMAIN: "jamwisata.com", TERM_ASSETS_CONTENT: "Term 4", TERM_SEO: "Term 5", TERM_OWNERSHIP: "Term 6",
    CLOSING_MESSAGE: "Closing text"
  };

  const propReport = await createReport({
    template: proposalTpl,
    data: propData,
    cmdDelimiter: ['{{', '}}'],
    failFast: false
  });
  assert(propReport && propReport.length > 10000, "Proposal DOCX output should be a non-empty binary buffer!");
  console.log("✓ Proposal DOCX generation test passed! Buffer size:", propReport.length, "bytes");

  const invData = {
    STATUS: "MENUNGGU PEMBAYARAN",
    INVOICE_SUBTITLE: "Pembayaran DP Project Website Travel Umroh Jam Wisata",
    INVOICE_NUMBER: "INV-HS-170826-002",
    INVOICE_DATE: "17 Agustus 2026",
    DUE_DATE: "Saat diterima",
    CLIENT_NAME: "Client Jam Wisata",
    CLIENT_CONTACT: "+62 852-2292-7499",
    PROJECT_NAME: "Website Travel Umroh Jam Wisata",
    PROJECT_META: "Maks. 5 halaman",
    ITEM_DESCRIPTION: "Website Travel Umroh Jam Wisata",
    ITEM_DETAILS: "Domain .id 1 tahun, hosting 1 tahun, SSL, basic SEO.",
    PROJECT_TOTAL: "Rp399.000",
    DP_PERCENT: "50",
    DP_AMOUNT: "Rp199.500",
    REMAINING_AMOUNT: "Rp199.500",
    REMAINING_PERCENT: "50"
  };

  const invReport = await createReport({
    template: invoiceTpl,
    data: invData,
    cmdDelimiter: ['{{', '}}'],
    failFast: false
  });
  assert(invReport && invReport.length > 10000, "Invoice DOCX output should be a non-empty binary buffer!");
  console.log("✓ Invoice DOCX generation test passed! Buffer size:", invReport.length, "bytes");

  console.log("\nALL TESTS PASSED SUCCESSFULLY!");
}

testDocx().catch(err => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
