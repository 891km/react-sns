import { deleteImagesInPath } from "@/api/image-api";
import { deletePost } from "@/api/post-api";
import { QUERY_KEYS } from "@/constants/constants";
import type { UseMutationCallback } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePost = (callback?: UseMutationCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onError: (error) => callback?.onError?.(error),
    onSuccess: async (deletedPost) => {
      callback?.onSuccess?.();

      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list,
      });

      if (deletedPost.image_urls && deletedPost.image_urls.length > 0) {
        const filePath = `${deletedPost.author_id}/${deletedPost.id}`;
        await deleteImagesInPath(filePath);
      }
    },
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
