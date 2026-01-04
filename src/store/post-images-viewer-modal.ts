import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type ModalState = {
  isOpen: boolean;
  postId: number | null;
};

const initialState = {
  isOpen: false,
} as ModalState;

const postImagesViewerModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (postId: number) => set({ isOpen: true, postId }),
        close: () => set({ isOpen: false, postId: null }),
      },
    })),
    {
      name: "PostImagesViewerModalStore",
    },
  ),
);

export const useOpenPostImagesViewerModal = () => {
  const open = postImagesViewerModalStore((store) => store.actions.open);
  return open;
};

export const usePostImagesViewerModal = () => {
  const store = postImagesViewerModalStore((store) => store);
  return store;
};
