import { z } from "zod";

export const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama klien wajib diisi"),
  companyName: z.string().optional().nullable(),
  picName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().optional().nullable(),
  name: z.string().min(1, "Nama project wajib diisi"),
  category: z.string().min(1, "Kategori project wajib diisi"),
  description: z.string().optional().nullable(),
  status: z.enum(["Lead", "Proposal", "Confirmed", "In Progress", "Review", "Completed", "Cancelled"]).default("Lead"),
  basePrice: z.number().nonnegative().default(0),
  finalPrice: z.number().nonnegative().default(0),
  startDate: z.string().optional().nullable(),
  targetCompletionDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const scopeItemSchema = z.object({
  area: z.string().min(1, "Nama area scope wajib diisi"),
  description: z.string().min(1, "Deskripsi scope wajib diisi"),
  status: z.enum(["included", "optional", "excluded"]),
  optionalPrice: z.number().optional(),
  statusText: z.string().optional(),
});

export const timelinePhaseSchema = z.object({
  number: z.number(),
  title: z.string().min(1, "Judul tahapan wajib diisi"),
  duration: z.string().min(1, "Durasi wajib diisi"),
  description: z.string().min(1, "Deskripsi tahapan wajib diisi"),
});

export const proposalSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  proposalNumber: z.string().optional(),
  proposalTitle: z.string().min(1, "Judul proposal wajib diisi"),
  proposalDate: z.string().min(1, "Tanggal proposal wajib diisi"),
  client: clientSchema,
  project: z.object({
    id: z.string().optional(),
    name: z.string(),
    category: z.string(),
  }),
  coverDescription: z.string().min(1, "Deskripsi cover wajib diisi"),
  promoLabel: z.string().optional(),
  estimatedTimeline: z.string().optional(),
  domainIncludeLabel: z.string().optional(),
  projectValueLabel: z.string().optional(),
  projectHeadline: z.string().min(1, "Headline project wajib diisi"),
  projectOverview: z.string().min(1, "Ringkasan project wajib diisi"),
  objectives: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  })).min(1, "Minimal 1 tujuan utama"),
  designDirections: z.array(z.string()),
  scopeIntro: z.string().optional(),
  scopes: z.array(scopeItemSchema),
  inclusions: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })),
  clientMaterials: z.array(z.string()),
  timelinePhases: z.array(timelinePhaseSchema),
  primaryPackage: z.object({
    name: z.string().min(1, "Nama paket utama wajib diisi"),
    description: z.string(),
    normalPrice: z.number().nonnegative(),
    discount: z.number().nonnegative(),
    finalPrice: z.number().nonnegative(),
  }),
  optionalPackage: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().nonnegative(),
  }).optional(),
  dpPercent: z.number().min(0).max(100).default(50),
  terms: z.array(z.object({
    title: z.string(),
    body: z.string(),
  })),
  closingMessage: z.string().optional(),
  status: z.enum(["Draft", "Sent", "Approved", "Rejected", "Expired", "Archived"]).default("Draft"),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Deskripsi rincian tagihan wajib diisi"),
  details: z.string().optional(),
  quantity: z.number().min(1).default(1),
  unitPrice: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const invoiceSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  invoiceNumber: z.string().optional(),
  invoiceSubtitle: z.string().min(1, "Subjudul invoice wajib diisi"),
  status: z.enum(["Draft", "Waiting Payment", "Partially Paid", "Paid", "Cancelled", "Overdue", "Archived"]).default("Draft"),
  issueDate: z.string().min(1, "Tanggal invoice wajib diisi"),
  dueDate: z.string().min(1, "Jatuh tempo wajib diisi"),
  client: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nama klien wajib diisi"),
    contact: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  project: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nama project wajib diisi"),
    meta: z.string().optional(),
  }),
  items: z.array(invoiceItemSchema).min(1, "Minimal 1 rincian item tagihan"),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  dpPercentage: z.number().min(0).max(100).default(50),
  dpAmount: z.number().nonnegative(),
  paidAmount: z.number().nonnegative().default(0),
  remainingAmount: z.number().nonnegative(),
  banks: z.array(z.object({
    bankName: z.string(),
    accountNumber: z.string(),
    accountHolder: z.string(),
  })),
  notes: z.array(z.string()),
});

export const bankAccountSchema = z.object({
  id: z.string().optional(),
  bankName: z.string().min(1, "Nama bank wajib diisi"),
  accountNumber: z.string().min(1, "Nomor rekening wajib diisi"),
  accountHolder: z.string().min(1, "Nama pemilik rekening wajib diisi"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});
