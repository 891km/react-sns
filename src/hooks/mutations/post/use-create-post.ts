import { createPostWithUpdate } from "@/api/post-api";
import { QUERY_KEYS } from "@/constants/constants";
import type { UseMutationCallback } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePost = (callback?: UseMutationCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostWithUpdate,
    onError: (error) => callback?.onError?.(error),
    onSuccess: () => {
      callback?.onSuccess?.();

      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list,
      });
    },
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
