import { useFetchProfile } from "@/hooks/queries/use-fetch-profile";
import ErrorMessage from "@/components/status/error-message";
import Loader from "@/components/status/loader";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router";
import { UserRoundPenIcon } from "lucide-react";
import { useSessionProfile, useSessionUserId } from "@/store/session";
import { Button } from "@/components/ui/button";
import { useOpenProfileEditorModal } from "@/store/profile-editor-modal";
import ProfileAvatar from "@/components/profile/profile-avatar";

interface BaseProfileInfoProps {
  authorId: string;
  variant?: "default" | "post-edit";
}

interface PostProfileInfoProps {
  authorId: string;
  variant: "post";
  dateText: string;
}

type ProfileInfoProps = BaseProfileInfoProps | PostProfileInfoProps;

export default function ProfileInfo(props: ProfileInfoProps) {
  const { variant } = props;

  if (variant === "post") return <PostProfileInfo {...props} />;
  if (variant === "post-edit") return <PostEditProfileInfo {...props} />;
  return <DefaultProfileInfo {...props} />;
}

// --- components
function PostProfileInfo(props: PostProfileInfoProps) {
  const currentUserId = useSessionUserId();
  const { dateText, authorId } = props;
  const { data: profile, error, isPending } = useFetchProfile(authorId);
  if (error) return <ErrorMessage />;
  if (isPending) return <Loader />;

  return (
    <Link to={ROUTES.PROFILE_DETAIL.replace(":authorId", authorId)}>
      <div className="flex flex-row items-center gap-4">
        <ProfileAvatar src={profile?.avatar_image_url} />
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium">{profile.nickname}</div>
            {currentUserId === authorId && (
              <span className="bg-muted flex h-5.5 w-5.5 items-center justify-center gap-1 rounded-full text-sm font-semibold">
                <UserRoundPenIcon className="text-muted-foreground h-3.5 w-auto pl-px" />
              </span>
            )}
          </div>
          <div className="text-muted-foreground text-sm">{dateText}</div>
        </div>
      </div>
    </Link>
  );
}

function PostEditProfileInfo(props: BaseProfileInfoProps) {
  const { authorId } = props;
  const { data: profile, error, isPending } = useFetchProfile(authorId);
  if (error) return <ErrorMessage />;
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-row items-center gap-3">
      <ProfileAvatar src={profile?.avatar_image_url} />
      <div className="flex flex-col items-center gap-2">
        <div className="tex-sm font-medium">{profile.nickname}</div>
      </div>
    </div>
  );
}
function DefaultProfileInfo(props: BaseProfileInfoProps) {
  const { authorId } = props;
  const userId = useSessionUserId();
  const profile = useSessionProfile();
  if (!profile) return <ErrorMessage />;

  const isCurrentUser = userId === authorId;

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <ProfileAvatar src={profile.avatarImageUrl} size={30} />
      <div className="flex flex-col items-center gap-2">
        <div className="text-lg font-bold">{profile.nickname}</div>
        {profile.bio && (
          <p className="text-muted-foreground w-[87%] min-w-80 text-center sm:w-[50%]">
            {profile.bio}
          </p>
        )}
      </div>
      {isCurrentUser && <EditProfileButton />}
    </div>
  );
}

function EditProfileButton() {
  const openProfileEditorModal = useOpenProfileEditorModal();

  const handleEditProfileClick = () => {
    openProfileEditorModal();
  };

  return (
    <Button variant="secondary" onClick={handleEditProfileClick}>
      프로필 수정
    </Button>
  );
}
