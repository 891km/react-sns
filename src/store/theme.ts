import type { Theme } from "@/types/types";
import { create } from "zustand";
import { combine, persist, devtools } from "zustand/middleware";

type State = {
  theme: Theme;
  isDark: boolean;
};

const initialState = {
  theme: "light",
  isDark: false,
} as State;

const useThemeStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
          setTheme: (theme: Theme) => {
            let isDark = false;
            const htmlTag = document.documentElement;
            htmlTag.classList.remove("system", "dark", "light");

            if (theme === "system") {
              isDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
              ).matches;
              htmlTag.classList.add(isDark ? "dark" : "light");
            } else {
              isDark = theme === "dark";
            }

            htmlTag.classList.add(theme);

            set({ theme, isDark });
          },
        },
      })),
      {
        name: "ThemeStore",
        partialize: (store) => ({
          theme: store.theme,
        }),
      },
    ),
    {
      name: "ThemeStore",
    },
  ),
);

export const useTheme = () => {
  const theme = useThemeStore((store) => store.theme);
  return theme;
};

export const useIsDarkTheme = () => {
  const isDark = useThemeStore((store) => store.isDark);
  return isDark;
};

export const useSetTheme = () => {
  const setTheme = useThemeStore((store) => store.actions.setTheme);
  return setTheme;
};
