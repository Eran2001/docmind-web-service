import type { Citation, DocumentDto } from "@/types";

export type DocTypeLabel = "PDF" | "DOCX" | "TXT" | "MD" | "URL";

export function documentTypeLabel(
  doc: Pick<DocumentDto, "sourceType" | "originalFilename" | "mimeType">,
): DocTypeLabel {
  if (doc.sourceType === "url") return "URL";
  const ext = doc.originalFilename?.split(".").pop()?.toLowerCase();
  if (ext === "pdf" || doc.mimeType === "application/pdf") return "PDF";
  if (ext === "docx") return "DOCX";
  if (ext === "md") return "MD";
  return "TXT";
}

export type DocIconName =
  | "file-text"
  | "file-type"
  | "file"
  | "file-code"
  | "globe";

export const DOC_ICON_BY_TYPE: Record<DocTypeLabel, DocIconName> = {
  PDF: "file-text",
  DOCX: "file-type",
  TXT: "file",
  MD: "file-code",
  URL: "globe",
};

export function pageLabel(c: Pick<Citation, "pageNumber">): string {
  return c.pageNumber ? `p. ${c.pageNumber}` : "web";
}

export function docTypeFromTitle(title: string, isUrl: boolean): DocTypeLabel {
  if (isUrl) return "URL";
  const ext = title.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "docx") return "DOCX";
  if (ext === "md") return "MD";
  return "TXT";
}
