import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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

export default function PostImagesViewerModal() {
  const store = usePostImagesViewerModal();
  const {
    isOpen,
    postId,
    actions: { close },
  } = store;

  const { data: post } = useFetchPostById({
    postId: postId!,
    type: "DETAIL",
  });

  const imageUrls = post?.image_urls;

  if (!isOpen) return;
  if (!imageUrls || imageUrls.length === 0) return;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="flex h-screen w-screen max-w-screen items-center justify-center rounded-none border-none bg-black p-0 sm:max-w-xl [&_svg]:text-white">
        <DialogHeader className="hidden">
          <DialogTitle className="sr-only">이미지 뷰어</DialogTitle>
          <DialogDescription className="sr-only">
            포스트에 게시된 이미지를 자세히 볼 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <IamgeContents imageUrls={imageUrls} />
      </DialogContent>
    </Dialog>
  );
}

function IamgeContents({ imageUrls }: { imageUrls: string[] }) {
  return (
    <Carousel className="items-cen relative m-0 flex h-full w-full flex-1">
      <CarouselContent className="m-0 h-full w-full p-0">
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem key={imageUrl} className="m-0 h-full w-full p-0">
            <div className="flex h-full w-full flex-col justify-center">
              <img
                src={imageUrl}
                alt={`게시된 이미지 ${index + 1}`}
                loading="lazy"
                className={cn(
                  "h-full w-auto object-contain transition-opacity duration-300",
                )}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 h-10 w-10 border-none bg-black/50 hover:bg-black/70" />
      <CarouselNext className="right-4 h-10 w-10 border-none bg-black/50 hover:bg-black/70" />
    </Carousel>
  );
}
