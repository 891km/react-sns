import { Link } from "react-router";
import ProfileInfo from "@/components/profile/profile-info";
import { Button } from "@/components/ui/button";
import type { CommentEntity } from "@/types/types";
import { formatTimeAgo } from "@/lib/time";
import { useSessionUserId } from "@/store/session";
import { useEffect, useState } from "react";
import PostCommentEditor from "@/components/post-comment/post-comment-editor";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { toast } from "sonner";
import { TOAST_MESSAGES_COMMENT } from "@/constants/toast-messages";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function PostCommentItem({
  comment,
}: {
  comment: CommentEntity;
}) {
  const userId = useSessionUserId();
  const { id, author_id, content, created_at } = comment;

  const openAlertModal = useOpenAlertModal();

  const { mutate: deleteComment, isPending: isDeletePending } =
    useDeleteComment({
      onSuccess: () => {
        toast.info(TOAST_MESSAGES_COMMENT.DELETE.SUCCESS);
      },
      onError: () => {
        toast.error(TOAST_MESSAGES_COMMENT.DELETE.ERROR);
      },
    });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, []);

  const handleEditCommentClick = () => {
    toggleIsEditing();
  };

  const handleDeleteCommentClick = () => {
    openAlertModal({
      title: "댓글을 삭제하시겠습니까?",
      description: "삭제된 댓글은 복구할 수 없습니다.",
      onAction: () => deleteComment(id),
    });
  };

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const isCurrentUser = userId === author_id;

  return (
    <div className={"gap- flex flex-col pb-5 not-last:border-b"}>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Link to={"#"}>
            <ProfileInfo authorId={author_id!} variant="simple" />
          </Link>
          <span className="text-muted-foreground text-sm">
            {formatTimeAgo(created_at)}
          </span>
        </div>
        {isCurrentUser && (
          <div className="text-muted-foreground flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={handleEditCommentClick}
            >
              {isEditing ? "취소" : "수정"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              disabled={isEditing || isDeletePending}
              onClick={handleDeleteCommentClick}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      <div className="ml-14 flex flex-col items-start gap-2">
        {isEditing ? (
          <PostCommentEditor
            type="EDIT"
            commentId={id}
            initialContent={content}
            onClose={toggleIsEditing}
          />
        ) : (
          <p className="whitespace-pre-line">{content}</p>
        )}

        <Button variant="link" size="sm" className="text-muted-foreground p-0">
          ㄴ 답글 달기
        </Button>
      </div>
    </div>
  );
}
