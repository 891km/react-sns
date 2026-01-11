import { usePostEditorModal } from "@/store/post-editor-modal";
import type { ContentMeta, ImagesMeta } from "@/types/types";
import { createContext, useContext, useState, type ReactNode } from "react";

type PostContentContextValue = {
  content: string;
  setContent: (content: string) => void;
  contentMeta: ContentMeta;
  setContentMeta: (contentMeta: ContentMeta) => void;
  imagesMeta: ImagesMeta;
  setImagesMeta: (imagesMeta: ImagesMeta) => void;
  isEmptyContent: boolean;
  isChanged: boolean;
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
  const [imagesMeta, setImagesMeta] = useState<ImagesMeta>(false);

  const isEmptyContent = !content.trim();
  const isChanged =
    store.isOpen &&
    store.type === "EDIT" &&
    (content !== store.content ||
      imagesMeta !== store.imagesMeta ||
      !isSameContentMeta(contentMeta, store.contentMeta));

  return (
    <PostContentContext.Provider
      value={{
        content,
        setContent,
        contentMeta,
        setContentMeta,
        imagesMeta,
        setImagesMeta,
        isEmptyContent,
        isChanged,
      }}
    >
      {children}
    </PostContentContext.Provider>
  );
}

function isSameContentMeta(a: ContentMeta, b: ContentMeta) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  return a.every(
    (item, index) => item.start === b[index].start && item.end === b[index].end,
  );
}
