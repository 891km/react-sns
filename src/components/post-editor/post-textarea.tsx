import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { POST_CONTENT_LENGTH_MAX } from "@/constants/constants";
import {
  adjustContentMeta,
  normalizeContentMeta,
  renderTextareaOverlay,
} from "@/lib/hide-content";
import { cn } from "@/lib/utils";
import { usePostContent } from "@/provider/post-editor/post-content-provider";
import { usePostEditor } from "@/provider/post-editor/post-editor-provider";
import { usePendingPostEditorModal } from "@/store/post-editor-modal";
import { useRef, useEffect, type ChangeEvent } from "react";

export default function PostTextarea() {
  const { isModalOpen } = usePostEditor();
  const { content, setContent, contentMeta, setContentMeta } = usePostContent();
  const { isPending } = usePendingPostEditorModal();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlapRef = useRef<HTMLDivElement>(null);

  // useEffects
  // useEffect(() => {
  //   if (!textareaRef.current) return;

  //   setContentMeta(contentMeta);
  // }, [content, contentMeta]);

  useEffect(() => {
    if (!textareaRef.current || !overlapRef.current) return;
    const textarea = textareaRef.current;
    const overlay = overlapRef.current;

    textareaRef.current.value = content;

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    overlay.style.height = textarea.scrollHeight + "px";
  }, [content]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [isModalOpen]);

  // -- event handler
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    const delta = e.target.value.length - content.length;
    const start = e.target.selectionStart;
    if (delta === 0) return;

    // 글자 입력/삭제 -> 위치 보정 및 병합
    const updatedMeta = adjustContentMeta({
      delta,
      start,
      end: delta < 0 ? start - delta : start,
      contentMeta,
    });

    setContentMeta(updatedMeta);
  };

  const handleHideContentClick = () => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start === end) return;

    // 새 영역 추가
    setContentMeta(normalizeContentMeta([...contentMeta, { start, end }]));

    // ---
    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="flex h-full flex-col gap-2 p-2 sm:h-auto">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              className={cn(
                "relative",
                "w-full resize-none whitespace-pre-line focus:outline-none sm:min-h-30",
                "bg-transparent not-placeholder-shown:text-transparent",
                "caret-primary",
              )}
              placeholder="나누고 싶은 이야기가 있나요?"
              name="content"
              onChange={(e) => handleTextareaChange(e)}
              maxLength={POST_CONTENT_LENGTH_MAX}
              disabled={isPending}
            />
            <div
              ref={overlapRef}
              className={cn(
                "absolute inset-0 z-1",
                "w-full resize-none whitespace-pre-line focus:outline-none sm:min-h-30",
                "pointer-events-none",
              )}
            >
              {renderTextareaOverlay({ content, contentMeta })}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-fit min-w-0">
          <Button
            variant="ghost"
            className="h-8 w-fit gap-0 p-3 text-sm"
            onClick={handleHideContentClick}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="m-0">텍스트 가리기</span>
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
