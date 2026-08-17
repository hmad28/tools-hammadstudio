import createReport from "docx-templates";
import { loadTemplateBuffer } from "./template-loader";
import { mapProposalPayloadToTemplate } from "./proposal-mapping";
import { mapInvoicePayloadToTemplate } from "./invoice-mapping";

export async function generateDocxBuffer(type: "proposal" | "invoice", payload: any): Promise<Buffer> {
  const templateBuffer = loadTemplateBuffer(type);
  const data = type === "proposal"
    ? mapProposalPayloadToTemplate(payload)
    : mapInvoicePayloadToTemplate(payload);

  const report = await createReport({
    template: templateBuffer,
    data: data,
    cmdDelimiter: ["{{", "}}"],
    failFast: false,
    rejectNullish: false,
  });

  return Buffer.from(report);
}
