import path from "path";
import fs from "fs";

export function loadTemplateBuffer(type: "proposal" | "invoice"): Buffer {
  const fileName = type === "proposal" ? "proposal.docx" : "invoice.docx";
  const templatePath = path.join(process.cwd(), "templates", fileName);

  if (fs.existsSync(/*turbopackIgnore: true*/ templatePath)) {
    return fs.readFileSync(/*turbopackIgnore: true*/ templatePath);
  }

  throw new Error(`Master template for ${type} not found at path: ${templatePath}`);
}
