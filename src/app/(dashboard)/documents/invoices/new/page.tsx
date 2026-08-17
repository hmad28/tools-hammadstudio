import { Header } from "@/components/layout/header";
import { InvoiceForm } from "@/components/documents/invoice-form";
import { memoryStore } from "@/db/store";

export default function NewInvoicePage() {
  const clients = memoryStore.getClients();
  const projects = memoryStore.getProjects();
  const bankAccounts = memoryStore.getBankAccounts();

  return (
    <div>
      <Header
        title="Buat Invoice Baru"
        subtitle="Hammad Studio Professional Invoice Generator"
      />

      <div className="p-6 max-w-7xl mx-auto">
        <InvoiceForm
          clients={clients}
          projects={projects}
          bankAccounts={bankAccounts}
        />
      </div>
    </div>
  );
}
