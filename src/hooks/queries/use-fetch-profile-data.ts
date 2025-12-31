import { createProfileData, fetchProfileData } from "@/api/profile-api";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useSession } from "@/store/session";
import type { PostgrestError } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export const useFetchProfileData = (userId?: string) => {
  const session = useSession();
  const isCurrentUser = userId === session?.user.id;

  return useQuery({
    queryKey: QUERY_KEYS.profile.byId(userId!),
    queryFn: async () => {
      try {
        const profileData = await fetchProfileData(userId!);
        return profileData;
      } catch (error) {
        if (isCurrentUser && (error as PostgrestError).code === "PGRST116") {
          return await createProfileData(userId!);
        }
        throw error;
      }
    },
    enabled: !!userId,
  });
};
