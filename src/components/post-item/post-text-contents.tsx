import { POST_CONTENT_LENGTH_SHORT } from "@/constants/constants";
import type { PostEntity, PostType } from "@/types/types";
import { cn } from "@/lib/utils";
import type { ContentMeta } from "@/types/types";
import { useState, type MouseEvent, type ReactNode } from "react";

export default function PostTextContents({
  post,
  type,
}: {
  post: PostEntity;
  type: PostType;
}) {
  const [isExtended, setIsExtended] = useState<boolean>(
    type === "DETAIL"
      ? true
      : Boolean(post && post.content.length < POST_CONTENT_LENGTH_SHORT),
  );

  const handleExtendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExtended(true);
  };

  return (
    <>
      {post.content && (
        <p className="text-base/6.5 whitespace-pre-line">
          {!isExtended ? (
            <>
              {post.content.slice(0, POST_CONTENT_LENGTH_SHORT)}...
              <button
                className="cursor-pointer px-2 text-gray-400"
                onClick={handleExtendClick}
              >
                더보기
              </button>
            </>
          ) : (
            <>
              {
                <HiddenContent
                  content={post.content}
                  contentMeta={post.metadata?.content_hidden}
                />
              }
            </>
          )}
        </p>
      )}
    </>
  );
}

function HiddenContent({
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
