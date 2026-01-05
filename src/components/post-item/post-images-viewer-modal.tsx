import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetchPostById } from "@/hooks/queries/use-fetch-post-by-id";
import { cn } from "@/lib/utils";
import { usePostImagesViewerModal } from "@/store/post-images-viewer-modal";
import { useEffect, useState } from "react";

const resetStyle = "m-0 h-screen w-full p-0 sm:m-0 sm:p-0";
const centerStyle = "flex justify-center items-center";

export default function PostImagesViewerModal() {
  const store = usePostImagesViewerModal();
  const {
    isOpen,
    actions: { close: closeModal },
  } = store;

  useEffect(() => {
    // 뒤로가기로 창닫기
    const handlePopState = () => {
      closeModal();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen]);

  if (!isOpen) return;
  if (!store.postId) return;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        className={cn(
          resetStyle,
          centerStyle,
          "max-h-screen max-w-screen sm:max-w-xl",
          "overflow-hidden",
          "rounded-none border-none bg-black sm:rounded-none md:rounded-none [&_svg]:text-white",
        )}
      >
        <DialogHeader className="hidden">
          <DialogTitle className="sr-only">이미지 뷰어</DialogTitle>
          <DialogDescription className="sr-only">
            포스트에 게시된 이미지를 자세히 볼 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        {
          <IamgeContents
            postId={store.postId}
            selectedIndex={store.selectedIndex}
          />
        }
      </DialogContent>
    </Dialog>
  );
}

function IamgeContents({
  postId,
  selectedIndex,
}: {
  postId: number;
  selectedIndex: number;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);

  const { data: post } = useFetchPostById({
    postId: postId,
    type: "DETAIL",
  });

  useEffect(() => {
    if (!api) return;
    api.scrollTo(selectedIndex, true);
  }, [api, selectedIndex]);

  const imageUrls = post?.image_urls;
  if (!imageUrls || imageUrls.length === 0) return;

  return (
    <Carousel setApi={setApi} className={cn(resetStyle)}>
      <CarouselContent className={cn(resetStyle)}>
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem key={imageUrl} className={cn(resetStyle, centerStyle)}>
            <img
              src={imageUrl}
              alt={`게시된 이미지 ${index + 1}`}
              loading="lazy"
              className={cn(
                "h-auto max-h-screen w-full object-contain",
                "transition-opacity duration-300",
              )}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 h-10 w-10 border-none bg-black/50 hover:bg-black/70" />
      <CarouselNext className="right-4 h-10 w-10 border-none bg-black/50 hover:bg-black/70" />
    </Carousel>
  );
}
