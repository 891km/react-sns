import { updateComment } from "@/api/comment-api";
import { QUERY_KEYS } from "@/constants/constants";
import type { CommentEntity, UseMutationCallback } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateComment = (callback?: UseMutationCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onError: (error) => callback?.onError?.(error),
    onSuccess: (updatedComment) => {
      callback?.onSuccess?.();

      queryClient.setQueryData<CommentEntity[]>(
        QUERY_KEYS.comment.byPost(updatedComment.post_id),
        (comments) => {
          if (!comments)
            throw new Error("댓글이 캐시 데이터에 보관되어 있지 않습니다.");
          return comments.map((comment) =>
            comment.id === updatedComment.id
              ? { ...comment, ...updatedComment }
              : comment,
          );
        },
      );
    },
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
