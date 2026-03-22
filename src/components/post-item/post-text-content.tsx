import { POST_CONTENT_LENGTH_SHORT } from "@/constants/constants";
import type { PostEntity, PostType } from "@/types/types";
import { cn } from "@/lib/utils";
import type { ContentMeta } from "@/types/types";
import { useState, type MouseEvent } from "react";
import { splitContentByMeta } from "@/lib/content-meta";

export default function PostTextContent({
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
    <div className="flex flex-col gap-4">
      {post.content && (
        <p className="text-base/6.5 whitespace-pre-line">
          {!isExtended ? (
            <>
              <ContentWithMeta
                content={post.content.slice(0, POST_CONTENT_LENGTH_SHORT)}
                contentMeta={post.metadata?.content_hidden}
              />
              <span>...</span>
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
                <ContentWithMeta
                  content={post.content}
                  contentMeta={post.metadata?.content_hidden}
                />
              }
            </>
          )}
        </p>
      )}
    </div>
  );
}

function ContentWithMeta({
  content,
  contentMeta,
}: {
  content: string;
  contentMeta?: ContentMeta;
}) {
  const contentItems = splitContentByMeta({ content, contentMeta });

  const [isShown, setIsShown] = useState<boolean[]>(() =>
    contentItems.map((item) => (item.type === "hidden" ? false : true)),
  );

  const handleShowClick = (
    e: MouseEvent<HTMLSpanElement>,
    targetIndex: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsShown((prev) =>
      prev.map((isShown, index) =>
        index === targetIndex ? !isShown : isShown,
      ),
    );
  };

  return (
    <>
      {contentItems.map((item, index) => {
        if (item.type === "hidden") {
          return (
            <span
              key={`${item.type}-${index}`}
              className={cn(
                isShown[index]
                  ? "text-primary bg-muted-foreground/10"
                  : "bg-muted-foreground/40 rounded-xs text-transparent",
                "cursor-pointer",
                "transition-colors duration-150",
              )}
              onClick={(e) => handleShowClick(e, index)}
            >
              {item.value}
            </span>
          );
        } else {
          return <span key={`${item.type}-${index}`}>{item.value}</span>;
        }
      })}
    </>
  );
}
