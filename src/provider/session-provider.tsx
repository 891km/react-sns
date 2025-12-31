import AppLoader from "@/components/ui/app-loader";
import { useFetchProfileData } from "@/hooks/queries/use-fetch-profile-data";
import supabase from "@/lib/supabase";
import { useSetSession, useIsSessionLoaded, useSession } from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  const { isLoading: isProfileLoading } = useFetchProfileData(session?.user.id);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded || isProfileLoading) return <AppLoader />;
  return children;
}
