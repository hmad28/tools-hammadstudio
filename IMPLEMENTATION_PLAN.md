# Hammad Studio — Proposal & Invoice DOCX Generator
## Implementation Plan & Technical Architecture Specification

### 1. Architectural Principles
- **Serverless & Stateless Runtime**: Designed for Vercel deployment without persistent filesystem or long-running daemon workers.
- **Neon PostgreSQL + Drizzle ORM**: Relational schema for indexed metadata and JSONB payloads for immutable document snapshots.
- **In-Memory DOCX Generation**: `.docx` templates loaded from application bundle (`/templates/`), data injected dynamically via `docx-templates`, and returned directly via Node.js Route Handlers (`export const runtime = "nodejs"`).
- **Snapshot Integrity**: Saving a proposal or invoice stores a full snapshot in `documents.payload` so future changes to clients, projects, or studio settings never mutate historical documents.

---

### 2. Database Schema Design (`src/db/schema/index.ts`)

```typescript
// PostgreSQL tables using drizzle-orm/pg-core

// Auth.js tables
users, accounts, sessions, verificationTokens

// Business entity tables
clients (id, name, companyName, picName, phone, email, address, website, notes, createdAt, updatedAt)

projects (id, clientId, name, category, description, status, basePrice, finalPrice, startDate, targetCompletionDate, notes, createdAt, updatedAt)

project_presets (id, name, category, description, defaultPayload [JSONB], isActive, createdAt, updatedAt)

document_templates (id, key, name, type, fileName, version, isActive, createdAt, updatedAt)

documents (
  id [UUID],
  type ['proposal' | 'invoice'],
  number [VARCHAR, UNIQUE],
  clientId [UUID],
  projectId [UUID],
  templateId [UUID],
  title [VARCHAR],
  status ['draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'archived' | 'waiting_payment' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'],
  issueDate [DATE],
  dueDate [DATE],
  currency [VARCHAR default 'IDR'],
  subtotal [BIGINT],
  discount [BIGINT],
  total [BIGINT],
  dpPercentage [INTEGER],
  dpAmount [BIGINT],
  paidAmount [BIGINT],
  remainingAmount [BIGINT],
  payload [JSONB], // Full snapshot of client, project, scope, timeline, pricing, terms, banks, notes
  generatedAt [TIMESTAMP],
  createdAt [TIMESTAMP],
  updatedAt [TIMESTAMP]
)

document_sequences (
  id [UUID],
  type ['proposal' | 'invoice'],
  dateKey [VARCHAR], // DDMMYY format, e.g. "170826"
  lastValue [INTEGER], // Atomic increment counter
  UNIQUE(type, dateKey)
)

bank_accounts (id, bankName, accountNumber, accountHolder, isActive, sortOrder, createdAt, updatedAt)

studio_settings (key [PRIMARY KEY], value [JSONB], updatedAt)
```

---

### 3. DOCX Template Mapping Specification

#### A. Proposal (`templates/proposal.docx`)
| Template Placeholder | Source Field in Document Payload | Example Output Value |
|---|---|---|
| `{{PROPOSAL_TITLE}}` | `payload.proposalTitle` | `REBRANDING WEBSITE` |
| `{{CLIENT_NAME_UPPER}}` | `payload.client.name.toUpperCase()` | `JAM WISATA` |
| `{{COVER_DESCRIPTION}}` | `payload.coverDescription` | `Website Jam Wisata yang lebih modern...` |
| `{{PROMO_LABEL}}` | `payload.promoLabel` | `Spesial Kemerdekaan` |
| `{{ESTIMATED_TIMELINE}}` | `payload.estimatedTimeline` | `7-14 Hari Kerja` |
| `{{DOMAIN_INCLUDE_LABEL}}` | `payload.domainIncludeLabel` | `Domain .id Termasuk` |
| `{{CLIENT_NAME}}` | `payload.client.name` | `Jam Wisata` |
| `{{PROPOSAL_DATE}}` | `payload.proposalDateFormatted` | `17 Agustus 2026` |
| `{{PROJECT_VALUE_LABEL}}` | `payload.projectValueLabel` | `Rp399.000 (Maks. 5 Halaman)` |
| `{{PROPOSAL_DATE_SHORT}}` | `payload.proposalDateShortFormatted` | `17 AUG 2026` |
| `{{PROJECT_HEADLINE}}` | `payload.projectHeadline` | `Rebranding website...` |
| `{{PROJECT_OVERVIEW}}` | `payload.projectOverview` | `Hammad Studio akan melakukan...` |
| `{{GOAL_1_TITLE}}` / `{{GOAL_1_DESC}}` | `payload.objectives[0]` | `Memperkuat Brand` / `Membawa...` |
| `{{GOAL_2_TITLE}}` / `{{GOAL_2_DESC}}` | `payload.objectives[1]` | `Menampilkan Paket` / `Menyajikan...` |
| `{{GOAL_3_TITLE}}` / `{{GOAL_3_DESC}}` | `payload.objectives[2]` | `Mempermudah Konsultasi` / `Mengarahkan...` |
| `{{GOAL_4_TITLE}}` / `{{GOAL_4_DESC}}` | `payload.objectives[3]` | `Fondasi Digital` / `Basic SEO...` |
| `{{DESIGN_DIRECTION_1..4}}` | `payload.designDirections[0..3]` | Bullet points for visual direction |
| `{{SCOPE_INTRO}}` | `payload.scopeIntro` | `Paket Spesial Kemerdekaan...` |
| `{{SCOPE_HOME..ADS}}` | `payload.scopes` area descriptions | Detailed scope area content |
| `{{CMS_STATUS_PRICE}}` | `payload.cmsStatusPrice` | `Belum Termasuk - Opsional - Paket Rp699.000` |
| `{{DOMAIN_TYPE}}` / `{{DURATION}}` | `payload.domainType` / `payload.duration` | `.id` / `1 tahun` |
| `{{CLIENT_MATERIAL_1..3}}` | `payload.clientMaterials[0..2]` | Client assets & details |
| `{{T1_TIME..T5_TIME}}` / `{{T1_DESC..T5_DESC}}` | `payload.timelinePhases[0..4]` | Phase duration & description |
| `{{P1_NAME}}` / `{{P1_DESC}}` / `{{P1_PRICE}}` | `payload.primaryPackage` | `PAKET SPESIAL KEMERDEKAAN` / `...` / `Rp399.000` |
| `{{P2_NAME}}` / `{{P2_DESC}}` / `{{P2_PRICE}}` | `payload.optionalPackage` | `PROMO SPESIAL KEMERDEKAAN + CMS` / `...` / `Rp799.000` |
| `{{DP_PERCENT}}` / `{{REMAINING_PERCENT}}` | `payload.dpPercent` / `payload.remainingPercent` | `50` / `50` |
| `{{TERM_SCOPE..TERM_OWNERSHIP}}` | `payload.terms` | Terms & Conditions clauses |
| `{{CLOSING_MESSAGE}}` | `payload.closingMessage` | Final CTA & closing text |

