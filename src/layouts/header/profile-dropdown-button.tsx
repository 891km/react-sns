import { logout } from "@/api/auth-api";
import ProfileAvatar from "@/components/profile/profile-avatar";
import { ROUTES } from "@/constants/routes";
import { useSessionUserId, useSessionProfile } from "@/store/session";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserRoundIcon, LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ProfileDropdownButton() {
  const currentUserId = useSessionUserId();
  const sessionProfile = useSessionProfile();

  const navigate = useNavigate();

  const handleProfilePageClick = () => {
    navigate(ROUTES.PROFILE_DETAIL.replace(":authorId", currentUserId!));
  };

  const handleLogoutClick = () => {
    logout();
    toast.info("로그아웃 했습니다.");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <ProfileAvatar src={sessionProfile?.avatarImageUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <button
            className="flex h-full w-full cursor-pointer items-center gap-2.5"
            onClick={handleProfilePageClick}
          >
            <UserRoundIcon className="h-2 w-2" />
            <span>프로필</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="flex h-full w-full cursor-pointer items-center gap-2.5"
            onClick={handleLogoutClick}
          >
            <LogOutIcon className="h-2 w-2" />
            <span>로그아웃</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
