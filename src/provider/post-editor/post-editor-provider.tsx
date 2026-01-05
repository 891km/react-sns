import { PostContentProvider } from "@/provider/post-editor/post-content-provider";
import { PostImagesProvider } from "@/provider/post-editor/post-images-provider";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { createContext, useContext, type ReactNode } from "react";

type PostEditorContextValue = {
  postId: number;
  isModalOpen: boolean;
  isEdit: boolean;
  closeModal: () => void;
};

const PostEditorContext = createContext<PostEditorContextValue | null>(null);

export const usePostEditor = () => {
  const ctx = useContext(PostEditorContext);
  if (!ctx) {
    throw new Error("usePostEditor는 PostEditorProvider가 있어야 합니다.");
  }
  return ctx;
};

export function PostEditorProvider({ children }: { children: ReactNode }) {
  const store = usePostEditorModal();

  const closeModal = () => {
    store.actions.close();
  };

  const isModalOpen = store.isOpen;
  const isEdit = isModalOpen && store.type === "EDIT";
  const postId = +(isEdit && store.postId);

  return (
    <PostContentProvider>
      <PostImagesProvider>
        <PostEditorContext.Provider
          value={{
            postId,
            isModalOpen,
            isEdit,
            closeModal,
          }}
        >
          {children}
        </PostEditorContext.Provider>
      </PostImagesProvider>
    </PostContentProvider>
  );
}
