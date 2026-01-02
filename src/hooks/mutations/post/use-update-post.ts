import { updatePost } from "@/api/post-api";
import { QUERY_KEYS } from "@/constants/constants";
import type { PostEntity, UseMutationCallback } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePost = (callback?: UseMutationCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onError: (error) => callback?.onError?.(error),
    onSuccess: (updatedPost) => {
      callback?.onSuccess?.();

      queryClient.setQueryData<PostEntity>(
        QUERY_KEYS.post.byId(updatedPost.id),
        (prevPost) => {
          if (!prevPost) {
            throw new Error(
              `${updatedPost.id}에 해당하는 포스트를 캐시 데이터에서 찾을 수 없습니다.`,
            );
          }
          return { ...prevPost, ...updatedPost };
        },
      );
    },
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
