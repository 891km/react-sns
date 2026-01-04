import PostEditorModal from "@/components/post-editor/post-editor-modal";
import PostImagesViewerModal from "@/components/post-item/post-images-viewer-modal";
import ProfileEditorModal from "@/components/profile/profile-editor-modal";
import AlertModal from "@/components/ui/alert-modal";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {createPortal(
        <>
          <PostEditorModal />
          <PostImagesViewerModal />
          <ProfileEditorModal />
          <AlertModal />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
