import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Share2Icon } from "lucide-react";
import { toast } from "sonner";

export default function PostShareButton({ postId }: { postId: number }) {
  const handleSharePostClick = () => {
    const url = `${import.meta.env.VITE_SITE_URL}/post/${postId}`;

    if (!navigator.clipboard) {
      toast.error("링크 복사에 실패했습니다.");
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("링크가 복사되었습니다."))
      .catch(() => toast.error("링크 복사에 실패했습니다."));
  };

  return (
    <DropdownMenuItem
      className="flex w-full cursor-pointer items-center gap-2.5"
      onClick={handleSharePostClick}
    >
      <Share2Icon />
      <span>공유하기</span>
    </DropdownMenuItem>
  );
}
