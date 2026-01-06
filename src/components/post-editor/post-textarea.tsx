import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { POST_CONTENT_LENGTH_MAX } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { usePostContent } from "@/provider/post-editor/post-content-provider";
import { usePostEditor } from "@/provider/post-editor/post-editor-provider";
import { usePendingPostEditorModal } from "@/store/post-editor-modal";
import { useRef, useEffect } from "react";

export default function PostTextarea() {
  const { isModalOpen } = usePostEditor();
  const {
    content,
    setContent,
    isSelected,
    isMarked,
    onSelectContent,
    onToggleMark,
  } = usePostContent();
  const { isPending } = usePendingPostEditorModal();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef<{ start: number; end: number }>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [content]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [isModalOpen]);

  // --- selected
  const handleSelectTextarea = () => {
    onSelectContent(textareaRef);
  };

  const handleToggleMarkClick = () => {
    onToggleMark(textareaRef);

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  useEffect(() => {
    if (!isSelected || !textareaRef.current || !selectionRef.current) return;

    const { start, end } = selectionRef.current;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(start, end);
  }, [isSelected]);

  return (
    <div className="flex h-full flex-col gap-2 p-2 sm:h-auto">
      <ContextMenu>
        <ContextMenuTrigger disabled={!isSelected}>
          <textarea
            ref={textareaRef}
            className={cn(
              "w-full flex-1 resize-none whitespace-pre-line focus:outline-none sm:min-h-30",
            )}
            placeholder="나누고 싶은 이야기가 있나요?"
            name="content"
            value={content}
            maxLength={POST_CONTENT_LENGTH_MAX}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleSelectTextarea}
            disabled={isPending}
          />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-fit min-w-0">
          <Button
            variant="ghost"
            className="h-8 w-fit gap-0 p-3 text-sm"
            onClick={handleToggleMarkClick}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="m-0">
              {isMarked ? "텍스트 가리기 취소" : "텍스트 가리기"}
            </span>
          </Button>
        </ContextMenuContent>
      </ContextMenu>
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
