/**
 * before → shift
 * overlap → include
 * after → noop
 */

import type { ContentMeta } from "@/types/types";

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

    if (next.start < current.end) {
      current.end = Math.max(current.end, next.end);
    } else {
      normalizedMeta.push(current);
      current = { ...next };
    }
  }
  normalizedMeta.push(current);
  return normalizedMeta;
}

export function splitContentByMeta({
  content,
  contentMeta,
}: {
  content: string;
  contentMeta?: ContentMeta;
}) {
  let cursor = 0;
  const metas = contentMeta ?? [];
  const result: Array<{ type: string; value: string }> = [];

  metas.forEach((meta) => {
    if (cursor < meta.start) {
      result.push({
        type: "text",
        value: content.slice(cursor, meta.start),
      });
    }

    result.push({
      type: "hidden",
      value: content.slice(meta.start, meta.end),
    });

    cursor = meta.end;
  });

  if (cursor < content.length) {
    result.push({
      type: "text",
      value: content.slice(cursor),
    });
  }

  return result;
}
