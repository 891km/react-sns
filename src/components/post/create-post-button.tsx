import { PlusCircleIcon } from "lucide-react";
import { useOpenPostEditorModal } from "../../store/post-editor-modal";

export default function CreatePostButton() {
  const openPostEditorModal = useOpenPostEditorModal();

  return (
    <button
      className="bg-muted text-muted-foreground flex cursor-pointer items-center justify-between rounded-xl px-6 py-4"
      onClick={openPostEditorModal}
    >
      <span>나누고 싶은 이야기가 있나요?</span>
      <PlusCircleIcon className="h-6 w-6" />
    </button>
  );
}
