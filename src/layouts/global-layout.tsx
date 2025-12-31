import { Link, Outlet } from "react-router";
import { SunIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import defaultProfile from "@/assets/default-profile.png";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useSessionUserId } from "@/store/session";

const container = "mx-auto w-full max-w-3xl px-4";

const flexRowCenter = "flex items-center justify-center";

const headerActionButton =
  "hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full";

export default function GlobalLayout() {
  const currentUserId = useSessionUserId();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div
          className={cn(container, flexRowCenter, "h-15 justify-between px-4")}
        >
          <Link to={ROUTES.HOME} className={cn(flexRowCenter, "gap-2")}>
            <img className="h-5" src={logo} alt="" />
            <h1 className="font-bold">민주 로그</h1>
          </Link>

          <div className={cn(flexRowCenter, "gap-5")}>
            <button className={headerActionButton} aria-label="테마 변경">
              <SunIcon className="h-6 w-6" />
            </button>
            {currentUserId && (
              <Link
                className={headerActionButton}
                to={ROUTES.PROFILE_DETAIL.replace(":userId", currentUserId)}
              >
                <img
                  className="h-full w-full object-cover"
                  src={defaultProfile}
                  alt="유저 프로필"
                />
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className={cn(container, "flex-1 border-x py-6")}>
        <Outlet />
      </main>
      <footer className="border-t">
        <div className={cn(container, flexRowCenter, "h-20")}>
          <a
            className="text-muted-foreground text-center text-sm"
            href="https://github.com/891km"
            target="_blank"
          >
            @891km
          </a>
        </div>
      </footer>
    </div>
  );
}
