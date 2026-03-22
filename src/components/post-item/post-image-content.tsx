import ImageHider from "@/components/status/image-hider";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useOpenPostImagesViewerModal } from "@/store/post-images-viewer-modal";
import type { ImagesMeta, PostType } from "@/types/types";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

export default function PostImageContent({
  postId,
  type,
  imageUrls,
  imagesMeta,
}: {
  postId: number;
  type: PostType;
  imageUrls: string[];
  imagesMeta: ImagesMeta;
}) {
  const openViewerModal = useOpenPostImagesViewerModal();
  const [isLoadedImages, setIsLoadedImages] = useState<boolean[]>(
    new Array(imageUrls.length).fill(false),
  );
  const [isHidden, setIsHidden] = useState(imagesMeta);

  const handleSetIsLoadedImages = (index: number) => {
    setIsLoadedImages((prev) => {
      const loaded = [...prev];
      loaded[index] = true;
      return loaded;
    });
  };

  const handleImageClick = (e: MouseEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    e.preventDefault();

    if (isHidden) return;
    openViewerModal({ postId, selectedIndex: index });
  };

  const handleShowImageClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsHidden((prev) => !prev);
  };

  useEffect(() => {
    setIsHidden(imagesMeta);
  }, [imagesMeta]);

  return (
    <div className="flex flex-col gap-2">
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {imageUrls.map((imageUrl, index) => (
            <CarouselItem
              key={imageUrl}
              className={cn(
                "w-fit shrink-0 basis-auto cursor-pointer",
                type === "DETAIL" && imageUrls.length === 1 && "w-full",
                index === imageUrls.length - 1 && "mr-20",
              )}
              onClick={(e: MouseEvent<HTMLDivElement>) =>
                handleImageClick(e, index)
              }
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-sm border",
                  "aspect-square h-auto w-76",
                  type === "DETAIL" &&
                    "aspect-auto w-auto max-w-[70vw] min-w-60 md:w-auto md:max-w-xl",
                  type === "DETAIL" &&
                    imageUrls.length === 1 &&
                    "w-full max-w-full md:w-full md:max-w-full",
                )}
              >
                {!isLoadedImages[index] && (
                  <Skeleton className="z-100 h-full w-full" />
                )}
                <ImageHider isHidden={isHidden} />
                <img
                  src={imageUrl}
                  alt={`게시된 이미지 ${index}`}
                  loading="lazy"
                  className={cn(
                    "transition-opacity duration-300",
                    "h-full w-full object-cover",
                    type === "DETAIL" && "object-contain",
                    isLoadedImages[index] ? "opacity-100" : "opacity-50",
                  )}
                  onLoad={() => handleSetIsLoadedImages(index)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {imagesMeta && (
        <Button
          size="sm"
          variant="ghost"
          className="w-fit"
          onClick={(e: MouseEvent<HTMLButtonElement>) =>
            handleShowImageClick(e)
          }
        >
          {isHidden ? (
            <>
              <EyeIcon />
              이미지 보기
            </>
          ) : (
            <>
              <EyeOffIcon />
              이미지 가리기
            </>
          )}
        </Button>
      )}
    </div>
  );
}
