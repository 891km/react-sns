import { deleteComment } from "@/api/comment-api";
import { QUERY_KEYS } from "@/constants/constants";
import type { CommentEntity, UseMutationCallback } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteComment = (callback?: UseMutationCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onError: (error) => callback?.onError?.(error),
    onSuccess: (deletedComment) => {
      (callback?.onSuccess?.(),
        queryClient.setQueryData<CommentEntity[]>(
          QUERY_KEYS.comment.byPost(deletedComment.post_id),
          (comments) => {
            if (!comments)
              throw new Error("댓글이 캐시 데이터에 보관되어 있지 않습니다.");
            return comments.filter(
              (comment) => comment.id !== deletedComment.id,
            );
          },
        ));
    },
    onMutate: () => callback?.onMutate?.(),
    onSettled: () => callback?.onSettled?.(),
  });
};
