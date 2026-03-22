import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useOpenPostImagesViewerModal } from "@/store/post-images-viewer-modal";
import type { PostType } from "@/types/types";
import { useState } from "react";

export default function PostImageContent({
  postId,
  type,
  imageUrls,
}: {
  postId: number;
  type: PostType;
  imageUrls: string[];
}) {
  const openViewerModal = useOpenPostImagesViewerModal();
  const [isLoadedImages, setIsLoadedImages] = useState<boolean[]>(
    new Array(imageUrls.length).fill(false),
  );
  const handleSetIsLoadedImages = (index: number) => {
    setIsLoadedImages((prev) => {
      const loaded = [...prev];
      loaded[index] = true;
      return loaded;
    });
  };

  const handleImageClick = (index: number) => {
    openViewerModal({ postId, selectedIndex: index });
  };

  return (
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
            onClick={() => handleImageClick(index)}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-sm border",
                "aspect-square h-auto w-[70vw] max-w-80",
                "sm:w-[40vw] sm:max-w-74",
                type === "DETAIL" && "aspect-auto sm:w-[50vw]",
                type === "DETAIL" &&
                  imageUrls.length === 1 &&
                  "w-full max-w-full sm:w-full sm:max-w-full",
              )}
            >
              {!isLoadedImages[index] && <Skeleton className="h-full w-full" />}
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
  );
}
