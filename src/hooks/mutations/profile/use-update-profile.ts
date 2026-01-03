import { updateProfile } from "@/api/profile-api";
import { QUERY_KEYS } from "@/constants/constants";
import type { ProfileEntity, UseMutationCallback } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const userUpdateProfile = (callback?: UseMutationCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onError: (error) => callback?.onError?.(error),
    onSuccess: (updatedProfile) => {
      callback?.onSuccess?.();
      queryClient.setQueryData<ProfileEntity>(
        QUERY_KEYS.profile.byId(updatedProfile.id),
        updatedProfile,
      );
    },
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
