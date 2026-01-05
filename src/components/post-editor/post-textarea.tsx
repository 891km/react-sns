import { POST_CONTENT_LENGTH_MAX } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { usePostContent } from "@/provider/post-editor/post-content-provider";
import { usePostEditor } from "@/provider/post-editor/post-editor-provider";
import { usePendingPostEditorModal } from "@/store/post-editor-modal";
import { useRef, useEffect } from "react";

export default function PostTextarea() {
  const { isModalOpen } = usePostEditor();
  const { content, setContent } = usePostContent();
  const { isPending } = usePendingPostEditorModal();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [content]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [isModalOpen]);

  return (
    <div className="flex h-full flex-col gap-2 p-2 sm:h-auto">
      <textarea
        ref={textareaRef}
        className="w-full flex-1 resize-none whitespace-pre-line focus:outline-none sm:min-h-30"
        placeholder="나누고 싶은 이야기가 있나요?"
        name="content"
        value={content}
        maxLength={POST_CONTENT_LENGTH_MAX}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <span
        className={cn(
          "ml-auto text-sm",
          content.length === POST_CONTENT_LENGTH_MAX
            ? "text-red-400"
            : "text-muted-foreground",
        )}
      >
        {content.length} / {POST_CONTENT_LENGTH_MAX}
      </span>
    </div>
  );
}
