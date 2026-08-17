# Hammad Studio — Document Generator

> **Production-Ready Proposal & Invoice DOCX Generator Web Application**
> Built for **Hammad Studio** to manage clients, projects, scope presets, and generate professional `.docx` client documents directly from master Word templates.

---

## 🌟 Key Features

- **Master DOCX Template Fidelity**: Preserves Hammad Studio's exact typography, brand colors, header/footer, logos, tables, and page hierarchy.
- **In-Memory DOCX Generation**: Generates `.docx` files dynamically in serverless memory via `docx-templates` and streams binary responses directly without storing temporary files on disk.
- **Concurrency-Safe Document Sequence**: Generates atomic document numbers (`PROP-HS-DDMMYY-###` and `INV-HS-DDMMYY-###`) ensuring duplicate-free numbers across team members.
- **Proposal Generator Wizard**: 7-step wizard (Client & Project, Summary, Scope, Timeline, Investment, Terms, Review & Generate) with live HTML document preview.
- **Invoice Generator Wizard**: 6-step wizard (Client & Project, Details, Line Items, Bank Selection & Payments, Notes, Review & Generate).
- **Proposal-to-Invoice Conversion**: One-click "Buat Invoice" action on proposal detail page pre-filling client, project, line items, and pricing.
- **Immutable Document Snapshots**: Saved documents store a complete snapshot (`documents.payload` JSONB) ensuring historical documents are 100% reproducible regardless of future changes to client or studio settings.
- **Scope Presets Engine**: Reusable scope presets for *Travel / Umrah Website*, *Company Profile*, *Landing Page*, *E-Commerce*, *Business System*, and *Custom Software*.
- **Internal Team Authentication**: Secure Auth.js login for Hammad Studio internal administrators.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **DOCX Engine**: [docx-templates](https://github.com/guillermomartinez/docx-templates)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Architecture & DOCX Engine Workflow

```text
Structured Form Input / Neon Database Payload
                    │
                    ▼
          Validation & Normalization
                    │
                    ▼
          Document Template Mapper
  (mapProposalPayloadToTemplate / mapInvoicePayloadToTemplate)
                    │
                    ▼
       docx-templates Engine (createReport)
                    │
                    ▼
    In-Memory Binary Buffer Generation
                    │
                    ▼
   Next.js Node.js Route Handler HTTP Stream
   (Content-Type: application/vnd.openxmlformats...)
```

---

## 📁 Repository Structure

```text
.
├── templates/
│   ├── invoice.docx                # Master Invoice Word Template
│   └── proposal.docx               # Master Proposal Word Template
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/             # Login Page
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/          # Dashboard Overview & Metrics
│   │   │   ├── documents/          # Documents Table, Proposals & Invoices Wizards
│   │   │   ├── clients/            # Client Management
│   │   │   ├── projects/           # Project Management
│   │   │   ├── presets/            # Scope Presets Management
│   │   │   └── settings/           # Studio Settings & Bank Accounts
│   │   └── api/
│   │       ├── auth/[...nextauth]/ # Auth.js API
│   │       └── documents/          # Save, Download, Duplicate, Create Invoice APIs
│   ├── components/                 # UI, Layout, & Wizard Components
│   ├── db/
│   │   ├── index.ts                # Neon Drizzle DB Connection
│   │   ├── schema/                 # Drizzle Schema Definitions
│   │   ├── store.ts                # In-Memory & Persistence Manager
│   │   └── seed-data.ts            # Default Presets, Banks & Settings
│   └── lib/
│       ├── auth/                   # NextAuth Config
│       ├── documents/              # Template Loader & Mapper Logic
│       ├── finance/                # Financial Calculation Rules
│       ├── formatters/             # Indonesian Currency & Date Formatters
│       └── validation/             # Zod Validation Schemas
├── test/
│   └── run-tests.js                # Test Suite (Finance & DOCX Engine)
├── drizzle.config.ts
└── package.json
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgres://user:password@ep-cool-db-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Auth.js / NextAuth Configuration
AUTH_SECRET="hammad-studio-super-secret-key-2026"
ADMIN_EMAIL="admin@hammad.studio"
ADMIN_PASSWORD="hammad123"
```

---

## 🛠️ Local Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hmad28/tools-hammadstudio.git
   cd tools-hammadstudio
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) and log in with the admin credentials:
   - **Email**: `admin@hammad.studio`
   - **Password**: `hammad123`

---

## 🧪 Testing & Verification

Run the automated unit test suite:

```bash
pnpm test
```

Run TypeScript strict verification:

```bash
npx tsc --noEmit
```

Build Next.js production bundle:

```bash
pnpm build
```

---

## 🌐 Vercel Deployment Guide

1. Push your repository to GitHub.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Set the Environment Variables (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
4. Click **Deploy**.

---

## 📝 License

Internal business tool for **Hammad Studio**. All rights reserved.