#### B. Invoice (`templates/invoice.docx`)
| Template Placeholder | Source Field in Document Payload | Example Output Value |
|---|---|---|
| `{{STATUS}}` | `payload.statusText` | `MENUNGGU PEMBAYARAN` |
| `{{INVOICE_SUBTITLE}}` | `payload.invoiceSubtitle` | `Pembayaran DP Project Website...` |
| `{{INVOICE_NUMBER}}` | `payload.invoiceNumber` | `INV-HS-170826-002` |
| `{{INVOICE_DATE}}` | `payload.invoiceDateFormatted` | `17 Agustus 2026` |
| `{{DUE_DATE}}` | `payload.dueDateFormatted` | `Saat diterima` |
| `{{CLIENT_NAME}}` | `payload.client.name` | `Client Website Travel Umroh Jam Wisata` |
| `{{CLIENT_CONTACT}}` | `payload.client.contact` | `+62 852-2292-7499` |
| `{{PROJECT_NAME}}` | `payload.projectName` | `Website Travel Umroh Jam Wisata - Multipage` |
| `{{PROJECT_META}}` | `payload.projectMeta` | `Maks. 5 halaman • Promo Merdeka 17 Agustus` |
| `{{ITEM_DESCRIPTION}}` | `payload.itemDescription` | Line item description |
| `{{ITEM_DETAILS}}` | `payload.itemDetails` | Line item details/inclusions |
| `{{PROJECT_TOTAL}}` | `payload.formattedTotal` | `Rp399.000` |
| `{{DP_PERCENT}}` | `payload.dpPercent` | `50` |
| `{{DP_AMOUNT}}` | `payload.formattedDpAmount` | `Rp199.500` |
| `{{REMAINING_AMOUNT}}` | `payload.formattedRemainingAmount` | `Rp199.500` |
| `{{REMAINING_PERCENT}}` | `payload.remainingPercent` | `50` |

---

### 4. Page Architecture & Routing
```text
/                       -> Redirects to /dashboard or /login
/(auth)/login           -> Auth.js Login screen
/(dashboard)/dashboard  -> Overview metrics cards, recent documents, quick actions
/(dashboard)/documents  -> Table of all documents, filter by type/status, search
/(dashboard)/documents/proposals/new  -> 8-step wizard form for Proposal creation
/(dashboard)/documents/invoices/new   -> 7-step wizard form for Invoice creation
/(dashboard)/documents/[id]          -> Detail view, status management, preview, download action
/(dashboard)/clients    -> Clients list & client detail drawer/page
/(dashboard)/projects   -> Projects list & project management
/(dashboard)/presets    -> Project scope presets management
/(dashboard)/settings   -> Bank accounts & default studio terms/notes
/api/documents/[id]/download -> Node.js Route Handler for binary DOCX stream
```

---

### 5. Implementation Roadmap (Phases 1 - 7)

- **Phase 1: Project Setup & Database Layer**: Initialize Next.js 15 App Router, Tailwind CSS, shadcn/ui, Auth.js, Drizzle ORM, Neon PostgreSQL configuration, and database migrations.
- **Phase 2: Core Master Data**: Build CRUD management for Clients, Projects, Scope Presets, Studio Settings, and Bank Accounts.
- **Phase 3: Proposal Engine & Forms**: Multi-step proposal generator form with dynamic arrays (scope, objectives, timeline, terms), draft saving, HTML preview, duplicate proposal functionality.
- **Phase 4: Invoice Engine & Forms**: Invoice creation form with line items, bank snapshots, payment calculation rules, HTML preview, duplicate invoice functionality.
- **Phase 5: In-Memory DOCX Generation Engine**: `docx-templates` integration in Node.js Route Handler. Streaming binary response directly without disk writes.
- **Phase 6: Proposal-to-Invoice Workflow**: One-click "Create Invoice from Proposal" action pre-filling client, project, line item, and pricing data. Document search, filters, and dashboard metrics.
- **Phase 7: Testing & Production Hardening**: Financial logic unit tests, DOCX archive validation tests, TypeScript strict checking, linting, build validation, and Vercel deployment readiness.
