import { fetchPosts } from "@/api/post-api";
import { QUERY_KEYS } from "@/constants/constants";
import { useSessionUserId } from "@/store/session";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;

export const useFetchInfinitePostIds = () => {
  const queryClient = useQueryClient();
  const userId = useSessionUserId();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const posts = await fetchPosts({ from, to, userId });

      // post 데이터 캐싱 후 post.id 반환
      // -> 캐싱된 post 데이터는 useFetchPostById로 불러옴
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
      });
      return posts.map((post) => post.id);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },

    staleTime: Infinity,
  });
};
