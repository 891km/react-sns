import { cn } from "@/lib/utils";
import { usePostContent } from "@/provider/post-editor/post-content-provider";
import { usePostEditor } from "@/provider/post-editor/post-editor-provider";
import { useRef, useEffect } from "react";

export default function PostTextarea() {
  const { isModalOpen, isPending } = usePostEditor();
  const { content, setContent } = usePostContent();

  const MAX_COTENT_LENGTH = 800;
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
    <div className="flex flex-col gap-2 p-2">
      <textarea
        ref={textareaRef}
        className="min-h-30 w-full resize-none whitespace-pre-line focus:outline-none"
        placeholder="나누고 싶은 이야기가 있나요?"
        name="content"
        value={content}
        maxLength={MAX_COTENT_LENGTH}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <span
        className={cn(
          "ml-auto text-sm",
          content.length === MAX_COTENT_LENGTH
            ? "text-red-400"
            : "text-muted-foreground",
        )}
      >
        {content.length} / {MAX_COTENT_LENGTH}
      </span>
    </div>
  );
}
