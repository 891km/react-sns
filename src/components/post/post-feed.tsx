import { useFetchInfinitePostIds } from "@/hooks/queries/use-fetch-infinite-post-ids";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ErrorMessage from "@/components/status/error-message";
import Loader from "@/components/status/loader";
import PostItem from "@/components/post/post-item";

export default function PostFeed({ authorId }: { authorId?: string }) {
  const {
    data: postIds,
    error,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchInfinitePostIds(authorId);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (error) return <ErrorMessage />;
  if (isPending) return <Loader />;
  return (
    <>
      <div className="flex flex-col">
        {postIds.pages.map((page) =>
          page.map((postId) => <PostItem key={postId} postId={postId} />),
        )}
      </div>
      {isFetchingNextPage && (
        <>
          <div className="border-b"></div>
          <Loader />
        </>
      )}
      <div ref={ref}></div>
    </>
  );
}
