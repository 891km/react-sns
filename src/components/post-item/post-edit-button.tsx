import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useOpenEditPostEditorModal } from "@/store/post-editor-modal";
import type { Post } from "@/types/types";
import { PencilIcon } from "lucide-react";

export default function PostEditButton({ post }: { post: Post }) {
  const openEditPostEditorModal = useOpenEditPostEditorModal();

  const handleEditPostClick = () => {
    openEditPostEditorModal({
      postId: post.id,
      content: post.content,
      contentMeta: post.metadata.content_hidden,
      imagesMeta: post.metadata.images_hidden,
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
