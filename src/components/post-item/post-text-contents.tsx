import { POST_CONTENT_LENGTH_SHORT } from "@/constants/constants";
import type { PostEntity, PostType } from "@/types/types";
import { useState } from "react";

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
            <>{post.content}</>
          )}
        </p>
      )}
    </>
  );
}
