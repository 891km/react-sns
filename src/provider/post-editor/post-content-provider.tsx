import { usePostEditorModal } from "@/store/post-editor-modal";
import type { ContentMeta } from "@/types/types";
import { createContext, useContext, useState, type ReactNode } from "react";

type PostContentContextValue = {
  content: string;
  setContent: (content: string) => void;
  contentMeta: ContentMeta;
  setContentMeta: (contentMeta: ContentMeta) => void;
  isEmptyContent: boolean;
  isContentChanged: boolean;
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
  const [contentMeta, setContentMeta] = useState<ContentMeta>([]);

  const isEmptyContent = !content.trim();
  const isContentChanged =
    store.isOpen && store.type === "EDIT" && content !== store.content;

  return (
    <PostContentContext.Provider
      value={{
        content,
        setContent,
        contentMeta,
        setContentMeta,
        isEmptyContent,
        isContentChanged,
      }}
    >
      {children}
    </PostContentContext.Provider>
  );
}
