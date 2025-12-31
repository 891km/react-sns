import AppLoader from "@/components/ui/app-loader";
import { useFetchProfileData } from "@/hooks/queries/use-fetch-profile-data";
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

  const { isLoading: isProfileLoading } = useFetchProfileData(userId);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded || isProfileLoading) return <AppLoader />;
  return children;
}
