import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Citation } from "@/types";

import {
  CitationChip,
  MarkdownContent,
} from "@/views/chat/components/Markdown";

const citation = (marker: number): Citation => ({
  marker,
  chunkId: `chunk-${marker}`,
  documentId: "doc-1",
  documentTitle: "Handbook.pdf",
  pageNumber: marker + 3,
  snippet: "…",
});

describe("CitationChip", () => {
  it("shows the marker as a button that says which source it opens", () => {
    render(<CitationChip marker={2} />);

    expect(
      screen.getByRole("button", { name: "Open source 2" }),
    ).toHaveTextContent("2");
  });

  it("calls onClick when pressed, but not when disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<CitationChip marker={1} onClick={onClick} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Open source 1" }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<CitationChip marker={1} onClick={onClick} disabled />);
    await userEvent.click(
      screen.getByRole("button", { name: "Open source 1" }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("MarkdownContent", () => {
  it("renders [n] in the text as clickable citation chips", async () => {
    const onCite = vi.fn();
    render(
      <MarkdownContent
        content="You get 25 days [1]. Carry over 5 [2]."
        citations={[citation(1), citation(2)]}
        onCite={onCite}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
    await userEvent.click(
      screen.getByRole("button", { name: "Open source 2" }),
    );
    expect(onCite).toHaveBeenCalledWith(2);
    expect(screen.queryByText(/\[1\]/)).not.toBeInTheDocument();
  });

  it("removes markers that point at a source that does not exist", () => {
    render(
      <MarkdownContent
        content="Thirty days [1] and a made-up one [7]."
        citations={[citation(1)]}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByText(/Thirty days/)).toBeInTheDocument();
    expect(screen.queryByText(/\[7\]/)).not.toBeInTheDocument();
  });

  it("shows chips but keeps them disabled while the answer is streaming", () => {
    render(
      <MarkdownContent
        content="Streaming a claim [1]"
        citations={[]}
        streaming
        onCite={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Open source 1" }),
    ).toBeDisabled();
  });

  it("marks the active chip", () => {
    render(
      <MarkdownContent
        content="A [1] and B [2]"
        citations={[citation(1), citation(2)]}
        activeMarker={2}
      />,
    );

    expect(screen.getByRole("button", { name: "Open source 2" })).toHaveClass(
      "bg-link",
    );
    expect(
      screen.getByRole("button", { name: "Open source 1" }),
    ).not.toHaveClass("bg-link");
  });

  it("renders ordinary markdown and opens normal links in a new tab safely", () => {
    render(
      <MarkdownContent
        content={"**Bold** and a [link](https://example.com).\n\n- one\n- two"}
        citations={[]}
      />,
    );

    expect(screen.getByText("Bold").tagName).toBe("STRONG");
    const link = screen.getByRole("link", { name: "link" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
