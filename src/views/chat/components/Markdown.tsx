"use client";

import { useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { Citation } from "@/types";

import { cn } from "@/lib/utils";
import { parseCiteHref, prepareMarkdown } from "@/utils/citations";

interface ChipProps {
  marker: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function CitationChip({ marker, active, disabled, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Open source ${marker}`}
      className={cn(
        "mr-px ml-1 inline-flex h-[18px] min-w-[19px] items-center justify-center rounded-full px-[5px] align-[2px] font-mono text-[11px] leading-none font-semibold transition-colors disabled:cursor-default",
        active ? "bg-link text-background" : "bg-accent-bg text-link",
        !disabled && "hover:bg-link hover:text-background",
      )}
    >
      {marker}
    </button>
  );
}

interface MarkdownProps {
  content: string;
  citations: Citation[];
  streaming?: boolean;
  activeMarker?: number | null;
  onCite?: (marker: number) => void;
}

export function MarkdownContent({
  content,
  citations,
  streaming,
  activeMarker,
  onCite,
}: MarkdownProps) {
  const source = useMemo(
    () => prepareMarkdown(content, streaming ? null : citations),
    [content, citations, streaming],
  );

  const components = useMemo<Components>(
    () => ({
      p: ({ children }) => <p className="mb-3 text-pretty">{children}</p>,
      ul: ({ children }) => (
        <ul className="mb-3 list-disc pl-[22px]">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-3 list-decimal pl-[22px]">{children}</ol>
      ),
      li: ({ children }) => <li className="my-1 pl-0.5">{children}</li>,
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      h1: ({ children }) => (
        <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>
      ),
      h2: ({ children }) => (
        <h3 className="mt-4 mb-2 text-base font-semibold">{children}</h3>
      ),
      h3: ({ children }) => (
        <h4 className="mt-3 mb-2 font-semibold">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="mb-3 border-l-2 pl-3 text-muted-foreground">
          {children}
        </blockquote>
      ),
      pre: ({ children }) => (
        <pre className="mb-3 overflow-x-auto rounded-lg bg-secondary p-3 font-mono text-[13px] leading-normal">
          {children}
        </pre>
      ),
      code: ({ children, className }) =>
        className ? (
          <code className={className}>{children}</code>
        ) : (
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[13px]">
            {children}
          </code>
        ),
      a: ({ href, children }) => {
        const marker = parseCiteHref(href);
        if (marker !== null) {
          return (
            <CitationChip
              marker={marker}
              active={activeMarker === marker}
              disabled={streaming}
              onClick={() => onCite?.(marker)}
            />
          );
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-link hover:underline"
          >
            {children}
          </a>
        );
      },
    }),
    [activeMarker, onCite, streaming],
  );

  return (
    <div
      className={cn(
        "text-[15px] leading-[1.7]",
        streaming && (source ? "dm-stream" : "dm-stream-empty"),
      )}
    >
      <ReactMarkdown components={components}>{source}</ReactMarkdown>
    </div>
  );
}
