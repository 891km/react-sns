import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

const initialState = {
  isOpen: false,
};

const profileEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
      },
    })),
    {
      name: "profileEditorModalStore",
    },
  ),
);

export const useOpenProfileEditorModal = () => {
  const open = profileEditorModalStore((store) => store.actions.open);
  return open;
};

export const useProfileEditorModal = () => {
  const store = profileEditorModalStore();
  return store;
};
