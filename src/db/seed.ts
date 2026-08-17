import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import * as schema from "./schema";
import {
  INITIAL_BANK_ACCOUNTS,
  INITIAL_PROJECT_PRESETS,
  DEFAULT_STUDIO_SETTINGS,
} from "./seed-data";

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}

neonConfig.fetchConnectionCache = true;
const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding Neon PostgreSQL Database...");

  try {
    // 1. Seed Templates
    console.log("Seeding document templates...");
    await db.insert(schema.documentTemplates).values([
      {
        key: "proposal-default",
        name: "Hammad Studio Master Proposal Template",
        type: "proposal",
        fileName: "proposal.docx",
        version: 1,
        isActive: true,
      },
      {
        key: "invoice-default",
        name: "Hammad Studio Master Invoice Template",
        type: "invoice",
        fileName: "invoice.docx",
        version: 1,
        isActive: true,
      },
    ]).onConflictDoNothing();

    // 2. Seed Bank Accounts
    console.log("Seeding bank accounts...");
    for (const b of INITIAL_BANK_ACCOUNTS) {
      await db.insert(schema.bankAccounts).values(b).onConflictDoNothing();
    }

    // 3. Seed Presets
    console.log("Seeding project presets...");
    for (const p of INITIAL_PROJECT_PRESETS) {
      await db.insert(schema.projectPresets).values({
        name: p.name,
        category: p.category || "General",
        description: p.description,
        defaultPayload: p.defaultPayload,
        isActive: true,
      }).onConflictDoNothing();
    }

    // 4. Seed Studio Settings
    console.log("Seeding studio settings...");
    for (const [k, v] of Object.entries(DEFAULT_STUDIO_SETTINGS)) {
      await db.insert(schema.studioSettings).values({
        key: k,
        value: v,
      }).onConflictDoUpdate({
        target: schema.studioSettings.key,
        set: { value: v },
      });
    }

    // 5. Seed Client (Jam Wisata)
    console.log("Seeding initial client & project...");
    const insertedClients = await db.insert(schema.clients).values({
      name: "Jam Wisata",
      companyName: "PT Jam Wisata Indonesia",
      picName: "Bapak Ahmad",
      phone: "+62 852-2292-7499",
      email: "info@jamwisata.com",
      address: "Jl. Wisata No. 17, Jakarta",
      website: "www.jamwisata.com",
      notes: "Klien travel umrah & tur.",
    }).returning();

    if (insertedClients.length > 0) {
      await db.insert(schema.projects).values({
        clientId: insertedClients[0].id,
        name: "Website Travel Umrah Jam Wisata",
        category: "Travel / Umrah Website",
        description: "Rebranding website travel umrah multipage (maks. 5 halaman).",
        status: "Confirmed",
        basePrice: 799000,
        finalPrice: 399000,
        startDate: "2026-08-17",
        targetCompletionDate: "2026-08-31",
        notes: "Promo Kemerdekaan 17 Agustus 2026.",
      }).onConflictDoNothing();
    }

    console.log("✅ SEEDING COMPLETE!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seed();
