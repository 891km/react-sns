import ProfileInfo from "@/components/profile/profile-info";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
import { DialogDescription } from "@radix-ui/react-dialog";
import { ImageIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

type ImageItem = {
  file: File;
  previewUrl: string;
};

export default function PostEditorModal() {
  const [content, setContent] = useState("");
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = useSessionUserId();
  const { isOpen, close } = usePostEditorModal();
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close();
      toast.info("포스트가 성공적으로 게시되었습니다!");
    },
    onError: () => {
      toast.error("포스트 게시에 실패하였습니다.");
    },
  });

  const handleCloseModal = () => {
    if (!isEmptyContent || !isEmptyImages) {
      const confirmed = window.confirm(
        "게시물을 삭제하시겠어요?\n작성 중인 내용은 저장되지 않습니다.",
      );
      if (confirmed) {
        close();
      }
    } else {
      close();
    }
  };

  const handleCreatePostClick = () => {
    if (isEmptyContent || !userId) return;
    createPost({
      content,
      imageFiles: imageItems.map((imageItem) => imageItem.file),
      userId: userId,
    });
  };

  const handleFileInputClick = () => {
    fileInputRef?.current?.click();
  };

  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      setImageItems((prev) => [
        ...prev,
        { file, previewUrl: URL.createObjectURL(file) },
      ]);
    });

    e.target.value = "";
  };

  const handleDeleteImageClick = (imageItem: ImageItem) => {
    setImageItems((prevImages) =>
      prevImages.filter(
        (prevImage) => prevImage.previewUrl !== imageItem.previewUrl,
      ),
    );
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
    setImageItems([]);
  }, [isOpen]);

  const isEmptyContent = !content.trim();
  const isEmptyImages = imageItems.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="flex max-h-[90vh] min-h-80 flex-col">
        <DialogHeader className="gap-8">
          <DialogTitle className="sm:text-center">포스트 작성</DialogTitle>
          <ProfileInfo userId={userId!} variant="post" />
          <DialogDescription className="sr-only">
            글을 입력하고 이미지를 첨부해 게시물을 작성할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-auto">
          <textarea
            ref={textareaRef}
            className="min-h-30 w-full resize-none p-2 focus:outline-none"
            placeholder="나누고 싶은 이야기가 있나요?"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isCreatePostPending}
          />
          {imageItems.length > 0 && (
            <Carousel>
              <CarouselContent>
                {imageItems.map((imageItem) => (
                  <CarouselItem
                    key={imageItem.previewUrl}
                    className="basis-auto"
                  >
                    <div className="relative h-40 w-fit flex-1 shrink-0 basis-auto overflow-hidden rounded-sm border">
                      <img
                        src={imageItem.previewUrl}
                        alt="선택된 이미지 미리보기"
                        className="h-full w-auto object-contain"
                      />
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        className="bg-secondary/60 absolute top-0 right-0 m-2.5 h-7 w-7"
                        aria-label="이미지 삭제"
                        onClick={() => handleDeleteImageClick(imageItem)}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
        <DialogFooter>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelectImages}
          />
          <Button
            variant="outline"
            onClick={handleFileInputClick}
            disabled={isCreatePostPending}
          >
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
