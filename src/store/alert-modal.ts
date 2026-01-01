import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  title: string;
  description: string;
  onAction?: () => void;
  onCancel?: () => void;
};

type CloseState = {
  isOpen: false;
};

type ModalState = OpenState | CloseState;

const initialState = {
  isOpen: false,
} as ModalState;

const useAlertModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: Omit<OpenState, "isOpen">) => {
          set({ isOpen: true, ...params });
        },
        close: () => {
          set(initialState);
        },
      },
    })),
    {
      name: "alertModalStore",
    },
  ),
);

export const useOpenAlertModal = () => {
  const open = useAlertModalStore((store) => store.actions.open);
  return open;
};

export const useAlertModal = () => {
  const store = useAlertModalStore();
  return store as typeof store & ModalState;
};
