import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { containerStyle, flexRowCenterStyle } from "@/layouts/global-layout";
import ProfileDropdownButton from "@/layouts/header/profile-dropdown-button";
import { cn } from "@/lib/utils";
import { useSessionUserId } from "@/store/session";
import { SunIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";

const headerActionButton =
  "hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full";

export default function Header() {
  const navigate = useNavigate();
  const currentUserId = useSessionUserId();

  const handleLoginClick = () => {
    if (currentUserId) return;
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="border-b">
      <div
        className={cn(
          containerStyle,
          flexRowCenterStyle,
          "h-15 justify-between",
        )}
      >
        <Link to={ROUTES.HOME} className={cn(flexRowCenterStyle, "gap-2")}>
          <img className="h-5" src={logo} alt="" />
          <h1 className="font-bold">민주 로그</h1>
        </Link>

        <div className={cn(flexRowCenterStyle, "gap-5")}>
          <button className={headerActionButton} aria-label="테마 변경">
            <SunIcon className="h-6 w-6" />
          </button>
          {currentUserId ? (
            <ProfileDropdownButton />
          ) : (
            <Button onClick={handleLoginClick}>로그인</Button>
          )}
        </div>
      </div>
    </header>
  );
}
