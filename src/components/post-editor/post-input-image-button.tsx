import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePostEditor } from "@/provider/post-editor/post-editor-provider";
import { usePostImages } from "@/provider/post-editor/post-images-provider";
import { usePendingPostEditorModal } from "@/store/post-editor-modal";
import { ImageIcon } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

export default function PostInputImageButton() {
  const { isEdit } = usePostEditor();
  const { setImageItems } = usePostImages();
  const { isPending } = usePendingPostEditorModal();

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleSelectImages}
        disabled={isPending}
      />
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span>
            <Button
              size="lg"
              variant="outline"
              onClick={handleFileInputClick}
              disabled={isPending || isEdit}
            >
              <ImageIcon />
              이미지 추가
            </Button>
          </span>
        </TooltipTrigger>
        {isEdit && (
          <TooltipContent
            className={cn(
              "bg-neutral-200 text-neutral-950",
              "[&_svg]:bg-neutral-200 [&_svg]:fill-neutral-200",
              "dark:bg-neutral-50",
              "dark:[&_svg]:bg-neutral-50 dark:[&_svg]:fill-neutral-50",
            )}
          >
            <p>이미지는 수정할 수 없습니다.</p>
          </TooltipContent>
        )}
      </Tooltip>
    </>
  );
}
