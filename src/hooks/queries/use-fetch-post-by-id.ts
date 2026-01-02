import { fetchPostById } from "@/api/post-api";
import { QUERY_KEYS } from "@/constants/constants";
import { useSessionUserId } from "@/store/session";
import { useQuery } from "@tanstack/react-query";

export const useFetchPostById = ({
  postId,
  type = "FEED",
}: {
  postId: number;
  type?: "FEED" | "DETAIL";
}) => {
  const userId = useSessionUserId();

  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById({ postId, userId }),
    enabled: type === "DETAIL" ? true : false,
  });
};
