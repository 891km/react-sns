import { fetchPostById } from "@/api/post-api";
import { QUERY_KEYS } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";

export const useFetchPostById = ({
  postId,
  type = "FEED",
}: {
  postId: number;
  type?: "FEED" | "DETAIL";
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById(postId),
    enabled: type === "DETAIL" ? true : false,
  });
};
