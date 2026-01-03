import PostFeed from "@/components/post/post-feed";
import ProfileInfo from "@/components/profile/profile-info";
import { ROUTES } from "@/constants/routes";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router";

export default function ProfileDetailPage() {
  const params = useParams();
  const authorId = params.authorId;
  if (!authorId) return <Navigate to={ROUTES.HOME} replace />;

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="flex flex-col">
      <ProfileInfo authorId={authorId} />
      <div className="border-b"></div>
      <PostFeed authorId={authorId} />
    </div>
  );
}
