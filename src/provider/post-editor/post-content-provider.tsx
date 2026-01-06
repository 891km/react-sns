import { textMarker } from "@/lib/text-marker";
import { usePostEditorModal } from "@/store/post-editor-modal";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

// --- content state
type PostContentContextValue = {
  content: string;
  setContent: (content: string) => void;

  isEmptyContent: boolean;
  isContentChanged: boolean;

  isMarked: boolean;
  onSelectContent: (textareaRef: RefObject<HTMLTextAreaElement | null>) => void;
  onToggleMark: (textareaRef: RefObject<HTMLTextAreaElement | null>) => void;

  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
};

const PostContentContext = createContext<PostContentContextValue | null>(null);

export const usePostContent = () => {
  const ctx = useContext(PostContentContext);
  if (!ctx) {
    throw new Error("usePostContent는 PostContentProvider가 있어야 합니다.");
  }
  return ctx;
};

export function PostContentProvider({ children }: { children: ReactNode }) {
  const store = usePostEditorModal();
  const [content, setContent] = useState("");
  const [isMarked, setIsMarked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const isEmptyContent = !content.trim();
  const isContentChanged =
    store.isOpen && store.type === "EDIT" && content !== store.content;

  const onSelectContent = (
    textareaRef: RefObject<HTMLTextAreaElement | null>,
  ) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const { selectionStart: start, selectionEnd: end } = textarea;
    const isSelectedNow = start !== end;
    setIsSelected(isSelectedNow);

    if (isSelectedNow) {
      setIsMarked(textMarker.check({ text: content, start, end }));
    } else {
      setIsMarked(false);
    }
  };

  const onToggleMark = (textareaRef: RefObject<HTMLTextAreaElement | null>) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const { selectionStart: start, selectionEnd: end } = textarea;
    if (start === end) return;

    const newContent = textMarker.toggle({ text: content, start, end });
    setContent(newContent);

    setIsSelected(false);
    setIsMarked(false);
  };

  return (
    <PostContentContext.Provider
      value={{
        content,
        setContent,
        isEmptyContent,
        isContentChanged,
        onSelectContent,
        isMarked,
        onToggleMark,
        isSelected,
        setIsSelected,
      }}
    >
      {children}
    </PostContentContext.Provider>
  );
}
