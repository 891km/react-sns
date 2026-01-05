import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { usePostImages } from "@/provider/post-editor/post-images-provider";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { XIcon } from "lucide-react";

export default function PostImagePreview() {
  const store = usePostEditorModal();
  const { imageItems, setImageItems } = usePostImages();

  const handleDeleteImageClick = (targetImageUrl: string) => {
    setImageItems((prevImageItem) =>
      prevImageItem.filter(
        (prevImageItem) => prevImageItem.previewUrl !== targetImageUrl,
      ),
    );
    URL.revokeObjectURL(targetImageUrl);
  };

  const reusltImageUrls =
    store.isOpen && store.type === "EDIT"
      ? store.imageUrls
      : imageItems.map((item) => item.previewUrl);

  return (
    <>
      {reusltImageUrls && reusltImageUrls.length > 0 && (
        <Carousel
          opts={{
            align: "start",
          }}
        >
          <CarouselContent>
            {reusltImageUrls.map((url, index) => (
              <CarouselItem
                key={url}
                className={cn(
                  "w-fit max-w-[80%] basis-auto",
                  index === reusltImageUrls.length - 1 && "mr-20",
                )}
              >
                <div
                  className={cn(
                    "relative w-fit min-w-20 flex-1 shrink-0 basis-auto overflow-hidden rounded-sm border sm:h-40",
                    "h-50 w-full",
                  )}
                >
                  <img
                    src={url}
                    alt="선택된 이미지 미리보기"
                    className="h-full w-full object-cover"
                  />
                  {store.isOpen && store.type !== "EDIT" && (
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      className="bg-secondary/60 absolute top-0 right-0 m-2 h-7 w-7"
                      aria-label="이미지 삭제"
                      onClick={() => handleDeleteImageClick(url)}
                    >
                      <XIcon />
                    </Button>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </>
  );
}
