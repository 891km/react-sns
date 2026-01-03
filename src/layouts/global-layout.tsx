import { Outlet } from "react-router";
import { cn } from "@/lib/utils";
import Header from "@/layouts/header/header";

export const containerStyle = "mx-auto w-full max-w-3xl px-4";

export const flexRowCenterStyle = "flex items-center justify-center";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn(containerStyle, "flex-1 border-x py-6")}>
        <Outlet />
      </main>
      <footer className="border-t">
        <div className={cn(containerStyle, flexRowCenterStyle, "h-20")}>
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
