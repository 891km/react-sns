import { togglePostLike } from "@/api/post-api";
import { QUERY_KEYS } from "@/constants/constants";
import { useSessionUserId } from "@/store/session";
import { type PostWithAuthor, type UseMutationCallback } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTogglePostLike = (callback?: UseMutationCallback) => {
  const queryClient = useQueryClient();
  const userId = useSessionUserId();

  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async ({ postId }) => {
      callback?.onMutate?.();

      if (!userId) return;

      // 낙관적 업데이트
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });

      const prevPost = queryClient.getQueryData<PostWithAuthor>(
        QUERY_KEYS.post.byId(postId),
      );

      queryClient.setQueryData<PostWithAuthor>(
        QUERY_KEYS.post.byId(postId),
        (post) => {
          if (!post) throw new Error("포스트가 존재하지 않습니다.");
          return {
            ...post,
            isLiked: !post.isLiked,
            like_count: post.isLiked
              ? post.like_count - 1
              : post.like_count + 1,
          };
        },
      );

      return { prevPost };
    },
    onSuccess: () => callback?.onSuccess?.(),
    onSettled: () => callback?.onSettled?.(),
    onError: (error, _, context) => {
      callback?.onError?.(error);

      if (context && context.prevPost) {
        queryClient.setQueryData(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost,
        );
      }
    },
  });
};
