import type { Citation } from "@/types";

const MARKER_RE = /\s*\[(\d+)\]/g;

// Turns [n] markers into #cite-n links for react-markdown; markers without a
// matching citation are dropped once the citation list is known (spec 7.3).
export function prepareMarkdown(
  content: string,
  citations: Citation[] | null,
): string {
  const valid = citations ? new Set(citations.map((c) => c.marker)) : null;
  return content.replace(MARKER_RE, (_m, n: string) => {
    const marker = Number(n);
    if (valid && !valid.has(marker)) return "";
    return `[${marker}](#cite-${marker})`;
  });
}

export function parseCiteHref(href: string | undefined): number | null {
  const m = href?.match(/^#cite-(\d+)$/);
  return m?.[1] ? Number(m[1]) : null;
}

// Plain text for the clipboard: keeps the [n] markers.
export function plainAnswer(content: string, citations: Citation[]): string {
  const valid = new Set(citations.map((c) => c.marker));
  return content.replace(MARKER_RE, (m, n: string) =>
    valid.has(Number(n)) ? ` [${n}]` : "",
  );
}

export function usedMarkers(
  content: string,
  citations: Citation[],
): Citation[] {
  const seen = new Set<number>();
  for (const m of content.matchAll(MARKER_RE)) seen.add(Number(m[1]));
  return citations
    .filter((c) => seen.has(c.marker))
    .sort((a, b) => a.marker - b.marker);
}
