import PostEditorModal from "@/components/post-editor/post-editor-modal";
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
          <ProfileEditorModal />
          <AlertModal />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
