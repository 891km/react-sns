import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type CreateMode = {
  isOpen: true;
  type: "CREATE";
  isPending: boolean;
};

type EditMode = {
  isOpen: true;
  type: "EDIT";
  postId: number;
  content: string;
  imageUrls: string[] | null;
  isPending: boolean;
};

type OpenState = CreateMode | EditMode;

type CloseState = {
  isOpen: false;
  isPending: false;
};

type ModalState = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as ModalState;

const usePostEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: () => {
          set({ isOpen: true, type: "CREATE" });
        },
        openEdit: (param: Omit<EditMode, "isOpen" | "type">) => {
          set({ isOpen: true, type: "EDIT", ...param });
        },
        close: () => {
          set({ isOpen: false });
        },
        setIsPending: (isPending: boolean) => {
          set({ isPending });
        },
      },
    })),
    {
      name: "postEditorModalStore",
    },
  ),
);

export const useOpenPostEditorModal = () => {
  const open = usePostEditorModalStore((store) => store.actions.open);
  return open;
};

export const useOpenEditPostEditorModal = () => {
  const openEdit = usePostEditorModalStore((store) => store.actions.openEdit);
  return openEdit;
};

export const usePendingPostEditorModal = () => {
  const setIsPending = usePostEditorModalStore(
    (store) => store.actions.setIsPending,
  );
  const isPending = usePostEditorModalStore((store) => store.isPending);
  return { isPending, setIsPending };
};

export const usePostEditorModal = () => {
  const store = usePostEditorModalStore();
  return store as typeof store & ModalState;
};
