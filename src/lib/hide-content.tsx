/**
 * before → shift
 * overlap → include
 * after → noop
 */

import { cn } from "@/lib/utils";
import type { ContentMeta } from "@/types/types";
import { useState, type MouseEvent, type ReactNode } from "react";

export function adjustContentMeta({
  delta,
  start,
  end,
  contentMeta,
}: {
  delta: number;
  start: number;
  end: number;
  contentMeta: ContentMeta;
}): ContentMeta {
  if (!contentMeta) return contentMeta;

  const cursorStart = delta > 0 ? start - delta : start;

  const updatedMeta = contentMeta
    .filter((meta) => {
      if (delta < 0 && start <= meta.start && end >= meta.end) return false;
      return true;
    })
    .map((meta) => {
      // before
      if (cursorStart <= meta.start) {
        const start = Math.max(0, meta.start + delta);
        const end = Math.max(0, meta.end + delta);
        return { start, end };
      }

      // overlap
      if (cursorStart > meta.start && cursorStart < meta.end) {
        const start = meta.start;
        const end = Math.max(meta.start, meta.end + delta);
        return { start, end };
      }

      // after
      return meta;
    })
    .sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return b.end - a.end;
    });

  return updatedMeta;
}

export function normalizeContentMeta(meta: ContentMeta): ContentMeta {
  if (!meta) return meta;

  if (meta.length <= 1) return meta;

  const sorted = [...meta].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  const normalizedMeta: ContentMeta = [];
  let current = { ...sorted[0] };

  for (let i = 0; i < sorted.length; i++) {
    const next = sorted[i];

    if (next.start <= current.end + 1) {
      current.end = Math.max(current.end, next.end);
    } else {
      normalizedMeta.push(current);
      current = { ...next };
    }
  }
  normalizedMeta.push(current);
  return normalizedMeta;
}

export function renderTextareaOverlay({
  content,
  contentMeta,
}: {
  content: string;
  contentMeta?: ContentMeta;
}) {
  if (contentMeta?.length === 0) return content;

  let nodes: ReactNode[] = [];
  let cursor = 0;

  contentMeta?.forEach((meta, index) => {
    if (cursor < meta.start) {
      nodes.push(
        <span key={`text-${index}`}>{content.slice(cursor, meta.start)}</span>,
      );
    }

    nodes.push(
      <span
        key={`hidden-${index}`}
        className="bg-muted-foreground/30 rounded-xs"
      >
        {content.slice(meta.start, meta.end)}
      </span>,
    );
    cursor = meta.end;
  });

  if (cursor < content.length) {
    nodes.push(<span key="text-end">{content.slice(cursor)}</span>);
  }

  return nodes;
}

export function renderHiddenContent({
  content,
  contentMeta,
}: {
  content: string;
  contentMeta?: ContentMeta;
}) {
  const [isShown, setIsShown] = useState<boolean[]>(() =>
    Array(contentMeta?.length ?? 0).fill(false),
  );

  const handleShowClick = (e: MouseEvent<HTMLSpanElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    setIsShown((prev) =>
      prev.map((isShown, i) => (i === index ? !isShown : isShown)),
    );
  };

  if (contentMeta?.length === 0) return content;

  let nodes: ReactNode[] = [];
  let cursor = 0;

  contentMeta?.forEach((meta, index) => {
    if (cursor < meta.start) {
      nodes.push(
        <span key={`text-${index}`}>{content.slice(cursor, meta.start)}</span>,
      );
    }

    nodes.push(
      <span
        key={`hidden-${index}`}
        className={cn(
          isShown[index]
            ? "text-primary bg-muted-foreground/10"
            : "bg-muted-foreground/40 rounded-xs text-transparent",
          "cursor-pointer",
          "transition-colors duration-150",
        )}
        onClick={(e) => handleShowClick(e, index)}
      >
        {content.slice(meta.start, meta.end)}
      </span>,
    );
    cursor = meta.end;
  });

  if (cursor < content.length) {
    nodes.push(<span key="text-end">{content.slice(cursor)}</span>);
  }

  return nodes;
}
