import { Header } from "@/components/layout/header";
import { ProposalForm } from "@/components/documents/proposal-form";
import { memoryStore } from "@/db/store";

export default function NewProposalPage() {
  const clients = memoryStore.getClients();
  const projects = memoryStore.getProjects();
  const presets = memoryStore.getPresets();

  return (
    <div>
      <Header
        title="Buat Proposal Baru"
        subtitle="Hammad Studio Professional Proposal Generator"
      />

      <div className="p-6 max-w-7xl mx-auto">
        <ProposalForm
          clients={clients}
          projects={projects}
          presets={presets}
        />
      </div>
    </div>
  );
}
