import AppLoader from "@/components/status/app-loader";
import { useFetchProfile } from "@/hooks/queries/use-fetch-profile";
import supabase from "@/lib/supabase";
import {
  useSetSession,
  useIsSessionLoaded,
  useSessionUserId,
} from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const userId = useSessionUserId();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  const { data: profile, isLoading: isProfileLoading } =
    useFetchProfile(userId);

  useEffect(() => {
    if (profile) {
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession({
          session,
          profile: {
            nickname: profile.nickname,
            avatarImageUrl: profile.avatar_image_url,
            bio: profile.bio,
          },
        });
      });
    } else {
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession({
          session,
          profile: null,
        });
      });
    }
  }, [profile]);

  if (!isSessionLoaded || isProfileLoading) return <AppLoader />;
  return children;
}
