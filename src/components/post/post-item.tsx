import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  Ellipsis,
  HeartIcon,
  MessageSquare,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";

import { formatTimeAgo } from "@/lib/time";
import type { PostWithAuthor } from "@/types/types";
import { ROUTES } from "@/constants/routes";
import { TOAST_MESSAGES_POST } from "@/constants/toast-messages";

import { useSessionUserId } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useOpenEditPostEditorModal } from "@/store/post-editor-modal";
import { useFetchPostById } from "@/hooks/queries/use-fetch-post-by-id";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";

import ProfileInfo from "@/components/profile/profile-info";
import AppLoader from "@/components/status/app-loader";
import Loader from "@/components/status/loader";
import ErrorMessage from "@/components/status/error-message";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTogglePostLike } from "@/hooks/mutations/post/use-toggle-post-like";
import { getLikeErrorMessageKo } from "@/lib/error-code-ko";

export default function PostItem({ postId }: { postId: number }) {
  const { data: post, isPending, error } = useFetchPostById({ postId });
  if (error) return <ErrorMessage />;
  if (isPending) return <Loader />;

  const userId = useSessionUserId();
  const isCurrentUserPost = post.author_id === userId;
  const LIMIT_CONTENT_LENGTH = 180;

  const [isExtended, setIsExtended] = useState<boolean>(
    Boolean(post.content.length < LIMIT_CONTENT_LENGTH),
  );

  return (
    <div className="flex flex-col gap-6 px-1 py-7 not-last:border-b">
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
            <DropdownMenuItem className="h-9">
              <SharePostButton postId={postId} />
            </DropdownMenuItem>
            {isCurrentUserPost && (
              <>
                <DropdownMenuItem className="h-9">
                  <EditPostButton post={post} />
                </DropdownMenuItem>
                <DropdownMenuItem className="h-9">
                  <DeletePostButton postId={post.id} />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        to={ROUTES.POST_DETAIL.replace(":postId", String(post.id))}
        className="flex flex-col gap-4"
      >
        {post.content && (
          <p className="text-base/6.5 whitespace-pre-line">
            {!isExtended ? (
              <>
                {post.content.slice(0, LIMIT_CONTENT_LENGTH)}...
                <ExtendContentButton setIsExtended={setIsExtended} />
              </>
            ) : (
              <>{post.content}</>
            )}
          </p>
        )}

        {post.image_urls && <ImageContents imageUrls={post.image_urls} />}
      </Link>

      <div className="flex gap-2">
        <LikeButton
          postId={post.id}
          likeCount={post.like_count}
          isLiked={post.isLiked}
        />
        <CommentButton />
      </div>
    </div>
  );
}

// --- components
function ImageContents({ imageUrls }: { imageUrls: string[] }) {
  const [isLoadedImages, setIsLoadedImages] = useState<boolean[]>(
    new Array(imageUrls.length).fill(false),
  );
  const handleSetIsLoadedImages = (index: number) => {
    setIsLoadedImages((prev) => {
      const loaded = [...prev];
      loaded[index] = true;
      return loaded;
    });
  };

  return (
    <Carousel>
      <CarouselContent>
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem key={imageUrl} className="basis-auto">
            <div className="relative h-64 w-fit flex-1 shrink-0 basis-auto overflow-hidden rounded-sm border">
              {!isLoadedImages[index] && (
                <div className="aspect-square h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              )}
              <img
                src={imageUrl}
                alt={`게시된 이미지 ${index}`}
                loading="lazy"
                className={cn(
                  "h-full w-auto object-contain transition-opacity duration-300",
                  isLoadedImages[index] ? "opacity-100" : "opacity-50",
                )}
                onLoad={() => handleSetIsLoadedImages(index)}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

// --- button components
function SharePostButton({ postId }: { postId: number }) {
  const handleSharePostClick = () => {
    const url = `${import.meta.env.VITE_SITE_URL}/post/${postId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("링크가 복사되었습니다."))
      .catch(() => toast.error("링크 복사에 실패했습니다."));
  };

  return (
    <button
      className="flex h-full w-full cursor-pointer items-center gap-2.5"
      onClick={handleSharePostClick}
    >
      <Share2 className="h-2 w-2" />
      <span>공유하기</span>
    </button>
  );
}

function EditPostButton({ post }: { post: PostWithAuthor }) {
  const openEditPostEditorModal = useOpenEditPostEditorModal();

  const handleEditPostClick = () => {
    openEditPostEditorModal({
      postId: post.id,
      content: post.content,
      imageUrls: post.image_urls,
    });
  };

  return (
    <button
      className="flex h-full w-full cursor-pointer items-center gap-2.5"
      onClick={handleEditPostClick}
    >
      <Pencil />
      <span>수정하기</span>
    </button>
  );
}

function DeletePostButton({ postId }: { postId: number }) {
  const openAlertModal = useOpenAlertModal();
  const { mutate: deletePost, isPending } = useDeletePost({
    onSuccess: () => {
      toast.info(TOAST_MESSAGES_POST.DELETE.SUCCESS);
    },
    onError: () => {
      toast.info(TOAST_MESSAGES_POST.DELETE.ERROR);
    },
  });

  const handleDeletePostClick = () => {
    openAlertModal({
      title: "게시물을 삭제하시겠습니까?",
      description: "삭제된 게시물은 복구할 수 없습니다.",
      onAction: () => deletePost(postId),
    });
  };

  return (
    <>
      {isPending && <AppLoader />}
      <button
        className="flex h-full w-full cursor-pointer items-center gap-2.5"
        onClick={handleDeletePostClick}
      >
        <Trash2 />
        <span>삭제하기</span>
      </button>
    </>
  );
}

function LikeButton({
  postId,
  likeCount,
  isLiked,
}: {
  postId: number;
  likeCount: number;
  isLiked: boolean;
}) {
  const userId = useSessionUserId();
  const { mutate: togglePostLike } = useTogglePostLike({
    onError: (error) => {
      toast.error(getLikeErrorMessageKo(error));
    },
  });

  const [isToggling, setIsToggling] = useState(false);

  const handleLikeClick = () => {
    if (!isLiked) {
      setIsToggling(true);

      setTimeout(() => {
        setIsToggling(false);
      }, 500);
    }

    togglePostLike({ postId, userId: userId! });
  };

  return (
    <Button variant="outline" onClick={handleLikeClick}>
      <HeartIcon
        className={cn(
          "h-4 w-4",
          isToggling ? "animate-(--like-ping)" : "animate-none",
          isLiked && "fill-current",
        )}
      />
      <span>{likeCount}</span>
    </Button>
  );
}

function CommentButton() {
  return (
    <Button variant="outline">
      <MessageSquare className="h-4 w-4" />
      <span>댓글 달기</span>
    </Button>
  );
}

function ExtendContentButton({
  setIsExtended,
}: {
  setIsExtended: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleExtendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExtended(true);
  };

  return (
    <button
      className="cursor-pointer px-2 text-gray-400"
      onClick={handleExtendClick}
    >
      더보기
    </button>
  );
}
