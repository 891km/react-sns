import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type SessionProfile = {
  nickname: string;
  avatarImageUrl?: string | null;
  bio?: string;
};

type State = {
  isLoaded: boolean;
  session: Session | null;
  profile: SessionProfile | null;
};

const initialState = {
  isLoaded: false,
  session: null,
} as State;

const useSessionStore = create(
  devtools(
    // state + actions
    combine(initialState, (set) => ({
      actions: {
        setSession: ({
          session,
          profile,
        }: {
          session: Session | null;
          profile: SessionProfile | null;
        }) => {
          set({ session, isLoaded: true, profile });
        },
      },
    })),
    {
      name: "sessionStore",
    },
  ),
);

export const useSession = () => {
  const session = useSessionStore((store) => store.session);
  return session;
};

export const useSessionUserId = () => {
  const userId = useSessionStore((store) => store.session?.user.id);
  return userId;
};

export const useIsSessionLoaded = () => {
  const isSessionLoaded = useSessionStore((store) => store.isLoaded);
  return isSessionLoaded;
};

export const useSessionProfile = () => {
  const profile = useSessionStore((store) => store.profile);
  return profile;
};

export const useSetSession = () => {
  const setSession = useSessionStore((store) => store.actions.setSession);
  return setSession;
};
