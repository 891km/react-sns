import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { containerStyle, flexRowCenterStyle } from "@/layouts/global-layout";
import ProfileDropdownButton from "@/layouts/header/profile-dropdown-button";
import ThemeButton from "@/layouts/header/theme-button";
import { cn } from "@/lib/utils";
import { useSessionUserId } from "@/store/session";
import { Link, useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const currentUserId = useSessionUserId();

  const handleLoginClick = () => {
    if (currentUserId) return;
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-background z- sticky top-0 z-20 min-w-sm border-b">
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
          <ThemeButton />
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
