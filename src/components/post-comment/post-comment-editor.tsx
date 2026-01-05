import ProfileInfo from "@/components/profile/profile-info";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { POST_COMMENT_LENGTH_MAX } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { TOAST_MESSAGES_COMMENT } from "@/constants/toast-messages";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";
import { getCommentErrorMessageKo } from "@/lib/error-code-ko";
import { cn } from "@/lib/utils";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useSessionUserId } from "@/store/session";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type CreateMode = {
  type: "CREATE";
  postId: number;
};

type EditMode = {
  type: "EDIT";
  commentId: number;
  initialContent: string;
  onClose: () => void;
};

type ReplyMode = {
  type: "REPLY";
  postId: number;
  parentCommentId: number;
  rootCommentId: number;
  onClose: () => void;
};

type CommentEditorProps = CreateMode | EditMode | ReplyMode;

export default function PostCommentEditor(props: CommentEditorProps) {
  const { type } = props;

  const userId = useSessionUserId();
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const { mutate: createComment, isPending: isCreatePending } =
    useCreateComment({
      onSuccess: () => {
        setContent("");
        if (type === "REPLY") props.onClose();
      },
      onError: (error) => {
        toast.error(getCommentErrorMessageKo(error));
      },
    });

  const { mutate: updateComment, isPending: isUpdatePending } =
    useUpdateComment({
      onSuccess: () => {
        (props as EditMode).onClose();
        setContent("");
      },
      onError: () => {
        toast.error(TOAST_MESSAGES_COMMENT.UPDATE.ERROR);
      },
    });

  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (type === "EDIT") {
      setContent(props.initialContent);
      textareaRef.current?.focus();
    }
  }, []);

  const handleCreateCommentClick = () => {
    if (isEmptyContent || type === "EDIT") return;

    if (type === "CREATE") {
      createComment({
        postId: props.postId,
        content,
      });
    } else if (type === "REPLY") {
      createComment({
        postId: props.postId,
        content,
        parentCommentId: props.parentCommentId,
        rootCommentId: props.rootCommentId,
      });
    }
  };

  const handleEditCommentClick = () => {
    if (isEmptyContent || type !== "EDIT") return;
    updateComment({
      commentId: props.commentId,
      content,
    });
  };

  const handleGuestTextareaClick = () => {
    if (userId) return;
    openAlertModal({
      title: "로그인이 필요한 서비스입니다.",
      description: "로그인 화면으로 이동하시겠습니까?",
      onAction: () => {
        navigate(ROUTES.LOGIN);
      },
    });
  };

  const handleFocus = () => {
    textareaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    console.log("제대로 되는건가요");
  };

  const isPending = isCreatePending || isUpdatePending;
  const isEmptyContent = !content.trim();
  const isEdited = type === "EDIT" && props.initialContent !== content;

  return (
    <div className={cn("flex w-full flex-col gap-3 pb-2")}>
      {userId ? (
        type === "CREATE" && <ProfileInfo variant="simple" authorId={userId} />
      ) : (
        <ProfileInfo variant="guest" />
      )}
      <Textarea
        ref={textareaRef}
        className={cn(
          "max-h-40 min-h-22 w-full resize-none bg-white p-3 whitespace-pre-line focus:outline-none",
          type !== "CREATE" && "min-h-auto",
        )}
        placeholder={
          type === "REPLY" ? "답글을 남겨 보세요" : "댓글을 남겨 보세요"
        }
        name="content"
        value={content}
        maxLength={POST_COMMENT_LENGTH_MAX}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
        onClick={handleGuestTextareaClick}
        onFocus={handleFocus}
      />
      <div className="flex justify-end gap-2">
        {type === "CREATE" && (
          <Button
            variant="default"
            disabled={isCreatePending || isEmptyContent}
            onClick={handleCreateCommentClick}
          >
            {isCreatePending && <Spinner />}
            작성
          </Button>
        )}
        {type === "REPLY" && (
          <Button
            variant="outline"
            disabled={isCreatePending || isEmptyContent}
            onClick={handleCreateCommentClick}
          >
            {isCreatePending && <Spinner />}
            작성
          </Button>
        )}
        {type === "EDIT" && (
          <Button
            variant="outline"
            disabled={isUpdatePending || !isEdited}
            onClick={handleEditCommentClick}
          >
            {isUpdatePending && <Spinner />}
            수정
          </Button>
        )}
      </div>
    </div>
  );
}
