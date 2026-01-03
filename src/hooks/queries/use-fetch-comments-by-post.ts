import { fetchCommentsByPost } from "@/api/comment-api";
import { QUERY_KEYS } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";

export const useFetchCommentsByPost = (postId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.comment.byPost(postId),
    queryFn: () => fetchCommentsByPost(postId),
  });
};
