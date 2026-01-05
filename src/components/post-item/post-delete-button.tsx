import AppLoader from "@/components/status/app-loader";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";
import { TOAST_MESSAGES_POST } from "@/constants/toast-messages";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { useOpenAlertModal } from "@/store/alert-modal";
import { Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function PostDeleteButton({ postId }: { postId: number }) {
  const navigate = useNavigate();
  const openAlertModal = useOpenAlertModal();

  const { mutate: deletePost, isPending } = useDeletePost({
    onSuccess: () => {
      toast.info(TOAST_MESSAGES_POST.DELETE.SUCCESS);

      const isDetailPage =
        location.pathname ===
        ROUTES.POST_DETAIL.replace(":postId", String(postId));

      if (isDetailPage) {
        navigate(ROUTES.HOME, { replace: true });
      }
    },
    onError: () => {
      toast.info(TOAST_MESSAGES_POST.DELETE.ERROR);
    },
  });

  const handleDeletePostClick = () => {
    openAlertModal({
      title: "게시물을 삭제하시겠습니까?",
      description: "삭제된 게시물은 복구할 수 없습니다.",
      onAction: () => {
        deletePost(postId);
      },
    });
  };

  return (
    <>
      {isPending && <AppLoader />}
      <DropdownMenuItem
        className="flex w-full cursor-pointer items-center gap-2.5"
        onClick={handleDeletePostClick}
      >
        <Trash2Icon />
        <span>삭제하기</span>
      </DropdownMenuItem>
    </>
  );
}
