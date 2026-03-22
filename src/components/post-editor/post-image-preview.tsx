import ImageHider from "@/components/status/image-hider";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { usePostContent } from "@/provider/post-editor/post-content-provider";
import { usePostImages } from "@/provider/post-editor/post-images-provider";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useEffect } from "react";

export default function PostImagePreview() {
  const store = usePostEditorModal();
  const { imagesMeta, setImagesMeta } = usePostContent();
  const { imageItems, setImageItems } = usePostImages();

  const handleDeleteImageClick = (targetImageUrl: string) => {
    setImageItems((prevImageItem) =>
      prevImageItem.filter(
        (prevImageItem) => prevImageItem.previewUrl !== targetImageUrl,
      ),
    );
    URL.revokeObjectURL(targetImageUrl);
  };

  const handleHideImageClick = () => {
    setImagesMeta(imagesMeta ? false : true);
  };

  useEffect(() => {
    if (store.isOpen && store.type !== "EDIT") {
      setImagesMeta(false);
    }
  }, [setImagesMeta, store]);

  const resultImageUrls =
    store.isOpen && store.type === "EDIT"
      ? store.imageUrls
      : imageItems.map((item) => item.previewUrl);

  return (
    <>
      {resultImageUrls && resultImageUrls.length > 0 && (
        <div className="flex flex-col gap-2">
          <Carousel
            opts={{
              align: "start",
            }}
          >
            <CarouselContent>
              {resultImageUrls.map((url, index) => (
                <CarouselItem
                  key={url}
                  className={cn(
                    "w-fit max-w-[80%] basis-auto",
                    index === resultImageUrls.length - 1 && "mr-20",
                  )}
                >
                  <div
                    className={cn(
                      "relative w-fit min-w-32 flex-1 shrink-0 basis-auto overflow-hidden rounded-sm border sm:h-40",
                      "h-50 w-full",
                    )}
                  >
                    <ImageHider isHidden={imagesMeta === true} />
                    <img
                      src={url}
                      alt="선택된 이미지 미리보기"
                      className="h-full w-full object-cover"
                    />
                    {store.isOpen && store.type !== "EDIT" && (
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        className="bg-secondary/60 absolute top-0 right-0 z-20 m-2 h-7 w-7"
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

          <Button
            size="sm"
            variant="ghost"
            className="w-fit"
            onClick={handleHideImageClick}
          >
            {imagesMeta === true ? (
              <>
                <EyeIcon />
                이미지 가리기 취소
              </>
            ) : (
              <>
                <EyeOffIcon />
                이미지 가리기
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
