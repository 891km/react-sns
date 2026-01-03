import AppLoader from "@/components/status/app-loader";
import ErrorMessage from "@/components/status/error-message";
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

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: fetchProfileError,
  } = useFetchProfile(userId);

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

  if (fetchProfileError)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <ErrorMessage />
      </div>
    );
  if (!isSessionLoaded || isProfileLoading) return <AppLoader />;
  return children;
}
