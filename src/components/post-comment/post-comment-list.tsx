import PostCommentItem from "@/components/post-comment/post-comment-item";
import ErrorMessage from "@/components/status/error-message";
import Loader from "@/components/status/loader";
import { useFetchCommentsByPost } from "@/hooks/queries/use-fetch-comments-by-post";

export default function PostCommentList({ postId }: { postId: number }) {
  const { data: comments, error, isPending } = useFetchCommentsByPost(postId);

  if (error) return <ErrorMessage />;
  if (isPending) return <Loader />;
  return (
    <div className="my-2 flex flex-col gap-5">
      {comments.map((comment) => (
        <PostCommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
