import ProfileInfo from "@/components/profile/profile-info";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useSessionUserId } from "@/store/session";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function PostEditorModal() {
  const userId = useSessionUserId();
  const { isOpen, close } = usePostEditorModal();
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close();
    },
    onError: () => {
      toast.error("포스트 게시에 실패하였습니다.");
    },
  });

  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCloseModal = () => {
    if (!isEmptyContent) {
      const confirmed = window.confirm("게시물을 삭제하시겠어요?");
      if (confirmed) {
        close();
      }
    }
    close();
  };

  const handleCreatePostClick = () => {
    if (isEmptyContent) return;
    createPost(content);
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [content]);

  useEffect(() => {
    if (!isOpen) return;
    textareaRef.current?.focus();
    setContent("");
  }, [isOpen]);

  const isEmptyContent = !content.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="flex max-h-[90vh] flex-col">
        <DialogHeader className="gap-8">
          <DialogTitle className="sm:text-center">포스트 작성</DialogTitle>
          <ProfileInfo userId={userId!} variant="post" />
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <textarea
            ref={textareaRef}
            className="min-h-50 w-full resize-none p-2 focus:outline-none"
            placeholder="나누고 싶은 이야기가 있나요?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isCreatePostPending}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={isCreatePostPending}>
            <ImageIcon />
            이미지 추가
          </Button>
          <Button
            onClick={handleCreatePostClick}
            disabled={isCreatePostPending}
          >
            {isCreatePostPending && <Spinner />}
            게시하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
