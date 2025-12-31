import { useFetchProfileData } from "@/hooks/queries/use-fetch-profile-data";
import defaultProfile from "@/assets/default-profile.png";
import { Spinner } from "@/components/ui/spinner";

type ProfileInfoVariant = "default" | "post";

interface ProfileInfoProps {
  userId: string;
  variant?: ProfileInfoVariant;
}

export default function ProfileInfo({ userId, variant }: ProfileInfoProps) {
  const { data: profileData, error, isPending } = useFetchProfileData(userId);

  if (error) return <div>에러가 발생하였습니다.</div>;
  if (isPending)
    return (
      <div className="flex h-60 flex-col items-center justify-center">
        <Spinner />
      </div>
    );

  if (variant === "post") {
    return (
      <div className="flex flex-row items-center gap-3">
        <img
          src={profileData?.profile_img_url || defaultProfile}
          alt="유저 프로필"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-medium">{profileData.nickname}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <img
        src={profileData?.profile_img_url || defaultProfile}
        alt="유저 프로필"
        className="h-30 w-30 rounded-full object-cover"
      />
      <div className="flex flex-col items-center gap-2">
        <div className="text-lg font-bold">{profileData.nickname}</div>
        {profileData.bio && (
          <p className="text-muted-foreground">{profileData.bio}</p>
        )}
      </div>
    </div>
  );
}
