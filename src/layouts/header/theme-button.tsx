import { CheckIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, useSetTheme } from "@/store/theme";

const THEMES: Theme[] = ["system", "dark", "light"];

export default function ThemeButton() {
  const currentTheme = useTheme();
  const setTheme = useSetTheme();

  const handleChangeClick = (theme: Theme) => {
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full p-2 [&_svg]:size-full"
          aria-label="테마 변경"
        >
          <SunIcon className="size-full" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={`theme-button-${theme}`}
            className="flex justify-between"
            onClick={() => handleChangeClick(theme)}
          >
            {theme === "system" && "시스템"}
            {theme === "dark" && "다크 모드"}
            {theme === "light" && "라이트 모드"}
            {currentTheme === theme && (
              <CheckIcon style={{ width: "14px", height: "14px" }} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
