import AppLoader from "@/components/status/app-loader";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TOAST_MESSAGES_POST } from "@/constants/toast-messages";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";
import { usePostContent } from "@/provider/post-editor/post-content-provider";
import { usePostEditor } from "@/provider/post-editor/post-editor-provider";
import { usePostImages } from "@/provider/post-editor/post-images-provider";
import { usePendingPostEditorModal } from "@/store/post-editor-modal";
import { useSessionUserId } from "@/store/session";
import { toast } from "sonner";

export default function PostSubmitButton() {
  const userId = useSessionUserId();
  const { isEdit, postId, closeModal } = usePostEditor();
  const { content, isEmptyContent, isContentChanged } = usePostContent();
  const { imageItems, isEmptyImages } = usePostImages();
  const { isPending, setIsPending } = usePendingPostEditorModal();

  const { mutate: createPost } = useCreatePost({
    onMutate: () => setIsPending(true),
    onSuccess: () => {
      closeModal();
      toast.info(TOAST_MESSAGES_POST.CREATE.SUCCESS);
    },
    onError: () => {
      toast.error(TOAST_MESSAGES_POST.CREATE.ERROR);
    },
    onSettled: () => setIsPending(false),
  });

  const { mutate: updatePost } = useUpdatePost({
    onMutate: () => setIsPending(true),
    onSuccess: () => {
      closeModal();
      toast.info(TOAST_MESSAGES_POST.UPDATE.SUCCESS);
    },
    onError: () => {
      toast.error(TOAST_MESSAGES_POST.UPDATE.ERROR);
    },
    onSettled: () => setIsPending(false),
  });

  const handleCreatePostClick = () => {
    if (isEdit) return;
    if ((isEmptyContent && isEmptyImages) || !userId) return;

    createPost({
      content,
      imageFiles: imageItems.map((imageItem) => imageItem.file),
      userId: userId,
    });
  };

  const handleUpdatePostClick = () => {
    if (!isEdit) return;
    if (!userId || !isContentChanged) return;

    updatePost({
      id: postId,
      content,
    });
  };

  return (
    <>
      {isPending && <AppLoader />}
      {isEdit ? (
        <Button
          size="lg"
          onClick={handleUpdatePostClick}
          disabled={isPending || !isContentChanged}
        >
          {isPending && <Spinner />}
          수정하기
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={handleCreatePostClick}
          disabled={isPending || (isEmptyContent && isEmptyImages)}
        >
          {isPending && <Spinner />}
          게시하기
        </Button>
      )}
    </>
  );
}
