import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useOpenPostImagesViewerModal } from "@/store/post-images-viewer-modal";
import { useState } from "react";

export default function PostImageContents({
  postId,
  imageUrls,
}: {
  postId: number;
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
    <Carousel>
      <CarouselContent>
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem
            key={imageUrl}
            className="basis-auto cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
            <div className="relative h-64 w-fit flex-1 shrink-0 basis-auto overflow-hidden rounded-sm border">
              {!isLoadedImages[index] && (
                <div className="aspect-square h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              )}
              <img
                src={imageUrl}
                alt={`게시된 이미지 ${index}`}
                loading="lazy"
                className={cn(
                  "h-full w-auto object-contain transition-opacity duration-300",
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
