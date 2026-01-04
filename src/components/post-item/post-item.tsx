import { useState } from "react";
import { Link } from "react-router";
import { Ellipsis } from "lucide-react";

import { formatTimeAgo } from "@/lib/time";
import { ROUTES } from "@/constants/routes";

import { useSessionUserId } from "@/store/session";
import { useFetchPostById } from "@/hooks/queries/use-fetch-post-by-id";

import ProfileInfo from "@/components/profile/profile-info";
import Loader from "@/components/status/loader";
import ErrorMessage from "@/components/status/error-message";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { POST_CONTENT_LENGTH_SHORT } from "@/constants/constants";
import PostImageContents from "@/components/post-item/post-image-contents";
import PostShareButton from "@/components/post-item/post-share-button";
import PostEditButton from "@/components/post-item/post-edit-button";
import PostDeleteButton from "@/components/post-item/post-delete-button";
import PostLikeButton from "@/components/post-item/post-like-button";
import PostCommentButton from "@/components/post-item/post-comment-button";
import { cn } from "@/lib/utils";
import type { PostEntity } from "@/types/types";

type PostType = "FEED" | "DETAIL";

export default function PostItem({
  postId,
  type = "FEED",
}: {
  postId: number;
  type?: PostType;
}) {
  const userId = useSessionUserId();
  const { data: post, isPending, error } = useFetchPostById({ postId, type });

  if (error) return <ErrorMessage />;
  if (isPending) return <Loader />;

  const isCurrentUserPost = post.author_id === userId;

  return (
    <div className={cn("flex flex-col gap-6 px-1 pb-7 not-last:border-b")}>
      <div className="flex items-center justify-between">
        <ProfileInfo
          variant="post"
          authorId={post.author_id}
          dateText={formatTimeAgo(post.created_at)}
        ></ProfileInfo>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground"
              aria-label="포스트 옵션 열기"
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PostShareButton postId={postId} />
            </DropdownMenuItem>
            {isCurrentUserPost && (
              <>
                <DropdownMenuItem>
                  <PostEditButton post={post} />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PostDeleteButton postId={post.id} />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-4">
        {type === "FEED" ? (
          <Link
            to={ROUTES.POST_DETAIL.replace(":postId", String(post.id))}
            className="flex flex-col gap-4"
          >
            <PostContents post={post} type={type} />
          </Link>
        ) : (
          <PostContents post={post} type={type} />
        )}
        {post.image_urls && (
          <PostImageContents postId={post.id} imageUrls={post.image_urls} />
        )}
      </div>

      <div className="flex gap-2">
        <PostLikeButton
          postId={post.id}
          likeCount={post.like_count}
          isLiked={post.isLiked}
        />
        {type === "FEED" && (
          <PostCommentButton postId={post.id} count={post.commentCount} />
        )}
      </div>
    </div>
  );
}

function PostContents({ post, type }: { post: PostEntity; type: PostType }) {
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
