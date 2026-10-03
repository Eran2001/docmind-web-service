import { describe, expect, it } from "vitest";
import type { Citation } from "@/types";

import {
  parseCiteHref,
  plainAnswer,
  prepareMarkdown,
  usedMarkers,
} from "@/utils/citations";

const citation = (marker: number): Citation => ({
  marker,
  chunkId: `chunk-${marker}`,
  documentId: "doc-1",
  documentTitle: "Handbook.pdf",
  pageNumber: marker,
  snippet: "…",
});

describe("prepareMarkdown", () => {
  it("turns [n] markers into #cite-n links and absorbs the space before them", () => {
    expect(prepareMarkdown("You get 25 days [1].", [citation(1)])).toBe(
      "You get 25 days[1](#cite-1).",
    );
  });

  it("drops markers that have no citation once the citations are known", () => {
    expect(
      prepareMarkdown("Thirty days [1] and more [9].", [citation(1)]),
    ).toBe("Thirty days[1](#cite-1) and more.");
  });

  it("keeps every marker while the answer is still streaming (no citation list yet)", () => {
    expect(prepareMarkdown("Maybe [2][3]", null)).toBe(
      "Maybe[2](#cite-2)[3](#cite-3)",
    );
  });

  it("leaves text without markers alone", () => {
    expect(prepareMarkdown("Nothing cited here.", [citation(1)])).toBe(
      "Nothing cited here.",
    );
  });
});

describe("parseCiteHref", () => {
  it("reads the marker from a citation link", () => {
    expect(parseCiteHref("#cite-12")).toBe(12);
  });

  it("returns null for anything else", () => {
    expect(parseCiteHref("https://example.com")).toBeNull();
    expect(parseCiteHref("#cite-")).toBeNull();
    expect(parseCiteHref("#cite-1a")).toBeNull();
    expect(parseCiteHref(undefined)).toBeNull();
  });
});

describe("plainAnswer", () => {
  it("keeps valid [n] markers (for the clipboard) and removes unknown ones", () => {
    expect(plainAnswer("Yes [1], maybe [4].", [citation(1)])).toBe(
      "Yes [1], maybe.",
    );
  });
});

describe("usedMarkers", () => {
  it("returns the citations the text actually uses, in marker order", () => {
    const used = usedMarkers("B [3] then A [1].", [
      citation(1),
      citation(2),
      citation(3),
    ]);

    expect(used.map((c) => c.marker)).toEqual([1, 3]);
  });
});
