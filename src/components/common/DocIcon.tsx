import {
  File,
  FileCode,
  FileText,
  FileType,
  Globe,
  type LucideIcon,
} from "lucide-react";

import type { DocTypeLabel } from "@/utils/documents";

const ICONS: Record<DocTypeLabel, LucideIcon> = {
  PDF: FileText,
  DOC: FileType,
  DOCX: FileType,
  TXT: File,
  MD: FileCode,
  URL: Globe,
};

export function DocIcon({
  type,
  className,
}: {
  type: DocTypeLabel;
  className?: string;
}) {
  const Icon = ICONS[type];
  return <Icon className={className} />;
}
