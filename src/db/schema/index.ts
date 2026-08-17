import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  jsonb,
  date,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";

// ==========================================
// 1. AUTH.JS TABLES
// ==========================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ==========================================
// 2. CLIENTS TABLE
// ==========================================

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  picName: varchar("pic_name", { length: 255 }),
  phone: varchar("phone", { length: 100 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  website: varchar("website", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 3. PROJECTS TABLE
// ==========================================

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull().default("Landing Page"),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull().default("Lead"),
  basePrice: bigint("base_price", { mode: "number" }).default(0),
  finalPrice: bigint("final_price", { mode: "number" }).default(0),
  startDate: date("start_date"),
  targetCompletionDate: date("target_completion_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 4. PROJECT PRESETS TABLE
// ==========================================

export const projectPresets = pgTable("project_presets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  defaultPayload: jsonb("default_payload").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 5. DOCUMENT TEMPLATES TABLE
// ==========================================

export const documentTemplates = pgTable("document_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'proposal' | 'invoice'
  fileName: varchar("file_name", { length: 255 }).notNull(),
  version: integer("version").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 6. DOCUMENTS TABLE
// ==========================================

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(), // 'proposal' | 'invoice'
  number: varchar("number", { length: 100 }).notNull().unique(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  templateId: uuid("template_id").references(() => documentTemplates.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("Draft"),
  issueDate: date("issue_date"),
  dueDate: date("due_date"),
  currency: varchar("currency", { length: 10 }).default("IDR").notNull(),
  subtotal: bigint("subtotal", { mode: "number" }).default(0).notNull(),
  discount: bigint("discount", { mode: "number" }).default(0).notNull(),
  total: bigint("total", { mode: "number" }).default(0).notNull(),
  dpPercentage: integer("dp_percentage").default(50).notNull(),
  dpAmount: bigint("dp_amount", { mode: "number" }).default(0).notNull(),
  paidAmount: bigint("paid_amount", { mode: "number" }).default(0).notNull(),
  remainingAmount: bigint("remaining_amount", { mode: "number" }).default(0).notNull(),
  payload: jsonb("payload").notNull(), // Full snapshot
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 7. DOCUMENT SEQUENCES TABLE (Concurrency-safe)
// ==========================================

export const documentSequences = pgTable(
  "document_sequences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: varchar("type", { length: 50 }).notNull(), // 'proposal' | 'invoice'
    dateKey: varchar("date_key", { length: 10 }).notNull(), // 'DDMMYY'
    lastValue: integer("last_value").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("type_date_key_unique").on(table.type, table.dateKey),
  ]
);

// ==========================================
// 8. BANK ACCOUNTS TABLE
// ==========================================

export const bankAccounts = pgTable("bank_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  bankName: varchar("bank_name", { length: 100 }).notNull(),
  accountNumber: varchar("account_number", { length: 100 }).notNull(),
  accountHolder: varchar("account_holder", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 9. STUDIO SETTINGS TABLE
// ==========================================

export const studioSettings = pgTable("studio_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
