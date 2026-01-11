import ProfileInfo from "@/components/profile/profile-info";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useEffect } from "react";

import { usePostEditorModal } from "@/store/post-editor-modal";
import PostTextarea from "@/components/post-editor/post-textarea";
import PostImagePreview from "@/components/post-editor/post-image-preview";
import PostInputImageButton from "@/components/post-editor/post-input-image-button";
import PostSubmitButton from "@/components/post-editor/post-submit-button";
import { usePostContent } from "@/provider/post-editor/post-content-provider";
import { usePostImages } from "@/provider/post-editor/post-images-provider";
import { usePostEditor } from "@/provider/post-editor/post-editor-provider";
import { useSessionUserId } from "@/store/session";
import { cn } from "@/lib/utils";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";

export default function PostEditorModal() {
  const keyboardHeight = useKeyboardHeight();
  const userId = useSessionUserId();
  const store = usePostEditorModal();
  const openAlertModal = useOpenAlertModal();

  const {
    setContent,
    setContentMeta,
    setImagesMeta,
    isEmptyContent,
    isChanged,
  } = usePostContent();
  const { imageItems, setImageItems } = usePostImages();
  const { isEmptyImages } = usePostImages();
  const { isModalOpen, isEdit, closeModal } = usePostEditor();

  const handleCloseModal = () => {
    if (isEdit && !isChanged) {
      closeModal();
    } else if (!isEmptyContent || !isEmptyImages) {
      openAlertModal({
        title: "게시물 작성이 마무리 되지 않았습니다",
        description: "이 화면에서 나가면 작성 중인 내용이 사라집니다.",
        onAction: () => {
          closeModal();
        },
      });
      return;
    }
    closeModal();
  };

  useEffect(() => {
    if (!isModalOpen) {
      imageItems.forEach((imageItem) => {
        URL.revokeObjectURL(imageItem.previewUrl);
      });
      return;
    }
    if (store.isOpen && store.type === "EDIT") {
      setContent(store.content);
      setContentMeta(store.contentMeta);
      setImagesMeta(store.imagesMeta);
      setImageItems([]);
    } else {
      setContent("");
      setImageItems([]);
    }

    // 뒤로가기로 창닫기
    const handlePopState = () => {
      closeModal();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isModalOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [keyboardHeight]);

  if (!isModalOpen) return;
  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent
        className={cn("flex min-h-80 flex-col", "sm:max-h-[90vh]")}
      >
        <DialogHeader className="gap-8">
          <DialogTitle className="sm:text-center">
            {isEdit ? "포스트 수정" : "포스트 작성"}
          </DialogTitle>
          <ProfileInfo authorId={userId!} variant="simple" />
          <DialogDescription className="sr-only">
            글을 입력하고 이미지를 첨부해 게시물을 작성할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-auto">
          <PostTextarea />
          <PostImagePreview />
        </div>
        <DialogFooter>
          <PostInputImageButton />
          <PostSubmitButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
