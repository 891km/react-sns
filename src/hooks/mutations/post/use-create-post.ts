import { createPostWithImages } from "@/api/post-api";
import type { UseMutationCallback } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

export const useCreatePost = (callback?: UseMutationCallback) => {
  return useMutation({
    mutationFn: createPostWithImages,
    onError: (error) => callback?.onError?.(error),
    onSuccess: () => callback?.onSuccess?.(),
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
