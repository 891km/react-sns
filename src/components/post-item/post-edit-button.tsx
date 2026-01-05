import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useOpenEditPostEditorModal } from "@/store/post-editor-modal";
import type { PostWithAuthor } from "@/types/types";
import { PencilIcon } from "lucide-react";

export default function PostEditButton({ post }: { post: PostWithAuthor }) {
  const openEditPostEditorModal = useOpenEditPostEditorModal();

  const handleEditPostClick = () => {
    openEditPostEditorModal({
      postId: post.id,
      content: post.content,
      imageUrls: post.image_urls,
    });
  };

  return (
    <DropdownMenuItem
      className="flex w-full cursor-pointer items-center gap-2.5"
      onClick={handleEditPostClick}
    >
      <PencilIcon />
      <span>수정하기</span>
    </DropdownMenuItem>
  );
}
