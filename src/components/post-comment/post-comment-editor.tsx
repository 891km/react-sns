import ProfileInfo from "@/components/profile/profile-info";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { POST_COMMENT_LENGTH_MAX } from "@/constants/constants";
import { TOAST_MESSAGES_COMMENT } from "@/constants/toast-messages";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";
import { cn } from "@/lib/utils";
import { useSessionUserId } from "@/store/session";
import { useEffect, useRef, useState } from "react";
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

type CommentEditorProps = CreateMode | EditMode;

export default function PostCommentEditor(props: CommentEditorProps) {
  const { type } = props;

  const userId = useSessionUserId();

  const { mutate: createComment, isPending: isCreatePending } =
    useCreateComment({
      onSuccess: () => {
        setContent("");
      },
      onError: () => {
        toast.error(TOAST_MESSAGES_COMMENT.CREATE.ERROR);
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
    if (isEmptyContent || type !== "CREATE") return;
    createComment({ postId: props.postId, content });
  };

  const handleEditCommentClick = () => {
    if (isEmptyContent || type !== "EDIT") return;
    updateComment({
      commentId: props.commentId,
      content,
    });
  };

  const isPending = isCreatePending || isUpdatePending;
  const isEmptyContent = !content.trim();
  const isEdited = type === "EDIT" && props.initialContent !== content;

  return (
    <div className={cn("flex w-full flex-col gap-3 pb-2")}>
      {type === "CREATE" && <ProfileInfo variant="simple" authorId={userId!} />}
      <Textarea
        ref={textareaRef}
        className={cn(
          "max-h-40 min-h-24 w-full resize-none bg-white p-3 text-sm whitespace-pre-line focus:outline-none md:text-base",
          type === "EDIT" && "min-h-auto",
        )}
        placeholder="댓글을 남겨 보세요"
        name="content"
        value={content}
        maxLength={POST_COMMENT_LENGTH_MAX}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <div className="flex justify-end gap-2">
        {type === "CREATE" ? (
          <Button
            variant="default"
            disabled={isCreatePending || isEmptyContent}
            onClick={handleCreateCommentClick}
          >
            {isCreatePending && <Spinner />}
            작성
          </Button>
        ) : (
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
