import PostCommentEditor from "@/components/post-comment/post-comment-editor";
import PostCommentList from "@/components/post-comment/post-comment-list";
import PostItem from "@/components/post-item/post-item";
import { ROUTES } from "@/constants/routes";
import { Navigate, useParams } from "react-router";

export default function PostDetailPage() {
  const params = useParams();
  const { postId } = params;
  if (!postId) return <Navigate to={ROUTES.HOME} />;

  return (
    <div className="flex flex-col gap-6">
      <PostItem postId={Number(postId)} type="DETAIL" />
      <PostCommentEditor postId={Number(postId)} type="CREATE" />
      <PostCommentList postId={Number(postId)} />
    </div>
  );
}
